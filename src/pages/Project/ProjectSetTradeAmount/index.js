/*
 * @Date: 2022-07-20 17:00:22
 * @Description:
 */
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Keyboard} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {deviceWidth, onlyNumber, px} from '~/utils/appUtil';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {getInfo, postDo} from './service';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BankCardModal, Modal} from '~/components/Modal';
import Toast from '~/components/Toast';
import {useSelector} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {PasswordModal} from '~/components/Password';
import Header from '~/pages/Assets/UpgradeDetail/Header';
import RenderHtml from '~/components/RenderHtml';
import http from '~/services';
import RenderAutoTime from '../ProjectSetTradeModel/AutoTime';

const Index = ({route, navigation}) => {
    const isFocused = useIsFocused();
    const userInfo = useSelector((state) => state.userInfo)?.toJS?.() || {};
    const [data, setData] = useState({});
    const passwordModal = useRef();
    const [bankSelect, setBankSelect] = useState(0);
    const bankCardRef = useRef();
    const [amount, setAmount] = useState('');
    const [errTip, setErrTip] = useState('');
    const jump = useJump();
    const showRiskDisclosureRef = useRef(true);
    const riskDisclosureModalRef = useRef();
    const autoTime = useRef({});

    const getData = async () => {
        const res = await getInfo(route?.params);
        if (res?.result?.buy_info?.default_amount) {
            setAmount(res?.result?.buy_info?.default_amount);
        }
        global.LogTool('effect_jump', '', res?.result?.log_id);
        const {pop_risk_disclosure, risk_disclosure} = res.result || {};
        if (isFocused && pop_risk_disclosure && risk_disclosure && showRiskDisclosureRef.current) {
            global.LogTool('RiskAgreementWindow_Show', '', res?.result?.log_id);
            showRiskDisclosure(risk_disclosure, res?.result?.log_id);
        }
        navigation.setOptions({title: res.result?.label});
        setData(res.result);
    };

    /**
     * @description 展示风险揭示书
     * @param {any} _data 风险揭示书内容
     * @returns void
     */
    const showRiskDisclosure = (_data, log_id) => {
        showRiskDisclosureRef.current = false;
        const {poid} = route.params || {};
        Modal.show({
            children: () => {
                return (
                    <View>
                        <Text
                            style={{
                                marginTop: px(2),
                                fontSize: Font.textH2,
                                lineHeight: px(20),
                                color: Colors.red,
                                textAlign: 'center',
                            }}>
                            {_data.sub_title}
                        </Text>
                        <ScrollView
                            bounces={false}
                            style={{
                                marginVertical: Space.marginVertical,
                                paddingHorizontal: px(20),
                                maxHeight: px(352),
                            }}
                            ref={riskDisclosureModalRef}>
                            <RenderHtml
                                style={{fontSize: px(13), lineHeight: px(22), color: Colors.descColor}}
                                html={_data.content}
                            />
                        </ScrollView>
                    </View>
                );
            },
            confirmCallBack: () => {
                http.post('/advisor/action/report/20220422', {
                    action: 'read',
                    poids: [poid],
                });
                global.LogTool('RiskAgreementWindow_Click', '', log_id);
            },
            confirmText: '关闭',
            countdown: _data.countdown,
            isTouchMaskToClose: false,
            onCloseCallBack: () => navigation.goBack(),
            onCountdownChange: (val) => {
                if (+val === 1) {
                    riskDisclosureModalRef.current?.scrollToEnd?.({animated: true});
                }
            },
            title: _data.title,
        });
    };

    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
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
    useEffect(() => {
        !!data?.pay_methods && onInput(amount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bankSelect]);
    const onInput = (value) => {
        const {buy_info, pay_methods} = data;
        if (value < buy_info?.initial_amount) {
            setErrTip(`起购金额${buy_info?.initial_amount}`);
        } else if (value > pay_methods[bankSelect]?.day_limit) {
            setErrTip(`最大单日购买金额为${pay_methods[bankSelect]?.day_limit}元`);
        } else if (value >= 100000000) {
            setErrTip('金额需小于1亿');
        } else {
            setErrTip('');
        }
        setAmount(onlyNumber(value >= 100000000 ? '99999999.99' : value));
    };
    const showPassword = () => {
        global.LogTool({
            event: 'SetForm_Click',
            plate_id: data?.pay_methods[bankSelect]?.pay_method == 'wallet' ? 'B' : 'A',
            ctrl: amount,
            oid: data?.log_id,
        });
        Keyboard.dismiss();
        passwordModal.current.show();
    };
    const onSubmit = async (password) => {
        let params = {
            amount,
            pay_method: data?.pay_methods[bankSelect]?.pay_method,
            trade_method: 0,
            ...route?.params,
            password,
            ...autoTime.current,
        };
        let toast = Toast.showLoading();
        let res = await postDo(params);
        Toast.hide(toast);
        if (res.code !== '000000') {
            Toast.show(res.message);
        } else {
            navigation.dispatch((state) => {
                // Remove the home route from the stack
                const routes = state.routes.filter((r) => {
                    return r.name !== 'ProjectSetTradeModel';
                });
                return CommonActions.reset({
                    ...state,
                    routes,
                    index: routes.length - 1,
                });
            });
            if (res?.result?.url) {
                jump(
                    {
                        path: res.result?.url?.path,
                        params: {
                            ...res.result?.url?.params,
                            password,
                        },
                    },
                    'replace'
                );
            } else {
                navigation.goBack();
            }
        }
    };
    // 定投周期
    const onChangeAutoTime = (time) => {
        autoTime.current = time;
    };
    const render_bank = () => {
        const {pay_methods = []} = data;
        return (
            <View style={[Style.flexBetween, styles.bankCard]}>
                <View style={Style.flexRow}>
                    <Image
                        style={styles.bank_icon}
                        source={{
                            uri: pay_methods[bankSelect]?.bank_icon,
                        }}
                    />
                    <View>
                        <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                            {pay_methods[bankSelect]?.bank_name}
                            {pay_methods[bankSelect]?.bank_no ? (
                                <Text>({pay_methods[bankSelect]?.bank_no})</Text>
                            ) : null}
                        </Text>
                        <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                            {pay_methods[bankSelect]?.limit_desc}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => bankCardRef?.current?.show()}>
                    <Text style={{color: Colors.lightGrayColor}}>
                        切换
                        <Icon name={'right'} size={px(12)} />
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    const showFixModal = () => {
        Modal.show(
            {
                title: data?.formula_mode?.title,
                children: (
                    <View style={{padding: px(16)}}>
                        <Text style={{fontWeight: '700', fontSize: px(14), textAlign: 'center', marginBottom: px(8)}}>
                            {data?.formula_mode?.condition}
                        </Text>
                        <Text
                            style={{
                                fontSize: px(12),
                                color: Colors.lightGrayColor,
                                textAlign: 'center',
                                marginBottom: px(16),
                            }}>
                            {data?.formula_mode?.formula_mode}
                        </Text>
                        <View
                            style={{borderRadius: px(6), borderColor: '#E9EAEF', borderWidth: 0.5, overflow: 'hidden'}}>
                            <View style={{backgroundColor: '#F7F8FA', ...Style.flexRow}}>
                                {data?.formula_mode?.table_header?.map((i, index) => (
                                    <View key={index} style={styles.item}>
                                        <Text style={{fontSize: px(12), fontWeight: '700'}}>{i}</Text>
                                    </View>
                                ))}
                            </View>
                            {data?.formula_mode?.table_body?.map((item, index) => (
                                <View
                                    key={index}
                                    style={{backgroundColor: index % 2 == 0 ? '#fff' : '#F7F8FA', ...Style.flexRow}}>
                                    {item?.map((tmp, _i) => (
                                        <View key={_i} style={styles.item}>
                                            {typeof tmp == 'object' ? (
                                                <View style={Style.flexRowCenter}>
                                                    <View
                                                        style={{...styles.icon, backgroundColor: tmp?.color || '#fff'}}
                                                    />
                                                    <Text
                                                        style={{
                                                            fontSize: px(12),
                                                        }}>
                                                        {tmp.value}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text
                                                    style={{
                                                        fontSize: px(12),
                                                        color: _i == 1 ? Colors.red : Colors.defaultColor,
                                                    }}>
                                                    {tmp}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                ),
            },
            'slide'
        );
    };
    const {buy_info, money_safe, tool_info} = data;
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            {route?.params?.fr != 'signal_manage' && (
                <>
                    <View style={{height: 0.5, backgroundColor: Colors.bgColor}} />
                    {data?.upgrade ? (
                        <Header data={{base_list: data?.upgrade.base_list, target: data?.upgrade.target}} />
                    ) : (
                        <Image
                            source={require('~/assets/img/trade/setModel2.png')}
                            style={{width: deviceWidth, height: px(42)}}
                        />
                    )}
                </>
            )}
            <ScrollView style={{flex: 1}}>
                <Text style={[styles.title, {paddingLeft: px(16), paddingVertical: px(9)}]}>{data?.name}</Text>
                {money_safe ? (
                    <TouchableOpacity
                        style={{height: px(32), ...Style.flexRowCenter, backgroundColor: '#F1F6FF'}}
                        onPress={() => jump(money_safe?.url)}>
                        <Image
                            source={{uri: money_safe.icon}}
                            style={{width: px(16), height: px(16), marginRight: px(4)}}
                        />
                        <Text style={{color: Colors.btnColor, fontSize: px(12)}}>{money_safe?.label}</Text>
                        <Icon name="right" color={Colors.btnColor} size={px(12)} />
                    </TouchableOpacity>
                ) : null}
                <View style={styles.buyCon}>
                    <View style={Style.flexRow}>
                        <Text style={{fontSize: px(16), marginVertical: px(4), fontWeight: '700'}}>
                            {buy_info?.title}
                        </Text>
                        {tool_info ? (
                            <View style={[styles.nameCon]}>
                                <Image
                                    source={{uri: tool_info?.icon}}
                                    style={{marginRight: px(3), width: px(17), height: px(17)}}
                                />
                                <Text style={{fontSize: px(12)}}>{tool_info?.name}</Text>
                            </View>
                        ) : null}
                    </View>
                    <View style={styles.buyInput}>
                        <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={[styles.inputStyle, {fontFamily: `${amount}`.length > 0 ? Font.numMedium : null}]}
                            onBlur={() => {
                                global.LogTool('buy_input');
                            }}
                            placeholder={buy_info?.hidden_text}
                            placeholderTextColor={Colors.placeholderColor}
                            onChangeText={(_amount) => {
                                onInput(onlyNumber(_amount));
                            }}
                            value={`${amount}`}
                        />
                    </View>
                    {amount ? (
                        <>
                            {errTip ? (
                                <View style={styles.tip}>
                                    <Text style={{color: Colors.red}}>{errTip}</Text>
                                </View>
                            ) : data?.actual_amount ? (
                                <View style={[styles.tip, Style.flexBetween, {paddingLeft: px(3)}]}>
                                    <Text style={{fontSize: px(12), flexShrink: 1, color: Colors.defaultColor}}>
                                        实际定投金额:
                                        <Text style={{color: Colors.yellow}}>
                                            {'¥' +
                                                (amount * data?.actual_amount.min).toFixed(2) +
                                                '~¥' +
                                                (amount * data?.actual_amount.max).toFixed(2) +
                                                '元' +
                                                '（' +
                                                data?.actual_amount.min +
                                                '~' +
                                                data?.actual_amount.max +
                                                '份）'}
                                        </Text>
                                    </Text>
                                    <Text style={{color: Colors.btnColor, fontSize: px(12)}} onPress={showFixModal}>
                                        计算方式
                                    </Text>
                                </View>
                            ) : null}
                        </>
                    ) : null}
                    {!!data?.notice_for_follow && (
                        <View
                            style={{
                                paddingVertical: px(12),
                                paddingLeft: px(2),
                                ...styles.tip,
                                height: 'auto',
                            }}>
                            <RenderHtml style={styles.text} html={data?.notice_for_follow} />
                        </View>
                    )}
                </View>
                {data?.period_info && (
                    <RenderAutoTime
                        initalData={data?.period_info}
                        onChangeAutoTime={onChangeAutoTime}
                        style={{marginBottom: px(12), paddingHorizontal: px(16)}}
                    />
                )}
                {render_bank()}
                <BottomDesc />
            </ScrollView>
            <BankCardModal
                data={data?.pay_methods || []}
                select={bankSelect}
                ref={bankCardRef}
                onDone={(select, index) => {
                    setBankSelect(index);
                }}
            />
            <PasswordModal onDone={onSubmit} ref={passwordModal} />
            {data?.button && (
                <FixedButton
                    containerStyle={{position: 'relative'}}
                    title={data?.button?.text}
                    agreement={data?.agreement_bottom ? data?.agreement_bottom : undefined}
                    otherAgreement={data?.agreement}
                    suffix={data?.agreement_bottom?.agree_text}
                    disabled={data?.button?.avail != 1 || !!errTip || !amount}
                    onPress={showPassword}
                />
            )}
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    buyCon: {
        backgroundColor: '#fff',
        marginBottom: px(12),
        paddingTop: px(15),
        paddingHorizontal: px(15),
    },
    buyInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(20),
        paddingBottom: px(12),
    },
    inputStyle: {
        flex: 1,
        fontSize: px(30),
        marginLeft: px(14),
        letterSpacing: 2,
        padding: 0,
    },
    tip: {
        height: px(40),
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderColor: '#E2E4EA',
    },
    bankCard: {
        backgroundColor: '#fff',
        paddingVertical: px(12),
        paddingHorizontal: px(14),
    },
    bank_icon: {
        width: px(28),
        height: px(28),
        marginRight: px(9),
    },
    text: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(17),
    },
    item: {
        ...Style.flexCenter,
        width: px(114),
        height: px(44),
        borderColor: '#E9EAEF',
        borderRightWidth: 0.5,
    },
    icon: {
        width: px(8),
        height: px(8),
        marginRight: px(2),
    },
    nameCon: {
        backgroundColor: Colors.bgColor,
        ...Style.flexRow,
        borderRadius: px(287),
        padding: px(4),
        flexShrink: 1,
        marginLeft: px(4),
        width: px(80),
    },
});
