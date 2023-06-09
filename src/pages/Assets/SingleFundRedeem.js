import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';
import http from '~/services';
import {onlyNumber, px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import BottomDesc from '~/components/BottomDesc';
import Html from '~/components/RenderHtml';
import {FixedButton} from '~/components/Button';
import {BankCardModal, Modal} from '~/components/Modal';
import Radio from '~/components/Radio';
import FastImage from 'react-native-fast-image';
import {PasswordModal} from '~/components/Password';
import Loading from '../Portfolio/components/PageLoading';

const SingleFundRedeem = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [loading, updateLoading] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [errText, setErrText] = useState('');
    const [activeOption, setActiveOption] = useState(null);
    const [btnHeight, setBtnHeight] = useState(0);
    const [bankSelectObj, setBankSelectObj] = useState({select: {}, index: 0});
    const [activeRatio, setActiveRatio] = useState(0);
    const [walletData, setWalletData] = useState(null);
    const [feeText, setFeeText] = useState('');
    const [reminder, setReminder] = useState('');

    const bankCardRef = useRef(null);
    const timer = useRef(null);
    const passwordModalRef = useRef(null);

    const getData = async () => {
        try {
            updateLoading(true);
            let res = await http.get('/fund/redeem/info/20220623', {
                fund_code: route?.params?.fund_code,
                poid: route?.params?.poid,
            });
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '卖出'});
                setData(res.result);
                // 拆出魔方宝
                res.result.pay_methods = res.result?.pay_methods?.filter((item) => {
                    if (item.pay_method === 'wallet') {
                        setWalletData(item);
                    }
                    return item.pay_method !== 'wallet';
                });
                setBankSelectObj({select: res.result?.pay_methods?.[0], index: 0});
            }
        } catch (error) {
            console.log(error);
        }
        updateLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        debounceGetFee(inputVal);
    }, [activeRatio, bankSelectObj, inputVal]);

    const getFee = async (share) => {
        try {
            let res = await http.get('/fund/redeem/fee/20220623', {
                fund_code: route?.params?.fund_code,
                poid: route?.params?.poid,
                share,
                pay_type: activeRatio,
                pay_method: bankSelectObj.select.pay_method,
            });
            setFeeText(res?.result?.fee_text);
            setReminder(res?.result?.reminder);
        } catch (error) {
            console.log(error);
        }
    };

    const debounceGetFee = (newVal) => {
        setFeeText('');
        setReminder('');
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        timer.current = setTimeout(() => {
            getFee(newVal);
        }, 500);
    };

    const handlerErrText = (newVal) => {
        let max = bankSelectObj.select.max_share;
        let min = bankSelectObj.select.min_share;
        let all = bankSelectObj.select.all_share;
        if (newVal === '') {
            setErrText('');
        } else if (+newVal === +all) {
            setErrText('');
        } else if (newVal < min) {
            setErrText('当前卖出份额小于最小卖出份额' + min);
        } else if (newVal > max && newVal < all) {
            setErrText('当前保留份额小于最小保留份额' + (all * 1000 - max * 1000) / 1000);
        } else if (newVal > all) {
            setErrText('卖出份额大于当前页面所选银行卡可卖出份额');
        } else {
            setErrText('');
        }
    };

    const onChangeText = (val) => {
        let newVal = onlyNumber(val);
        handlerErrText(newVal);

        setInputVal(newVal);
        setActiveOption(null);

        // 防抖 获得手续费
        if (newVal) debounceGetFee(newVal);
    };

    const confirm = async () => {
        const loading1 = Toast.showLoading();
        // Toast.hide(loading1);
        try {
            let res1 = await http.get('/fund/redeem/fee/20220623', {
                fund_code: route?.params?.fund_code,
                poid: route?.params?.poid,
                share: inputVal,
                pay_type: activeRatio,
                pay_method: bankSelectObj.select.pay_method,
            });
            if (res1.result.pop_info) {
                Modal.show({
                    title: res1.result.pop_info.title,
                    content: res1.result.pop_info.content,
                    confirm: true,
                    cancelText: '确认赎回',
                    confirmText: '再想一想',
                    confirmCallBack: () => {},
                    cancelCallBack: () => {
                        passwordModalRef.current.show();
                    },
                });
            } else {
                passwordModalRef.current.show();
            }
        } catch (error) {
            console.log(error);
        }
        Toast.hide(loading1);
    };

    const submit = async (password) => {
        const loading2 = Toast.showLoading();
        try {
            let res = await http.post('/fund/redeem/do/20220623', {
                fund_code: route?.params?.fund_code,
                poid: route?.params?.poid,
                share: inputVal,
                pay_type: activeRatio,
                pay_method: bankSelectObj.select.pay_method,
                password,
            });
            if (res.code === '000000') {
                Toast.show('赎回下单成功');
                navigation.goBack();
            } else {
                Toast.show(res.message);
            }
        } catch (error) {
            console.log(error);
        }
        Toast.hide(loading2);
    };

    const clear = () => {
        setInputVal('');
        setActiveOption(null);
        setErrText('');
        setFeeText('');
        setReminder('');
    };

    return (
        <View style={{flex: 1}}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <View style={[styles.container, {paddingBottom: btnHeight}]}>
                        <ScrollView bounces={false} style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                            <View style={styles.fundInfo}>
                                <Text style={styles.fundInfoName}>{data.fund_info?.name}</Text>
                                <Text style={styles.fundInfoCode}>{data.fund_info?.code}</Text>
                            </View>
                            <View style={styles.card}>
                                <View style={[styles.cardHeader, Style.flexBetween]}>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.cardHeaderTitle}>{data.share_info?.title}</Text>
                                        <Text style={styles.cardHeaderTip}>{data.share_info?.tip}</Text>
                                    </View>
                                    {data.rule_btn ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                jump(data.rule_btn?.url);
                                            }}>
                                            <Text style={styles.tradeRule}>{data.rule_btn?.text}</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                <View style={styles.cardInput}>
                                    <View style={Style.flexRow}>
                                        <TextInput
                                            keyboardType="numeric"
                                            style={[styles.inputStyle, {fontFamily: Font.numMedium}]}
                                            placeholder={`最多可卖出${bankSelectObj.select?.all_share || 0}份`}
                                            placeholderTextColor={Colors.placeholderColor}
                                            onChangeText={onChangeText}
                                            value={inputVal}
                                        />
                                        {inputVal ? (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    clear();
                                                }}>
                                                <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                    {errText ? <Text style={styles.errText}>{errText}</Text> : null}
                                </View>
                                <View style={styles.cardOption}>
                                    {data.share_info?.options?.map?.((item, idx) => (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            key={idx}
                                            style={[
                                                styles.optionBtn,
                                                {
                                                    marginLeft: idx > 0 ? px(8) : 0,
                                                    borderColor: activeOption === item ? '#0051CC' : '#BDC2CC',
                                                    backgroundColor: activeOption === item ? '#F1F6FF' : '#fff',
                                                },
                                            ]}
                                            onPress={() => {
                                                setActiveOption(item);
                                                let rVal = bankSelectObj.select.all_share * item.percent;
                                                let nrVal = rVal.toFixed(2) + '';
                                                setInputVal(nrVal);
                                                handlerErrText(nrVal);
                                                debounceGetFee(nrVal);
                                            }}>
                                            <Text
                                                style={[
                                                    styles.optionBtnText,
                                                    {color: activeOption === item ? '#0051CC' : '#9AA0B1'},
                                                ]}>
                                                {item.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.cardDesc}>
                                    {feeText || reminder ? (
                                        <>
                                            {feeText ? <Html html={feeText} style={styles.feeText} /> : null}
                                            {reminder ? (
                                                <View style={{marginTop: px(4)}}>
                                                    <Html html={reminder} style={styles.feeText} />
                                                </View>
                                            ) : null}
                                        </>
                                    ) : (
                                        <View style={[Style.flexCenter]}>
                                            <ActivityIndicator color={Colors.lightGrayColor} />
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View style={styles.bankWrap}>
                                <Text style={styles.bankTitle}>赎回至{['银行卡', '魔方宝'][activeRatio]}</Text>
                                <View style={styles.bankCard}>
                                    <View
                                        style={[
                                            styles.bankCardItem,
                                            {justifyContent: 'space-between'},
                                            walletData ? {borderBottomColor: '#DDDDDD', borderBottomWidth: 0.5} : null,
                                        ]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                // if (activeRatio === 1) {
                                                //     clear();
                                                // }
                                                setActiveRatio(0);
                                            }}
                                            style={Style.flexCenter}>
                                            <Radio
                                                style={{marginRight: px(10)}}
                                                index={0}
                                                click={true}
                                                checked={activeRatio === 0}
                                            />
                                        </TouchableOpacity>
                                        <View style={[styles.bankCardItemDetail, {flex: 1}]}>
                                            <FastImage
                                                source={{uri: bankSelectObj.select?.bank_icon}}
                                                style={styles.bankCardItemDetailIcon}
                                            />
                                            <View style={styles.bankCardItemDetailInfo}>
                                                <Text style={styles.bankCardItemDetailInfoName}>
                                                    {bankSelectObj.select?.bank_name}({bankSelectObj.select?.bank_no})
                                                </Text>
                                                <Text style={styles.bankCardItemDetailInfoDesc}>
                                                    {bankSelectObj.select?.desc}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{}}
                                            onPress={() => {
                                                bankCardRef.current?.show?.();
                                            }}>
                                            <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                                切换
                                                <Icon name={'right'} size={px(12)} />
                                            </Text>
                                        </TouchableOpacity>
                                        <View />
                                    </View>
                                    {walletData ? (
                                        <View style={styles.bankCardItem}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    // if (activeRatio === 0) {
                                                    //     clear();
                                                    // }
                                                    setActiveRatio(1);
                                                }}
                                                style={Style.flexCenter}>
                                                <Radio
                                                    style={{marginRight: px(10)}}
                                                    index={1}
                                                    click={true}
                                                    checked={activeRatio === 1}
                                                />
                                            </TouchableOpacity>
                                            <View style={styles.bankCardItemDetail}>
                                                <FastImage
                                                    source={{uri: walletData?.bank_icon}}
                                                    style={styles.bankCardItemDetailIcon}
                                                />
                                                <Text style={styles.bankCardItemDetailName}>
                                                    {walletData.bank_name}
                                                </Text>
                                                <Text style={styles.bankCardItemDetailDesc}>{walletData.desc}</Text>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                            <BottomDesc />
                        </ScrollView>
                    </View>
                    {data.button ? (
                        <FixedButton
                            title={data.button?.text}
                            disabled={!(+inputVal && !errText)}
                            onPress={confirm}
                            heightChange={(height) => setBtnHeight(height)}
                        />
                    ) : null}
                    <BankCardModal
                        type={'hidden'}
                        title="请选择银行卡"
                        data={data.pay_methods || []}
                        select={bankSelectObj?.index}
                        ref={(ref) => {
                            bankCardRef.current = ref;
                        }}
                        onDone={(select, index) => {
                            setBankSelectObj({select, index});
                            clear();
                            // console.log(select, index);
                        }}
                    />
                    <PasswordModal
                        ref={(ref) => {
                            passwordModalRef.current = ref;
                        }}
                        onDone={submit}
                    />
                </>
            )}
        </View>
    );
};

export default SingleFundRedeem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
    },
    fundInfo: {
        paddingVertical: px(10),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    fundInfoName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
    },
    fundInfoCode: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        marginLeft: px(8),
    },
    card: {
        padding: px(16),
        backgroundColor: '#fff',
    },
    cardHeader: {},
    cardHeaderTitle: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#292D39',
    },
    cardHeaderTip: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        marginLeft: px(8),
    },
    cardInput: {
        marginTop: px(15),
        borderBottomColor: '#E2E4EA',
        borderBottomWidth: 0.5,
        paddingBottom: px(8),
    },
    inputStyle: {
        flex: 1,
        fontSize: px(26),
        letterSpacing: 2,
        padding: 0,
        margin: 0,
    },
    errText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#E74949',
        marginTop: px(2),
    },
    tradeRule: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
    cardOption: {
        marginTop: px(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionBtn: {
        borderRadius: px(4),
        borderWidth: 1,
        paddingVertical: px(4),
        paddingHorizontal: px(24),
        flex: 1,
    },
    optionBtnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#9AA0B1',
        textAlign: 'center',
    },
    cardDesc: {
        marginTop: px(20),
    },
    feeText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    bankWrap: {},
    bankTitle: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
        fontSize: px(13),
        lineHeight: px(18),
        color: '#4E556C',
    },
    bankCard: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
    bankCardItem: {
        paddingVertical: px(17),
        flexDirection: 'row',
        alignItems: 'center',
    },
    bankCardItemDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px(12),
    },
    bankCardItemDetailIcon: {
        width: px(26),
        height: px(26),
    },
    bankCardItemDetailName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#1E2331',
        marginLeft: px(8),
    },
    bankCardItemDetailDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#FF7D41',
        marginLeft: px(8),
    },
    bankCardItemDetailInfo: {
        marginLeft: px(8),
    },
    bankCardItemDetailInfoName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#1E2331',
    },
    bankCardItemDetailInfoDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        marginTop: px(4),
    },
});
