/*
 * @Date: 2021-01-18 10:27:39
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-11-01 16:09:29
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
const typeArr = ['从相册中获取', '拍照'];
class UploadID extends Component {
    state = {
        frontSource: '',
        behindSource: '',
        showTypePop: false,
        clickIndex: '',
        desc: '',
    };
    toast = '';
    fr = this.props.route?.params?.fr;
    showPop = (clickIndex) => {
        this.setState({showTypePop: true, clickIndex});
    };
    componentDidMount() {
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
        console.log(frontSource);
        return (
            <>
                <ScrollView style={styles.con}>
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
