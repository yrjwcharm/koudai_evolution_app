/*
 * @Date: 2022-06-23 16:05:46
 * @Description: 基金购买
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import Picker from 'react-native-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import checked from '~/assets/img/login/checked.png';
import notChecked from '~/assets/img/login/notChecked.png';
import tips from '~/assets/img/trade/tips.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {Button, FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Mask from '~/components/Mask';
import {BankCardModal, Modal} from '~/components/Modal';
import {PasswordModal} from '~/components/Password';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {onlyNumber, px} from '~/utils/appUtil';
import {
    fundBatchBuyDo,
    fundBuyDo,
    fundFixDo,
    getBatchBuyFee,
    getBatchBuyInfo,
    getBuyFee,
    getBuyInfo,
    getBuyQuestionnaire,
    getNextDay,
    postQuestionAnswer,
} from './services';
import http from '~/services';
import {debounce} from 'lodash';

export const Questionnaire = ({callback, data = [], summary_id}) => {
    const [current, setIndex] = useState(0);
    const [selected, setSelected] = useState();
    const question = data[current];
    const {btn, id: questionId, name, options, title} = question || {};

    return (
        <View style={{padding: Space.padding, paddingTop: px(20)}}>
            <Text style={[styles.buyTitle, title ? {textAlign: 'center'} : {}]}>{title || name}</Text>
            {options?.map?.((option, i) => {
                const {content, id: optionId, next_quest_id} = option;
                const active = selected === optionId;
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!!selected}
                        key={optionId}
                        onPress={debounce(
                            () => {
                                setSelected(optionId);
                                postQuestionAnswer({
                                    option_id: optionId,
                                    option_val: content,
                                    question_id: questionId,
                                    summary_id,
                                }).then((res) => {
                                    if (res.code === '000000') {
                                        if (next_quest_id === 0) {
                                            callback?.('continue');
                                        } else {
                                            const idx = data?.findIndex?.((q) => q.id === next_quest_id);
                                            setSelected();
                                            setIndex(idx);
                                        }
                                    }
                                });
                            },
                            300,
                            {leading: true, trailing: false}
                        )}
                        style={[
                            Style.flexBetween,
                            styles.questionOp,
                            {marginTop: Space.marginVertical},
                            {borderColor: active ? Colors.brandColor : Colors.borderColor},
                        ]}>
                        <Text
                            style={[
                                styles.title,
                                {maxWidth: px(280)},
                                active ? {color: Colors.brandColor} : {fontWeight: '400'},
                            ]}>
                            {content}
                        </Text>
                        <Image source={active ? checked : notChecked} style={{width: px(16), height: px(16)}} />
                    </TouchableOpacity>
                );
            })}
            {btn?.length > 0 && (
                <>
                    <View style={{paddingTop: Space.padding}}>
                        <Text style={styles.questionContent}>{name}</Text>
                    </View>
                    <View style={[Style.flexRow, {paddingTop: px(20)}]}>
                        {btn.map?.((b, i) => {
                            const {text, type} = b;
                            return (
                                <Button
                                    key={text + i}
                                    onPress={() => callback?.(type === 2 ? 'continue' : 'close')}
                                    style={{marginLeft: i === 0 ? 0 : px(12), flex: 1, height: px(40)}}
                                    textStyle={{fontSize: Font.textH2, lineHeight: px(20)}}
                                    title={text}
                                    type={i === 0 ? 'minor' : 'primary'}
                                />
                            );
                        })}
                    </View>
                </>
            )}
        </View>
    );
};

/** @name 金额输入框 */
const InputBox = ({buy_info, errTip, feeData, onChange, rule_button, tipLoading, value = ''}) => {
    const jump = useJump();
    const {hidden_text, title} = buy_info;
    const {date_text, fee_text, origin_fee} = feeData;
    const input = useRef();

    const keyboardHide = () => {
        input.current?.blur?.();
    };

    useEffect(() => {
        Platform.OS === 'android' && Keyboard.addListener('keyboardDidHide', keyboardHide);
    }, []);

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
                {`${value}`.length === 0 && <Text style={styles.placeholder}>{hidden_text}</Text>}
                <TextInput
                    keyboardType="numeric"
                    onBlur={() => {
                        global.LogTool({event: 'EnterAmount', oid: value});
                    }}
                    onChangeText={onChange}
                    ref={input}
                    style={[styles.input, `${value}`.length > 0 ? {fontFamily: Font.numMedium} : {}]}
                    value={`${value}`}
                />
                {`${value}`.length > 0 && (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => onChange('')}>
                        <AntDesign color="#BDC2CC" name="closecircle" size={px(16)} />
                    </TouchableOpacity>
                )}
            </View>
            {Object.keys(feeData).length > 0 || errTip ? (
                <View style={styles.tipsBox}>
                    {errTip ? (
                        <HTML html={errTip} style={{...styles.desc, color: Colors.red}} />
                    ) : tipLoading ? (
                        <View style={Style.flexCenter}>
                            <ActivityIndicator color={Colors.lightGrayColor} />
                        </View>
                    ) : fee_text || date_text ? (
                        <>
                            {fee_text ? (
                                <View style={Style.flexRow}>
                                    <HTML
                                        html={`${fee_text.split('：')[0]}：`}
                                        style={{...styles.desc, color: Colors.descColor}}
                                    />
                                    {origin_fee ? (
                                        <Text style={[styles.desc, styles.originFee]}>{origin_fee}</Text>
                                    ) : null}
                                    <HTML
                                        html={`${fee_text.split('：')[1]}`}
                                        style={{...styles.desc, color: Colors.descColor}}
                                    />
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
                    ) : null}
                </View>
            ) : null}
        </View>
    );
};

/** @name 定投周期 */
const FixedInvestCycle = ({current_date = [], date_items = [], nextday, onChange, setShowMask, text}) => {
    const pickerData = useRef();
    /** @name 生成定投周期选择器数据 */
    const createPickerData = () => {
        return date_items.map((item) => {
            const {key, val} = item;
            return {
                [key]: val,
            };
        });
    };
    /** @name 展示定投周期选择器 */
    const showPicker = () => {
        Keyboard.dismiss();
        setShowMask(true);
        Picker.init({
            pickerTitleText: '定投周期',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerData: pickerData.current,
            pickerFontColor: [33, 33, 33, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            pickerTextEllipsisLen: 100,
            wheelFlex: [1, 1],
            selectedValue: [current_date[0], current_date[1]],
            onPickerConfirm: (pickedValue) => {
                setShowMask(false);
                onChange(pickedValue);
            },
            onPickerCancel: () => {
                setShowMask(false);
            },
        });
        Picker.show();
    };

    useEffect(() => {
        pickerData.current = createPickerData();
    }, []);

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={showPicker} style={styles.fixedInvestCycle}>
            <View style={Style.flexBetween}>
                <Text style={styles.buyTitle}>{text}</Text>
                <View style={Style.flexRow}>
                    <Text style={[styles.buyTitle, {fontWeight: '400', marginRight: px(4)}]}>
                        {current_date.join(' ')}
                    </Text>
                    <AntDesign color={Colors.lightGrayColor} name="right" size={px(12)} />
                </View>
            </View>
            {nextday ? (
                <View style={{marginTop: px(8)}}>
                    <HTML html={nextday} style={styles.desc} />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

/** @name 支付方式 */
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
                    {large_pay_show_type === 2 && (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsLarge(false)} style={styles.radioBox}>
                            <View style={styles.radioWrap}>
                                <View style={[styles.radioPoint, isLarge ? {backgroundColor: 'transparent'} : {}]} />
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            global.LogTool({event: 'BankCard'});
                            bankCardModal.current.show();
                        }}
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
                {large_pay_method.pay_method && large_pay_show_type === 2 ? (
                    <View style={[styles.payMethodBox, styles.borderTop]}>
                        <View style={Style.flexRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    global.LogTool('speedbuy');
                                    setIsLarge(true);
                                }}
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
                                        onPress={() => {
                                            global.LogTool('usebutton');
                                            jump(button.url);
                                        }}
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

/** @name 基金增值服务 */
const FundService = ({body, head, onChange}) => {
    const {content, duration, icon, price, price_discount, title: bodyTitle} = body;
    const {acquire, selected, title: headTitle} = head;
    const {pop, text} = acquire;
    const [select, setSelect] = useState(selected);

    useEffect(() => {
        onChange?.(select);
    }, [select]);

    return (
        <View style={[styles.partBox, {marginTop: px(12), paddingVertical: px(12)}]}>
            <View style={Style.flexBetween}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelect((prev) => Number(!prev))}
                    style={Style.flexRow}>
                    <Image source={select ? checked : notChecked} style={styles.checkIcon} />
                    <HTML html={headTitle} style={styles.title} />
                </TouchableOpacity>
                <Text
                    onPress={() => Modal.show({confirmText: pop.button?.text, content: pop.content})}
                    style={[styles.desc, {color: Colors.brandColor}]}>
                    {text}
                </Text>
            </View>
            <View style={{marginTop: px(12), flexDirection: 'row'}}>
                <Image source={{uri: icon}} style={styles.serviceImg} />
                <View style={{flex: 1}}>
                    <HTML html={bodyTitle} style={styles.bodyTitle} />
                    <HTML html={content} nativeProps={{containerStyle: {marginTop: px(4)}}} style={styles.smText} />
                    <View style={[Style.flexRow, {alignItems: 'flex-end', marginTop: px(8)}]}>
                        <Text
                            style={[styles.desc, {marginBottom: 1, color: Colors.red, fontWeight: Font.weightMedium}]}>
                            ￥
                        </Text>
                        <HTML
                            html={price_discount}
                            nativeProps={{containerStyle: {marginHorizontal: px(2)}}}
                            style={styles.priceDiscount}
                        />
                        <Text style={[styles.desc, {marginBottom: 1, color: Colors.descColor}]}>
                            <Text style={{textDecorationLine: 'line-through'}}>{price}</Text>
                            {duration}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

/** @name 买入/卖出明细 */
const TradeDetail = ({amount, data = {}, listRef = {}, setCanBuy}) => {
    const {disable_info, header, items, title, total_info} = data;
    const [list, setList] = useState(items);
    const inputArr = useRef([]);

    const allSelected = useMemo(() => {
        return list?.every?.((item) => item.select);
    }, [list]);

    const totalPercent = useMemo(() => {
        return list?.reduce?.((prev, curr) => prev + (curr.select ? Number(curr.percent) : 0), 0) || 0;
    }, [list]);

    const canBuy = useMemo(() => {
        return (
            list?.every?.((item) => {
                const {max_amount, min_amount, percent, select} = item;
                const _amount = (amount * percent) / 100;
                return select ? _amount >= min_amount && (max_amount ? _amount <= max_amount : true) : true;
            }) && totalPercent === 100
        );
    }, [amount, list, totalPercent]);

    const selectAll = () => {
        setList((prev) => {
            const next = [...prev];
            next.forEach((item) => (item.select = !allSelected));
            return next;
        });
    };

    const onSelect = (index) => {
        setList((prev) => {
            const next = [...prev];
            next[index].select = !next[index].select;
            return next;
        });
    };

    const onChangePercent = (val, index) => {
        const _amount = Number(val.replace(/\D/g, ''));
        setList((prev) => {
            const next = [...prev];
            next[index].percent = _amount > 100 ? '100' : `${_amount}`;
            return next;
        });
    };

    const keyboardHide = () => {
        inputArr.current?.forEach((input) => {
            input?.blur?.();
        });
    };

    useEffect(() => {
        setCanBuy?.(canBuy);
    }, [canBuy]);

    useEffect(() => {
        listRef.current = list.filter((item) => item.select);
    }, [list]);

    useEffect(() => {
        Platform.OS === 'android' && Keyboard.addListener('keyboardDidHide', keyboardHide);
    }, []);

    return (
        <>
            <View style={[styles.partBox, {marginTop: px(12), paddingVertical: Space.padding}]}>
                <View style={[Style.flexBetween, {paddingBottom: px(12)}]}>
                    <Text style={[styles.title, {fontWeight: '400'}]}>{title}</Text>
                </View>
                <View style={styles.detailBox}>
                    <View style={Style.flexRow}>
                        {header?.map?.((item, index, arr) => {
                            const {pop, text} = item;
                            return (
                                <TouchableOpacity
                                    activeOpacity={index === 0 ? 0.8 : 1}
                                    key={text + index}
                                    onPress={index === 0 ? selectAll : undefined}
                                    style={[
                                        Style.flexRow,
                                        {
                                            flex: index === 0 ? 1.6 : 1,
                                            justifyContent:
                                                index === arr.length - 1
                                                    ? 'flex-end'
                                                    : index === 0
                                                    ? 'flex-start'
                                                    : 'center',
                                        },
                                    ]}>
                                    {index === 0 && (
                                        <Image source={allSelected ? checked : notChecked} style={styles.checkIcon} />
                                    )}
                                    <Text style={styles.desc}>{text}</Text>
                                    {pop ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                const {content, confirm} = pop;
                                                Modal.show({
                                                    confirmText: confirm.text,
                                                    content,
                                                });
                                            }}
                                            style={{marginLeft: px(4)}}>
                                            <AntDesign
                                                color={Colors.lightGrayColor}
                                                name="questioncircleo"
                                                size={px(12)}
                                            />
                                        </TouchableOpacity>
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {list?.map?.((item, index) => {
                        const {code, max_amount, min_amount, name, percent, select} = item;
                        const _amount = (amount * percent) / 100;
                        const hasAmount = `${amount}`.length > 0;
                        const errTip =
                            hasAmount && select
                                ? _amount < min_amount
                                    ? `小于最低起购金额${min_amount}元`
                                    : max_amount && _amount > max_amount
                                    ? `大于最大申购金额${max_amount}元`
                                    : ''
                                : '';
                        return (
                            <View key={code} style={{marginTop: Space.marginVertical}}>
                                <View style={Style.flexRow}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => onSelect(index)}
                                        style={{flexDirection: 'row', flex: 1.6}}>
                                        <Image source={select ? checked : notChecked} style={styles.checkIcon} />
                                        <View>
                                            <Text style={styles.fundName}>{name}</Text>
                                            <Text style={styles.fundCodeText}>{code}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            const input = inputArr.current?.[index];
                                            if (!input?.isFocused?.()) input?.focus?.();
                                        }}
                                        style={[Style.flexRowCenter, {flex: 1}]}>
                                        <View style={styles.percentInputBox}>
                                            <TextInput
                                                editable={select}
                                                keyboardType="number-pad"
                                                onChangeText={(val) => onChangePercent(val, index)}
                                                ref={(ref) => (inputArr.current[index] = ref)}
                                                style={[
                                                    styles.percentInput,
                                                    select ? {} : {color: Colors.lightGrayColor},
                                                ]}
                                                value={`${percent}`}
                                            />
                                        </View>
                                        <Text style={styles.percentUnit}>%</Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Text
                                            style={[
                                                styles.fundAmount,
                                                {
                                                    color:
                                                        _amount && _amount >= min_amount && select
                                                            ? Colors.defaultColor
                                                            : Colors.lightGrayColor,
                                                },
                                            ]}>
                                            {hasAmount && select ? _amount.toFixed(2) : `最低${min_amount}元`}
                                        </Text>
                                    </View>
                                </View>
                                {errTip ? <Text style={styles.errTip}>{errTip}</Text> : null}
                            </View>
                        );
                    })}
                </View>
                {total_info ? (
                    <View style={[Style.flexRow, {paddingTop: Space.padding}]}>
                        <View style={[Style.flexRow, {flex: 1.6}]}>
                            <Text style={styles.totalText}>{total_info.text}</Text>
                            <Text
                                style={[
                                    styles.totalTip,
                                    {color: totalPercent !== 100 ? Colors.red : Colors.lightGrayColor},
                                ]}>
                                {total_info.tip}
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.totalPercentText,
                                {color: totalPercent !== 100 ? Colors.red : Colors.defaultColor},
                            ]}>
                            {totalPercent}%
                        </Text>
                        <View style={{flex: 1}} />
                    </View>
                ) : null}
            </View>
            {disable_info?.items?.length > 0 && (
                <View style={styles.disableBox}>
                    <Text style={[styles.desc, {color: Colors.defaultColor}]}>{disable_info.text}</Text>
                    {disable_info.items.map?.((item) => {
                        const {code, name} = item;
                        return (
                            <Text
                                key={code}
                                style={[
                                    styles.fundName,
                                    {marginTop: Space.marginVertical, color: Colors.lightGrayColor},
                                ]}>
                                {name}
                            </Text>
                        );
                    })}
                </View>
            )}
        </>
    );
};

const Index = ({navigation, route}) => {
    const jump = useJump();
    const isFocused = useIsFocused();
    const {amount: _amount = '', append = '', code, isLargeAmount = false, type = 0} = route.params;
    const bankCardModal = useRef();
    const passwordModal = useRef();
    const tradeDetailList = useRef();
    const isFocusedRef = useRef(isFocused);
    const [amount, setAmount] = useState(_amount);
    const [data, setData] = useState({});
    const [feeData, setFeeData] = useState({});
    const [tipLoading, setTipLoading] = useState(false);
    const [isLarge, setIsLarge] = useState(isLargeAmount);
    const [bankSelectIndex, setIndex] = useState(0);
    const [deltaHeight, setDeltaHeight] = useState(0);
    const [errTip, setErrTip] = useState('');
    const [showMask, setShowMask] = useState(false);
    const [canBuy, setCanBuy] = useState(true);
    const {
        add_payment_disable = false,
        agreement,
        agreement_bottom,
        button,
        buy_info,
        fund_service,
        large_pay_method,
        large_pay_show_type, // 1为显示在内层列表 2为显示在外层
        large_pay_tip,
        money_safe,
        pay_methods = [],
        period_info,
        ratio_detail,
        rule_button,
        sale_fund_codes,
        sub_title,
        tip,
    } = data;
    const timer = useRef();
    const selectFundService = useRef();
    const userInfo = useSelector((state) => state.userInfo)?.toJS?.() || {};

    const onChange = (val) => {
        setAmount(onlyNumber(val >= 100000000 ? '99999999.99' : val));
    };

    /** @name 输入金额获取交易费用等信息 */
    const onInput = () => {
        const method = isLarge ? large_pay_method : pay_methods[bankSelectIndex];
        if (amount > method.left_amount && type === 0) {
            setErrTip(
                method.pay_method !== 'wallet'
                    ? `您当日剩余可用额度为${method.left_amount}元，推荐使用大额极速购`
                    : `魔方宝余额不足,建议<alink url='{"path":"MfbIn","params":{"fr":"fund_trade_buy"}}'>立即充值</alink>`
            );
        } else if (amount > method.single_amount) {
            setErrTip(`最大单笔购买金额为${method.single_amount}元`);
        } else if (method.pay_method !== 'wallet' && amount > method.day_limit) {
            setErrTip(`最大单日购买金额为${method.day_limit}元`);
        } else if (amount !== '' && amount < buy_info.initial_amount) {
            setErrTip(`起购金额${buy_info.initial_amount}`);
        } else {
            setErrTip('');
            if (type === 0 || type === 3) {
                setTipLoading(true);
                timer.current && clearTimeout(timer.current);
                timer.current = setTimeout(() => {
                    const params = {
                        amount,
                        fund_code: code,
                        pay_method: method.pay_method,
                        type,
                    };
                    if (type === 3) {
                        params.fund_ratios = JSON.stringify(
                            tradeDetailList.current?.map?.((item) => {
                                const {code: _code, percent} = item;
                                return {amount: (amount * percent) / 100, code: _code, percent};
                            })
                        );
                    }
                    (type === 0 ? getBuyFee : getBatchBuyFee)(params)
                        .then((res) => {
                            if (res.code === '000000') {
                                setFeeData(res.result);
                            } else {
                                setErrTip(res.message);
                            }
                        })
                        .finally(() => {
                            setTipLoading(false);
                        });
                }, 300);
            }
        }
    };

    /** @name 点击购买/定投按钮 */
    const buyClick = () => {
        const method = isLarge ? large_pay_method : pay_methods[bankSelectIndex];
        global.LogTool({ctrl: `${method.pay_method},${amount}`, event: 'buy_button_click', oid: code});
        Keyboard.dismiss();
        getBuyQuestionnaire({fr: 'compliance', scene: 'fund'}).then((res) => {
            if (res.code === '000000') {
                const {list, summary_id} = res.result;
                if (summary_id) {
                    Modal.show(
                        {
                            backButtonClose: false,
                            children: (
                                <Questionnaire
                                    callback={(action) => {
                                        Modal.close();
                                        action === 'continue' && passwordModal.current.show();
                                    }}
                                    data={list}
                                    summary_id={summary_id}
                                />
                            ),
                            header: <View />,
                            isTouchMaskToClose: false,
                            style: {
                                minHeight: 0,
                            },
                        },
                        'slide'
                    );
                } else {
                    passwordModal.current.show();
                }
            } else {
                passwordModal.current.show();
            }
        });
    };

    /** @name 输入完交易密码确认交易 */
    const onSubmit = (password) => {
        const method = isLarge ? large_pay_method : pay_methods[bankSelectIndex];
        const toast = Toast.showLoading();
        const params = {
            amount,
            fund_code: code,
            fund_service: selectFundService.current,
            password,
            pay_method: method.pay_method,
            poid: data.poid,
            append,
        };
        if (type === 1) {
            params.cycle = period_info.current_date[0];
            params.need_buy = false;
            params.timing = period_info.current_date[1];
            params.trade_method = method.pay_type;
            params.wallet_auto_charge = 0;
        }
        if (type === 3) {
            params.fund_ratios = JSON.stringify(
                tradeDetailList.current?.map?.((item) => {
                    const {code: _code, percent} = item;
                    return {amount: (amount * percent) / 100, code: _code, percent};
                })
            );
        }
        (type === 0 ? fundBuyDo : type === 3 ? fundBatchBuyDo : fundFixDo)(params)
            .then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    navigation[type === 0 || type === 3 ? 'navigate' : 'replace'](
                        type === 0 || type === 3 ? 'TradeProcessing' : 'TradeFixedConfirm',
                        res.result
                    );
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

    /** @name 弹出风险弹窗 */
    const showRiskPop = (pop) => {
        const {cancel = {}, confirm, content, title} = pop;
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
            confirm: !!cancel?.text,
            confirmCallBack: () => {
                const {act, url} = confirm;
                if (act === 'jump') {
                    jump(url);
                } else if (act === 'back') {
                    navigation.goBack();
                } else if (act === 'report') {
                    http.post(url, {fund_code: sale_fund_codes || code});
                }
            },
            confirmText: confirm.text,
            content,
            isTouchMaskToClose: false,
            title,
        });
    };

    /** @name 更改定投周期 */
    const onChangeDate = (date) => {
        getNextDay({cycle: date[0], timing: date[1]}).then((res) => {
            if (res.code === '000000') {
                setData((prev) => {
                    prev.period_info.current_date = date;
                    prev.period_info.nextday = res.result.nextday;
                    return {...prev};
                });
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            const {anti_pop} = userInfo;
            if (anti_pop) {
                const {cancel_action, confirm_action, content, title} = anti_pop;
                isFocusedRef.current &&
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
        }, [userInfo])
    );

    useFocusEffect(
        useCallback(() => {
            global.LogTool({ctrl: code, event: 'buy_detail_view'});
            (type === 3 ? getBatchBuyInfo : getBuyInfo)({amount, fund_code: code, type}).then((res) => {
                if (res.code === '000000') {
                    const {risk_pop, title = '买入'} = res.result;
                    risk_pop && isFocusedRef.current && showRiskPop(risk_pop);
                    navigation.setOptions({title});
                    selectFundService.current = res.result.fund_service?.selected || 0;
                    setData(res.result);
                }
            });
        }, [])
    );

    useEffect(() => {
        isFocusedRef.current = isFocused;
    }, [isFocused]);

    useEffect(() => {
        if (pay_methods.length > 0) {
            onInput();
        }
    }, [amount, bankSelectIndex, code, isLarge, large_pay_method, pay_methods]);

    useEffect(() => {
        return () => {
            Keyboard.removeAllListeners('keyboardDidHide');
        };
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({android: 'height', ios: 'padding'})}
            keyboardVerticalOffset={deltaHeight}
            style={[styles.container]}>
            {showMask && (
                <Mask
                    onClick={() => {
                        Picker.hide();
                        setShowMask(false);
                    }}
                />
            )}
            {Object.keys(data).length > 0 ? (
                <>
                    <ScrollView
                        bounces={false}
                        keyboardShouldPersistTaps="handled"
                        scrollIndicatorInsets={{right: 1}}
                        style={{flex: 1}}>
                        {sub_title ? (
                            <View style={[Style.flexRow, styles.nameBox]}>
                                <Text style={styles.title}>{sub_title}</Text>
                                <Text style={[styles.desc, styles.fundCode]}>{code}</Text>
                            </View>
                        ) : null}
                        {tip ? (
                            <View style={styles.topTips}>
                                <Image source={tips} style={styles.tipsIcon} />
                                <Text style={styles.desc}>{tip}</Text>
                            </View>
                        ) : null}
                        {money_safe ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(money_safe.url)}
                                style={[Style.flexRowCenter, styles.fundSafe]}>
                                <Image source={{uri: money_safe.icon}} style={styles.safeIcon} />
                                <Text style={[styles.desc, {marginRight: px(4), color: Colors.brandColor}]}>
                                    {money_safe.label}
                                </Text>
                                <FontAwesome color={Colors.brandColor} name="angle-right" size={16} />
                            </TouchableOpacity>
                        ) : null}
                        <InputBox
                            buy_info={buy_info}
                            errTip={errTip}
                            feeData={feeData}
                            onChange={onChange}
                            rule_button={rule_button}
                            tipLoading={tipLoading}
                            value={amount}
                        />
                        {period_info ? (
                            <FixedInvestCycle {...period_info} onChange={onChangeDate} setShowMask={setShowMask} />
                        ) : null}
                        {pay_methods?.length > 0 && (
                            <PayMethod
                                bankCardModal={bankCardModal}
                                isLarge={isLarge}
                                large_pay_show_type={large_pay_show_type}
                                large_pay_method={large_pay_method ? {...large_pay_method, large_pay_tip} : undefined}
                                pay_method={isLarge ? large_pay_method : pay_methods[bankSelectIndex]}
                                setIsLarge={setIsLarge}
                            />
                        )}
                        {ratio_detail ? (
                            <TradeDetail
                                amount={amount}
                                data={ratio_detail}
                                listRef={tradeDetailList}
                                setCanBuy={setCanBuy}
                            />
                        ) : null}
                        {fund_service ? (
                            <FundService {...fund_service} onChange={(val) => (selectFundService.current = val)} />
                        ) : null}
                        <BottomDesc />
                    </ScrollView>
                    <BankCardModal
                        data={
                            large_pay_show_type === 1 && large_pay_method
                                ? [...pay_methods, large_pay_method]
                                : pay_methods
                        }
                        initIndex={
                            route.params?.isLargeAmount && large_pay_show_type === 1 && large_pay_method
                                ? pay_methods.length
                                : null
                        }
                        onDone={(select, index) => {
                            if (select.pay_method === 'wallet' && index === pay_methods.length) {
                                setIsLarge(true);
                                setIndex(index);
                            } else {
                                setIndex(index);
                                setIsLarge(false);
                            }
                        }}
                        ref={bankCardModal}
                        select={bankSelectIndex}
                        type={add_payment_disable ? 'hidden' : ''}
                    />
                    <PasswordModal onDone={onSubmit} ref={passwordModal} />
                    <FixedButton
                        agreement={agreement_bottom}
                        containerStyle={{position: 'relative'}}
                        disabled={amount === '' || button.avail === 0 || errTip !== '' || !canBuy}
                        enableKeyboardAvoiding={false}
                        heightChange={(height) => setDeltaHeight(height)}
                        onPress={buyClick}
                        otherAgreement={agreement}
                        otherParam={{fund_codes: sale_fund_codes || code, type}}
                        suffix={agreement_bottom.agree_text}
                        title={button.text}
                    />
                </>
            ) : (
                <Loading />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topTips: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        flexDirection: 'row',
    },
    tipsIcon: {
        marginRight: px(4),
        width: px(16),
        height: px(16),
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
    fundSafe: {
        paddingVertical: px(8),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        backgroundColor: '#F1F6FF',
    },
    safeIcon: {
        marginRight: px(2),
        width: px(16),
        height: px(16),
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
    detailBox: {
        paddingVertical: Space.padding,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
    },
    checkIcon: {
        marginRight: px(8),
        width: px(16),
        height: px(16),
    },
    fundName: {
        fontSize: px(13),
        lineHeight: px(15),
        color: Colors.defaultColor,
        maxWidth: px(140),
    },
    fundCodeText: {
        marginTop: px(2),
        fontSize: Font.textSm,
        lineHeight: px(13),
        color: Colors.lightGrayColor,
        fontFamily: Font.numRegular,
    },
    percentInputBox: {
        marginRight: px(4),
        paddingRight: px(8),
        borderRadius: px(2),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
        width: px(54),
        height: px(28),
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: Colors.bgColor,
    },
    percentInput: {
        padding: 0,
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        minWidth: 2,
        textAlign: 'right',
    },
    percentUnit: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    fundAmount: {
        fontSize: px(13),
        lineHeight: px(15),
        color: Colors.lightGrayColor,
    },
    totalText: {
        fontSize: px(15),
        lineHeight: px(17),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    totalTip: {
        marginLeft: px(4),
        fontSize: Font.textSm,
        lineHeight: px(14),
        color: Colors.lightGrayColor,
        fontFamily: Font.numRegular,
    },
    totalPercentText: {
        flex: 1,
        fontSize: Font.textH1,
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    disableBox: {
        padding: Space.padding,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
    },
    errTip: {
        marginTop: px(8),
        fontSize: Font.textSm,
        lineHeight: px(14),
        color: Colors.red,
        textAlign: 'right',
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
    questionOp: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        overflow: 'hidden',
    },
    questionContent: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
    },
    fixedInvestCycle: {
        marginTop: px(12),
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    serviceImg: {
        marginRight: px(12),
        borderRadius: px(4),
        width: px(110),
        height: px(92),
    },
    bodyTitle: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    priceDiscount: {
        fontSize: px(24),
        lineHeight: px(28),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
});

export default Index;
