/*
 * @Date: 2022/10/11 14:16
 * @Author: yanruifeng
 * @Description: 定投详情新页面
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {deviceWidth, px} from '../../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import {Modal, SelectModal} from '../../../components/Modal';
import {enterToReadCardPage} from '../../CreateAccount/Account/TokenCloudBridge';
import {useJump} from '../../../components/hooks';
import {callFixedInvestDetailApi} from './services';
const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.102,
    x: 0,
    y: 2,
};

const FixedInvestDetail = ({navigation, r}) => {
    const jump = useJump();
    const [visible, setVisible] = useState(false);
    const [selectData] = useState(['修改', '暂停', '终止']);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => {
                            setVisible(true);
                        }}>
                        <Text style={styles.title}>管理</Text>
                    </TouchableOpacity>
                </>
            ),
        });
    }, []);
    const initData = async () => {
        const res = await callFixedInvestDetailApi({});
    };
    useEffect(() => {}, []);
    return (
        <View style={styles.container}>
            {/*定投*/}
            <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(123)}}>
                <View style={styles.investHeader}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerTopWrap}>
                            <View style={Style.flexBetween}>
                                <Text style={styles.fundName}>中欧价值发现混合A</Text>
                                <Text style={styles.detail}>详情</Text>
                            </View>
                            <Text style={styles.fundCode}>000888</Text>
                        </View>
                    </View>
                    <View style={styles.headerBottom}>
                        <View style={styles.headerBottomWrap}>
                            <View style={styles.headerBottomWrapItem}>
                                <Text style={styles.itemValue}>5,000.00</Text>
                                <Text style={styles.itemLabel}>每期定投(元)</Text>
                            </View>
                            <View style={styles.headerBottomWrapItem}>
                                <Text style={styles.itemValue}>3</Text>
                                <Text style={styles.itemLabel}>已投期数</Text>
                            </View>
                            <View style={styles.headerBottomWrapItem}>
                                <Text style={styles.itemValue}>15,000.00</Text>
                                <Text style={styles.itemLabel}>累计定投(元)</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </BoxShadow>
            <View style={{marginTop: px(12)}}>
                <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(156)}}>
                    <View style={styles.section}>
                        <View style={[styles.status, {backgroundColor: '#EDF7EC'}]}>
                            <Text style={[styles.statusText, {color: Colors.green}]}>定投中</Text>
                        </View>
                        <Text style={styles.title}>定投</Text>
                        <View style={styles.bankcard}>
                            <Image resizeMode={'cover'} source={require('./assets/logo.png')} />
                            <View style={{marginLeft: px(8)}}>
                                <Text style={styles.card}>招商银行 (尾号8888)</Text>
                                <Text style={[styles.transfer, {marginTop: px(2)}]}>
                                    单笔限额:10万，单日限额：100万
                                </Text>
                                <Text style={[styles.schedule, {marginTop: px(12)}]}>每月10日 定投5,000.00元</Text>
                            </View>
                        </View>
                        <View style={{height: px(41), justifyContent: 'center'}}>
                            <View style={Style.flexRow}>
                                <Text style={styles.redText}>2022-09-10(星期一)</Text>
                                <Text style={styles.blackText}>将扣款</Text>
                                <Text style={styles.redText}>5,000元</Text>
                                <Text style={styles.blackText}>,请保持账户资金充足</Text>
                            </View>
                        </View>
                    </View>
                </BoxShadow>
            </View>
            <View style={styles.footer}>
                <View>
                    <Text style={styles.listRowTitle}>定投记录(5)</Text>
                </View>
                <View style={Style.flexBetween}>
                    <Text style={styles.rowTitle}>日期</Text>
                    <Text style={styles.rowTitle}>金额(元)</Text>
                    <Text style={styles.rowTitle}>交易状态</Text>
                </View>
                <View style={[Style.flexRow, {marginTop: px(12)}]}>
                    <View style={{width: '38.5%'}}>
                        <Text style={styles.date}>2022-02-10</Text>
                    </View>
                    <View style={{width: '38.5%'}}>
                        <Text style={styles.money}>5,000.00</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center'}}>
                        {/*<Text style={styles.investStatus}>定投成功</Text>*/}
                        <View>
                            <Text style={[styles.investFail, {textAlign: 'right'}]}>定投失败</Text>
                            <Text style={styles.failReason}>银行卡余额不足</Text>
                        </View>
                        <Image source={require('./assets/more.png')} />
                    </View>
                </View>
            </View>
            <SelectModal
                style={{borderTopRightRadius: px(10), borderTopLeftRadius: px(10)}}
                callback={(index) => {
                    if (index === 0) {
                        navigation.navigate('UpdateAutomaticInvest');
                    } else if (index === 1) {
                    } else if (index === 2) {
                        Modal.show({
                            title: '终止确认',
                            confirm: true,
                            cancelText: '仍要终止',
                            confirmCallBack: () => {},
                            confirmText: '在坚持一下',
                            content: `定投是以不同的持有成本买入，持续投入可起到摊平成本，分散风险的作用，贵在坚持！`,
                        });
                    }
                }}
                closeModal={() => setVisible(false)}
                entityList={selectData}
                show={visible}
            />
        </View>
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
        fontFamily: Font.pingFangMedium,
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
