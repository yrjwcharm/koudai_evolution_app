/*
 * @Author: xjh
 * @Date: 2021-02-20 16:08:07
 * @Description:私募赎回申请
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-26 18:31:48
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
export default function PrivateRedeem() {
    const [data, setData] = useState({});
    const [amount, setAmount] = useState('');
    const btnClick = (url) => {};
    useEffect(() => {
        Http.get(
            'http://kmapi.huangjianquan.mofanglicai.com.cn:10080/pe/redeem_detail/20210101?fund_code=SGX499&poid=xxx'
        ).then((res) => {
            setData(res.result);
        });
    }, []);
    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={{flex: 1}}>
                    <Text style={[Style.descSty, {padding: text(16)}]}>{data.share.name}</Text>
                    <View style={styles.card_sty}>
                        <Text style={{color: Colors.defaultColor, fontSize: Font.textH1}}>赎回份额</Text>
                        <View
                            style={[
                                Style.flexRow,
                                {marginTop: text(12), borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                            ]}>
                            <TextInput
                                style={{height: text(50), fontSize: text(26), flex: 1}}
                                placeholder="请输入赎回百分比"
                                // keyboardType={'number-pad'}
                                value={amount}
                            />
                            <TouchableOpacity onPress={() => setAmount(data.share.share.toString())}>
                                <Text style={styles.percent_symbol}>全部</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                color: '#9095A5',
                                fontSize: Font.textH3,
                                marginTop: text(10),
                                lineHeight: text(18),
                            }}>
                            {data.share.notice}
                        </Text>
                    </View>
                    <View style={[styles.card_sty, {paddingVertical: 0}]}>
                        {data.share.items.map((_item, _index) => {
                            return (
                                <View
                                    key={_index + '_item'}
                                    style={[
                                        Style.flexBetween,
                                        {
                                            borderColor: Colors.borderColor,
                                            borderBottomWidth: _index < data.share.items.length - 1 ? 0.5 : 0,
                                            paddingVertical: text(16),
                                        },
                                    ]}>
                                    <Text>{_item.name}</Text>
                                    <Text>{_item.value}</Text>
                                </View>
                            );
                        })}
                    </View>
                    <FixedButton title={data.share.button.text} style={styles.btn_sty} onPress={() => btnClick()} />
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    percent_symbol: {
        fontSize: Font.textH3,
        color: '#0051CC',
    },
    card_sty: {
        padding: text(15),
        paddingBottom: text(10),
        backgroundColor: '#fff',
        marginBottom: text(16),
    },
    btn_sty: {
        marginHorizontal: Space.padding,
        backgroundColor: '#CEA26B',
    },
});
