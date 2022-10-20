/*
 * @Date: 2022/10/11 14:16
 * @Author: yanruifeng
 * @Description: 定投详情新页面
 */

import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {deviceWidth, isEmpty, px} from '../../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import {Modal, SelectModal} from '../../../components/Modal';
import {useDispatch, useSelector} from 'react-redux';
import {callFixedInvestDetailApi, executePauseFixedInvestApi, executeStopFixedInvestApi} from './services';
import {useJump} from '../../../components/hooks';
import Loading from '../../Portfolio/components/PageLoading';
import {PasswordModal} from '../../../components/Password';
import Http from '../../../services';
import Toast from '../../../components/Toast';
const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.102,
    x: 0,
    y: 2,
};

const FixedInvestDetail = ({navigation, route}) => {
    const {invest_plan_id: plan_id = ''} = route?.params;
    const [type, setType] = useState();
    const jump = useJump();
    const passwordModal = useRef(null);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        loading: true,
        btn_list: [],
        pay_info: {},
        records: {},
    });
    const [visible, setVisible] = useState(false);
    const res = useSelector((state) => state.fixedInvest.fixedInvestDetail);
    const selectData = useRef(['修改', '暂停', '终止']);
    const handleClick = (t) => {
        setType(t);
        passwordModal?.current?.show();
    };
    useEffect(() => {
        (async () => {
            dispatch(callFixedInvestDetailApi({plan_id}));
            if (res.code === '000000') {
                const {
                    title = '',
                    header = {},
                    pay_info = {},
                    records = {},
                    manage_list: {btn_list = [], text},
                } = res.result || {};
                navigation.setOptions({
                    title,
                    headerRight: () => (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.topRightBtn, Style.flexCenter]}
                                onPress={() => {
                                    setVisible(true);
                                }}>
                                <Text style={styles.title}>{text}</Text>
                            </TouchableOpacity>
                        </>
                    ),
                });
                setState({
                    header,
                    pay_info,
                    records,
                    btn_list,
                    loading: false,
                });
            }
        })();
    }, []);
    const submit = async (password) => {
        const loading = Toast.showLoading();
        let range = ['recover', 'pause', 'terminate'];
        if (range.includes('pause') || range.includes('recover')) {
            const res = await executeStopFixedInvestApi({
                plan_id,
                password,
                type: type == 'pause' ? 20 : 30,
            });
            if (res.code === '000001') {
                Toast.hide(loading);
                let timer = setTimeout(() => {
                    Toast.show(res.message);
                    timer && clearTimeout(timer);
                }, 500);
            }
        } else {
            Http.get('/trade/stop/invest_plan/20210101', {
                invest_id: plan_id,
                password,
            }).then((res) => {
                Toast.show(res.message);
                if (res.code == '000000') {
                }
            });
        }
    };
    return (
        <>
            {state.loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={styles.container}>
                    {/*定投*/}
                    <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(123)}}>
                        <View style={styles.investHeader}>
                            <View style={styles.headerTop}>
                                <View style={styles.headerTopWrap}>
                                    <View style={Style.flexBetween}>
                                        <Text style={styles.fundName}>{state.header?.name}</Text>
                                        <TouchableOpacity onPress={() => jump(state.header?.url?.url)}>
                                            <Text style={styles.detail}>{state.header?.url?.text}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {!isEmpty(state.header?.code) && (
                                        <Text style={styles.fundCode}>{state.header?.code}</Text>
                                    )}
                                </View>
                            </View>
                            <View style={styles.headerBottom}>
                                <View style={styles.headerBottomWrap}>
                                    <View style={styles.headerBottomWrapItem}>
                                        <Text style={styles.itemValue}>{state.header?.head_list[0]?.value}</Text>
                                        <Text style={styles.itemLabel}>{state.header?.head_list[0]?.text}</Text>
                                    </View>
                                    <View style={styles.headerBottomWrapItem}>
                                        <Text style={styles.itemValue}>{state.header?.head_list[1]?.value}</Text>
                                        <Text style={styles.itemLabel}>{state.header?.head_list[1]?.text}</Text>
                                    </View>
                                    <View style={styles.headerBottomWrapItem}>
                                        <Text style={styles.itemValue}>{state.header?.head_list[2]?.value}</Text>
                                        <Text style={styles.itemLabel}>{state.header?.head_list[2]?.text}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </BoxShadow>
                    <View style={{marginTop: px(12)}}>
                        <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(156)}}>
                            <View style={styles.section}>
                                <View
                                    style={[
                                        styles.status,
                                        {
                                            backgroundColor:
                                                state.pay_info?.status == '定投中'
                                                    ? '#EDF7EC'
                                                    : state.pay_info?.status == '已暂停'
                                                    ? '#FDEFE4'
                                                    : '#E9EAEF',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color:
                                                    state.pay_info?.status == '定投中'
                                                        ? Colors.green
                                                        : state.pay_info?.status == '已暂停'
                                                        ? '#FF7D41'
                                                        : Colors.lightGrayColor,
                                            },
                                        ]}>
                                        {state.pay_info?.status}
                                    </Text>
                                </View>
                                <Text style={styles.title}>{state.pay_info?.title}</Text>
                                <View style={styles.bankcard}>
                                    <Image
                                        resizeMode={'cover'}
                                        style={{width: px(25), height: px(27)}}
                                        source={{uri: state.pay_info?.bank_icon}}
                                    />
                                    <View style={{marginLeft: px(8)}}>
                                        <Text style={styles.card}>{state.pay_info?.bank_name}</Text>
                                        {!isEmpty(state.pay_info?.limit_desc) && (
                                            <Text style={[styles.transfer, {marginTop: px(2)}]}>
                                                {state.pay_info?.limit_desc}
                                            </Text>
                                        )}
                                        <Text style={[styles.schedule, {marginTop: px(12)}]}>
                                            {state.pay_info?.text}
                                        </Text>
                                    </View>
                                </View>
                                {!isEmpty(state.pay_info?.remind) && (
                                    <View style={{height: px(41), justifyContent: 'center'}}>
                                        <View style={Style.flexRow}>
                                            <Text style={styles.redText}>
                                                {state.pay_info?.remind.substring(
                                                    0,
                                                    state.pay_info?.remind.indexOf('）') + 1
                                                )}
                                            </Text>
                                            <Text style={styles.blackText}>将扣款</Text>
                                            <Text style={styles.redText}>
                                                {state.pay_info?.remind.substring(
                                                    state.pay_info?.remind.indexOf('款') + 1,
                                                    state.pay_info?.remind.lastIndexOf('元')
                                                )}
                                                元
                                            </Text>
                                            <Text style={styles.blackText}>,请保持账户资金充足</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </BoxShadow>
                    </View>
                    {state.records?.data_list?.length > 0 && (
                        <View style={styles.footer}>
                            <View>
                                <Text style={styles.listRowTitle}>{state.records?.title}</Text>
                            </View>
                            <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                                <Text style={styles.rowTitle}>日期</Text>
                                <Text style={styles.rowTitle}>金额(元)</Text>
                                <Text style={styles.rowTitle}>交易状态</Text>
                            </View>
                            {state.records?.data_list?.map((item, index) => {
                                return (
                                    <View key={item + '' + index} style={[Style.flexRow, {marginTop: px(12)}]}>
                                        <View style={{width: '38.5%'}}>
                                            <Text style={styles.date}>{item.date}</Text>
                                        </View>
                                        <View style={{width: '38.5%'}}>
                                            <Text style={styles.money}>{item.value}</Text>
                                        </View>
                                        <View style={{width: '23%', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                            <View style={Style.flexRow}>
                                                <View>
                                                    {/*<Text style={styles.investStatus}>定投成功</Text>*/}
                                                    <Text style={[styles.investFail, {textAlign: 'right'}]}>
                                                        {item.status}
                                                    </Text>
                                                    {/*<Text style={styles.failReason}>银行卡余额不足</Text>*/}
                                                </View>
                                                <Image
                                                    source={require('./assets/more.png')}
                                                    style={{marginLeft: px(4)}}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                    <PasswordModal ref={passwordModal} onDone={submit} />

                    <SelectModal
                        style={{borderTopRightRadius: px(10), borderTopLeftRadius: px(10)}}
                        callback={(index) => {
                            if (index === 0) {
                                jump(state.btn_list[index]?.url);
                            } else if (index === 1) {
                                handleClick(state.pay_info?.status == '已暂停' ? 'recover' : 'pause');
                            } else if (index === 2) {
                                const {
                                    popup: {title, content, confirm, cancel, back_close, touch_close},
                                } = state.btn_list[index];
                                Modal.show({
                                    title,
                                    confirm: true,
                                    isTouchMaskToClose: back_close,
                                    backButtonClose: touch_close,
                                    cancelText: cancel.text,
                                    confirmCallBack: () => {
                                        handleClick('terminate');
                                    },
                                    confirmText: confirm.text,
                                    content,
                                });
                            }
                        }}
                        closeModal={() => setVisible(false)}
                        entityList={selectData.current}
                        show={visible}
                    />
                </View>
            )}
        </>
    );
};

export default FixedInvestDetail;
const styles = StyleSheet.create({
    failReason: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightGrayColor,
    },
    investFail: {
        fontSize: px(12),
        marginTop: px(1),
        fontFamily: Font.pingFangRegular,
        color: Colors.red,
    },
    money: {
        fontSize: px(13),
        fontFamily: Font.numRegular,
        color: Colors.lightBlackColor,
    },
    investStatus: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightBlackColor,
    },
    container: {
        marginHorizontal: px(16),
        marginTop: px(12),
        backgroundColor: Colors.bgColor,
    },
    rowTitle: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: '#8F95A4',
    },
    listRowTitle: {
        fontSize: px(13),
        fontFamily: Font.pingFangMedium,
        color: Colors.defaultColor,
    },
    listRowHeader: {},
    footer: {
        marginTop: px(12),
        borderRadius: px(6),
        paddingTop: px(12),
        paddingBottom: px(18),
        paddingHorizontal: px(16),
        backgroundColor: Colors.white,
    },
    statusText: {
        fontSize: px(10),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
    },
    status: {
        position: 'absolute',
        right: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: px(46),
        height: px(19),
        borderTopRightRadius: px(6),
    },
    redText: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.red,
    },
    blackText: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightBlackColor,
    },
    bankcard: {
        borderBottomColor: '#E9EAEF',
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        paddingBottom: px(11),
        marginTop: px(10),
    },
    schedule: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    card: {
        fontSize: px(13),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    transfer: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    section: {
        position: 'relative',
        height: px(156),
        paddingTop: px(12),
        paddingHorizontal: px(16),
        borderRadius: px(6),
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    investHeader: {
        paddingHorizontal: px(16),
        backgroundColor: Colors.white,
        borderRadius: px(6),
    },
    headerTop: {
        height: px(59),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderBottomColor: '#E9EAEF',
    },
    headerTopWrap: {},
    fundName: {
        fontSize: px(14),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    fundCode: {
        fontSize: px(11),
        marginTop: px(4),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightBlackColor,
    },
    detail: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        color: '#0051CC',
        fontWeight: 'normal',
    },
    headerBottom: {
        height: px(64),
        justifyContent: 'center',
    },
    headerBottomWrap: {
        ...Style.flexBetween,
    },
    headerBottomWrapItem: {
        alignItems: 'center',
    },
    itemValue: {
        fontSize: px(14),
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    itemLabel: {
        marginTop: px(4),
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightGrayColor,
    },
    topRightBtn: {
        flex: 1,
        marginRight: Space.marginAlign,
    },
});
