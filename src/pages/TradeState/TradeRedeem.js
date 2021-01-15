/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-15 19:25:10
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import FastImage from 'react-native-fast-image';
import {px as text} from '../../utils/appUtil';
import {Space, Style, Colors, Font} from '../../common/commonStyle';
import Radio from '../../components/Radio';

export default class TradeRedeem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            check: false,
            data: [
                {icon: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_jy_yhk@2x.png', title: '银行卡'},
                {
                    icon: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_jy_yhk@2x.png',
                    title: '魔方宝',
                    desc: '七日年化2.93%',
                },
            ],
        };
    }
    onSelect(index, value) {
        console.log(index, value);
    }
    render() {
        const {data} = this.state;
        return (
            <View>
                <ScrollView>
                    <Text style={styles.redeem_desc}>赎回至银行卡</Text>
                    {!!data.length > 0 &&
                        data.map((_item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        Style.flexRow,
                                        styles.card_item,
                                        styles.card_select,
                                        {
                                            borderBottomWidth: index < data.length - 1 ? 0.5 : 0,
                                            borderColor: Colors.borderColor,
                                        },
                                    ]}>
                                    <View style={[Style.flexRow, {flex: 1}]}>
                                        <FastImage
                                            style={{width: 24, height: 24}}
                                            source={{
                                                uri: _item.icon,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <Text style={{color: Colors.descColor, paddingLeft: text(10)}}>
                                            {_item.title}
                                        </Text>
                                        <Text style={{color: '#DC4949', paddingLeft: text(10)}}>{_item.desc}</Text>
                                    </View>
                                    <Radio
                                        checked={this.state.check}
                                        onChange={(check, index) => {
                                            this.setState({
                                                check,
                                            });
                                        }}></Radio>
                                </View>
                            );
                        })}
                    <View style={styles.card_wrap}>
                        <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                            <Text style={{fontSize: Font.textH1, color: '#1F2432'}}>赎回比例</Text>
                            <View>
                                <TouchableOpacity style={styles.btn_percent}>
                                    <Text style={{color: '#0051CC'}}>5%</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={[
                                Style.flexRow,
                                {marginTop: text(12), borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                            ]}>
                            <TextInput
                                style={{height: text(50), fontSize: text(26), flex: 1, textAlign: 'center'}}
                                placeholder="请输入赎回百分比"
                            />
                            <Text style={styles.percent_symbol}>%</Text>
                        </View>
                        <View style={{marginTop: text(17)}}>
                            <Text style={{color: '#1F2432', fontSize: Font.textH2}}>查看持有基金</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    redeem_desc: {
        color: Colors.descColor,
        fontSize: Font.placeholderFont,
        paddingVertical: text(12),
        paddingLeft: text(15),
    },
    card_select: {
        backgroundColor: '#fff',
        paddingLeft: text(15),
        paddingRight: text(10),
    },
    card_item: {
        flex: 1,
        paddingVertical: text(16),
    },
    card_wrap: {
        padding: text(15),
        backgroundColor: '#fff',
        marginTop: text(12),
    },
    btn_percent: {
        borderRadius: text(10),
        backgroundColor: '#F1F6FF',
        paddingHorizontal: text(8),
        paddingVertical: text(3),
    },
    percent_symbol: {
        fontSize: text(20),
        color: '#333',
        width: text(20),
        fontWeight: 'bold',
    },
});
