/*
 * @Date: 2022-10-09 14:06:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 15:47:40
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecialCreateBaseInfo.js
 * @Description:
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
    PermissionsAndroid,
    DeviceEventEmitter,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import NavBar from '~/components/NavBar';
import {isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {Style, Colors, Space} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import {getStashBaseInfo, saveStashBaseInfo, uploadImage} from './services';
import LoadingTips from '~/components/LoadingTips';

function Tag(props) {
    let {text, onPress, onClose} = props;
    return (
        <View style={[styles.tagItem]}>
            <Pressable onPress={onPress}>
                <Text style={styles.tagItem_text}>{text}</Text>
            </Pressable>
            <Pressable onPress={onClose}>
                <Text style={styles.tagItem_closeIcon}>X</Text>
            </Pressable>
            {/* <FastImage style={styles.tagItem_closeIcon}>X</FastImage> */}
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

    const handleTagChange = (i) => {
        console.log('handleTagChange:', i);
        setIndex(i);
        if (i === -1) {
            setText('');
        } else {
            setText(tags[i]);
        }
        bottomModal.current?.show();
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
    return (
        <>
            <View style={[styles.space2, styles.tagsWrap]}>
                {tags.length < 3 && <AddTag onPress={() => handleTagChange(-1)} />}
                {(tags || []).map((tag, i) => (
                    <Tag key={tag + i} text={tag} onPress={() => handleTagChange(i)} onClose={() => handelTagDel(i)} />
                ))}
            </View>
            <View style={[styles.space1, styles.tipWrap]}>
                <FastImage style={styles.tip_icon} source={require('~/assets/img/fof/warning.png')} />
                <Text style={styles.tip}>专题标签用于流量投放，至少1个至多3个，每个标签不超过6个字</Text>
            </View>
            <BottomModal
                ref={bottomModal}
                title="标签内容编辑"
                showClose={true}
                confirmText="确定"
                onDone={handleTagEdit}>
                <View style={styles.tagItem_inputWrap}>
                    <TextInput
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
const blockCal = () => {
    Modal.show({
        title: '权限申请',
        content: '权限没打开,请前往手机的“设置”选项中,允许该权限',
        confirm: true,
        confirmText: '前往',
        confirmCallBack: () => {
            openSettings().catch(() => console.warn('cannot open settings'));
        },
    });
};

export default function SpecialModifyBaseInfo({navigation, route, isEdit}) {
    const jump = useJump();
    const {subject_id} = route?.params ?? {};
    const [bgSource, setBgSource] = useState();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const [showPickerModal, setPickerModal] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState([]);

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
                    navigation.goBack();
                } else {
                    jump(data.next_button.url);
                }
            }
        });
    };

    const handleBack = () => {
        if (bgSource || title || desc || tags.length > 1) {
            Modal.show({
                content: '已编辑内容是否要保存草稿？下次可继续编辑。',
                cancelText: '不保存草稿',
                confirmText: '保存草稿',
                confirm: true,
                backCloseCallbackExecute: true,
                cancelCallBack: () => {
                    navigation.goBack();
                },
                confirmCallBack: () => {
                    saveStashBaseInfo({
                        subject_id: subject_id || 0,
                        name: title,
                        bg_img: bgSource,
                        desc: desc,
                        tags,
                    }).then((_) => {
                        navigation.goBack();
                    });
                },
            });
        } else {
            navigation.goBack();
        }
    };

    const handleChooseOld = () => {
        jump({
            path: 'SpecialModifyBgImage',
            params: {
                onSure: (uri) => {
                    setBgSource(uri);
                },
                selectedUri: bgSource,
            },
        });
    };

    const openPicker = () => {
        setTimeout(() => {
            ImagePicker.openPicker({
                width: px(1125),
                height: px(600),
                cropping: true,
                cropperChooseText: '选择',
                cropperCancelText: '取消',
                loadingLabelText: '加载中',
                mediaType: 'photo',
            })
                .then((image) => {
                    console.log('image picker:', image);
                    uploadImage({
                        fileName: image.filename,
                        type: image.mime,
                        uri: image.path,
                    }).then((res) => {
                        if (res.code === '000000') {
                            setBgSource(res.result.url);
                        }
                    });
                })
                .catch((err) => {
                    console.warn(err);
                });
        }, 200);
    };
    const handlePickAlumn = () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, openPicker, blockCal);
            } else {
                requestAuth(PERMISSIONS.IOS.PHOTO_LIBRARY, openPicker, blockCal);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        setLoading(true);
        getStashBaseInfo({subject_id: subject_id || 0})
            .then((res) => {
                if (res.code === '000000') {
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
            <SafeAreaView edges={['bottom']}>
                <NavBar
                    title={isEdit ? '修改专题基础信息' : '创建专题'}
                    leftIcon="chevron-left"
                    leftPress={handleBack}
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
                <ImageBackground resizeMode="cover" source={{uri: bgSource}} style={[styles.bg_image]}>
                    <FastImage
                        source={require('~/components/IM/app/source/image/camera.png')}
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
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={isEdit ? '修改专题基础信息' : '创建专题'}
                leftIcon="chevron-left"
                rightText={isEdit ? '保存' : data.next_button?.text ?? '下一步'}
                rightPress={rightPress}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <ScrollView style={styles.pageWrap}>
                <Text style={styles.upload_label}>上传专题背景图片</Text>
                <View style={[styles.space1, styles.upload_imageWrap]}>{uploadImgSection}</View>
                <View style={[styles.space2, styles.inputWrap]}>
                    <TextInput
                        style={styles.title}
                        onChangeText={setTitle}
                        placeholder="请输入专题名称，最多13个字符"
                        value={title}
                        clearButtonMode="while-editing"
                    />
                    <View style={[styles.line, styles.space1]} />
                </View>
                <View style={[styles.space2, styles.inputWrap]}>
                    <TextInput
                        style={styles.desc}
                        placeholder="请输入专题简介"
                        onChangeText={setDesc}
                        maxLength={13}
                        value={desc}
                        clearButtonMode="while-editing"
                    />
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
    },
    upload_label: {
        fontSize: px(16),
        color: '#121D3A',
    },
    upload_imageWrap: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        width: 40,
        height: 40,
    },

    bg_image: {
        width: '100%',
        height: '100%',
        minHeight: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: px(16),
        color: '#121D3A',
    },
    desc: {
        fontSize: px(13),
        color: '#545968',
    },
    tipWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    tip_icon: {
        height: 12,
        width: 12,
    },
    tip: {
        marginLeft: 4,
        fontSize: px(11),
        color: '#9AA0B1',
    },

    tagsWrap: {
        display: 'flex',
        flexDirection: 'row',
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
        paddingRight: px(12),
    },
    tagItem_text: {
        color: '#0051CC',
        fontSize: px(12),
    },
    tagItem_closeIcon: {
        color: 'red',
        marginLeft: 10,
        height: px(10),
        width: px(10),
        lineHeight: px(10),
        fontSize: px(10),
    },
    tagItemAdd: {
        backgroundColor: '#F5F6F8',
    },
    tagItemAdd_text: {
        color: '#9AA0B1',
        fontSize: px(12),
    },
    tagItem_inputWrap: {
        width: '100%',
        height: 300,
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
