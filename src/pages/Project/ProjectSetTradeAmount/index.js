/*
 * @Date: 2022-07-20 17:00:22
 * @Description:
 */
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Image, TextInput, Keyboard} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {deviceWidth, onlyNumber, px} from '~/utils/appUtil';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {getInfo, postDo} from './service';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BankCardModal, Modal} from '~/components/Modal';
import Toast from '~/components/Toast';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {PasswordModal} from '~/components/Password';

const Index = ({route, navigation}) => {
    const poid = route?.params?.poid || 1;
    const project_id = route?.params?.project_id || 'X04F926077';
    const userInfo = useSelector((state) => state.userInfo)?.toJS?.() || {};
    const [data, setData] = useState({});
    const passwordModal = useRef();
    const [bankSelect, setBankSelect] = useState(0);
    const bankCardRef = useRef();
    const [amount, setAmount] = useState('');
    const [btnClick, setBtnClick] = useState(true);
    const [errTip, setErrTip] = useState('');
    const jump = useJump();
    const actual_amount = {
        max: 1.5,
        min: 0.5,
        text: '实际定投金额',
    };
    const getData = async () => {
        let res = await getInfo({poid, project_id});
        setData(res.result);
    };
    const showFixModal = () => {
        Modal.show(
            {
                title: '定投计算方式',
                children: (
                    <FastImage
                        source={require('~/assets/img/common/fixIcon.png')}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{width: px(322), height: px(251), marginLeft: (deviceWidth - px(322)) / 2}}
                    />
                ),
            },
            'slide'
        );
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
    const onInput = (value) => {
        const {buy_info, pay_methods} = data;
        if (value < buy_info?.initial_amount) {
            setErrTip(`起购金额${buy_info?.initial_amount}`);
        } else if (value > pay_methods[bankSelect]?.day_limit) {
            setErrTip(`最大单笔购买金额为${pay_methods[bankSelect]?.day_limit}元`);
        } else if (value >= 100000000) {
            setErrTip('金额需小于1亿');
        } else {
            setErrTip('');
        }
        setAmount(onlyNumber(value >= 100000000 ? '99999999.99' : value));
    };
    const showPassword = () => {
        Keyboard.dismiss();
        passwordModal.current.show();
    };
    const onSubmit = async (password) => {
        let params = {
            password,
            amount,
            pay_method: data?.pay_methods[bankSelect]?.pay_method,
            ...route?.params,
        };
        console.log(params);
        let res = await postDo(params);
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
    const {buy_info, money_safe} = data;
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <View style={{height: 0.5, backgroundColor: Colors.bgColor}} />
            <Image source={require('~/assets/img/trade/setModel2.png')} style={{width: deviceWidth, height: px(42)}} />
            <ScrollView style={{flex: 1}}>
                <Text style={[styles.title, {paddingLeft: px(16), paddingVertical: px(9)}]}>{data?.name}</Text>
                {money_safe ? (
                    <TouchableOpacity
                        style={{height: px(32), ...Style.flexRowCenter, backgroundColor: '#F1F6FF'}}
                        onPress={() => jump(money_safe?.url)}>
                        <Image source={{uri: money_safe.icon}} style={{width: px(16), height: px(16)}} />
                        <Text style={{color: Colors.btnColor, fontSize: px(12)}}>{money_safe?.label}</Text>
                        <Icon name="right" color={Colors.btnColor} size={px(12)} />
                    </TouchableOpacity>
                ) : null}
                <View style={styles.buyCon}>
                    <Text style={{fontSize: px(16), marginVertical: px(4), fontWeight: '700'}}>{buy_info?.title}</Text>
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
                        {/* {`${amount}`.length > 0 && (
                            <TouchableOpacity onPress={this.clearInput}>
                                <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                            </TouchableOpacity>
                        )} */}
                    </View>
                    {amount ? (
                        <>
                            {errTip ? (
                                <View style={styles.tip}>
                                    <Text style={{color: Colors.red}}>{errTip}</Text>
                                </View>
                            ) : data?.actual_amount ? (
                                <View style={[styles.tip, Style.flexBetween, {paddingLeft: px(3)}]}>
                                    <Text style={{fontSize: px(12), flexShrink: 1}} numberOfLines={1}>
                                        实际定投金额:
                                        <Text style={{color: Colors.yellow}}>
                                            {'¥' +
                                                amount * data?.actual_amount.min +
                                                '~¥' +
                                                amount * data?.actual_amount.max +
                                                '元'}
                                        </Text>
                                    </Text>
                                    <Text style={{color: Colors.btnColor, fontSize: px(12)}} onPress={showFixModal}>
                                        计算方式
                                    </Text>
                                </View>
                            ) : null}
                        </>
                    ) : null}
                </View>
                {render_bank()}
                <BottomDesc />
            </ScrollView>
            <BankCardModal
                data={data?.pay_methods || []}
                select={bankSelect}
                ref={bankCardRef}
                onDone={(select, index) => {
                    // this.setState(
                    //     (prev) => {
                    //         if (prev.bankSelect?.pay_method !== select?.pay_method) {
                    //             if (select?.pop_risk_disclosure) {
                    //                 setTimeout(() => {
                    //                     this.showRiskDisclosure(prev.data);
                    //                 }, 300);
                    //             }
                    //         }
                    //         return {bankSelect: select, bankSelectIndex: index};
                    //     },
                    //     () => {
                    //         if (!this.state.isLargeAmount) {
                    //             this.onInput(this.state.amount);
                    //         }
                    //     }
                    // );
                }}
            />
            <PasswordModal onDone={onSubmit} ref={passwordModal} />
            {data?.button && (
                <FixedButton
                    style={{position: 'relative'}}
                    title={data?.button?.text}
                    agreement={data?.agreement_bottom ? data?.agreement_bottom : undefined}
                    otherAgreement={data?.agreement}
                    suffix={data?.agreement_bottom?.agree_text}
                    disabled={data?.button?.avail != 1 || !!errTip}
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
        fontSize: px(35),
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
});
