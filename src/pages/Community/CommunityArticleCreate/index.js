/*
 * @Date: 2022-10-18 14:26:23
 * @Description: 写文章
 */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Image from 'react-native-fast-image';
// import RNFileSelector from 'react-native-file-selector';
import {launchImageLibrary} from 'react-native-image-picker';
import {openCropper} from 'react-native-image-crop-picker';
import {actions, RichEditor} from 'react-native-pell-rich-editor';
import deleteImg from '~/assets/img/icon/delete.png';
import uploadImg from '~/assets/img/icon/upload.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import NavBar from '~/components/NavBar';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {upload} from '~/utils/AliyunOSSUtils';
import {ChooseModal, ChooseTag} from '../CommunityVodCreate';
import {getArticleDraft, publishArticle, saveArticleDraft} from './services';
import {SERVER_URL} from '~/services/config';

const toolbarIcons = {
    disabled: {
        audio: require('~/assets/img/editor/disabled/audio.png'),
        font: require('~/assets/img/editor/disabled/font.png'),
        fund: require('~/assets/img/editor/disabled/fund.png'),
        picture: require('~/assets/img/editor/disabled/picture.png'),
        portfolio: require('~/assets/img/editor/disabled/portfolio.png'),
        video: require('~/assets/img/editor/disabled/video.png'),
    },
    enabled: {
        activeFont: require('~/assets/img/editor/enabled/activeFont.png'),
        audio: require('~/assets/img/editor/enabled/audio.png'),
        font: require('~/assets/img/editor/enabled/font.png'),
        fund: require('~/assets/img/editor/enabled/fund.png'),
        picture: require('~/assets/img/editor/enabled/picture.png'),
        portfolio: require('~/assets/img/editor/enabled/portfolio.png'),
        video: require('~/assets/img/editor/enabled/video.png'),
    },
};

/** @name 文章编辑器 */
const WriteArticle = ({article, setArticle}) => {
    const input = useRef();
    const editor = useRef();
    const [editorIsFocused, setEditorIsFocused] = useState(false);
    const [keyboardShow, setKeyboardShow] = useState(false);
    const [firstLevelOps, setFirstLevelOps] = useState([
        {
            action: 'font',
            activeIcon: toolbarIcons.enabled.activeFont,
            disabledIcon: toolbarIcons.disabled.font,
            enabledIcon: toolbarIcons.enabled.font,
            name: '字体',
        },
        {
            action: 'picture',
            disabledIcon: toolbarIcons.disabled.picture,
            enabledIcon: toolbarIcons.enabled.picture,
            name: '图片',
        },
        // {
        //     action: 'audio',
        //     disabledIcon: toolbarIcons.disabled.audio,
        //     enabledIcon: toolbarIcons.enabled.audio,
        //     name: '音频',
        // },
        // {
        //     action: 'video',
        //     disabledIcon: toolbarIcons.disabled.video,
        //     enabledIcon: toolbarIcons.enabled.video,
        //     name: '视频',
        // },
        {
            action: 'fund',
            disabledIcon: toolbarIcons.disabled.fund,
            enabledIcon: toolbarIcons.enabled.fund,
            name: '基金',
        },
        {
            action: 'portfolio',
            disabledIcon: toolbarIcons.disabled.portfolio,
            enabledIcon: toolbarIcons.enabled.portfolio,
            name: '组合',
        },
    ]);
    const [secondLevelOps, setSecondLevelOps] = useState([
        {
            action: 'heading2',
            name: '一级标题',
            style: {...styles.headingText, fontWeight: Font.weightMedium},
            type: 'heading2',
        },
        {action: 'heading3', name: '二级标题', style: styles.headingText, type: 'heading3'},
        {action: 'setBold', name: 'B', style: {...styles.fontStyleText, fontWeight: 'bold'}, type: 'bold'},
        {action: 'setItalic', name: 'I', style: {...styles.fontStyleText, fontStyle: 'italic'}, type: 'italic'},
        {
            action: 'setUnderline',
            name: 'U',
            style: {...styles.fontStyleText, textDecorationLine: 'underline'},
            type: 'underline',
        },
        // {action: 'setRed', name: '红', style: {...styles.title, color: Colors.red}},
    ]);
    const [height, setHeight] = useState(px(300));
    const scrollView = useRef();
    const chooseModal = useRef();

    const fontActive = useMemo(() => {
        return firstLevelOps.find((op) => op.action === 'font')?.active;
    }, [firstLevelOps]);

    const handleKeyboardShow = () => {
        setKeyboardShow(true);
    };

    const handleKeyboardHide = () => {
        setKeyboardShow(false);
    };

    const onCursorPosition = (y) => {
        scrollView.current?.scrollTo({
            animated: false,
            y: y < Platform.select({android: px(280), ios: px(300)}) ? 0 : y + px(100),
        });
    };

    const handleFirstLevelOps = ({action, index}) => {
        switch (action) {
            case 'font':
                setFirstLevelOps((prev) => {
                    const next = [...prev];
                    next[index].active = !next[index].active;
                    return next;
                });
                break;
            case 'audio':
            case 'picture':
            case 'video':
                chooseFile({type: action});
                break;
            case 'fund':
            case 'portfolio':
                chooseModal.current.show(action);
                break;
            default:
                break;
        }
    };

    const handleSecondLevelOps = ({action, index}) => {
        switch (true) {
            case action === 'setRed':
                editor.current?.setForeColor?.(Colors.red);
                break;
            default:
                editor.current?.focusContentEditor?.();
                editor.current?.sendAction?.(actions[action], 'result');
                break;
        }
    };

    const chooseFile = ({type}) => {
        if (type === 'picture' || type === 'video') {
            launchImageLibrary({mediaType: type === 'picture' ? 'photo' : 'video', selectionLimit: 1}, (resp) => {
                const {assets: [file] = []} = resp;
                if (file) {
                    upload({...file, fileType: type === 'picture' ? 'pic' : 'vod'}).then((res) => {
                        if (res) {
                            editor.current?.focusContentEditor?.();
                            if (type === 'picture') {
                                editor.current?.insertHTML(`
                                    <br>
                                    <img style="display: block;width: 100%;margin: 12px 0;border-radius: 6px;" src="${res.url}" alt="">
                                    <br>
                                `);
                            } else {
                                editor.current?.insertHTML(`
                                    <br>
                                    <img class="oss_media" id="oss_vod_${res.id}" src="${res.cover}" alt="" style="display: block;width: 100%;margin: 12px 0;border-radius: 6px;" videoUrl="${res.url}">
                                    <br>
                                `);
                            }
                        }
                    });
                }
            });
        } else {
            // RNFileSelector.Show({
            //     closeMenu: true,
            //     filter: '.+(.mp3|.MP3|.wma|.WMA|.m4a|.M4A)$',
            //     onCancel: () => {
            //         console.log('canceled');
            //     },
            //     onDone: (path) => {
            //         const uri = Platform.OS === 'android' ? `file://${path}` : path;
            //         upload({fileName: path, fileType: 'audio', uri}).then((res) => {
            //             if (res) {
            //                 editor.current?.focusContentEditor?.();
            //                 editor.current?.insertHTML(`
            //                     <div class="oss_media" id="oss_audio_${res.id}"></div>
            //                 `);
            //             }
            //         });
            //     },
            //     title: '选择音频文件',
            // });
        }
    };

    useEffect(() => {
        let showListener, hideListenr;
        if (Platform.OS === 'android') {
            showListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
            hideListenr = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
        } else {
            showListener = Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
            hideListenr = Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
        }
        return () => {
            showListener?.remove?.();
            hideListenr?.remove?.();
        };
    }, []);

    return (
        <>
            <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                ref={scrollView}
                scrollIndicatorInsets={{right: 1}}
                style={{paddingHorizontal: Space.padding}}>
                <TextInput
                    clearButtonMode="while-editing"
                    maxLength={30}
                    onBlur={() => input.current.setNativeProps({style: {borderColor: Colors.borderColor}})}
                    onChangeText={(text) => setArticle((prev) => ({...prev, title: text}))}
                    onFocus={() => input.current.setNativeProps({style: {borderColor: Colors.brandColor}})}
                    placeholder=" 请输入标题"
                    placeholderTextColor={Colors.placeholderColor}
                    ref={input}
                    style={styles.titleInput}
                    value={article?.title || ''}
                />
                <ChooseTag setTags={(tags) => setArticle((prev) => ({...prev, tags}))} tags={article.tags} />
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (editor.current?.isKeyboardOpen) return false;
                        else editor.current?.focusContentEditor?.();
                    }}>
                    <RichEditor
                        containerStyle={{marginTop: px(20)}}
                        editorInitializedCallback={() => {
                            editor.current.registerToolbar((items) => {
                                setFirstLevelOps((prev) => {
                                    const next = [...prev];
                                    next[0].active = secondLevelOps.some((op) =>
                                        items.some((item) => item === op.type)
                                    );
                                    return next;
                                });
                                setSecondLevelOps((prev) => {
                                    const next = [...prev];
                                    next.forEach((op) => (op.active = false));
                                    items.forEach((item) => {
                                        const index = next.findIndex((op) => op.type === item);
                                        if (index > -1) next[index].active = true;
                                    });
                                    return next;
                                });
                            });
                        }}
                        editorStyle={{
                            caretColor: Colors.brandColor,
                            color: Colors.defaultColor,
                            contentCSSText: `padding: 0; min-height: ${px(300)}px;`,
                            initialCSSText: `
                                h2 {
                                    font-size: 18px;
                                    line-height: 25px;
                                    color: #121d3a;
                                    font-weight: 700;
                                    margin: 20px 0 12px;
                                }
                                h3 {
                                    font-size: 16px;
                                    line-height: 22px;
                                    color: #121d3a;
                                    font-weight: 700;
                                    margin: 20px 0 12px;
                                }
                                div {
                                    font-size: 14px;
                                    line-height: 20px;
                                    color: #121d3a;
                                }
                                a {
                                    color: ${Colors.brandColor};
                                    text-decoration: none;
                                }
                            `,
                            placeholderColor: Colors.placeholderColor,
                        }}
                        initialContentHTML={article?.content || ''}
                        onBlur={() => {
                            setEditorIsFocused(false);
                            setFirstLevelOps((prev) => {
                                const next = [...prev];
                                next.forEach((op) => (op.active = false));
                                return next;
                            });
                        }}
                        onChange={(data) => {
                            // console.log(data);
                            setArticle((prev) => ({...prev, content: data}));
                        }}
                        onCursorPosition={onCursorPosition}
                        onFocus={() => setEditorIsFocused(true)}
                        onHeightChange={(h) => {
                            setHeight(h + px(40));
                        }}
                        placeholder="请输入正文"
                        ref={editor}
                        showsVerticalScrollIndicator={false}
                        style={{flex: 1, minHeight: height}}
                        useContainer
                    />
                </TouchableWithoutFeedback>
                <View style={{height: px(100)}} />
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {fontActive && (
                    <View style={styles.secondLevel}>
                        {secondLevelOps.map((op, i) => {
                            const {action, active, name, style} = op;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={name + i}
                                    onPress={() => handleSecondLevelOps({action, index: i})}
                                    style={[
                                        Style.flexCenter,
                                        styles.fontOpBox,
                                        {
                                            marginLeft: i === 0 ? Space.marginAlign : px(12),
                                            backgroundColor: active ? '#DADDE3' : Colors.bgColor,
                                        },
                                        action.includes('heading') ? {paddingHorizontal: px(12)} : {},
                                    ]}>
                                    <Text style={style}>{name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
                <View style={[keyboardShow ? {paddingBottom: 0} : {paddingBottom: isIphoneX() ? 34 : 0}]}>
                    <View style={[Style.flexRow, styles.firstLevel]}>
                        {firstLevelOps.map((op, i) => {
                            const {action, active, activeIcon, disabledIcon, enabledIcon, name} = op;
                            const disabled = !editorIsFocused && keyboardShow;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={disabled}
                                    key={name + i}
                                    onPress={() => handleFirstLevelOps({action, index: i})}
                                    style={[Style.flexCenter, {marginLeft: i === 0 ? 0 : px(22)}]}>
                                    <Image
                                        source={disabled ? disabledIcon : active ? activeIcon : enabledIcon}
                                        style={styles.toolbarIcon}
                                    />
                                    <Text
                                        style={[
                                            styles.toolbarName,
                                            {
                                                color: disabled
                                                    ? Colors.lightGrayColor
                                                    : active
                                                    ? Colors.brandColor
                                                    : Colors.defaultColor,
                                            },
                                        ]}>
                                        {name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </KeyboardAvoidingView>
            <ChooseModal
                maxCount={1}
                onDone={(res) => {
                    // console.log(res);
                    editor.current?.focusContentEditor?.();
                    editor.current?.insertHTML(res.url);
                }}
                ref={chooseModal}
                type="fund"
            />
        </>
    );
};

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const {article_id = 0, community_id = 0, fr = '', history_id = 0} = route.params || {};
    const [step, setStep] = useState(1); // 步骤：1 第一步上传文章封面 2 第二步写文章内容
    const [cover, setCover] = useState(''); // 文章封面
    const [article, setArticle] = useState({}); // content 文章内容 tags 文章标签 title 文章标题

    const canPublish = useMemo(() => {
        const {content, tags, title} = article;
        return content?.length > 0 && tags?.length > 0 && title?.length > 0 ? true : false;
    }, [article]);

    const renderRight = () => {
        if (step === 1) {
            return (
                <TouchableOpacity activeOpacity={0.8} onPress={() => setStep(2)} style={{marginRight: px(6)}}>
                    <Text style={[styles.title, {color: Colors.descColor}]}>{cover?.url ? '下一步' : '跳过'}</Text>
                </TouchableOpacity>
            );
        }
        if (step === 2) {
            return (
                <View style={[Style.flexRow, {marginRight: px(6)}]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!canPublish}
                        onPress={() =>
                            saveDraft((res) =>
                                jump({
                                    path: 'PreviewArticle',
                                    params: {
                                        link: `${SERVER_URL[global.env].H5}/articleDraft?history_id=${res.history_id}`,
                                    },
                                })
                            )
                        }
                        style={{marginRight: px(10)}}>
                        <Text style={[styles.title, {color: canPublish ? Colors.descColor : Colors.lightGrayColor}]}>
                            预览
                        </Text>
                    </TouchableOpacity>
                    <Button
                        disabled={!canPublish}
                        disabledColor="rgba(0, 81, 204, 0.3)"
                        onPress={onPublish}
                        style={styles.pubBtn}
                        textStyle={{...styles.title, color: '#fff'}}
                        title="发布"
                    />
                </View>
            );
        }
    };

    const chooseCover = () => {
        launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, (resp) => {
            const {assets: [file] = []} = resp;
            file &&
                openCropper({
                    path: file.uri,
                    width: px(400),
                    height: px(300),
                    cropping: true,
                    cropperChooseText: '选择',
                    cropperCancelText: '取消',
                    loadingLabelText: '加载中',
                })
                    .then((img) => {
                        if (img) {
                            upload({fileName: img.path, fileType: 'pic', uri: img.path}).then((res) => {
                                res && setCover(res);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
        });
    };

    const saveDraft = (callback) => {
        const loading = Toast.showLoading('保存中...');
        const {content = '', tags = [], title = ''} = article;
        saveArticleDraft({
            article_id,
            community_id,
            content,
            cover_media_id: cover?.id || '',
            tag_ids: tags?.map((tag) => tag.id)?.join(','),
            title,
        })
            .then((res) => {
                Toast.hide(loading);
                Toast.show(res.message);
                if (res.code === '000000') {
                    callback?.(res.result);
                }
            })
            .finally(() => {
                Toast.hide(loading);
            });
    };

    const onPublish = () => {
        const loading = Toast.showLoading('提交审核中...');
        const {content = '', tags = [], title = ''} = article;
        publishArticle({
            article_id,
            community_id,
            content,
            cover_media_id: cover?.id || '',
            fr,
            tag_ids: tags?.map((tag) => tag.id)?.join(','),
            title,
        })
            .then((res) => {
                Toast.hide(loading);
                Toast.show(res.message);
                if (res.code === '000000') {
                    jump(res.result.url, 'replace');
                }
            })
            .finally(() => {
                Toast.hide(loading);
            });
    };

    useEffect(() => {
        const {content, tags, title} = article;
        const needSaveDraft = content?.length > 0 || cover?.url || tags?.length > 0 || title?.length > 0;
        if (needSaveDraft) {
            const listener = navigation.addListener('beforeRemove', (e) => {
                const {action} = e.data;
                if (['GO_BACK', 'POP'].includes(action.type)) {
                    e.preventDefault();
                    // Prompt the user before leaving the screen
                    Modal.show({
                        title: '是否保存草稿',
                        backButtonClose: false,
                        isTouchMaskToClose: false,
                        cancelCallBack: () => navigation.dispatch(action),
                        content: '<span style="text-align: center">保存后再次进入页面可继续编辑</span>',
                        confirm: true,
                        confirmCallBack: () => {
                            saveDraft(() => navigation.dispatch(action));
                        },
                    });
                }
            });
            return () => {
                listener();
            };
        }
    }, [article, cover]);

    useEffect(() => {
        getArticleDraft({article_id, history_id})
            .then((res) => {
                if (res.code === '000000') {
                    const {content, cover: coverUrl, cover_media_id, tag_list, title} = res.result;
                    setArticle({content, tags: tag_list, title});
                    setCover({id: cover_media_id, url: coverUrl});
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <View style={styles.container}>
            <NavBar
                leftIcon="chevron-left"
                leftPress={() => (step === 1 ? navigation.goBack() : setStep(1))}
                renderRight={renderRight()}
                title="写文章"
            />
            {step === 1 ? (
                <View style={{paddingHorizontal: Space.padding}}>
                    <Text style={[styles.desc, {marginTop: px(12)}]}>
                        <Text style={styles.bigTitle}>上传封面图</Text> （上传封面图可获得更多曝光率）
                    </Text>
                    {cover?.url ? (
                        <ImageBackground source={{uri: cover.url}} style={styles.cover}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setCover('')} style={styles.deleteImg}>
                                <Image source={deleteImg} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </ImageBackground>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={chooseCover}
                            style={[Style.flexCenter, styles.uploadBtn]}>
                            <Image source={uploadImg} style={styles.uploadImg} />
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <WriteArticle article={article} setArticle={setArticle} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    pubBtn: {
        borderRadius: px(50),
        width: px(64),
        height: px(34),
        backgroundColor: Colors.brandColor,
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    cover: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        width: px(300),
        height: px(225),
        overflow: 'hidden',
    },
    uploadBtn: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        width: px(125),
        height: px(125),
        backgroundColor: Colors.bgColor,
        overflow: 'hidden',
    },
    uploadImg: {
        width: px(24),
        height: px(24),
    },
    deleteImg: {
        position: 'absolute',
        top: px(8),
        right: px(8),
    },
    deleteIcon: {
        width: px(14),
        height: px(14),
    },
    titleInput: {
        marginTop: px(20),
        paddingTop: 0,
        paddingBottom: px(4),
        borderBottomWidth: px(1),
        borderColor: Colors.borderColor,
        fontSize: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    firstLevel: {
        paddingTop: px(12),
        paddingHorizontal: px(20),
        paddingBottom: px(8),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
    },
    toolbarIcon: {
        width: px(22),
        height: px(22),
    },
    toolbarName: {
        marginTop: px(2),
        fontSize: px(10),
        lineHeight: px(14),
    },
    secondLevel: {
        paddingVertical: Space.padding,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    fontOpBox: {
        borderRadius: Space.borderRadius,
        minWidth: px(34),
        height: px(34),
    },
    headingText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    fontStyleText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
});

export default withPageLoading(Index);
