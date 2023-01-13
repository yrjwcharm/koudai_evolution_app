/*
 * @Date: 2021-09-22 11:55:04
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-13 16:15:57
 * @Description: 开户身份证认证
 */

import React, {Component, useRef, useState} from 'react';
import {
    DeviceEventEmitter,
    Keyboard,
    KeyboardAvoidingView,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {deviceHeight, deviceWidth, px, requestAuth} from '~/utils/appUtil';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Input from '~/components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Button, FixedButton} from '~/components/Button';
import Picker from 'react-native-picker';
import Mask from '~/components/Mask';
import {formCheck} from '~/utils/validator';
import http from '~/services';
import Toast from '~/components/Toast';
import {BottomModal, Modal, SelectModal} from '~/components/Modal';
import BottomDesc from '~/components/BottomDesc';
import _ from 'lodash';
import {connect, useDispatch} from 'react-redux';
import {openSettings, PERMISSIONS} from 'react-native-permissions';
import upload from '~/services/upload';
import {updateAccount} from '~/redux/actions/accountInfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import {useCountdown} from '~/components/hooks';
import Storage from '~/utils/storage';
import {getUserInfo} from '~/redux/actions/userInfo';
import {useNavigation, useRoute} from '@react-navigation/native';
import NavBar from '~/components/NavBar';

/**
 * 绑定已开户用户
 * @param data
 * @param id_no
 * @param name
 * @param navigation
 * @param rcode
 * @param rname
 * @returns {JSX.Element}
 * @constructor
 */
const BindModalContent = ({data = {}, id_no, name, rcode, rname}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const {mobile, msg, title} = data;
    const [code, setCode] = useState('');
    const [codeText, setCodeText] = useState('获取验证码');
    const {countdown, start} = useCountdown(() => {
        setCodeText('重发验证码');
        canSendCode.current = true;
    });
    const canSendCode = useRef(true);
    const input = useRef();

    /**
     * 发送验证码
     */
    const onSendCode = () => {
        if (canSendCode.current) {
            canSendCode.current = false;
            http.post('/passport/send_bind_user_partner_verify_code/20221220', {id_no, name})
                .then((res) => {
                    Toast.show(res.message);
                    if (res.code === '000000') {
                        start();
                        setTimeout(() => input.current?.focus?.(), 2000);
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        canSendCode.current = true;
                    }, 1000);
                });
        }
    };

    /**
     * 确认绑定
     */
    const onBindSubmit = () => {
        Keyboard.dismiss();
        const loading = Toast.showLoading('请稍后...');
        http.post('/passport/bind_user_partner_uid/20221220', {...route.params, code, id_no, name})
            .then(async (res) => {
                Toast.hide(loading);
                Toast.show(res.message);
                if (res.code === '000000') {
                    const {auth_info, url} = res.result;
                    await Storage.save('loginStatus', auth_info);
                    dispatch(getUserInfo());
                    Modal.close();
                    if (url) navigation.replace(url.path, url.params);
                    else navigation.navigate('BankInfo', {...route.params, id_no, name, rcode, rname});
                }
            })
            .finally(() => {
                setTimeout(() => {
                    Toast.hide(loading);
                }, 2000);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={() => input.current?.blur?.()}>
            <View style={styles.modalContent}>
                <Text style={styles.bigTitle}>{title}</Text>
                <Text style={styles.msg}>{msg}</Text>
                <View style={[styles.inputBox, {marginTop: px(20)}]}>
                    <Text style={styles.inputText}>{mobile}</Text>
                </View>
                <View style={styles.inputBox}>
                    <TextInput
                        clearButtonMode="while-editing"
                        keyboardType="number-pad"
                        maxLength={6}
                        onChangeText={(val) => setCode(val.replace(/\D/g, ''))}
                        placeholder="请输入验证码"
                        placeholderTextColor={Colors.placeholderColor}
                        ref={input}
                        style={[styles.inputText, {flex: 1}]}
                        value={code}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={countdown > 0}
                        onPress={onSendCode}
                        style={[styles.getCodeBtn, {backgroundColor: countdown > 0 ? '#FFCFB9' : '#FF7D41'}]}>
                        <Text style={[styles.inputText, {color: '#fff', fontWeight: Font.weightMedium}]}>
                            {countdown > 0 ? `${countdown}秒重发` : codeText}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text
                    onPress={() => {
                        Modal.close();
                        navigation.navigate('VerifyCodeQA');
                    }}
                    style={styles.canNotGetCode}>
                    没有收到验证码？
                </Text>
                <Button
                    disabled={code.length < 6}
                    onPress={onBindSubmit}
                    style={{marginTop: Space.marginVertical}}
                    title="完成"
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

class IdAuth extends Component {
    constructor(props) {
        super(props);
        this.typeArr = ['从相册中获取', '拍照'];
        this.state = {
            name: props?.accountInfo?.name || '', //姓名
            id_no: '', //身份证号
            rname: '', //职业名称
            rcode: '', //职业代码
            showMask: false,
            careerList: [],
            btnDisable: true,
            showTypePop: false,
            frontSource: '',
            behindSource: '',
            modalData: {},
            modalVisible: false,
        };
    }

    componentWillUnmount() {
        this.closePicker();
        this.subscription?.remove();
    }

    componentDidMount() {
        const {navigation, update} = this.props;
        const {name, showMask} = this.state;
        //页面销毁之前保存信息
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            if (showMask) {
                this.closePicker();
            } else {
                update({
                    name,
                });
                navigation.dispatch(e.data.action);
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
        http.get('/passport/xy_account/career_list/20210101').then((data) => {
            const career = data.result.career.filter((item) => {
                return item.code === data.result.default_career;
            });
            this.setState({
                careerList: data.result.career,
                rname: career[0].name,
                rcode: data.result.default_career,
            });
        });
    }
    jumpPage = (nav) => {
        const {navigation} = this.props;
        navigation.navigate(nav);
    };
    checkData = () => {
        const {behindSource, frontSource, name} = this.state;

        if (name?.length >= 2 && frontSource && behindSource) {
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
        const {navigation, route} = this.props;
        const {name, id_no, rcode, rname} = this.state;
        const checkData = [
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
        const loading = Toast.showLoading();
        http.get('/passport/open_account/check/20210101', {
            id_no,
            name,
        }).then((res) => {
            Toast.hide(loading);
            if (res.code === '000000') {
                if (res.result.pop?.content) {
                    Modal.show({
                        content: res.result.pop.content,
                        isTouchMaskToClose: false,
                        confirmText: '确定',
                        confirmCallBack: () => {
                            navigation.goBack();
                        },
                    });
                } else {
                    navigation.navigate(nav, {
                        name,
                        id_no,
                        rname,
                        rcode,
                        amount: route?.params?.amount,
                        poid: route?.params?.poid,
                        fr: route?.params?.fr || '',
                        fund_code: route?.params?.fund_code,
                        url: route?.params?.url || '',
                    });
                }
            } else if (res.code === 'A30001') {
                Keyboard.dismiss();
                this.setState({modalData: res.result, modalVisible: true});
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
            if (Platform.OS === 'android') {
                await requestAuth(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, this.openPicker, this.blockCal);
            } else {
                await requestAuth(PERMISSIONS.IOS.PHOTO_LIBRARY, this.openPicker, this.blockCal);
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
            const {navigation} = this.props;
            if (Platform.OS === 'android') {
                requestAuth(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    () => {
                        navigation.navigate('Camera', {index: this.clickIndex});
                    },
                    this.blockCal
                );
            } else {
                requestAuth(
                    PERMISSIONS.IOS.CAMERA,
                    () => {
                        navigation.navigate('Camera', {index: this.clickIndex});
                    },
                    this.blockCal
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };
    showImg = (uri) => {
        const clickIndex = Number(this.clickIndex);
        if (clickIndex === 1) {
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
        const clickIndex = Number(this.clickIndex);
        this.toast = Toast.showLoading('正在上传');

        upload(
            'mapi/identity/upload/20210101',
            response,
            [{name: 'desc', data: clickIndex === 1 ? 'front' : 'back'}],
            (res) => {
                Toast.hide(this.toast);
                if (res) {
                    this.uri = '';
                    if (res?.code === '000000') {
                        this.showImg(response.uri);
                        Toast.show('上传成功');
                        global.LogTool('CreateAccountUploadSuccess');
                        if (clickIndex === 1) {
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
        const data = [];
        for (let obj in careerList) {
            data.push(careerList[obj].name);
        }
        return data;
    }
    //职业信息选择
    _showPosition = () => {
        Keyboard.dismiss();
        this.setState({showMask: true});
        const {careerList} = this.state;
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
                this.setState({rname: pickedValue[0], showMask: false, rcode: careerList[pickedIndex].code});
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
        const {
            showMask,
            name,
            id_no,
            rcode,
            rname,
            frontSource,
            behindSource,
            showTypePop,
            btnDisable,
            modalData,
            modalVisible,
        } = this.state;
        return (
            <>
                <NavBar leftIcon="chevron-left" title="基金交易安全开户" />
                {modalVisible && (
                    <KeyboardAvoidingView
                        behavior={Platform.select({android: 'height', ios: 'padding'})}
                        keyboardVerticalOffset={-px(80)}
                        style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: false})}>
                            <View style={styles.mask} />
                        </TouchableWithoutFeedback>
                        <BindModalContent data={modalData} id_no={id_no} name={name} rcode={rcode} rname={rname} />
                    </KeyboardAvoidingView>
                )}
                <KeyboardAwareScrollView extraScrollHeight={px(100)} style={styles.con}>
                    {showMask && <Mask onClick={this.closePicker} />}
                    <BottomModal ref={(ref) => (this.bottomModal = ref)} title={'上传要求'}>
                        <View style={{padding: px(16)}}>
                            <FastImage
                                source={require('~/assets/img/account/upload_id_tip.png')}
                                style={{width: '100%', height: px(200)}}
                                resizeMode="contain"
                            />
                        </View>
                    </BottomModal>
                    <SelectModal
                        entityList={this.typeArr}
                        callback={(i) => {
                            if (i === 0) {
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
                    <ScrollView style={{paddingHorizontal: px(16)}} keyboardShouldPersistTaps="handled">
                        <FastImage
                            style={styles.pwd_img}
                            source={require('~/assets/img/account/first.png')}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <View style={styles.card}>
                            <View style={styles.card_header}>
                                <FastImage
                                    source={require('~/assets/img/account/personalMes.png')}
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
                                                : require('~/assets/img/account/idfront.png')
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
                                                : require('~/assets/img/account/idback.png')
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
                    </ScrollView>
                    <BottomDesc />
                </KeyboardAwareScrollView>
                <FixedButton
                    title={'下一步'}
                    disabled={btnDisable}
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
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: deviceWidth,
        height: deviceHeight,
        zIndex: 1,
        ...Style.flexCenter,
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        padding: px(20),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        width: px(280),
    },
    bigTitle: {
        fontSize: px(18),
        lineHeight: px(25),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
        textAlign: 'center',
    },
    msg: {
        marginTop: px(12),
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    inputBox: {
        marginTop: Space.marginVertical,
        paddingLeft: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
        height: px(44),
        overflow: 'hidden',
        ...Style.flexRow,
    },
    inputText: {
        fontSize: Font.textH2,
        color: Colors.defaultColor,
    },
    getCodeBtn: {
        width: px(94),
        height: '100%',
        ...Style.flexCenter,
    },
    canNotGetCode: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(18),
        color: Colors.brandColor,
        textAlign: 'right',
    },
});
