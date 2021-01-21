/*
 * @Date: 2021-01-18 10:22:15
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 17:57:29
 * @Description:基金开户实名认证
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { px } from '../../../utils/appUtil';
import { Style, Colors } from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FixedButton } from '../../../components/Button';
import Picker from 'react-native-picker';
import Mask from '../../../components/Mask';
import {formCheck} from '../../../utils/validator'
export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '', //姓名
            id_no: '', //身份证号
            rname: '', //职业名称
            rcode: '', //职业代码
            showMask: false,
        };
    }
    jumpPage = (nav) => {
        const {name,id_no} = this.state
        var checkData = [
            {
              field: name,
              text: "姓名不能为空"
            },
            {
              field: id_no,
              text: "身份证不能为空"
            }
          ];
          if (!formCheck(checkData)) {
            return
          }
        this.props.navigation.navigate(nav);
    };
    _showPosition = () => {
        Keyboard.dismiss();
        this.setState({ showMask: true })
        Picker.init({
            pickerTitleText: '请选择职业信息',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerData: [1, 2, 3, 4],
            pickerFontColor: [33, 33, 33, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            wheelFlex: [1, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                this.setState({ rname: pickedValue, showMask: false, rcode: this.state.identity.career[pickedIndex] })
            },
            onPickerCancel: () => {
                this.setState({ showMask: false })
            }
        });
        Picker.show();
    }
    closePicker = () => {
        Picker.hide();
        this.setState({ showMask: false })
    }
    componentWillUnmount() {
        this.closePicker()
    }
    render() {
        const { showMask } = this.state
        return (
            <View style={styles.con}>
                {showMask && <Mask onClick={this.closePicker} />}
                <ScrollView scrollEnabled={false} style={{ paddingHorizontal: px(16) }}>
                    <FastImage
                        style={styles.pwd_img}
                        source={require('../../../assets/img/account/first.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View style={styles.card}>
                        <View style={styles.card_header}>
                            <Image
                                source={require('../../../assets/img/account/personalMes.png')}
                                style={{ width: px(22), resizeMode: 'contain' }}
                            />
                            <Text style={styles.card_head_text}>基本信息</Text>
                        </View>
                        <Input
                            label="姓名"
                            placeholder="请输入您的姓名"
                            onChange={(name) => {
                                this.setState({ name });
                            }}
                            returnKeyType={'next'}
                        />
                        <View style={[Style.flexRow, styles.border]}>
                            <Input
                                label="身份证"
                                placeholder="请输入您的身份证号"
                                onChange={(id_no) => {
                                    this.setState({ id_no });
                                }}
                                maxLength={18}
                                inputStyle={{ flex: 1, borderBottomWidth: 0 }}
                                returnKeyType={'next'}
                            />
                            <TouchableOpacity onPress={() => {
                                this.jumpPage('UploadID')
                            }}>
                                <FontAwesome name={'camera'} size={18} color={'#000'} />
                            </TouchableOpacity>
                        </View>
                        <View style={Style.flexRow}>
                            <Input
                                label="职业信息"
                                isUpdate={false}
                                placeholder="请选择您的职业"
                                value={this.state.rname}
                                onClick={this._showPosition}
                                inputStyle={{ flex: 1, borderBottomWidth: 0 }}
                                returnKeyType={'done'}
                            />
                            <FontAwesome name={'angle-right'} size={18} color={'#999999'} style={{ marginLeft: -14 }} />
                        </View>
                    </View>
                </ScrollView>
                <FixedButton title={'下一步'} onPress={() => {
                    this.jumpPage('BankInfo')
                }} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    con:{
        flex:1,
        backgroundColor:Colors.bgColor
    },
    pwd_img: {
        width: '100%',
        height: px(55),
        marginVertical:px(24)
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
