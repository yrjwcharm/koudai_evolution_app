/*
 * @Author: xjh
 * @Date: 2021-02-20 16:08:07
 * @Description:私募赎回申请
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-09 19:06:14
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
import {Modal} from '../../components/Modal';
// import {PasswordModal} from '../../components/Password';
export default function PrivateRedeem({route, navigation}) {
    const [data, setData] = useState({});
    const [amount, setAmount] = useState('');
    const passwordModal = useRef(null);
    useEffect(() => {
        console.log(navigation);
        Http.get('/pe/redeem_detail/20210101', {
            fund_code: route.params?.fund_code,
            poid: route.params.poid,
        }).then((res) => {
            setData(res.result);
        });
    }, []);

    const submitData = () => {
        Http.post('/pe/do_redeem/20210101', {
            fund_code: route.params?.fund_code,
            poid: route.params.poid,
            order_id: route.params.order_id,
            share: amount,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.navigate('Home');
            } else {
                Modal.show({content: res.message});
            }
        });
    };
    const onInput = (amount) => {
        if (amount >= data.share.share) {
            setAmount(data.share.share.toString());
        } else {
            setAmount(amount);
        }
    };
    //  const submit = () => {
    //     passwordModal.current.show();
    //   };
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
                                keyboardType={'number-pad'}
                                onChangeText={onInput}
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
                    {/* <PasswordModal
                        ref={(ref) => {
                            this.passwordModal = ref;
                        }}
                        onDone={(password) => this.submitData(password)}
                    />
                   */}
                    <FixedButton
                        title={data.share.button.text}
                        style={styles.btn_sty}
                        onPress={() => submitData()}
                        color={'#CEA26B'}
                    />
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
