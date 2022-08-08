/*
 * @Date: 2022-06-23 16:05:46
 * @Description: 基金购买
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {BankCardModal, Modal} from '~/components/Modal';
import {PasswordModal} from '~/components/Password';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, onlyNumber, px} from '~/utils/appUtil';
import {fundBuyDo, getBuyFee, getBuyInfo} from './services';
import http from '~/services';

const InputBox = ({buy_info, errTip, feeData, onChange, rule_button, value = ''}) => {
    const jump = useJump();
    const {hidden_text, title} = buy_info;
    const {date_text, fee_text, origin_fee} = feeData;
    return (
        <View style={[styles.partBox, {paddingVertical: Space.padding}]}>
            <View style={[Style.flexBetween, {alignItems: 'flex-end'}]}>
                <Text style={styles.buyTitle}>{title}</Text>
                {rule_button?.text ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(rule_button.url)}>
                        <Text style={[styles.desc, {color: Colors.brandColor}]}>{rule_button.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={[Style.flexRow, styles.inputBox]}>
                <Text style={styles.unit}>{'￥'}</Text>
                {`${value}`.length === 0 && (
                    <Text style={styles.placeholder}>
                        {/* <Text style={{fontSize: px(28)}}>{'10'}</Text> */}
                        {hidden_text}
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
                {errTip ? (
                    <HTML html={errTip} style={{...styles.desc, color: Colors.red}} />
                ) : fee_text || date_text ? (
                    <>
                        {fee_text ? (
                            <View style={Style.flexRow}>
                                <HTML html={`${fee_text}`} style={{...styles.desc, color: Colors.descColor}} />
                                {/* {origin_fee ? <Text style={[styles.desc, styles.originFee]}>{origin_fee}</Text> : null}
                                <HTML
                                    html={`${fee_text.split('：')[1]}`}
                                    style={{...styles.desc, color: Colors.descColor}}
                                /> */}
                            </View>
                        ) : null}
                        {date_text ? (
                            <View style={{marginTop: px(4)}}>
                                <HTML
                                    html={date_text}
                                    style={{...styles.desc, color: Colors.descColor, marginTop: px(4)}}
                                />
                            </View>
                        ) : null}
                    </>
                ) : (
                    <View style={Style.flexCenter}>
                        <ActivityIndicator color={Colors.lightGrayColor} />
                    </View>
                )}
            </View>
        </View>
    );
};

const PayMethod = ({
    bankCardModal,
    isLarge,
    large_pay_method = {},
    pay_method = {},
    setIsLarge,
    large_pay_show_type,
}) => {
    const jump = useJump();
    const {bank_icon, bank_name, bank_no, limit_desc} = pay_method;
    const {
        bank_icon: large_bank_icon,
        bank_name: large_bank_name,
        button,
        large_pay_tip,
        limit_desc: large_limit_desc,
    } = large_pay_method;
    return (
        <>
            <Text style={styles.payTitle}>{'付款方式'}</Text>
            <View style={styles.partBox}>
                <View style={Style.flexRow}>
                    {large_pay_show_type == 2 && (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsLarge(false)} style={styles.radioBox}>
                            <View style={styles.radioWrap}>
                                <View style={[styles.radioPoint, isLarge ? {backgroundColor: 'transparent'} : {}]} />
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => bankCardModal.current.show()}
                        style={[Style.flexBetween, styles.payMethodBox]}>
                        <View style={Style.flexRow}>
                            <Image source={{uri: bank_icon}} style={styles.bankIcon} />
                            <View>
                                <Text style={styles.title}>
                                    {`${bank_name}`}
                                    {bank_no ? `(${bank_no})` : ''}
                                </Text>
                                <Text style={[styles.desc, {marginTop: px(4)}]}>{limit_desc}</Text>
                            </View>
                        </View>
                        <View style={Style.flexRow}>
                            <Text style={[styles.desc, {marginRight: px(4)}]}>{'切换'}</Text>
                            <FontAwesome color={Colors.lightGrayColor} name={'angle-right'} size={16} />
                        </View>
                    </TouchableOpacity>
                </View>
                {large_pay_method.pay_method && large_pay_show_type == 2 ? (
                    <View style={[styles.payMethodBox, styles.borderTop]}>
                        <View style={Style.flexRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setIsLarge(true)}
                                style={styles.radioBox}>
                                <View style={styles.radioWrap}>
                                    <View
                                        style={[styles.radioPoint, isLarge ? {} : {backgroundColor: 'transparent'}]}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={[Style.flexBetween, {flex: 1}]}>
                                <View style={Style.flexRow}>
                                    <Image
                                        source={{
                                            uri: large_bank_icon,
                                        }}
                                        style={styles.bankIcon}
                                    />
                                    <View>
                                        <Text style={styles.title}>{large_bank_name}</Text>
                                        <Text style={[styles.desc, {marginTop: px(4)}]}>{large_limit_desc}</Text>
                                    </View>
                                </View>
                                {button?.text ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => jump(button.url)}
                                        style={[Style.flexRow, styles.useBtn]}>
                                        <Text style={[styles.desc, styles.useText]}>{button.text}</Text>
                                        <FontAwesome color={'#FF7D41'} name={'angle-right'} size={16} />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                        {large_pay_tip ? (
                            <View style={styles.largePayTipsBox}>
                                <Text style={[styles.desc, {color: '#FF7D41'}]}>{large_pay_tip}</Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}
            </View>
        </>
    );
};

const Index = ({navigation, route}) => {
    const jump = useJump();
    const {amount: _amount = '', code} = route.params;
    const bankCardModal = useRef();
    const passwordModal = useRef();
    const [amount, setAmount] = useState(_amount);
    const [data, setData] = useState({});
    const [feeData, setFeeData] = useState({});
    const [isLarge, setIsLarge] = useState(false);
    const [bankSelectIndex, setIndex] = useState(0);
    const [deltaHeight, setDeltaHeight] = useState(0);
    const [errTip, setErrTip] = useState('');
    const {
        add_payment_disable = false,
        agreement,
        agreement_bottom,
        button,
        buy_info,
        large_pay_method,
        large_pay_show_type, //arge_pay_show_type  1为显示在内层列表 2为显示在外层
        large_pay_tip,
        pay_methods = [],
        rule_button,
        sub_title,
    } = data;
    const timer = useRef();
    const userInfo = useSelector((state) => state.userInfo)?.toJS?.() || {};

    const onChange = (val) => {
        setAmount(onlyNumber(val >= 100000000 ? '99999999.99' : val));
    };

    const onInput = () => {
        const method = isLarge ? large_pay_method : pay_methods[bankSelectIndex];
        if (amount > method.left_amount) {
            setErrTip(
                method.pay_method !== 'wallet'
                    ? `您当日剩余可用额度为${method.left_amount}元，推荐使用大额极速购`
                    : `魔方宝余额不足,建议<alink url='{"path":"MfbIn","params":{"fr":"fund_trade_buy"}}'>立即充值</alink>`
            );
            setFeeData({});
        } else if (amount > method.single_amount) {
            setErrTip(`最大单笔购买金额为${method.single_amount}元`);
            setFeeData({});
        } else if (method.pay_method !== 'wallet' && amount > method.day_limit) {
            setErrTip(`最大单日购买金额为${method.day_limit}元`);
            setFeeData({});
        } else if (amount !== '' && amount < buy_info.initial_amount) {
            setErrTip(`起购金额${buy_info.initial_amount}`);
            setFeeData({});
        } else {
            setErrTip('');
            timer.current && clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                getBuyFee({amount, fund_code: code, pay_method: method.pay_method, type: 0}).then((res) => {
                    if (res.code === '000000') {
                        setFeeData(res.result);
                    } else {
                        setErrTip(res.message);
                    }
                });
            }, 300);
        }
    };

    const buyClick = () => {
        const method = isLarge ? large_pay_method : pay_methods[bankSelectIndex];
        global.LogTool({ctrl: `${method.pay_method},${amount}`, event: 'buy_button_click', oid: code});
        Keyboard.dismiss();
        passwordModal.current.show();
    };

    const onSubmit = (password) => {
        const method = isLarge ? large_pay_method : pay_methods[bankSelectIndex];
        const toast = Toast.showLoading();
        fundBuyDo({amount, fund_code: code, password, pay_method: method.pay_method})
            .then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    navigation.navigate('TradeProcessing', res.result);
                } else {
                    res.message &&
                        Toast.show(res.message, {
                            onHidden: () => {
                                if (res.code === 'TA2803') {
                                    passwordModal.current.show();
                                }
                            },
                        });
                }
            })
            .finally(() => {
                Toast.hide(toast);
            });
    };

    useFocusEffect(
        useCallback(() => {
            const {anti_pop} = userInfo;
            if (anti_pop) {
                const {cancel_action, confirm_action, content, title} = anti_pop;
                Modal.show({
                    title: title,
                    content: content,
                    confirm: true,
                    backButtonClose: false,
                    isTouchMaskToClose: false,
                    cancelCallBack: () => {
                        navigation.goBack();
                    },
                    confirmCallBack: () => {
                        jump(confirm_action?.url);
                    },
                    cancelText: cancel_action?.text,
                    confirmText: confirm_action?.text,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userInfo])
    );

    const showRiskPop = (pop) => {
        const {cancel, confirm, content, title} = pop;
        Modal.show({
            backButtonClose: false,
            cancelCallBack: () => {
                const {act, url} = cancel;
                if (act === 'jump') {
                    jump(url);
                } else if (act === 'back') {
                    navigation.goBack();
                }
            },
            cancelText: cancel.text,
            confirm: cancel?.text ? true : false,
            confirmCallBack: () => {
                const {act, url} = confirm;
                if (act === 'jump') {
                    jump(url);
                } else if (act === 'back') {
                    navigation.goBack();
                } else if (act === 'report') {
                    http.post(url, {fund_code: code});
                }
            },
            confirmText: confirm.text,
            content,
            isTouchMaskToClose: false,
            title,
        });
    };

    useFocusEffect(
        useCallback(() => {
            global.LogTool({ctrl: code, event: 'buy_detail_view'});
            getBuyInfo({amount, fund_code: code, type: 0}).then((res) => {
                if (res.code === '000000') {
                    const {risk_pop, title = '买入'} = res.result;
                    risk_pop && showRiskPop(risk_pop);
                    navigation.setOptions({title});
                    setData(res.result);
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        if (pay_methods.length > 0) {
            onInput();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, bankSelectIndex, code, isLarge, large_pay_method, pay_methods]);

    return (
        <View style={[styles.container, {paddingBottom: (isIphoneX() ? px(86) : px(60)) + deltaHeight}]}>
            {Object.keys(data).length > 0 ? (
                <>
                    <ScrollView
                        bounces={false}
                        keyboardShouldPersistTaps="handled"
                        scrollIndicatorInsets={{right: 1}}
                        style={{flex: 1}}>
                        <View style={[Style.flexRow, styles.nameBox]}>
                            <Text style={styles.title}>{sub_title}</Text>
                            <Text style={[styles.desc, styles.fundCode]}>{code}</Text>
                        </View>
                        <InputBox
                            buy_info={buy_info}
                            errTip={errTip}
                            feeData={feeData}
                            onChange={onChange}
                            rule_button={rule_button}
                            value={amount}
                        />
                        <PayMethod
                            bankCardModal={bankCardModal}
                            isLarge={isLarge}
                            large_pay_show_type={large_pay_show_type}
                            large_pay_method={large_pay_method ? {...large_pay_method, large_pay_tip} : undefined}
                            pay_method={pay_methods[bankSelectIndex]}
                            setIsLarge={setIsLarge}
                        />
                        <BottomDesc />
                    </ScrollView>
                    <BankCardModal
                        data={[...pay_methods, large_pay_show_type == 1 && large_pay_method] || []}
                        onDone={(select, index) => {
                            setIndex(index);
                        }}
                        ref={bankCardModal}
                        select={bankSelectIndex}
                        type={add_payment_disable ? 'hidden' : ''}
                    />
                    <PasswordModal onDone={onSubmit} ref={passwordModal} />
                    <FixedButton
                        agreement={agreement_bottom}
                        disabled={amount === '' || button.avail === 0 || errTip !== ''}
                        heightChange={(height) => setDeltaHeight(height)}
                        onPress={buyClick}
                        otherAgreement={agreement}
                        suffix={agreement_bottom.agree_text}
                        title={button.text}
                    />
                </>
            ) : (
                <Loading />
            )}
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
    originFee: {
        marginRight: px(4),
        color: Colors.descColor,
        textDecorationColor: Colors.descColor,
        textDecorationLine: 'line-through',
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
