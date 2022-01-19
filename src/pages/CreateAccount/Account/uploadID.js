/*
 * @Date: 2021-01-18 10:27:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-19 14:50:03
 * @Description:上传身份证
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    DeviceEventEmitter,
    ScrollView,
} from 'react-native';
import {px, deviceWidth, requestAuth} from '../../../utils/appUtil';
import {Colors, Font} from '../../../common/commonStyle';
import {FixedButton} from '../../../components/Button';
import {Modal, SelectModal} from '../../../components/Modal';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import upload from '../../../services/upload';
import Toast from '../../../components/Toast';
import _ from 'lodash';
import http from '../../../services';
import {getUserInfo} from '../../../redux/actions/userInfo';
import {deleteModal} from '../../../redux/actions/modalInfo';
import {connect} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';

import {
    androidHideLoading,
    androidShowLoading,
    detectNFCStatus,
    enterToConfirmInfoPage,
    enterToReadCardPage,
    MethodObj,
    NativeReadCardEmitter,
    tokenCloudIdentityInit,
} from './TokenCloudBridge';
class UploadID extends Component {
    uiconfig = {
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
    };
    cartInfo = {};
    state = {
        frontSource: '',
        behindSource: '',
        showTypePop: false,
        clickIndex: '',
        desc: '',
        reqIdString: '',
        // 正面图片base64
        frontImgBase64: '',
        backImgBase64: '',
        combinationImgBase64: '',
        typeArr: ['从相册中获取', '拍照'],
    };
    toast = '';
    fr = this.props.route?.params?.fr;
    showPop = (clickIndex) => {
        // 检测NFC状态
        detectNFCStatus((status) => {
            if (status === 1) {
                // console.log('NFC开启');
                let selectData = this.state.typeArr;
                !selectData.includes('NFC读取身份证') && selectData.push('NFC读取身份证');
                this.setState({showTypePop: true, typeArr: selectData, clickIndex});
            } else if (status === 2) {
                let selectData = this.state.typeArr;
                !selectData.includes('NFC读取身份证') && selectData.push('NFC读取身份证');
                this.setState({showTypePop: true, typeArr: selectData, clickIndex});
                // console.log('(仅限安卓):未开启');
            } else if (status === 3 || status === 4) {
                this.setState({showTypePop: true, clickIndex});
                // console.log('不支持NFC');
                // console.log('(仅限iOS):NFC不可用,版本过低，iOS14.5以上才可使用');
            }
        });
    };
    componentDidMount() {
        // 令牌云SDK初始化
        // tokenCloudIdentityInit(
        //     '00DA2110281448486514',
        //     0,
        //     'eidcloudread.eidlink.com',
        //     9989,
        //     52302,
        //     (status, errorCode) => {
        //         if (status === 0) {
        //             console.log('初始化成功');
        //         } else {
        //             console.log('初始化失败: ' + errorCode);
        //         }
        //     }
        // );
        tokenCloudIdentityInit(
            'F186ED61F9DC446FA6C1',
            0,
            'testeidcloudread.eidlink.com',
            9989,
            26814,
            (status, errorCode) => {
                if (status === 0) {
                    console.log('初始化成功');
                } else {
                    console.log('初始化失败: ' + errorCode);
                }
            }
        );

        // 读卡成功获取到reqid
        this.successReqidSubscription = NativeReadCardEmitter.addListener(MethodObj.readCardSuccess, (reminder) => {
            this.successReqidCallback(reminder);
        });

        // 读卡失败
        this.readCardFailedSubscription = NativeReadCardEmitter.addListener(MethodObj.readCardFailed, (reminder) => {
            this.readCardFailed(reminder);
        });

        // 确认信息成功
        this.confirmInfoSubscription = NativeReadCardEmitter.addListener(MethodObj.confirmCardInfo, (reminder) => {
            this.confirmCardInfoCallback(reminder);
        });

        // 确认信息失败
        this.confirmInfoFailedSubscription = NativeReadCardEmitter.addListener(
            MethodObj.confirmCardFailed,
            (reminder) => {
                this.confirmCardFailed(reminder);
            }
        );
        http.get('/mapi/identity/upload_info/20210101', {scene: this.fr}).then((res) => {
            this.setState({
                frontSource: res.result.identity?.front,
                behindSource: res.result.identity?.back,
                desc: res.result.desc,
            });
        });

        this.subscription = DeviceEventEmitter.addListener(
            'EventType',
            _.debounce((uri) => {
                this.uri = uri;
                if (this.uri) {
                    this.uploadImage({uri, type: 'image/png', name: 'name'});
                }
                // 刷新界面等
            }, 500)
        );
    }
    componentWillUnmount() {
        this.uri = '';
        this.subscription.remove();
        this.successReqidSubscription.remove();
        this.readCardFailedSubscription.remove();
        this.confirmInfoSubscription.remove();
        this.confirmInfoFailedSubscription.remove();
    }
    // 读卡成功，获取到ReqID
    successReqidCallback(reminder) {
        // iOS和安卓都有
        let reqId = reminder.reqId;
        // iOS由于系统原因，无hardwareId, iOS为null
        http.get('/passport/tokencloud/element/20220117', {
            req_id: reqId,
        }).then((res) => {
            const cardInfo = res.result;
            this.cartInfo = cardInfo;
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
        });
    }

    //  读卡失败
    //  @param errorCode 错误码
    //  @param errorMessage 错误信息
    //  - 10001: 读卡超时
    //  - 10002: 读卡失败
    //  - 10003: 设备不支持NFC
    //  - 10004: 用户取消读卡操作，点击读卡页面左上角返回按钮
    //  - 10005: 用户取消读卡操作, 3次取消读卡后，点击选择其他方式
    readCardFailed(reminder) {
        console.log(reminder);
    }
    //上传正反面base64照片
    base64Upload = (index, data) => {
        return new Promise((resolve, reject) => {
            http.post('mapi/identity/upload/20210101', {
                file_con: data,
                desc: index == 1 ? 'front' : 'back',
                ...this.cartInfo,
                adapter: 1, //使用axios
            }).then((res) => {
                Toast.hide(this.toast);
                if (res.code === '000000') {
                    if (index == 1) {
                        this.setState({
                            frontSource: 'data:image/png;base64,' + data,
                        });
                    } else {
                        this.setState({
                            behindSource: 'data:image/png;base64,' + data,
                        });
                    }
                    resolve(1);
                } else {
                    reject(0);
                }
            });
        });
    };
    // 用户在确认信息页面返回获取到正反面图片
    //  @param code 点击类型，0: 点击左上角返回按钮 1: 点击确认信息按钮
    //  @param frontBitmapBase64Str 正面身份证照(头像页) base64
    //  @param backBitmapBase64Str 反面身份证照(国徽页) base64
    //  @param fullBitmapBase64Str 正反面合成照片 base64
    confirmCardInfoCallback(reminder) {
        this.toast = Toast.showLoading('正在上传');
        Promise.all([
            this.base64Upload(1, reminder.frontBitmapBase64Str),
            this.base64Upload(2, reminder.backBitmapBase64Str),
        ])
            .then((res) => {
                Toast.show('上传成功');
                DeviceEventEmitter.emit('upload', {name: this.cartInfo.name, id_no: this.cartInfo.idnum});
            })
            .catch((errcode) => {
                Toast.show('上传失败');
            });
    }
    //  确信页面页面加载异常
    //  触发场景：传入数据在sdk内部解析失败，无法正确展示UI页面
    confirmCardFailed(reminder) {
        console.log('数据加载异常');
    }
    handleBack = () => {
        this.props.navigation.goBack();
    };
    showImg = (uri) => {
        const {clickIndex} = this.state;
        if (clickIndex == 1) {
            this.setState({
                frontSource: uri,
            });
        } else {
            this.setState({
                behindSource: uri,
            });
        }
        if (this.state.behindSource && this.state.frontSource) {
            setTimeout(() => {
                this.props.getUserInfo();
                if (this.props.modalInfo?.log_id === 'upload_identity_pop') {
                    this.props.deleteModal();
                }
            }, 10);
        }
    };

    uploadImage = (response) => {
        const {clickIndex} = this.state;
        this.toast = Toast.showLoading('正在上传');
        upload(
            'mapi/identity/upload/20210101',
            response,
            [{name: 'desc', data: clickIndex == 1 ? 'front' : 'back'}],
            (res) => {
                Toast.hide(this.toast);
                if (res) {
                    this.uri = '';
                    if (res?.code == '000000') {
                        this.showImg(response.uri);
                        Toast.show('上传成功');
                        if (clickIndex == 1) {
                            DeviceEventEmitter.emit('upload', {name: res.result.name, id_no: res.result.identity_no});
                        }
                    } else {
                        Toast.show(res.message);
                    }
                }
            },
            () => {
                Toast.hide(this.toast);
                Toast.show('上传失败');
            }
        );
    };
    //打开相册
    openPicker = () => {
        setTimeout(() => {
            launchImageLibrary({quality: 0.5}, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else if (response.assets) {
                    this.uploadImage(response.assets[0]);
                }
            });
        }, 100);
    };
    // 选择图片或相册
    onClickChoosePicture = async () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, this.openPicker, this.blockCal);
            } else {
                requestAuth(PERMISSIONS.IOS.PHOTO_LIBRARY, this.openPicker, this.blockCal);
            }
        } catch (err) {
            console.warn(err);
        }
    };
    //权限提示弹窗
    blockCal = () => {
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
    // 从相机中选择
    takePic = () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    () => {
                        this.props.navigation.navigate('Camera', {index: this.state.clickIndex});
                    },
                    this.blockCal
                );
            } else {
                requestAuth(
                    PERMISSIONS.IOS.CAMERA,
                    () => {
                        this.props.navigation.navigate('Camera', {index: this.state.clickIndex});
                    },
                    this.blockCal
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };
    render() {
        const {showTypePop, frontSource, behindSource, desc} = this.state;
        return (
            <>
                <ScrollView style={styles.con}>
                    <SelectModal
                        entityList={this.state.typeArr}
                        callback={(i) => {
                            if (i == 0) {
                                this.onClickChoosePicture();
                            } else if (i == 1) {
                                this.takePic();
                            } else {
                                // 进入读卡页面
                                const configString = JSON.stringify(this.uiconfig);
                                enterToReadCardPage(configString);
                            }
                        }}
                        show={showTypePop}
                        closeModal={(show) => {
                            this.setState({
                                showTypePop: show,
                            });
                        }}
                    />
                    <Text style={styles.text}>
                        根据反洗钱法律法规及证监会要求，需要您上传身份证照片，请如实完善身份信息
                    </Text>
                    {desc ? (
                        <Text style={{textAlign: 'center', color: '#E74949', marginBottom: px(10)}}>{desc}</Text>
                    ) : null}
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.showPop(1);
                            }}
                            activeOpacity={1}>
                            <Image
                                source={
                                    frontSource ? {uri: frontSource} : require('../../../assets/img/account/Id1.png')
                                }
                                style={styles.id_image}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.showPop(2);
                            }}
                            activeOpacity={1}>
                            <Image
                                source={
                                    behindSource ? {uri: behindSource} : require('../../../assets/img/account/Id2.png')
                                }
                                style={styles.id_image}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>上传要求</Text>
                    <Image style={styles.tip_img} source={require('../../../assets/img/account/uploadExample.png')} />
                </ScrollView>
                <FixedButton
                    title={'确认上传'}
                    disabled={!(frontSource && behindSource)}
                    onPress={_.debounce(this.handleBack, 300)}
                />
            </>
        );
    }
}
const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
        flex: 1,
        marginBottom: px(60),
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: px(17),
        textAlign: 'center',
        marginVertical: px(12),
    },
    title: {
        fontSize: Font.textH1,
        fontWeight: '500',
        marginTop: px(10),
    },
    id_image: {
        height: px(190),
        width: px(310),
        // resizeMode: 'contain',
        marginBottom: px(14),
        borderRadius: px(8),
    },
    tip_img: {
        marginTop: px(16),
        width: deviceWidth - px(32),
        height: px(80),
        resizeMode: 'contain',
    },
});

const mapStateToProps = (state) => {
    return {
        modalInfo: state.modalInfo?.toJS(),
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getUserInfo: () => {
            dispatch(getUserInfo());
        },
        deleteModal: () => {
            dispatch(deleteModal());
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(UploadID);
