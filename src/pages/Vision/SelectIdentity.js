/*
 * @Date: 2022-02-15 14:47:58
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 18:18:47
 * @Description: 选择视野中的身份
 */
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import Image from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {Modal, SelectModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../Portfolio/components/PageLoading';
import {getUserInfo} from '~/redux/actions/userInfo';
import http from '../../services';
import upload from '../../services/upload';
import {px, requestAuth} from '../../utils/appUtil';

function reducer(state, action) {
    switch (action.type) {
        case 'set_data':
            return {...action.payload};
        case 'update_avatar':
            return {...state, virtual: {...state.virtual, img: action.payload}};
        case 'update_nickname':
            return {...state, virtual: {...state.virtual, name: action.payload}};
        case 'update_error_tip':
            return {...state, errorTip: action.payload};
        default:
            throw new Error();
    }
}

export default ({navigation}) => {
    const reduxDispatch = useDispatch();
    const inputRef = useRef();
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState();
    const [data, dispatch] = useReducer(reducer, {});
    const {button = {}, desc, errorTip = '', real = {}, virtual, virtual: {img: avatar, name: nickname} = {}} = data;

    // 选择图片或相册
    const onClickChoosePicture = () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    () => openPicker('gallery'),
                    () => blockCal('gallery')
                );
            } else {
                requestAuth(
                    PERMISSIONS.IOS.PHOTO_LIBRARY,
                    () => openPicker('gallery'),
                    () => blockCal('gallery')
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };
    // 从相机中选择
    const takePic = () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    () => openPicker('camera'),
                    () => blockCal('camera')
                );
            } else {
                requestAuth(
                    PERMISSIONS.IOS.CAMERA,
                    () => openPicker('camera'),
                    () => blockCal('camera')
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };
    // 打开相册或相机
    const openPicker = (action) => {
        setTimeout(() => {
            if (action === 'gallery') {
                launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, (res) => {
                    const {assets: [file] = []} = res;
                    setTimeout(() => {
                        file &&
                            ImagePicker.openCropper({
                                path: file.uri,
                                width: px(320),
                                height: px(320),
                                cropping: true,
                                cropperChooseText: '选择',
                                cropperCancelText: '取消',
                                loadingLabelText: '加载中',
                            })
                                .then((image) => {
                                    uploadImage({
                                        fileName: image.filename,
                                        type: image.mime,
                                        uri: image.path,
                                    });
                                })
                                .catch((err) => {
                                    console.warn(err);
                                });
                    }, 500);
                });
            } else if (action === 'camera') {
                ImagePicker.openCamera({
                    width: px(320),
                    height: px(320),
                    cropping: true,
                    cropperChooseText: '选择',
                    cropperCancelText: '取消',
                    loadingLabelText: '加载中',
                })
                    .then((image) => {
                        uploadImage({
                            fileName: image.filename,
                            type: image.mime,
                            uri: image.path,
                        });
                    })
                    .catch((err) => {
                        console.warn(err);
                    });
            }
        }, 800);
    };
    // 权限提示弹窗
    const blockCal = (action) => {
        Modal.show({
            title: '权限申请',
            content: `${action === 'gallery' ? '相册' : '相机'}权限没打开,请前往手机的“设置”选项中,允许该权限`,
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
                openSettings().catch(() => console.warn('无法打开设置'));
            },
        });
    };
    // 上传图片
    const uploadImage = (file) => {
        const toast = Toast.showLoading('正在上传');
        upload(
            '/vision/image_upload/20220216',
            file,
            [],
            (res) => {
                Toast.hide(toast);
                if (res?.code === '000000') {
                    Toast.show('上传成功');
                    ImagePicker.clean();
                    dispatch({payload: res?.result?.url, type: 'update_avatar'});
                } else {
                    Toast.show(res?.message || '上传失败');
                }
            },
            () => {
                Toast.hide(toast);
                Toast.show('上传失败');
            }
        );
    };
    // 完成设置
    const onSubmit = () => {
        const toast = Toast.showLoading('设置中');
        const {img, name} = type === 'real' ? real : virtual;
        http.post('/vision/set_user_info/20220216', {img, name, show_type: type === 'real' ? 0 : 1}).then((res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                reduxDispatch(getUserInfo());
                Toast.show('设置成功');
                navigation.goBack();
            } else {
                Toast.show(res.message);
            }
        });
    };

    useEffect(() => {
        http.get('/vision/select_user_info/20220216').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '选择视野中的身份'});
                if (res.result.real.select) {
                    setType('real');
                } else {
                    setType('virtual');
                }
                dispatch({payload: res.result, type: 'set_data'});
            }
        });
    }, []);

    useEffect(() => {
        dispatch({payload: '', type: 'update_error_tip'});
        if (type === 'virtual') {
            if (avatar === '') {
                dispatch({payload: '请设置头像', type: 'update_error_tip'});
            } else if (nickname === '') {
                dispatch({payload: '请输入昵称', type: 'update_error_tip'});
            }
        }
    }, [avatar, nickname, type]);

    return Object.keys(data || {}).length > 0 ? (
        <ScrollView bounces={false} keyboardShouldPersistTaps="handled" style={styles.container}>
            <Text style={styles.info}>{desc || ''}</Text>
            <View style={[Style.flexBetween, {marginTop: Space.marginVertical}]}>
                <View style={[styles.identityCon, type === 'real' ? {borderColor: Colors.brandColor} : {}]}>
                    <Text style={styles.info}>{'真实'}</Text>
                    <Image
                        source={{
                            uri: real.img || 'https://static.licaimofang.com/wp-content/uploads/2022/02/avatar.png',
                        }}
                        style={[styles.avatar, {marginTop: Space.marginVertical, marginHorizontal: px(42)}]}
                    />
                    <Text style={[styles.username, {marginTop: Space.marginVertical}]}>{real.name || ''}</Text>
                    <View style={styles.chooseBtn}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setType('real')}
                            style={[Style.flexCenter, {paddingVertical: px(14)}]}>
                            <Text style={styles.chooseText}>{'选Ta'}</Text>
                        </TouchableOpacity>
                    </View>
                    {type === 'real' && (
                        <Image source={require('../../assets/img/vision/choose.png')} style={styles.chooseImg} />
                    )}
                </View>
                <View style={[styles.identityCon, type === 'virtual' ? {borderColor: Colors.brandColor} : {}]}>
                    <Text style={styles.info}>{'虚拟'}</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setVisible(true);
                            setType('virtual');
                        }}
                        style={[Style.flexCenter, {marginTop: Space.marginVertical}]}>
                        <Image
                            source={{
                                uri: avatar || 'https://static.licaimofang.com/wp-content/uploads/2022/02/avatar.png',
                            }}
                            style={styles.avatar}
                        />
                        <View style={[Style.flexCenter, styles.cameraCon]}>
                            <Icon name="camera" size={12} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            const isFocused = inputRef.current?.isFocused();
                            if (!isFocused) {
                                inputRef.current?.focus();
                            }
                        }}
                        style={[Style.flexCenter, {marginTop: Space.marginVertical}]}>
                        {nickname?.length === 0 && <Text style={styles.placeholder}>点击输入昵称</Text>}
                        <TextInput
                            maxLength={7}
                            onChangeText={(text) => dispatch({payload: text, type: 'update_nickname'})}
                            onFocus={() => setType('virtual')}
                            textAlign="left"
                            ref={inputRef}
                            style={styles.input}
                            value={nickname}
                        />
                        <Image source={require('../../assets/img/vision/edit.png')} style={styles.editImg} />
                    </TouchableOpacity>
                    <View style={styles.chooseBtn}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setType('virtual')}
                            style={[Style.flexCenter, {paddingVertical: px(14)}]}>
                            <Text style={styles.chooseText}>{'选Ta'}</Text>
                        </TouchableOpacity>
                    </View>
                    {type === 'virtual' && (
                        <Image source={require('../../assets/img/vision/choose.png')} style={styles.chooseImg} />
                    )}
                    {errorTip ? <Text style={styles.errorTip}>{errorTip}</Text> : null}
                </View>
            </View>
            <Button
                disabled={type === 'virtual' && (avatar === '' || nickname === '')}
                onPress={onSubmit}
                style={{marginTop: px(40)}}
                title={button.text || '确定'}
            />
            <SelectModal
                callback={(index) => {
                    if (index === 0) {
                        onClickChoosePicture();
                    } else if (index === 1) {
                        takePic();
                    }
                }}
                closeModal={() => setVisible(false)}
                entityList={['从相册中获取', '拍照']}
                show={visible}
            />
        </ScrollView>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingTop: px(12),
        paddingHorizontal: Space.padding,
    },
    info: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
    },
    identityCon: {
        padding: px(12),
        paddingBottom: 0,
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        borderRadius: px(8),
        width: px(164),
        backgroundColor: '#fff',
    },
    avatar: {
        width: px(56),
        height: px(56),
        borderRadius: px(56),
    },
    username: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
        textAlign: 'center',
    },
    cameraCon: {
        borderWidth: Space.borderWidth,
        borderColor: '#2B3652',
        borderRadius: px(21),
        position: 'absolute',
        right: px(32),
        bottom: 0,
        width: px(21),
        height: px(21),
        backgroundColor: '#fff',
    },
    input: {
        width: '80%',
        height: px(22),
        fontSize: Font.textH2,
        color: Colors.defaultColor,
    },
    placeholder: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.lightGrayColor,
        textAlign: 'center',
        position: 'absolute',
    },
    editImg: {
        position: 'absolute',
        right: 0,
        bottom: px(3),
        width: px(14),
        height: px(14),
    },
    chooseBtn: {
        marginTop: px(8),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    chooseText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.brandColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    chooseImg: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: px(26),
        height: px(26),
    },
    errorTip: {
        position: 'absolute',
        right: 0,
        bottom: px(-30),
        left: 0,
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.red,
        textAlign: 'center',
    },
});
