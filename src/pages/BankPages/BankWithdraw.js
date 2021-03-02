/*
 * @Author: xjh
 * @Date: 2021-02-27 16:12:22
 * @Description:银行产品提现
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-02 12:09:44
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
import Clipboard from '@react-native-community/clipboard';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';

export default function BankWithdraw(props) {
    const [showMask, setShowMark] = useState(false);
    const passwordModal = useRef(null);

    const submitData = () => {};
    const passwordInput = () => {
        passwordModal.current.show();
        setShowMark(true);
    };
    return (
        <View style={{flex: 1}}>
            <View style={{position: 'relative', margin: text(16)}}>
                <FastImage
                    style={styles.bank_bg_sty}
                    source={{
                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/zhaoshang.png',
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <Text style={styles.bank_name_sty}>招商银行</Text>
                <View style={styles.bank_fund_wrap_sty}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>余额(元)</Text>
                    <Text style={styles.bank_fund_sty}>2,400.00</Text>
                </View>
            </View>
            <View style={styles.card_sty}>
                <Text style={styles.title_sty}>提现金额</Text>
                <View style={[Style.flexRow, {alignItems: 'baseline', marginTop: text(18)}]}>
                    <Text style={{fontSize: text(22), fontWeight: 'bold'}}>¥</Text>
                    <TextInput value={'2,000.00'} style={styles.num_sty} />
                </View>
            </View>
            <Text style={[{padding: text(15)}, Style.descSty]}>收款银行卡</Text>
            <View style={[Style.flexRow, styles.card_item, styles.card_select]}>
                <View style={Style.flexRow}>
                    <FastImage
                        style={{width: text(30), height: text(30)}}
                        source={{
                            uri: 'https://static.licaimofang.com/wp-content/uploads/2016/04/gongshang.png',
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View>
                        <Text style={{color: Colors.defaultColor, paddingLeft: text(10), fontWeight: 'bold'}}>
                            招商银行储蓄卡(4569)
                        </Text>
                        <Text style={{color: '#9095A5', paddingLeft: text(10), fontSize: text(12), marginTop: text(4)}}>
                            单笔限额30000元
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={styles.tips_sty}>预计2小时内到账，具体到账时间以收款方银</Text>
            <PasswordModal
                ref={passwordModal}
                onDone={submitData}
                onClose={() => {
                    setShowMark(false);
                }}
            />
            <FixedButton title={'确认提现'} onPress={passwordInput} />
        </View>
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
