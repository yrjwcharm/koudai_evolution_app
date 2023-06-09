/*
 * @Date: 2022-10-09 14:06:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-07 21:12:54
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecialCreateBaseInfo.js
 * @Description: 创建专题 - 基础信息
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {deviceHeight, px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {getStashBaseInfo, saveStashBaseInfo} from './services';
import LoadingTips from '~/components/LoadingTips';
import pickerUploadImg from '~/utils/pickerUploadImg';
import {useFocusEffect} from '@react-navigation/native';

function Tag(props) {
    let {text, onPress, onClose} = props;
    return (
        <View style={[styles.tagItem]}>
            <Pressable onPress={onPress}>
                <Text style={styles.tagItem_text}>{text}</Text>
            </Pressable>
            <TouchableOpacity style={styles.tagItem_closeWrap} onPress={onClose}>
                <FastImage
                    source={require('~/assets/img/special/clear_tag.png')}
                    style={{width: px(8), height: px(8)}}
                />
            </TouchableOpacity>
        </View>
    );
}
function AddTag(props) {
    const {onPress} = props;
    return (
        <TouchableOpacity style={[styles.tagItem, styles.tagItemAdd]} onPress={onPress}>
            <Text style={styles.tagItemAdd_text}>+标签</Text>
        </TouchableOpacity>
    );
}

/** 标签 */
function TagWrap(props) {
    const {tags, setTags} = props;
    const [text, setText] = useState('');
    const [index, setIndex] = useState(-1);
    const bottomModal = useRef(null);
    const inputRef = useRef(null);

    const handleTagChange = (i) => {
        console.log('handleTagChange:', i);
        setIndex(i);
        if (i === -1) {
            setText('');
        } else {
            setText(tags[i]);
        }
        bottomModal.current?.show();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 200);
    };
    const handelTagDel = (i) => {
        setTags(tags.filter((t, idx) => idx != i));
    };
    const handleTagEdit = () => {
        if (index === -1 && text && text.length > 0) {
            tags.push(text);
            setTags([...tags]);
            return;
        }

        if (index >= 0) {
            if (text.length == 0) {
                setTags(tags.filter((t, idx) => idx != index));
            } else {
                tags[index] = text;
                setTags([...tags]);
            }
        }
    };

    const bottomModalConfig = Platform.select({
        ios: {
            keyboardAvoiding: true,
        },
        android: {
            keyboardAvoiding: true, // 配置在android 可能不生校
        },
    });

    return (
        <>
            <View style={[styles.space2, styles.tagsWrap]}>
                {(tags || []).map((tag, i) => (
                    <Tag key={tag + i} text={tag} onPress={() => handleTagChange(i)} onClose={() => handelTagDel(i)} />
                ))}
                {tags.length < 3 && <AddTag key="addTagkey" onPress={() => handleTagChange(-1)} />}
            </View>
            <View style={[styles.space1, styles.tipWrap]}>
                <FastImage style={styles.tip_icon} source={require('~/assets/img/special/warning_tip.png')} />
                <Text style={styles.tip} numberOfLines={2} textBreakStrategy="simple">
                    专题标签用于流量投放，至少1个至多3个，每个标签不超过6个字
                </Text>
            </View>
            <BottomModal
                ref={bottomModal}
                title="标签内容编辑"
                showClose={true}
                confirmText="确定"
                keyboardAvoiding={bottomModalConfig.keyboardAvoiding}
                onDone={handleTagEdit}>
                <View style={[styles.tagItem_inputWrap]}>
                    <TextInput
                        ref={inputRef}
                        style={styles.tagItem_input}
                        multiline={false}
                        placeholder="请填写标签内容，最多6个字符"
                        maxLength={6}
                        value={text}
                        onChangeText={setText}
                    />
                </View>
            </BottomModal>
        </>
    );
}

const typeArr = ['选择现有图片', '从相册选择'];

export default function SpecialModifyBaseInfo({navigation, route, isEdit}) {
    const jump = useJump();
    const {subject_id} = route?.params ?? {};
    const [bgSource, setBgSource] = useState();
    const [bgPreview, setBgPreview] = useState();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const [showPickerModal, setPickerModal] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState([]);

    const canGoBack = useRef(false);

    const showSelectImg = () => {
        setPickerModal(true);
    };

    const rightPress = () => {
        if (!bgSource || bgSource.length === 0) {
            Toast.show('未选择背景图片');
            return;
        }
        if (!title || title.length === 0) {
            Toast.show('专题名称未填写');
            return;
        }
        if (!desc || desc.length === 0) {
            Toast.show('专题简介未填写');
            return;
        }

        if (desc.length < 50) {
            Toast.show('专题简介需大于50个字');
            return;
        }

        if (!tags || tags.length === 0) {
            Toast.show('专题标签未填写');
            return;
        }

        saveStashBaseInfo({
            subject_id: subject_id || 0,
            name: title,
            bg_img: bgSource,
            desc: desc,
            tags,
        }).then((res) => {
            if (res.code === '000000') {
                if (isEdit) {
                    canGoBack.current = true;
                    navigation.goBack();
                } else {
                    console.log('jump:', data.next_button.url);
                    jump(data.next_button.url);

                    // jump({
                    //     path: 'SpecialDetailDraft',
                    //     type: 4,
                    //     params: {
                    //         link: 'http://localhost:3001/specialDetailDraft',
                    //         secne: 'create',
                    //         params: data.next_button.url.params.params,
                    //     },
                    // });
                }
            } else {
                Toast.show(res.message);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            let listener = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                if (canGoBack.current) {
                    navigation.dispatch(e.data.action);
                    return;
                }
                if (bgSource || title || desc || tags.length > 1) {
                    Modal.show({
                        content: '已编辑内容是否要保存草稿？下次可继续编辑。',
                        cancelText: '不保存草稿',
                        confirmText: '保存草稿',
                        confirm: true,
                        backCloseCallbackExecute: true,
                        cancelCallBack: () => {
                            navigation.dispatch(e.data.action);
                        },
                        confirmCallBack: () => {
                            saveStashBaseInfo({
                                subject_id: subject_id || 0,
                                name: title,
                                bg_img: bgSource,
                                desc: desc,
                                tags,
                            }).then((_) => {
                                navigation.dispatch(e.data.action);
                            });
                        },
                    });
                } else {
                    navigation.dispatch(e.data.action);
                }
            });
            return () => listener?.();
        }, [bgSource, title, desc, tags])
    );

    const handleChooseOld = () => {
        jump({
            path: 'SpecialModifyBgImage',
            params: {
                onSure: (uri) => {
                    setBgSource(uri);
                    setBgPreview(null);
                },
                selectedUri: bgSource,
            },
        });
    };
    const handlePickAlumn = () => {
        pickerUploadImg(({url, uri}) => {
            console.log('pickerUploadImg:', url, uri);
            setBgSource(url);
            setBgPreview(uri);
        });
    };

    useEffect(() => {
        setLoading(true);
        getStashBaseInfo({subject_id: subject_id || 0})
            .then((res) => {
                if (res.code === '000000') {
                    console.log('getStashBaseInfo:', res);
                    setData(res.result);
                    setTitle(res.result.name || '');
                    setDesc(res.result.desc || '');
                    setTags(res.result.tags.filter((t) => t.length > 0) || []);
                    setBgSource(res.result.bg_img || null);
                }
            })
            .finally((_) => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
                <NavBar
                    title={isEdit ? '修改专题基础信息' : '创建专题'}
                    leftIcon="chevron-left"
                    leftPress={() => navigation.goBack()}
                />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }

    let uploadImgSection;
    if (bgSource) {
        // 背景图片是否已选择
        uploadImgSection = (
            <TouchableOpacity style={[styles.uload_btn, Style.flexCenter]} activeOpacity={0.9} onPress={showSelectImg}>
                <ImageBackground
                    resizeMode="cover"
                    imageStyle={{borderRadius: 6}}
                    source={{uri: bgPreview ? bgPreview : bgSource}}
                    style={[styles.bg_image]}>
                    <FastImage
                        source={require('~/assets/img/special/camera.png')}
                        style={[styles.upload_centerCamera]}
                    />
                </ImageBackground>
            </TouchableOpacity>
        );
    } else {
        uploadImgSection = (
            <TouchableOpacity
                style={[styles.uload_btn, styles.upload_init, Style.flexCenter]}
                activeOpacity={0.9}
                onPress={showSelectImg}>
                <FastImage source={require('~/assets/img/special/add-fill.png')} style={[styles.upload_centerAdd]} />
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar
                title={isEdit ? '修改专题基础信息' : '创建专题'}
                leftIcon="chevron-left"
                rightText={isEdit ? '保存' : data.next_button?.text ?? '下一步'}
                rightPress={rightPress}
                leftPress={() => navigation.goBack()}
                rightTextStyle={styles.right_sty}
            />
            <ScrollView style={styles.contentWrap} keyboardShouldPersistTaps="handled">
                <Text style={styles.upload_label}>上传专题背景图片</Text>
                <View style={[styles.space1, styles.upload_imageWrap]}>{uploadImgSection}</View>
                <View style={[styles.space2, styles.inputWrap]}>
                    <TextInput
                        placeholderTextColor={'#9AA0B1'}
                        style={styles.titleInput}
                        onChangeText={setTitle}
                        placeholder="请输入专题名称，最多13个字符"
                        value={title}
                        maxLength={13}
                        clearButtonMode="never"
                    />
                    <TouchableOpacity style={styles.titleInput_clearBtn} onPress={() => setTitle('')}>
                        <FastImage
                            style={{width: px(14), height: px(14)}}
                            source={require('~/assets/img/special/clear_input.png')}
                        />
                    </TouchableOpacity>
                    <View style={[styles.line, styles.space1]} />
                </View>
                <View style={[styles.space2, styles.inputWrap]}>
                    <TextInput
                        style={styles.descInput}
                        placeholderTextColor={'#9AA0B1'}
                        placeholder="请输入专题简介，最少50个字，最多150个字"
                        onChangeText={setDesc}
                        maxLength={150}
                        numberOfLines={0}
                        multiline={true}
                        editable
                        value={desc}
                        clearButtonMode="never"
                    />
                    <TouchableOpacity style={styles.titleInput_clearBtn} onPress={() => setDesc('')}>
                        <FastImage
                            style={{width: px(14), height: px(14)}}
                            source={require('~/assets/img/special/clear_input.png')}
                        />
                    </TouchableOpacity>
                    <View style={[styles.line, styles.space1]} />
                </View>
                <TagWrap tags={tags} setTags={setTags} />
            </ScrollView>

            <SelectModal
                entityList={typeArr}
                callback={(i) => {
                    if (i == 0) {
                        handleChooseOld();
                    } else {
                        handlePickAlumn();
                    }
                }}
                show={showPickerModal}
                closeModal={(show) => {
                    setPickerModal(show);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    right_sty: {
        marginRight: px(14),
        color: '#121D3A',
    },
    pageWrap: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentWrap: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: px(16),
        paddingRight: px(16),
        paddingTop: px(12),
        minHeight: '100%',
    },
    space1: {
        marginTop: px(12),
    },
    space2: {
        marginTop: px(20),
    },
    line: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#BDC2CC',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    upload_label: {
        fontSize: px(16),
        fontWeight: 'bold',
        color: '#121D3A',
    },
    upload_imageWrap: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: px(6),
    },

    uload_btn: {
        display: 'flex',
        position: 'relative',
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        opacity: 1,
        width: '100%',
        height: px(200),
    },
    upload_init: {
        width: px(125),
        height: px(125),
    },
    upload_centerAdd: {
        height: 24,
        width: 24,
    },
    upload_centerCamera: {
        width: px(40),
        height: px(40),
    },

    bg_image: {
        width: '100%',
        height: '100%',
        minHeight: 100,
        borderRadius: px(6),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: px(12),
    },
    titleInput: {
        fontSize: px(16),
        color: '#121D3A',
        // width: '100%',
        flex: 1,
    },
    titleInput_clearBtn: {
        width: px(20),
        height: px(20),
    },
    descInput: {
        fontSize: px(13),
        flex: 1,
        color: '#545968',
    },
    descInputWrap: {},
    tipWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
    },
    tip_icon: {
        height: px(16),
        width: px(16),
        alignSelf: 'flex-start',
        // marginTop: px(2),
    },
    tip: {
        marginLeft: 4,
        fontSize: px(11),
        lineHeight: px(16),
        alignSelf: 'flex-start',
        color: '#9AA0B1',
        flex: 1,
    },

    tagsWrap: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    tagItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px(40),
        height: px(25),
        backgroundColor: '#F1F6FF',
        paddingLeft: px(12),
        paddingRight: px(8),
        marginRight: px(8),
        marginBottom: px(8),
    },
    tagItem_text: {
        color: '#0051CC',
        fontSize: px(12),
    },
    tagItem_closeWrap: {
        height: '100%',
        width: px(16),
        justifyContent: 'center',
        alignItems: 'center',
    },

    tagItemAdd: {
        backgroundColor: '#F5F6F8',
        paddingRight: px(12),
    },
    tagItemAdd_text: {
        color: '#9AA0B1',
        fontSize: px(12),
    },
    tagItem_inputWrap: {
        width: '100%',
        height: 200,
        maxHeight: deviceHeight / 2,
        paddingTop: 20,
        paddingLeft: 16,
        paddingRight: 16,
    },
    tagItem_input: {
        width: '100%',
        height: px(24),
        fontSize: px(14),
    },
});
