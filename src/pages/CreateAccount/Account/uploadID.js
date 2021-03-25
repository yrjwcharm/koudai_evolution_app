/*
 * @Date: 2021-01-18 10:27:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-25 17:04:47
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
} from 'react-native';
import {px, deviceWidth, requestExternalStoragePermission} from '../../../utils/appUtil';
import {Colors, Font} from '../../../common/commonStyle';
import {FixedButton} from '../../../components/Button';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modal, SelectModal} from '../../../components/Modal';
import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';
import upload from '../../../services/upload';
import Toast from '../../../components/Toast';
import _ from 'lodash';
const typeArr = ['从相册中获取', '拍照'];
export class uploadID extends Component {
    state = {
        frontSource: '',
        behindSource: '',
        showTypePop: false,
        clickIndex: '',
        frontStatus: false,
        backStatus: false,
    };
    toast = '';
    showPop = (clickIndex) => {
        this.setState({showTypePop: true, clickIndex});
    };
    componentDidMount() {
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
                        Toast.show('上传成功');
                        if (clickIndex == 1) {
                            DeviceEventEmitter.emit('upload', {name: res.result.name, id_no: res.result.identity_no});
                            this.setState({frontStatus: true});
                        } else {
                            this.setState({backStatus: true});
                        }
                    } else {
                        if (clickIndex == 1) {
                            this.setState({frontSource: ''});
                        } else {
                            this.setState({behindSource: ''});
                        }
                        Toast.show(res.message);
                    }
                }
            },
            () => {
                Toast.hide(this.toast);
                if (clickIndex == 1) {
                    this.setState({frontSource: ''});
                } else {
                    this.setState({behindSource: ''});
                }
                Toast.show('上传失败');
            }
        );
        this.showImg(response.uri);
    };
    //打开相册
    openPicker = () => {
        const options = {
            width: px(300),
            height: px(190),
        };
        setTimeout(() => {
            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    this.uploadImage(response);
                }
            });
        }, 100);
    };
    // 选择图片或相册
    onClickChoosePicture = async () => {
        try {
            if (Platform.OS == 'android') {
                requestExternalStoragePermission(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    this.openPicker,
                    this.blockCal
                );
            } else {
                requestExternalStoragePermission(PERMISSIONS.IOS.PHOTO_LIBRARY, this.openPicker, this.blockCal);
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
                requestExternalStoragePermission(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    () => {
                        this.props.navigation.navigate('Camera', {index: this.state.clickIndex});
                    },
                    this.blockCal
                );
            } else {
                requestExternalStoragePermission(
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
        const {frontStatus, backStatus, showTypePop, frontSource, behindSource} = this.state;
        return (
            <View style={styles.con}>
                <SelectModal
                    entityList={typeArr}
                    callback={(i) => {
                        if (i == 0) {
                            this.onClickChoosePicture();
                        } else {
                            this.takePic();
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
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                            this.showPop(1);
                        }}
                        activeOpacity={1}>
                        <Image
                            source={frontSource ? {uri: frontSource} : require('../../../assets/img/account/Id1.png')}
                            style={styles.id_image}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.showPop(2);
                        }}
                        activeOpacity={1}>
                        <Image
                            source={behindSource ? {uri: behindSource} : require('../../../assets/img/account/Id2.png')}
                            style={styles.id_image}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>上传要求</Text>
                <Image style={styles.tip_img} source={require('../../../assets/img/account/uploadExample.png')} />
                <FixedButton title={'下一步'} disabled={!(frontStatus && backStatus)} onPress={this.handleBack} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
        flex: 1,
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: px(17),
        textAlign: 'center',
        marginVertical: px(20),
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
export default uploadID;
