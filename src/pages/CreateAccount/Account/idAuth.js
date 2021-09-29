/*
 * @Date: 2021-09-22 11:55:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-29 18:44:51
 * @Description: 开户身份证认证
 */

import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    ScrollView,
    DeviceEventEmitter,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px, requestAuth} from '../../../utils/appUtil';
import {Style, Colors, Space} from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FixedButton} from '../../../components/Button';
import Picker from 'react-native-picker';
import Mask from '../../../components/Mask';
import {formCheck} from '../../../utils/validator';
import http from '../../../services';
import Toast from '../../../components/Toast';
import {Modal, BottomModal, SelectModal} from '../../../components/Modal';
import BottomDesc from '../../../components/BottomDesc';
import _ from 'lodash';
import {connect} from 'react-redux';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import upload from '../../../services/upload';
import {updateAccount} from '../../../redux/actions/accountInfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
class IdAuth extends Component {
    constructor(props) {
        super(props);
        this.typeArr = ['从相册中获取', '拍照'];
        this.state = {
            name: this.props?.accountInfo?.name || '', //姓名
            id_no: '', //身份证号
            rname: '', //职业名称
            rcode: '', //职业代码
            showMask: false,
            careerList: [],
            btnDisable: true,
            showTypePop: false,
            frontSource: '',
            behindSource: '',
        };
    }
    componentWillUnmount() {
        this.closePicker();
        this.subscription?.remove();
    }

    componentDidMount() {
        //页面销毁之前保存信息
        this.props.navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            if (this.state.showMask) {
                this.closePicker();
            } else {
                this.props.update({
                    name: this.state.name,
                });
                this.props.navigation.dispatch(e.data.action);
            }
        });
        //获取身份证
        http.get('/mapi/identity/upload_info/20210101', {scene: this.fr}).then((res) => {
            this.setState(
                {
                    frontSource: res.result.identity?.front,
                    behindSource: res.result.identity?.back,
                    id_no: res.result.id_no,
                },
                () => {
                    this.checkData();
                }
            );
        });
        //拍照
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
        // if (this.state.name && this.state.id_no) {
        //     this.checkData();
        // }
        http.get('/passport/xy_account/career_list/20210101').then((data) => {
            var career = data.result.career.filter((item) => {
                return item.code == data.result.default_career;
            });
            this.setState({
                careerList: data.result.career,
                rname: career[0].name,
                rcode: data.result.default_career,
            });
        });
    }
    jumpPage = (nav) => {
        this.props.navigation.navigate(nav);
    };
    checkData = () => {
        const {name} = this.state;

        if (name?.length >= 2 && this.state.frontSource && this.state.behindSource) {
            this.setState({
                btnDisable: false,
            });
        } else {
            this.setState({
                btnDisable: true,
            });
        }
    };

    onChangeName = (name) => {
        this.setState({name}, () => {
            this.checkData();
        });
    };
    jumpBank = (nav) => {
        global.LogTool('CreateAccountNextStep');
        const {name, id_no, rcode, rname} = this.state;
        var checkData = [
            {
                field: name,
                text: '姓名不能为空',
            },
            {
                field: id_no,
                text: '身份证不能为空',
            },
        ];
        if (!formCheck(checkData)) {
            return;
        }
        http.get('/passport/open_account/check/20210101', {
            id_no,
            name,
        }).then((res) => {
            if (res.code === '000000') {
                if (res.result.pop?.content) {
                    Modal.show({
                        content: res.result.pop.content,
                        isTouchMaskToClose: false,
                        confirmText: '确定',
                        confirmCallBack: () => {
                            this.props.navigation.goBack();
                        },
                    });
                } else {
                    this.props.navigation.navigate(nav, {
                        name,
                        id_no,
                        rname,
                        rcode,
                        amount: this.props.route?.params?.amount,
                        poid: this.props.route?.params?.poid,
                        fr: this.props.route?.params?.fr || '',
                        url: this.props.route?.params?.url || '',
                    });
                }
            } else {
                Toast.show(res.message);
            }
        });
    };
    //底部选择弹窗
    showSelect = (index) => {
        global.LogTool('CreateAccountCamera');
        this.clickIndex = index;
        this.setState({showTypePop: true});
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
                        this.props.navigation.navigate('Camera', {index: this.clickIndex});
                    },
                    this.blockCal
                );
            } else {
                requestAuth(
                    PERMISSIONS.IOS.CAMERA,
                    () => {
                        this.props.navigation.navigate('Camera', {index: this.clickIndex});
                    },
                    this.blockCal
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };
    showImg = (uri) => {
        const {clickIndex} = this;
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
    //图片上传
    uploadImage = (response) => {
        const {clickIndex} = this;
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
                        global.LogTool('CreateAccountUploadSuccess');
                        if (clickIndex == 1) {
                            this.setState(
                                {
                                    name: res.result?.name,
                                    id_no: res.result?.identity_no,
                                },
                                () => {
                                    this.checkData();
                                }
                            );
                        } else {
                            this.checkData();
                        }
                    } else {
                        global.LogTool('CreateAccountUploadFail');
                        Toast.show(res.message);
                    }
                }
            },
            () => {
                global.LogTool('CreateAccountUploadFail');
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
    //职业信息format
    careertData() {
        const {careerList} = this.state;
        var data = [];
        for (var obj in careerList) {
            data.push(careerList[obj].name);
        }
        return data;
    }
    //职业信息选择
    _showPosition = () => {
        Keyboard.dismiss();
        this.setState({showMask: true});
        Picker.init({
            pickerTitleText: '请选择职业信息',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerData: this.careertData(),
            pickerFontColor: [33, 33, 33, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            pickerTextEllipsisLen: 100,
            wheelFlex: [1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                this.setState({rname: pickedValue[0], showMask: false, rcode: this.state.careerList[pickedIndex].code});
            },
            onPickerCancel: () => {
                this.setState({showMask: false});
            },
        });
        Picker.show();
    };
    closePicker = () => {
        Picker.hide();
        this.setState({showMask: false});
    };
    render() {
        const {showMask, name, id_no, rname, frontSource, behindSource} = this.state;
        return (
            <>
                <KeyboardAwareScrollView extraScrollHeight={px(100)} style={styles.con}>
                    {showMask && <Mask onClick={this.closePicker} />}
                    <BottomModal ref={(ref) => (this.bottomModal = ref)} title={'上传要求'}>
                        <View style={{padding: px(16)}}>
                            <FastImage
                                source={require('../../../assets/img/account/upload_id_tip.png')}
                                style={{width: '100%', height: px(200)}}
                                resizeMode="contain"
                            />
                        </View>
                    </BottomModal>
                    <SelectModal
                        entityList={this.typeArr}
                        callback={(i) => {
                            if (i == 0) {
                                this.onClickChoosePicture();
                            } else {
                                this.takePic();
                            }
                        }}
                        show={this.state.showTypePop}
                        closeModal={(show) => {
                            this.setState({
                                showTypePop: show,
                            });
                        }}
                    />
                    <ScrollView style={{paddingHorizontal: px(16)}} keyboardShouldPersistTaps="handled">
                        <FastImage
                            style={styles.pwd_img}
                            source={require('../../../assets/img/account/first.png')}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <View style={styles.card}>
                            <View style={styles.card_header}>
                                <FastImage
                                    source={require('../../../assets/img/account/personalMes.png')}
                                    style={{width: px(22), height: px(22), resizeMode: 'contain'}}
                                />
                                <Text style={styles.card_head_text}>实名认证</Text>
                            </View>
                            <View style={[Style.flexBetween, {marginVertical: px(14)}]}>
                                <Text style={[styles.card_head_text, {color: '#545968'}]}>身份证上传</Text>
                                <Text
                                    style={[styles.card_head_text, {color: Colors.btnColor}]}
                                    onPress={() => {
                                        this.bottomModal.show();
                                    }}>
                                    上传要求
                                </Text>
                            </View>
                            <View style={[Style.flexBetween, {marginBottom: px(16)}]}>
                                <TouchableOpacity
                                    style={[styles.idImage, Style.flexCenter]}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        this.showSelect(1);
                                    }}>
                                    <FastImage
                                        source={
                                            frontSource
                                                ? {uri: frontSource}
                                                : require('../../../assets/img/account/idfront.png')
                                        }
                                        style={[frontSource ? styles.id_large_image : {width: px(108), height: px(68)}]}
                                    />
                                    {frontSource ? null : (
                                        <Text style={[styles.card_head_text, {marginTop: px(14), fontSize: px(12)}]}>
                                            点击拍摄/上传人像面
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.idImage, Style.flexCenter]}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        this.showSelect(2);
                                    }}>
                                    <FastImage
                                        source={
                                            behindSource
                                                ? {uri: behindSource}
                                                : require('../../../assets/img/account/idback.png')
                                        }
                                        style={[frontSource ? styles.id_large_image : {width: px(108), height: px(68)}]}
                                    />
                                    {behindSource ? null : (
                                        <Text style={[styles.card_head_text, {marginTop: px(14), fontSize: px(12)}]}>
                                            点击拍摄/上传国徽面
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            {frontSource ? (
                                <>
                                    <Input
                                        label="姓名"
                                        placeholder="请输入您的姓名"
                                        onChangeText={this.onChangeName}
                                        value={name}
                                        onFocus={() => {
                                            global.LogTool('CreateAccountName');
                                        }}
                                        onBlur={() => {
                                            global.LogTool('acName');
                                        }}
                                        returnKeyType={'next'}
                                    />
                                    <Input
                                        label="身份证"
                                        placeholder="请输入您的身份证号"
                                        isUpdate={false}
                                        value={id_no}
                                        maxLength={18}
                                        returnKeyType={'next'}
                                    />

                                    <View style={Style.flexRow}>
                                        <Input
                                            label="职业信息"
                                            isUpdate={false}
                                            placeholder="请选择您的职业"
                                            value={rname}
                                            onClick={this._showPosition}
                                            inputStyle={{flex: 1, borderBottomWidth: 0}}
                                        />
                                        <FontAwesome
                                            name={'angle-right'}
                                            size={18}
                                            color={'#999999'}
                                            style={{marginLeft: -14}}
                                        />
                                    </View>
                                </>
                            ) : null}
                        </View>
                        <BottomDesc />
                    </ScrollView>
                </KeyboardAwareScrollView>
                <FixedButton
                    title={'下一步'}
                    disabled={this.state.btnDisable}
                    onPress={_.debounce(() => {
                        this.jumpBank('BankInfo');
                    }, 500)}
                />
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        accountInfo: state.accountInfo?.toJS(),
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        update: (params) => {
            dispatch(updateAccount(params));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(IdAuth);
const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        marginBottom: px(60),
    },
    pwd_img: {
        width: '100%',
        height: px(55),
        marginVertical: px(24),
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        borderRadius: px(8),
        marginBottom: px(12),
    },
    card_header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        paddingVertical: px(12),
    },
    card_head_text: {
        fontSize: px(14),
        color: '#292D39',
        marginLeft: px(6),
    },
    border: {
        borderColor: Colors.borderColor,
        borderBottomWidth: Space.borderWidth,
    },
    idImage: {
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        height: px(130),
        width: px(148),
    },
    id_large_image: {
        height: px(83),
        width: px(128),
    },
});
