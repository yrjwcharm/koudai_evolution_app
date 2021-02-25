/*
 * @Date: 2021-01-18 10:27:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-25 11:47:59
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
import http from '../../../services/';
const typeArr = ['从相册中获取', '拍照'];
export class uploadID extends Component {
    state = {
        canClick: true,
        frontSource: {},
        behindSource: {},
        showTypePop: false,
        clickIndex: '',
    };
    showPop = (clickIndex) => {
        this.setState({showTypePop: true, clickIndex});
    };
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('EventType', (param) => {
            console.log(param);
            // 刷新界面等
        });
    }
    openPicker = () => {
        const {clickIndex} = this.state;
        const options = {
            maxWidth: px(310),
            // maxHeight: px(190),
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = {uri: response.uri};
                // if (Platform.OS === 'android') {
                //     source = res.uri;
                // } else {
                //     source = res.uri.replace('file://','');
                // }
                const formData = new FormData();
                // 文件类型根据对应的后端接口改变！！！
                let file = {uri: source, type: 'multipart/form-data', name: response.fileName};
                formData.append('file', file);
                let params = {
                    formData,
                };
                http.post('http://kapi-web.wanggang.mofanglicai.com.cn:10080/mapi/identity/upload/20210101', params, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then((res) => {
                    console.log(res);
                });
                if (clickIndex == 1) {
                    this.setState({
                        frontSource: source,
                    });
                } else {
                    this.setState({
                        behindSource: source,
                    });
                }
            }
        });
    };
    // 选择图片或相册
    onClickChoosePicture = async () => {
        try {
            if (Platform.OS == 'android') {
                let res = await requestExternalStoragePermission();
                if (res == 'granted') {
                    this.openPicker();
                }
            } else {
                this.openPicker();
            }
        } catch (err) {
            console.warn(err);
        }
    };

    jumpPage = () => {
        // 从相机中选择
        if (Platform.OS == 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((res) => {
                if (res !== 'granted') {
                    Modal.show({
                        content: '相机权限没打开,请在手机的“设置”选项中,允许访问您的摄像头',
                    });
                } else {
                    this.props.navigation.navigate('Camera');
                }
            });
        } else {
            this.props.navigation.navigate('Camera');
        }
    };
    render() {
        const {canClick, showTypePop, frontSource, behindSource} = this.state;
        return (
            <View style={styles.con}>
                <SelectModal
                    entityList={typeArr}
                    callback={(i) => {
                        if (i == 0) {
                            this.onClickChoosePicture();
                        } else {
                            this.jumpPage();
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
                            source={
                                frontSource.uri
                                    ? {uri: frontSource.uri}
                                    : require('../../../assets/img/account/Id1.png')
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
                                behindSource.uri
                                    ? {uri: behindSource.uri}
                                    : require('../../../assets/img/account/Id2.png')
                            }
                            style={styles.id_image}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.title}>上传要求</Text>
                    <Image style={styles.tip_img} source={require('../../../assets/img/account/idTip.png')} />
                </View>
                <FixedButton
                    title={'下一步'}
                    disabled={canClick}
                    onPress={() => {
                        this.jumpPage('BankInfo');
                    }}
                />
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
    },
    id_image: {
        height: px(190),
        width: px(310),
        marginBottom: px(14),
        borderRadius: px(8),
    },
});
export default uploadID;
