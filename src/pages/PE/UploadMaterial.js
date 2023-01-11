/*
 * @Date: 2022-05-17 15:46:02
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-11 18:31:46
 * @Description: 投资者证明材料上传
 */
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
    DeviceEventEmitter,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {Modal, SelectModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import upload from '../../services/upload';
import {isIphoneX, px, requestAuth} from '../../utils/appUtil';
import {
    androidHideLoading,
    androidShowLoading,
    // detectNFCStatus,
    enterToConfirmInfoPage,
    enterToReadCardPage,
    MethodObj,
    NativeReadCardEmitter,
    tokenCloudIdentityInit,
} from '../CreateAccount/Account/TokenCloudBridge';
import {debounce} from 'lodash';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

export default ({navigation, route}) => {
    const [data, setData] = useState({});
    const [visible, setVisible] = useState(false);
    const [selectData, setSelectData] = useState(['从相册中获取', '拍照']);
    const {button = {}, id_info = {}, materials = []} = data;
    const {back, desc: idDesc, front, title: idTitle} = id_info;
    const clickIndexRef = useRef('');
    // const nfcEnable = useRef(false);
    const cardInfoRef = useRef({});
    const toastRef = useRef('');
    const uiconfig = useRef({
        readTitle: '身份认证，立即开启',
        readTitleColor: '#ff0000',
        readBtnTextColor: '#FFFFFF',
        readBtnBgColor: '#0000FF',
        bottomTipText: '个人信息已加密保护',
        bottomTipTextColor: '#333333',
        sureMessageTextColor: '#FFFFFF',
        sureMessageBgColor: '#0000FF',
        bottomTipImageDrawableBase64: '112jiaaaa',
        openNfcBtnBgColor: '#333333',
        openNfcBtnTextColor: '#FFFFFF',
    }).current;

    const finished = useMemo(() => {
        const {id_info: _id_info = {}, materials: _materials = []} = data;
        const filled = _materials.every((item) => item.images?.length > 0);
        return _id_info.front && _id_info.back && filled;
    }, [data]);

    // 点击上传身份证
    const onPressIdUpload = (type) => {
        clickIndexRef.current = type;
        // if (nfcEnable.current) {
        //     // 检测NFC状态
        //     detectNFCStatus((status) => {
        //         if (status === 1 || status === 2) {
        //             setSelectData(['从相册中获取', '拍照', 'NFC读取身份证']);
        //         } else if (status === 3 || status === 4) {
        //             setSelectData(['从相册中获取', '拍照']);
        //         }
        //         setVisible(true);
        //     });
        // } else {
        //     setVisible(true);
        // }
        setVisible(true);
    };

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
                ImagePicker.openPicker({
                    cropping: false,
                    loadingLabelText: '加载中',
                    mediaType: 'photo',
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
            } else if (action === 'camera') {
                ImagePicker.openCamera({
                    cropping: false,
                    loadingLabelText: '加载中',
                    mediaType: 'photo',
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
            content: `${
                action === 'gallery' ? '相册' : action === 'doc' ? '文档' : '相机'
            }权限没打开,请前往手机的“设置”选项中,允许该权限`,
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
        const _data = {...data};
        const type =
            typeof clickIndexRef.current === 'number' ? _data?.materials[clickIndexRef.current]?.type : 'id_card';
        // console.log(file, type);
        upload(
            '/private_fund/upload_material/20220510',
            file,
            type === 'id_card'
                ? [
                      {data: clickIndexRef.current, name: 'scene'},
                      {data: '1', name: 'type'},
                  ]
                : [{data: `${type}`, name: 'type'}],
            (res) => {
                Toast.hide(toast);
                if (res?.code === '000000') {
                    Toast.show('上传成功');
                    if (type === 'id_card') {
                        _data.id_info[clickIndexRef.current] = res.result.url;
                    } else {
                        // 图片的name为空
                        let obj = {type: 'img', url: res.result.url, name: ''};
                        if (_data?.materials[clickIndexRef.current]?.images) {
                            _data.materials[clickIndexRef.current].images.push(obj);
                        } else {
                            _data.materials[clickIndexRef.current].images = [obj];
                        }
                    }
                    setData(_data);
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

    // 上传pdf
    const takePdf = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.pdf],
            copyTo: 'cachesDirectory',
        }).then((file) => {
            const toast = Toast.showLoading('正在上传');
            const _data = {...data};
            const _file = {fileName: file.name, type: 'application/pdf', uri: file.fileCopyUri};
            http.uploadFiles('/private_fund/upload_material/20220510', _file)
                .then((res) => {
                    Toast.hide(toast);
                    if (res?.code === '000000') {
                        Toast.show('上传成功');

                        let obj = {type: 'pdf', url: res.result.url, name: file.name};
                        if (_data?.materials[clickIndexRef.current]?.images) {
                            _data.materials[clickIndexRef.current].images.push(obj);
                        } else {
                            _data.materials[clickIndexRef.current].images = [obj];
                        }
                        setData(_data);
                    } else {
                        Toast.show(res?.message || '上传失败');
                    }
                })
                .catch(() => {
                    Toast.hide(toast);
                    Toast.show('上传失败');
                });
        });
    };

    // 读卡成功，获取到ReqID
    const successReqidCallback = (reminder) => {
        // iOS和安卓都有
        const {reqId} = reminder;
        // iOS由于系统原因，无hardwareId, iOS为null
        http.get('/passport/tokencloud/element/20220117', {
            req_id: reqId,
        }).then((res) => {
            if (res.code === '000000' && res.result && Object.keys(res.result).length) {
                const cardInfo = res.result;
                cardInfoRef.current = cardInfo;
                // 请求9要素解码接口获取数据，转为json字符串处理进入确认信息页面
                if (Platform.OS === 'ios') {
                    // iOS
                    setTimeout(() => {
                        const infoString = JSON.stringify(cardInfo);
                        enterToConfirmInfoPage(infoString);
                    }, 300);
                } else {
                    // 安卓
                    androidShowLoading();
                    const infoString = JSON.stringify(cardInfo);
                    androidHideLoading();
                    enterToConfirmInfoPage(infoString);
                }
            }
        });
    };

    //  读卡失败
    //  @param errorCode 错误码
    //  @param errorMessage 错误信息
    //  - 10001: 读卡超时
    //  - 10002: 读卡失败
    //  - 10003: 设备不支持NFC
    //  - 10004: 用户取消读卡操作，点击读卡页面左上角返回按钮
    //  - 10005: 用户取消读卡操作, 3次取消读卡后，点击选择其他方式
    const readCardFailed = (reminder) => {
        console.log(reminder);
    };

    // 用户在确认信息页面返回获取到正反面图片
    //  @param code 点击类型，0: 点击左上角返回按钮 1: 点击确认信息按钮
    //  @param frontBitmapBase64Str 正面身份证照(头像页) base64
    //  @param backBitmapBase64Str 反面身份证照(国徽页) base64
    //  @param fullBitmapBase64Str 正反面合成照片 base64
    const confirmCardInfoCallback = async (reminder) => {
        console.log(reminder.code);
        if (reminder.code !== 0) {
            toastRef.current = Toast.showLoading('正在上传');
            try {
                await base64Upload('front', reminder.frontBitmapBase64Str);
                await base64Upload('back', reminder.backBitmapBase64Str);
                Toast.show('上传成功');
                const {name, idnum: id_no} = cardInfoRef.current;
                DeviceEventEmitter.emit('upload', {name, id_no});
            } catch (error) {
                Toast.show(error);
            }
        }
    };

    //上传正反面base64照片
    const base64Upload = (type, _data) => {
        return new Promise((resolve, reject) => {
            http.post('/mapi/identity/upload/20210101', {
                file_con: _data,
                desc: type,
                ...cardInfoRef.current,
                adapter: 1, //使用axios
            }).then(async (res) => {
                Toast.hide(toastRef.current);
                if (res.code === '000000') {
                    const tempData = {...data};
                    if (type === 'front') {
                        tempData.id_info.front = `data:image/png;base64,${_data}`;
                    } else {
                        tempData.id_info.back = `data:image/png;base64,${_data}`;
                    }
                    setData(tempData);
                    resolve(1);
                } else {
                    reject(res.message);
                }
            });
        });
    };

    //  确信页面页面加载异常
    //  触发场景：传入数据在sdk内部解析失败，无法正确展示UI页面
    const confirmCardFailed = (reminder) => {
        console.log('数据加载异常', reminder);
    };

    const onSubmit = useCallback(
        debounce(
            () => {
                const toast = Toast.showLoading();
                const params = {materials: {}, order_id: route.params.order_id || ''};
                const {id_info: _id_info, materials: _materials = []} = data;
                _materials.forEach((item) => (params.materials[item.type] = item.images));
                params.materials[1] = [
                    {type: 'img', url: _id_info.front, name: ''},
                    {type: 'img', url: _id_info.back, name: ''},
                ];
                params.materials = JSON.stringify(params.materials);
                http.post('/private_fund/submit_certification_material/20220510', params)
                    .then((res) => {
                        if (res.code === '000000') {
                            navigation.goBack();
                        }
                        Toast.hide(toast);
                        Toast.show(res.message);
                    })
                    .catch(() => {
                        Toast.hide(toast);
                    });
            },
            1000,
            {leading: true, trailing: false}
        ),
        [data]
    );

    useFocusEffect(
        useCallback(() => {
            // 令牌云SDK初始化
            tokenCloudIdentityInit(
                '00DA2110281448486514',
                0,
                'eidcloudread.eidlink.com',
                9989,
                52302,
                (status, errorCode) => {
                    if (status === 0) {
                        console.log('初始化成功');
                    } else {
                        console.log('初始化失败: ' + errorCode);
                    }
                }
            );

            // 读卡成功获取到reqid
            const successReqidSubscription = NativeReadCardEmitter.addListener(
                MethodObj.readCardSuccess,
                (reminder) => {
                    successReqidCallback(reminder);
                }
            );

            // 读卡失败
            const readCardFailedSubscription = NativeReadCardEmitter.addListener(
                MethodObj.readCardFailed,
                (reminder) => {
                    readCardFailed(reminder);
                }
            );

            // 确认信息成功
            const confirmInfoSubscription = NativeReadCardEmitter.addListener(MethodObj.confirmCardInfo, (reminder) => {
                confirmCardInfoCallback(reminder);
            });

            // 确认信息失败
            const confirmInfoFailedSubscription = NativeReadCardEmitter.addListener(
                MethodObj.confirmCardFailed,
                (reminder) => {
                    confirmCardFailed(reminder);
                }
            );
            return () => {
                successReqidSubscription?.remove?.();
                readCardFailedSubscription?.remove?.();
                confirmInfoSubscription?.remove?.();
                confirmInfoFailedSubscription?.remove?.();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            http.get('/private_fund/certification_material_info/20220510', {
                order_id: route.params.order_id || '',
            }).then((res) => {
                if (res.code === '000000') {
                    navigation.setOptions({title: res.result.title || '投资者证明材料上传'});
                    setData(res.result);
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {Object.keys(id_info).length > 0 ? (
                    <View style={styles.partBox}>
                        {idTitle ? <Text style={styles.partTitle}>{idTitle}</Text> : null}
                        {idDesc ? <Text style={styles.partDesc}>{idDesc}</Text> : null}
                        <View style={Style.flexBetween}>
                            <View style={styles.uploadBox}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={button.avail === 0}
                                    onPress={() => onPressIdUpload('front')}
                                    style={styles.imgBox}>
                                    <Image
                                        source={front ? {uri: front} : require('../../assets/img/fof/uploadID1.png')}
                                        style={styles.uploadID}
                                    />
                                </TouchableOpacity>
                                {button.avail !== 0 && <Text style={styles.uploadTips}>{'点击拍摄/上传人像面'}</Text>}
                            </View>
                            <View style={styles.uploadBox}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={button.avail === 0}
                                    onPress={() => onPressIdUpload('back')}
                                    style={styles.imgBox}>
                                    <Image
                                        source={back ? {uri: back} : require('../../assets/img/fof/uploadID2.png')}
                                        style={styles.uploadID}
                                    />
                                </TouchableOpacity>
                                {button.avail !== 0 && <Text style={styles.uploadTips}>{'点击拍摄/上传国徽面'}</Text>}
                            </View>
                        </View>
                    </View>
                ) : null}
                {materials.map((item, index, arr) => {
                    const {desc, images = [], max = 6, title, type} = item;
                    return (
                        <View
                            key={item + index}
                            style={[styles.partBox, {marginBottom: index === arr.length - 1 ? px(20) : 0}]}>
                            {title ? <Text style={styles.partTitle}>{title}</Text> : null}
                            {desc ? <Text style={styles.partDesc}>{desc}</Text> : null}
                            <View style={styles.uploadBoxWrap}>
                                {images.map((img, i) => {
                                    return (
                                        <View key={img.url + i} style={[styles.uploadBox, {justifyContent: 'center'}]}>
                                            <View
                                                style={[
                                                    img.type === 'img'
                                                        ? {width: px(108), height: '100%'}
                                                        : styles.displayBox,
                                                ]}>
                                                {img.type === 'img' ? (
                                                    <Image source={{uri: img.url}} style={styles.displayImg} />
                                                ) : (
                                                    <View
                                                        style={[
                                                            styles.displayImg,
                                                            {justifyContent: 'center', marginTop: px(2)},
                                                        ]}>
                                                        <View
                                                            style={[
                                                                {
                                                                    backgroundColor: '#fff',
                                                                    width: '100%',
                                                                    height: px(68),
                                                                },
                                                                Style.flexCenter,
                                                            ]}>
                                                            <Image
                                                                source={{
                                                                    uri:
                                                                        'https://static.licaimofang.com/wp-content/uploads/2023/01/pdf-icon.png',
                                                                }}
                                                                style={[{width: px(40), height: px(40)}]}
                                                            />
                                                        </View>
                                                        <Text
                                                            style={[styles.uploadTips, {marginTop: px(10)}]}
                                                            numberOfLines={1}>
                                                            {img.name}
                                                        </Text>
                                                    </View>
                                                )}
                                                {button.avail !== 0 && (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => {
                                                            const _data = {...data};
                                                            const temp = _data.materials[index].images;
                                                            temp.splice(i, 1);
                                                            setData(_data);
                                                        }}
                                                        style={styles.deleteIcon}>
                                                        <AntDesign
                                                            color={Colors.defaultColor}
                                                            name="closecircle"
                                                            size={px(16)}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                                {images.length === max || button.avail === 0 ? null : (
                                    <View style={styles.uploadBox}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                clickIndexRef.current = index;
                                                let opt = ['从相册中获取', '拍照'];
                                                if (type === 2) {
                                                    opt.push('上传文件（pdf）');
                                                }
                                                setSelectData(opt);
                                                setVisible(true);
                                            }}
                                            style={styles.imgBox}>
                                            <Image
                                                source={require('../../assets/img/fof/upload.png')}
                                                style={styles.uploadID}
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.uploadTips}>{'点击上传'}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            {button.text ? (
                <View style={[Style.flexRow, styles.bottomBtn]}>
                    <Button
                        color={'#EDDBC5'}
                        disabled={button.avail === 0 || !finished}
                        disabledColor={'#EDDBC5'}
                        onPress={onSubmit}
                        style={styles.nextBtn}
                        title={button.text}
                    />
                </View>
            ) : null}
            <SelectModal
                callback={(index) => {
                    if (index === 0) {
                        onClickChoosePicture();
                    } else if (index === 1) {
                        takePic();
                    } else if (index === 2) {
                        // setTimeout(() => {
                        //     // 进入读卡页面
                        //     enterToReadCardPage(JSON.stringify(uiconfig));
                        // }, 1000);
                        takePdf();
                    }
                }}
                closeModal={() => setVisible(false)}
                entityList={selectData}
                show={visible}
            />
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    partBox: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    partDesc: {
        marginTop: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    uploadBoxWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    uploadBox: {
        marginTop: Space.marginVertical,
        borderRadius: Space.borderRadius,
        width: px(148),
        height: px(130),
        backgroundColor: Colors.bgColor,
        alignItems: 'center',
    },
    imgBox: {
        marginTop: px(20),
        marginBottom: px(12),
    },
    uploadID: {
        width: px(108),
        height: px(68),
    },
    uploadTips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    displayBox: {
        width: px(124),
        height: px(84),
    },
    displayImg: {
        width: '100%',
        height: '100%',
    },
    deleteIcon: {
        position: 'absolute',
        top: px(-8),
        right: px(-8),
        zIndex: 1,
        backgroundColor: Colors.bgColor,
        borderRadius: px(16),
    },
    bottomBtn: {
        paddingTop: px(8),
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 : px(8),
        backgroundColor: '#fff',
    },
    prevBtn: {
        marginRight: px(12),
        width: px(166),
    },
    nextBtn: {
        flex: 1,
        backgroundColor: '#D7AF74',
    },
    btnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
    },
});
