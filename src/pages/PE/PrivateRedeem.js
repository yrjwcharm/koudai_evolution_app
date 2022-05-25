/*
 * @Author: xjh
 * @Date: 2021-02-20 16:08:07
 * @Description:私募赎回申请
 * @LastEditors: dx
 * @LastEditTime: 2022-05-25 17:28:41
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, inputInt} from '../../utils/appUtil';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
import Toast from '../../components/Toast';
import {debounce} from 'lodash';

export default function PrivateRedeem({route, navigation}) {
    const [data, setData] = useState({});
    const [amount, setAmount] = useState('');
    const [enable, setEnable] = useState(true);
    useEffect(() => {
        Http.get('/private_fund/redeem_detail/20220510', {
            fund_code: route.params?.fund_code,
            poid: route.params?.poid,
        }).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitData = useCallback(
        debounce(
            () => {
                if (!amount) {
                    setEnable(true);
                }
                const toast = Toast.showLoading('申请中...');
                Http.post('/private_fund/redeem_submit/20220510', {
                    fund_code: route.params?.fund_code,
                    poid: route.params.poid,
                    order_id: route.params.order_id,
                    share: amount,
                }).then((res) => {
                    Toast.hide(toast);
                    if (res.code === '000000') {
                        Toast.show('申请成功');
                        navigation.goBack();
                    } else {
                        Toast.show(res.message);
                    }
                });
            },
            1000,
            {leading: true, trailing: false}
        ),
        [amount]
    );
    const onInput = (_amount) => {
        if (!_amount) {
            setAmount('');
            setEnable(true);
            return;
        }
        if (_amount >= data.share.share) {
            setAmount(data.share.share.toString());
        } else {
            setAmount(inputInt(_amount));
        }
        setEnable(false);
    };

    return (
        <View style={{flex: 1}}>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{flex: 1}}>
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
                                placeholder={data.placeholder}
                                placeholderTextColor={Colors.placeholderColor}
                                keyboardType={'number-pad'}
                                onChangeText={onInput}
                                value={amount}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setAmount(data.share.share.toString());
                                    onInput(data.share.share);
                                }}>
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
                </ScrollView>
            )}
            {data?.button && (
                <FixedButton
                    disabled={enable}
                    title={data.button.text}
                    style={styles.btn_sty}
                    disabledColor={'#EDDBC5'}
                    onPress={submitData}
                    color={'#EDDBC5'}
                />
            )}
        </View>
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
