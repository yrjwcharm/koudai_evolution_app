import React, {Component} from 'react';
import {Button, Text, View, SafeAreaView, Image, Dimensions, Switch, StyleSheet, Platform} from 'react-native';
import cardInfo from './cardInfo';
import {
    androidApplyCameraPermission,
    androidHideLoading,
    androidShowLoading,
    detectNFCStatus,
    enterFaceDetectPage,
    enterToConfirmInfoPage,
    enterToReadCardPage,
    faceLivingSDKInit,
    MethodObj,
    NativeReadCardEmitter,
    tokenCloudIdentityInit,
} from './TokenCloudBridge';
// import Spinner from 'react-native-loading-spinner-overlay';

class TKNativeView extends Component {
    constructor() {
        super();
        this.state = {
            reqIdString: '',
            hardwareString: '',
            // 正面图片base64
            frontImgBase64: '',
            backImgBase64: '',
            combinationImgBase64: '',
            faceDetect: false,
            isShowLoading: false,
        };
    }

    componentDidMount() {
        console.log('组件挂载好~');

        // 令牌云SDK初始化
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

        // 活体检测SDK初始化
        faceLivingSDKInit('F186ED61F9DC446FA6C1', 'http://testnidocr.eidlink.com', '9909');

        // 活体检测成功
        this.detectFaceSuccessSubscription = NativeReadCardEmitter.addListener(
            MethodObj.faceDetectSuccess,
            (reminder) => {
                this.detectFaceSuccess(reminder);
            }
        );

        // 活体检测失败
        this.detectFaceFailedSubscription = NativeReadCardEmitter.addListener(
            MethodObj.faceDetectFailed,
            (reminder) => {
                this.detectFaceFailed(reminder);
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
    }

    componentWillUnmount() {
        console.log('componentWillUnmount：组件即将卸载');
        this.detectFaceSuccessSubscription.remove();
        this.detectFaceFailedSubscription.remove();
        this.successReqidSubscription.remove();
        this.readCardFailedSubscription.remove();
        this.confirmInfoSubscription.remove();
        this.confirmInfoFailedSubscription.remove();
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {/* <Spinner
                        visible={this.state.isShowLoading}
                        textContent={'数据请求中...'}
                        textStyle={styles.spinnerTextStyle}
                    /> */}
                    <Button
                        title={'开启读卡'}
                        onPress={() => {
                            // 检测NFC状态
                            detectNFCStatus((status) => {
                                if (status === 1) {
                                    console.log('NFC开启');
                                    const uiconfig = {
                                        readTitle: '身份认证，立即开启',
                                        readTitleColor: '#ff0000',
                                        readBtnTextColor: '#FFFFFF',
                                        readBtnBgColor: '#0000FF',
                                        bottomTipText: '个人信息已加密保护',
                                        bottomTipTextColor: '#333333',
                                        sureMessageTextColor: '#FFFFFF',
                                        sureMessageBgColor: '#00FF00',
                                        bottomTipImageDrawableBase64: '112jiaaaa',
                                        openNfcBtnBgColor: '#333333',
                                        openNfcBtnTextColor: '#FFFFFF',
                                    };
                                    const configString = JSON.stringify(uiconfig);
                                    // 进入读卡页面
                                    enterToReadCardPage(configString);
                                } else if (status === 2) {
                                    enterToReadCardPage();
                                    console.log('(仅限安卓):未开启');
                                } else if (status === 3) {
                                    console.log('不支持NFC');
                                } else if (status === 4) {
                                    console.log('(仅限iOS):NFC不可用,版本过低，iOS14.5以上才可使用');
                                }
                            });
                        }}
                    />
                    <Switch
                        style={styles.topStyle}
                        value={this.state.faceDetect}
                        onValueChange={(v) => {
                            if (Platform.OS === 'android') {
                                // 安卓使用使用活体检测需要申请权限
                                androidApplyCameraPermission((status) => {
                                    this.setState({
                                        faceDetect: status,
                                    });
                                });
                            } else {
                                this.setState({
                                    faceDetect: v,
                                });
                            }
                        }}
                    />
                    <Text style={styles.topStyle}>Reqid: {this.state.reqIdString}</Text>
                    <Text style={styles.topStyle}>
                        hardwareId:
                        {Platform.OS === 'ios' ? 'iOS无此值' : this.state.hardwareString}
                    </Text>
                    <Image
                        source={{
                            uri: 'data:image/png;base64,' + this.state.combinationImgBase64,
                        }}
                        style={{
                            width: '70%',
                            marginTop: 15,
                            height: (Dimensions.get('window').width * 0.7 * 362) / 279.0,
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // 活体检测成功
    detectFaceSuccess(reminder) {
        console.log(reminder);
        let reqID = reminder.reqId;
        if (Platform.OS === 'ios') {
            // iOS
            // 请求9要素解码接口获取数据，转为json字符串处理进入确认信息页面
            // 此处为模拟数据
            this.setState({
                isShowLoading: true,
            });
            setTimeout(() => {
                this.setState({
                    isShowLoading: false,
                });
                setTimeout(() => {
                    const infoString = JSON.stringify(cardInfo);
                    enterToConfirmInfoPage(infoString);
                }, 300);
            }, 2000);
        } else {
            // 安卓
            androidShowLoading();
            androidHideLoading();
            const infoString = JSON.stringify(cardInfo);
            enterToConfirmInfoPage(infoString);
            // setTimeout(() => {
            //
            // }, 2000);
        }
    }

    // 活体检测失败
    // errorCode: 错误码
    // errorMessage: 错误消息
    detectFaceFailed(reminder) {
        console.log(reminder);
    }

    // 读卡成功，获取到ReqID
    successReqidCallback(reminder) {
        console.log(reminder);
        // iOS和安卓都有
        let reqId = reminder.reqId;
        // iOS由于系统原因，无hardwareId, iOS为null
        let hardwareId = reminder.hardWareId;
        this.setState({
            reqIdString: reminder.reqId,
            hardwareString: !hardwareId ? '' : hardwareId,
        });
        if (this.state.faceDetect) {
            // 需要活体
            enterFaceDetectPage(reqId);
        } else {
            // 不需要活体
            // 请求9要素解码接口获取数据，转为json字符串处理进入确认信息页面
            // 此处为模拟数据
            if (Platform.OS === 'ios') {
                // iOS
                this.setState({
                    isShowLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        isShowLoading: false,
                    });
                    setTimeout(() => {
                        const infoString = JSON.stringify(cardInfo);
                        enterToConfirmInfoPage(infoString);
                    }, 300);
                }, 2000);
            } else {
                // 安卓
                androidShowLoading();
                androidHideLoading();
                const infoString = JSON.stringify(cardInfo);
                enterToConfirmInfoPage(infoString);
                /*setTimeout(() => {
          androidHideLoading();
          const infoString = JSON.stringify(cardInfo);
          enterToConfirmInfoPage(infoString);
        }, 2000);*/
            }
        }
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

    // 用户在确认信息页面返回获取到正反面图片
    //  @param code 点击类型，0: 点击左上角返回按钮 1: 点击确认信息按钮
    //  @param frontBitmapBase64Str 正面身份证照(头像页) base64
    //  @param backBitmapBase64Str 反面身份证照(国徽页) base64
    //  @param fullBitmapBase64Str 正反面合成照片 base64
    confirmCardInfoCallback(reminder) {
        console.log(reminder);
        this.setState({
            combinationImgBase64: reminder.fullBitmapBase64Str,
        });
    }

    //  确信页面页面加载异常
    //  触发场景：传入数据在sdk内部解析失败，无法正确展示UI页面
    confirmCardFailed(reminder) {
        console.log('数据加载异常');
    }
}

const styles = StyleSheet.create({
    topStyle: {
        marginTop: 15,
    },
    spinnerTextStyle: {
        color: '#fff',
    },
});

export default TKNativeView;
