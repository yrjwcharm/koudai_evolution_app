/*
 * @Date: 2022-06-23 16:05:46
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-23 22:49:37
 * @Description: 基金购买
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {BankCardModal} from '~/components/Modal';
import {PasswordModal} from '~/components/Password';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {onlyNumber, px} from '~/utils/appUtil';

const InputBox = ({onChange, value = ''}) => {
    return (
        <View style={[styles.partBox, {paddingVertical: Space.padding}]}>
            <View style={[Style.flexBetween, {alignItems: 'flex-end'}]}>
                <Text style={styles.buyTitle}>{'买入金额'}</Text>
                <TouchableOpacity activeOpacity={0.8}>
                    <Text style={[styles.desc, {color: Colors.brandColor}]}>{'交易规则'}</Text>
                </TouchableOpacity>
            </View>
            <View style={[Style.flexRow, styles.inputBox]}>
                <Text style={styles.unit}>{'￥'}</Text>
                {`${value}`.length === 0 && (
                    <Text style={styles.placeholder}>
                        <Text style={{fontSize: px(28)}}>{'10'}</Text>
                        {'元起购'}
                    </Text>
                )}
                <TextInput keyboardType="numeric" onChangeText={onChange} style={styles.input} value={`${value}`} />
                {`${value}`.length > 0 && (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => onChange('')}>
                        <AntDesign color="#BDC2CC" name="closecircle" size={px(16)} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.tipsBox}>
                <Text style={{...styles.desc, color: Colors.descColor}}>
                    {'买入费率：'}
                    <Text style={{color: '#FF7D41'}}>{'0.2%'}&nbsp;</Text>
                    <Text style={{textDecorationLine: 'line-through'}}>{'1.5%'}</Text>
                </Text>
                <Text style={{...styles.desc, color: Colors.descColor, marginTop: px(4)}}>
                    {'预计'}
                    <Text style={{color: '#FF7D41'}}>&nbsp;{'05月30日(周一)'}&nbsp;</Text>
                    {'根据'}
                    <Text style={{color: '#FF7D41'}}>&nbsp;{'05月27日(周五)'}&nbsp;</Text>
                    {'的净值确认份额'}
                </Text>
            </View>
        </View>
    );
};

const PayMethod = () => {
    return (
        <>
            <Text style={styles.payTitle}>{'付款方式'}</Text>
            <View style={styles.partBox}>
                <View style={Style.flexRow}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.radioBox}>
                        <View style={styles.radioWrap}>
                            <View style={styles.radioPoint} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={[Style.flexBetween, styles.payMethodBox]}>
                        <View style={Style.flexRow}>
                            <Image
                                source={{uri: 'https://static.licaimofang.cn/wp-content/uploads/2016/04/zhaoshang.png'}}
                                style={styles.bankIcon}
                            />
                            <View>
                                <Text style={styles.title}>{'招商银行(尾号8888)'}</Text>
                                <Text style={[styles.desc, {marginTop: px(4)}]}>{'限额：单笔5千元、单日3万元'}</Text>
                            </View>
                        </View>
                        <View style={Style.flexRow}>
                            <Text style={[styles.desc, {marginRight: px(4)}]}>{'切换'}</Text>
                            <FontAwesome color={Colors.lightGrayColor} name={'angle-right'} size={16} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.payMethodBox, styles.borderTop]}>
                    <View style={Style.flexRow}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.radioBox}>
                            <View style={styles.radioWrap}>
                                <View style={[styles.radioPoint, {backgroundColor: 'transparent'}]} />
                            </View>
                        </TouchableOpacity>
                        <View style={[Style.flexBetween, {flex: 1}]}>
                            <View style={Style.flexRow}>
                                <Image
                                    source={{
                                        uri: 'https://static.licaimofang.cn/wp-content/uploads/2021/04/mfb2@3x.png',
                                    }}
                                    style={styles.bankIcon}
                                />
                                <View>
                                    <Text style={styles.title}>{'大额汇款(单笔无上限)'}</Text>
                                    <Text style={[styles.desc, {marginTop: px(4)}]}>
                                        {'魔方宝可用余额：288,290.03元'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} style={[Style.flexRow, styles.useBtn]}>
                                <Text style={[styles.desc, styles.useText]}>{'去使用'}</Text>
                                <FontAwesome color={'#FF7D41'} name={'angle-right'} size={16} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.largePayTipsBox}>
                        <Text style={[styles.desc, {color: '#FF7D41'}]}>
                            {'您尚有X次大额极速购优惠，使用大额极速购，原有折扣上再打五折'}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    );
};

const Index = ({navigation, route}) => {
    const [amount, setAmount] = useState('');

    const onChange = (val) => {
        setAmount(onlyNumber(val >= 100000000 ? '99999999.99' : val));
    };

    useEffect(() => {
        navigation.setOptions({
            title: '买入',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <View style={[Style.flexRow, styles.nameBox]}>
                    <Text style={styles.title}>{'国投瑞银新能源混合A'}</Text>
                    <Text style={[styles.desc, styles.fundCode]}>{'000883'}</Text>
                </View>
                <InputBox onChange={onChange} value={amount} />
                <PayMethod />
                <View style={styles.agreementBox}>
                    <HTML
                        html={`购买既代表您已悉知该基金组合的<alink style="color: #0051CC;">基金服务协议</alink>、<alink style="color: #0051CC;">产品概要</alink>、<alink style="color: #0051CC;">风险揭示书</alink>、<alink style="color: #0051CC;">客户维护费揭示书</alink>和<alink style="color: #0051CC;">投资人权益须知</alink>等内容`}
                        style={styles.agreementText}
                    />
                </View>
                <BottomDesc />
            </ScrollView>
            <FixedButton title="确认购买" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    nameBox: {
        paddingVertical: px(10),
        paddingHorizontal: Space.padding,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    fundCode: {
        marginLeft: px(8),
        fontWeight: Font.weightMedium,
    },
    partBox: {
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    buyTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    inputBox: {
        paddingTop: Space.padding,
        paddingBottom: px(2),
        position: 'relative',
    },
    unit: {
        marginRight: px(12),
        fontSize: px(24),
        lineHeight: px(34),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    input: {
        padding: 0,
        flex: 1,
        fontSize: px(34),
        color: Colors.defaultColor,
    },
    placeholder: {
        fontSize: px(26),
        lineHeight: px(36),
        color: Colors.placeholderColor,
        position: 'absolute',
        bottom: px(6),
        left: px(36),
    },
    tipsBox: {
        paddingTop: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    payTitle: {
        paddingVertical: px(8),
        paddingHorizontal: Space.padding,
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
    },
    radioBox: {
        paddingRight: px(12),
        justifyContent: 'center',
    },
    radioWrap: {
        padding: px(3),
        borderRadius: px(28),
        borderWidth: Space.borderWidth,
        borderColor: Colors.lightGrayColor,
    },
    radioPoint: {
        borderRadius: px(16),
        width: px(8),
        height: px(8),
        backgroundColor: Colors.brandColor,
    },
    payMethodBox: {
        flex: 1,
        paddingVertical: px(12),
    },
    bankIcon: {
        marginRight: px(8),
        width: px(32),
        height: px(32),
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    useBtn: {
        paddingVertical: px(2),
        paddingHorizontal: px(8),
        borderRadius: px(4),
        borderWidth: Space.borderWidth,
        borderColor: '#FF7D41',
    },
    useText: {
        marginRight: px(4),
        color: '#FF7D41',
    },
    largePayTipsBox: {
        marginTop: px(8),
        marginRight: px(8),
        marginLeft: px(26),
        paddingVertical: px(6),
        paddingHorizontal: px(8),
        borderRadius: px(4),
        backgroundColor: '#FFF5E5',
    },
    agreementBox: {
        paddingTop: px(12),
        paddingHorizontal: Space.padding,
    },
    agreementText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
        textAlign: 'justify',
    },
});

export default Index;
