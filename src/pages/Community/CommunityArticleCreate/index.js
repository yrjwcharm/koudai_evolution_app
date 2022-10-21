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
import {launchImageLibrary} from 'react-native-image-picker';
import {openPicker} from 'react-native-image-crop-picker';
import {actions, RichEditor} from 'react-native-pell-rich-editor';
import deleteImg from '~/assets/img/icon/delete.png';
import uploadImg from '~/assets/img/icon/upload.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import NavBar from '~/components/NavBar';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {upload} from '~/utils/AliyunOSSUtils';
import {ChooseTag} from '../CommunityVodCreate';

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
        {
            action: 'audio',
            disabledIcon: toolbarIcons.disabled.audio,
            enabledIcon: toolbarIcons.enabled.audio,
            name: '音频',
        },
        {
            action: 'video',
            disabledIcon: toolbarIcons.disabled.video,
            enabledIcon: toolbarIcons.enabled.video,
            name: '视频',
        },
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
        {action: 'heading2', name: '一级标题', style: {...styles.headingText, fontWeight: Font.weightMedium}},
        {action: 'heading3', name: '二级标题', style: styles.headingText},
        {action: 'setBold', name: 'B', style: {...styles.fontStyleText, fontWeight: 'bold'}},
        {action: 'setItalic', name: 'I', style: {...styles.fontStyleText, fontStyle: 'italic'}},
        {action: 'setUnderline', name: 'U', style: {...styles.fontStyleText, textDecorationLine: 'underline'}},
        // {action: 'setRed', name: '红', style: {...styles.title, color: Colors.red}},
    ]);
    const scrollView = useRef();

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
        scrollView.current?.scrollTo({animated: false, y});
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
            default:
                break;
        }
    };

    const handleSecondLevelOps = ({action, index}) => {
        switch (true) {
            case action === 'setRed':
                editor.current?.sendAction?.(actions.setTextColor, 'result', Colors.red);
                break;
            default:
                editor.current?.focusContentEditor?.();
                editor.current?.sendAction?.(actions[action], 'result');
                break;
        }
    };

    const chooseFile = ({type}) => {
        if (type === 'picture') {
            launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, (resp) => {
                const {assets: [file] = []} = resp;
                if (file) {
                    if (file.fileSize > 10 * 1024 * 1024) {
                        Toast.show('图片大小不能超过10M');
                    } else {
                        upload({...file, fileType: 'pic'}).then((res) => {
                            if (res) {
                                editor.current?.focusContentEditor?.();
                                editor.current?.sendAction(
                                    actions.insertImage,
                                    'result',
                                    res.url,
                                    `display: block;width: 100%;margin: 12px 0;`
                                );
                            }
                        });
                    }
                }
            });
        }
    };

    useEffect(() => {
        console.log(editor.current);
    }, []);

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
                    value={article.title || ''}
                />
                <ChooseTag setTags={(tags) => setArticle((prev) => ({...prev, tags}))} tags={article.tags} />
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (editor.current?.isKeyboardOpen) return false;
                        else editor.current?.focusContentEditor?.();
                    }}>
                    <RichEditor
                        containerStyle={{marginTop: px(20)}}
                        editorStyle={{
                            color: Colors.defaultColor,
                            caretColor: Colors.brandColor,
                            initialCSSText: `
                                h2 {
                                    font-size: 18px;
                                    line-height: 30px;
                                    color: #121d3a;
                                    font-weight: 700;
                                    margin: 28px 0 16px;
                                }
                                h3 {
                                    font-size: 16px;
                                    line-height: 32px;
                                    color: #121d3a;
                                    font-weight: 700;
                                    margin: 28px 0 16px;
                                }
                            `,
                            placeholderColor: Colors.placeholderColor,
                        }}
                        onBlur={() => {
                            setEditorIsFocused(false);
                            setFirstLevelOps((prev) => {
                                const next = [...prev];
                                next.forEach((op) => (op.active = false));
                                return next;
                            });
                        }}
                        onChange={(data) => {
                            console.log(data);
                        }}
                        onCursorPosition={onCursorPosition}
                        onFocus={() => setEditorIsFocused(true)}
                        placeholder="请输入正文"
                        ref={editor}
                        style={{flex: 1, minHeight: px(200), marginBottom: px(200)}}
                    />
                </TouchableWithoutFeedback>
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
        </>
    );
};

const Index = ({navigation, route, setLoading}) => {
    const [step, setStep] = useState(1); // 步骤：1 第一步上传文章封面 2 第二步写文章内容
    const [cover, setCover] = useState(''); // 文章封面
    const [article, setArticle] = useState({}); // content 文章内容 media_ids 文章关联的媒体id tags 文章标签 title 文章标题

    const canPublish = useMemo(() => {
        const {content, tags, title} = article;
        return content?.length > 0 && tags?.length > 0 && title?.length > 0 ? true : false;
    }, [article]);

    const renderRight = () => {
        if (step === 1) {
            return (
                <TouchableOpacity activeOpacity={0.8} onPress={() => setStep(2)} style={{marginRight: px(6)}}>
                    <Text style={[styles.title, {color: Colors.descColor}]}>{cover ? '下一步' : '跳过'}</Text>
                </TouchableOpacity>
            );
        }
        if (step === 2) {
            return (
                <View style={[Style.flexRow, {marginRight: px(6)}]}>
                    <TouchableOpacity activeOpacity={0.8} style={{marginRight: px(10)}}>
                        <Text style={[styles.title, {color: Colors.descColor}]}>预览</Text>
                    </TouchableOpacity>
                    <Button
                        disabled={!canPublish}
                        disabledColor="rgba(0, 81, 204, 0.3)"
                        style={styles.pubBtn}
                        textStyle={{...styles.title, color: '#fff'}}
                        title="发布"
                    />
                </View>
            );
        }
    };

    const chooseCover = () => {
        openPicker({
            width: px(300),
            height: px(400),
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
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <View style={styles.container}>
            <NavBar leftIcon="chevron-left" renderRight={renderRight()} title="写文章" />
            {step === 1 ? (
                <View style={{paddingHorizontal: Space.padding}}>
                    <Text style={[styles.desc, {marginTop: px(12)}]}>
                        <Text style={styles.bigTitle}>上传封面图</Text> （上传封面图可获得更多曝光率）
                    </Text>
                    {cover ? (
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
        height: px(400),
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