/*
 * @Date: 2021-01-18 10:22:15
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-16 17:38:11
 * @Description:基金开户实名认证
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Keyboard, ScrollView, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '../../../utils/appUtil';
import {Style, Colors, Space} from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FixedButton} from '../../../components/Button';
import Picker from 'react-native-picker';
import Mask from '../../../components/Mask';
import {formCheck} from '../../../utils/validator';
import http from '../../../services';
import Toast from '../../../components/Toast';
import {Modal} from '../../../components/Modal';
import BottomDesc from '../../../components/BottomDesc';
import _ from 'lodash';
import {connect} from 'react-redux';
import {updateUserInfo} from '../../../redux/actions/userInfo';
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props?.userInfo?.name || '', //姓名
            id_no: this.props?.userInfo?.id_no || '', //身份证号
            rname: '', //职业名称
            rcode: '', //职业代码
            showMask: false,
            careerList: [],
            btnDisable: true,
            idErrorMsg: '',
        };
    }
    componentWillUnmount() {
        this.closePicker();
        this.subscription.remove();
    }

    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            this.props.update({name: this.state.name, id_no: this.state.id_no});
            this.props.navigation.dispatch(e.data.action);
        });
        this.subscription = DeviceEventEmitter.addListener('upload', (params) => {
            if (params && Object.keys(params).length == 2 && params.name && params.id_no) {
                this.setState({name: params.name, id_no: params.id_no});
                this.checkData(params.name, params.id_no);
            }
            // 刷新界面等
        });
        if (this.state.name && this.state.id_no) {
            this.checkData(this.state.name, this.state.id_no);
        }
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
    checkData = (name, id_no) => {
        this.setState({
            idErrorMsg: id_no.length > 14 && id_no.length < 18 ? '身份证号位数不正确' : '',
        });
        if (id_no.length >= 18 && name.length >= 2) {
            this.setState({
                btnDisable: false,
            });
        } else {
            this.setState({
                btnDisable: true,
            });
        }
    };
    onChangeIdNo = (id_no) => {
        const {name} = this.state;
        let _no = id_no;
        this.setState({
            id_no: _no.length <= 17 ? _no.replace(/[^\d]/g, '') : _no.replace(/\W/g, ''),
        });
        this.checkData(name, _no);
    };
    onChangeName = (name) => {
        const {id_no} = this.state;
        this.setState({name});
        this.checkData(name, id_no);
    };
    jumpBank = (nav) => {
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
    careertData() {
        const {careerList} = this.state;
        var data = [];
        for (var obj in careerList) {
            data.push(careerList[obj].name);
        }
        return data;
    }
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
        const {showMask, name, id_no, rname, idErrorMsg} = this.state;
        return (
            <View style={styles.con}>
                {showMask && <Mask onClick={this.closePicker} />}
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{paddingHorizontal: px(16)}}>
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
                                <Text style={styles.card_head_text}>基本信息</Text>
                            </View>
                            <Input
                                label="姓名"
                                placeholder="请输入您的姓名"
                                onChangeText={this.onChangeName}
                                value={name}
                                onBlur={() => {
                                    global.LogTool('acName');
                                }}
                                returnKeyType={'next'}
                            />
                            <View style={[Style.flexRow, styles.border]}>
                                <Input
                                    label="身份证"
                                    placeholder="请输入您的身份证号"
                                    onChangeText={this.onChangeIdNo}
                                    value={id_no}
                                    onBlur={() => {
                                        global.LogTool('acIdNo');
                                    }}
                                    maxLength={18}
                                    errorMsg={idErrorMsg}
                                    inputStyle={{flex: 1, borderBottomWidth: 0}}
                                    returnKeyType={'next'}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.jumpPage('UploadID');
                                    }}>
                                    <FontAwesome name={'camera'} size={px(20)} color={'#000'} />
                                </TouchableOpacity>
                            </View>
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
                        </View>
                    </View>
                    <BottomDesc />
                </ScrollView>
                <FixedButton
                    title={'下一步'}
                    disabled={this.state.btnDisable}
                    onPress={_.debounce(() => {
                        this.jumpBank('BankInfo');
                    }, 500)}
                />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo?.toJS(),
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        update: (params) => {
            dispatch(updateUserInfo(params));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Index);
const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: Colors.bgColor,
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
        paddingVertical: px(10),
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
});
