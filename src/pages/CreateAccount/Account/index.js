/*
 * @Date: 2021-01-18 10:22:15
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-24 17:48:36
 * @Description:基金开户实名认证
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Keyboard, ScrollView, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '../../../utils/appUtil';
import {Style, Colors} from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FixedButton} from '../../../components/Button';
import Picker from 'react-native-picker';
import Mask from '../../../components/Mask';
import {formCheck} from '../../../utils/validator';
import http from '../../../services';
import Toast from '../../../components/Toast';
import {Modal} from '../../../components/Modal';

export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '', //姓名
            id_no: '', //身份证号
            rname: '', //职业名称
            rcode: '', //职业代码
            showMask: false,
            careerList: [],
        };
    }
    componentWillUnmount() {
        this._unsubscribe();
        this.closePicker();
    }
    back = (e) => {
        if (e.data.action.type == 'REPLACE') {
            return;
        }
        e.preventDefault();
        Modal.show({
            title: '结束开户',
            content: '您马上就开户完成了，确定要离开吗？',
            confirm: true,
            confirmCallBack: () => {
                this.props.navigation.dispatch(e.data.action);
            },
        });
    };

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('beforeRemove', this.back);
        this.subscription = DeviceEventEmitter.addListener('upload', (params) => {
            if (params && Object.keys(params).length == 2) {
                this.setState({name: params.name, id_no: params.id_no});
            }
            // 刷新界面等
        });
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
            if (res.code == '000000') {
                this.props.navigation.replace(nav, {
                    name,
                    id_no,
                    rname,
                    rcode,
                    poid: this.props.route?.params?.poid,
                    fr: this.props.route?.params?.fr || '',
                });
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
            wheelFlex: [1, 1, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                this.setState({rname: pickedValue[0], showMask: false, rcode: this.state.careerList[pickedIndex]});
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
        const {showMask, name, id_no, rname} = this.state;
        // console.log(rname);
        return (
            <View style={styles.con}>
                {showMask && <Mask onClick={this.closePicker} />}
                <ScrollView style={{paddingHorizontal: px(16)}} keyboardShouldPersistTaps="handled">
                    <FastImage
                        style={styles.pwd_img}
                        source={require('../../../assets/img/account/first.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View style={styles.card}>
                        <View style={styles.card_header}>
                            <Image
                                source={require('../../../assets/img/account/personalMes.png')}
                                style={{width: px(22), resizeMode: 'contain'}}
                            />
                            <Text style={styles.card_head_text}>基本信息</Text>
                        </View>
                        <Input
                            label="姓名"
                            placeholder="请输入您的姓名"
                            onChangeText={(name) => {
                                this.setState({name});
                            }}
                            value={name}
                            returnKeyType={'next'}
                        />
                        <View style={[Style.flexRow, styles.border]}>
                            <Input
                                label="身份证"
                                placeholder="请输入您的身份证号"
                                onChangeText={(id_no) => {
                                    this.setState({id_no});
                                }}
                                value={id_no}
                                maxLength={18}
                                inputStyle={{flex: 1, borderBottomWidth: 0}}
                                returnKeyType={'next'}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.jumpPage('UploadID');
                                }}>
                                <FontAwesome name={'camera'} size={18} color={'#000'} />
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
                            <FontAwesome name={'angle-right'} size={18} color={'#999999'} style={{marginLeft: -14}} />
                        </View>
                    </View>
                </ScrollView>
                <FixedButton
                    title={'下一步'}
                    onPress={() => {
                        this.jumpBank('BankInfo');
                    }}
                />
            </View>
        );
    }
}
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
        paddingVertical: px(6),
    },
    card_head_text: {
        fontSize: px(14),
        color: '#292D39',
        marginLeft: px(6),
    },
    border: {
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
});
export default index;
