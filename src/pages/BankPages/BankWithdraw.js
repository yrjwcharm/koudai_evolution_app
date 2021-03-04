/*
 * @Author: xjh
 * @Date: 2021-02-27 16:12:22
 * @Description:银行产品提现
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-03 15:04:46
 */
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';
import Mask from '../../components/Mask';

export default function BankWithdraw(props) {
    const [data, setData] = useState({});
    const [showMask, setShowMask] = useState(false);
    const passwordModal = useRef(null);

    const submitData = () => {};
    const passwordInput = () => {
        passwordModal.current.show();
        setShowMask(true);
    };
    useEffect(() => {
        Http.get('trade/bank/withdraw/info/20210101', {
            asset_code: 'BK.SX0001H',
        }).then((res) => {
            setData(res.result);
        });
    }, []);
    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={{flex: 1}}>
                    <View style={{position: 'relative', margin: text(16)}}>
                        <FastImage
                            style={styles.bank_bg_sty}
                            source={{
                                uri: data.bank_account.bank_icon,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.bank_name_sty}>{data.bank_account.bank_name}</Text>
                        <View style={styles.bank_fund_wrap_sty}>
                            <Text style={{color: '#fff', fontWeight: 'bold'}}>{data.bank_account.balance.key}</Text>
                            <Text style={styles.bank_fund_sty}>{data.bank_account.balance.val}</Text>
                        </View>
                    </View>
                    <View style={styles.card_sty}>
                        <Text style={styles.title_sty}>{data.withdraw_info.title}</Text>
                        <View style={[Style.flexRow, {alignItems: 'baseline', marginTop: text(18)}]}>
                            <Text style={{fontSize: text(22), fontWeight: 'bold'}}>¥</Text>
                            <TextInput value={data.withdraw_info.min.toString()} style={styles.num_sty} />
                        </View>
                    </View>
                    <Text style={[{padding: text(15)}, Style.descSty]}>{data.pay_info.title}</Text>
                    <View style={[Style.flexRow, styles.card_item, styles.card_select]}>
                        <View style={Style.flexRow}>
                            <FastImage
                                style={{width: text(30), height: text(30)}}
                                source={{
                                    uri: data.pay_info.pay_method.bank_icon,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <View>
                                <Text style={{color: Colors.defaultColor, paddingLeft: text(10), fontWeight: 'bold'}}>
                                    {data.pay_info.pay_method.bank_name}
                                </Text>
                                <Text
                                    style={{
                                        color: '#9095A5',
                                        paddingLeft: text(10),
                                        fontSize: text(12),
                                        marginTop: text(4),
                                    }}>
                                    {data.pay_info.pay_method.limit_desc}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.tips_sty}>{data.notice}</Text>
                    <PasswordModal
                        ref={passwordModal}
                        onDone={submitData}
                        onClose={() => {
                            setShowMask(false);
                        }}
                    />
                    {showMask && <Mask />}
                    <FixedButton title={data.button.text} onPress={passwordInput} disabled={data.button.avail == 0} />
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    bank_bg_sty: {
        height: text(150),
    },
    bank_name_sty: {
        position: 'absolute',
        top: '22%',
        left: '20%',
        fontSize: Font.textH1,
        color: '#fff',
        fontWeight: 'bold',
    },
    bank_fund_wrap_sty: {
        position: 'absolute',
        top: '50%',
        left: text(16),
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    bank_fund_sty: {
        color: '#fff',
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
        marginLeft: text(5),
    },
    card_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        marginTop: text(-50),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
    },
    num_sty: {
        color: '#333333',
        fontSize: text(35),
        fontFamily: Font.numFontFamily,
        marginLeft: text(5),
    },
    card_select: {
        backgroundColor: '#fff',
        paddingLeft: text(15),
        paddingRight: text(10),
    },
    card_item: {
        paddingVertical: text(16),
    },
    tips_sty: {
        color: '#9095A5',
        fontSize: Font.textH3,
        marginHorizontal: text(16),
        paddingTop: text(12),
    },
});
