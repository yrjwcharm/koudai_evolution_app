/*
 * @Date: 2022/10/10 09:48
 * @Author: yanruifeng
 * @Description: 定投管理
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {deviceWidth, px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {BoxShadow} from 'react-native-shadow';
import BottomDesc from '../../../components/BottomDesc';
import {FixedButton} from '../../../components/Button';

const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.102,
    x: 0,
    y: 1,
    style: {
        position: 'relative',
        left: px(16),
    },
};
const {width} = Dimensions.get('window');
const AutomaticInvestManage = ({navigation}) => {
    const [data, setData] = useState({
        label: '',
    });
    const [tabList, setTabList] = useState([
        {label: '全部', checked: true},
        {label: '公募基金', checked: false},
        {label: '投顾组合', checked: false},
        {label: '理财计划', checked: false},
        {label: '私募基金', checked: false},
    ]);
    const selTab = (item) => {
        tabList.map((_item) => {
            _item.checked = false;
            if (JSON.stringify(_item) == JSON.stringify(item)) {
                _item.checked = true;
            }
        });
        setTabList([...tabList]);
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageBackground style={{width, height: px(120)}} source={require('./assets/lineargradient.png')}>
                    <View style={styles.automaticInvestDaysView}>
                        <Text style={styles.prevText}>您已坚持定投</Text>
                        <View style={styles.dayView}>
                            <Text style={styles.dayText}>8</Text>
                        </View>
                        <View style={styles.dayView}>
                            <Text style={styles.dayText}>8</Text>
                        </View>
                        <View style={styles.dayView}>
                            <Text style={styles.dayText}>8</Text>
                        </View>
                        <Text style={[styles.nextText, {marginRight: px(9)}]}>天</Text>
                        <ImageBackground style={{width: px(51), height: px(17)}} source={require('./assets/label.png')}>
                            <View style={styles.labelView}>
                                <Text style={styles.label}>定投达人</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </ImageBackground>
                <View style={styles.autoInvestWrap}>
                    <ImageBackground source={require('./assets/rect.png')} style={styles.autoInvest}>
                        <View style={styles.investWrap}>
                            <View style={styles.investView}>
                                <View style={styles.itemWrap}>
                                    <Text style={styles.investValue}>15,000.00</Text>
                                    <Text style={styles.investLabel}>月定投(元)</Text>
                                </View>
                                <View style={styles.itemWrap}>
                                    <Text style={styles.investValue}>2</Text>
                                    <Text style={styles.investLabel}>定投数量(个)</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
            <View style={styles.scrollTab}>
                {tabList.map((el, index) => {
                    return (
                        <TouchableOpacity onPress={() => selTab(el)}>
                            <View
                                key={el}
                                style={[styles.defaultTab, {backgroundColor: el.checked ? '#DEE8FF' : '#FFFFFF'}]}>
                                <Text
                                    style={[
                                        styles.defaultTabText,
                                        {color: el.checked ? Colors.brandColor : Colors.defaultColor},
                                    ]}>
                                    {el.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(37)}}>
                <View style={styles.sortChoiceView}>
                    <View style={styles.sortChoiceWrap}>
                        <Text style={styles.sortText}>名称/每期定投(元)</Text>
                        <View style={styles.investIssure}>
                            <Text style={styles.sortText}>已投期数(期)</Text>
                            <Image source={require('./assets/asc.png')} />
                        </View>
                        <View style={styles.totalSort}>
                            <Text style={styles.sortText}>累计定投(元)</Text>
                            <Image source={require('./assets/asc.png')} />
                        </View>
                    </View>
                </View>
            </BoxShadow>
            <View style={{marginTop: px(8)}}>
                <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(111)}}>
                    <View style={[styles.listRowWrap]}>
                        <View style={styles.listRowTopView}>
                            <View style={styles.listRowTopWrap}>
                                <View style={[styles.status, {backgroundColor: '#EDF7EC'}]}>
                                    <Text style={[styles.statusText, {color: Colors.green}]}>定投中</Text>
                                </View>
                                <View style={styles.top}>
                                    <View style={styles.topView}>
                                        <Text style={styles.type}>基金</Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.invest_num,
                                            {
                                                fontSize: px(12),
                                                marginLeft: px(8),
                                                fontWeight: 'normal',
                                                fontFamily: 'PingFang SC-中黑体, PingFang SC',
                                            },
                                        ]}>
                                        中欧价值发现混合A
                                    </Text>
                                </View>
                                <View style={[styles.bottom, {marginTop: px(11)}]}>
                                    <View style={styles.bottomWrap}>
                                        <View style={Style.flexRow}>
                                            <Text style={styles.autoInvestIssure}>月定投</Text>
                                            <Text
                                                style={[
                                                    styles.invest_num,
                                                    {fontSize: px(14), fontWeight: '500', fontFamily: Font.numMedium},
                                                ]}>
                                                5,000.00
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.invest_num,
                                                {fontSize: px(14), fontWeight: '500', fontFamily: Font.numMedium},
                                            ]}>
                                            463
                                        </Text>
                                        <Text
                                            style={[
                                                styles.invest_num,
                                                {fontSize: px(14), fontWeight: '500', fontFamily: Font.numMedium},
                                            ]}>
                                            315,000.00
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.listRowBottomView}>
                            <Text style={styles.desc}>2022-09-25(星期一)将从招商银行(尾号8888)扣款5,000元</Text>
                        </View>
                    </View>
                </BoxShadow>
            </View>
            <View style={{marginTop: px(12), ...Style.flexCenter}}>
                <View style={Style.flexRow}>
                    <Text style={styles.termintal}>查看已终止的定投(3)</Text>
                    <Image source={require('./assets/more.png')} />
                </View>
            </View>
            <View style={{backgroundColor: '#f5f6f8'}}>
                <BottomDesc />
            </View>
            {Object.keys(data).length > 0 ? <FixedButton title="新建定投" onPress={() => {}} /> : null}
        </View>
    );
};
export default AutomaticInvestManage;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    termintal: {
        fontSize: px(12),
        marginRight: px(5),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        color: '#545968',
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
    statusText: {
        fontSize: px(10),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
    },
    autoInvestIssure: {
        marginRight: px(6),
        fontSize: px(10),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    listRowWrap: {
        // marginHorizontal: px(16),
        backgroundColor: Colors.white,
        paddingHorizontal: px(16),
        borderRadius: px(6),
    },
    invest_num: {
        color: Colors.defaultColor,
    },
    type: {
        fontSize: px(10),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    listRowTopWrap: {
        position: 'relative',
    },

    listRowTopView: {
        height: px(70),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E9EAEF',
        borderStyle: 'solid',
    },
    listRowBottomView: {
        height: px(40),
        justifyContent: 'center',
    },
    desc: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        fontWeight: '400',
        color: Colors.lightGrayColor,
    },
    sortText: {
        fontSize: px(11),
        marginRight: px(2),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    totalSort: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortChoiceView: {
        backgroundColor: '#fff',
        paddingHorizontal: px(12),
        // marginHorizontal: px(16),
        borderRadius: px(6),
        height: px(37),
        justifyContent: 'center',
    },
    investIssure: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortChoiceWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    defaultTab: {
        marginRight: px(5),
        paddingHorizontal: px(12),
        paddingVertical: px(6),
        borderRadius: px(20),
    },
    defaultTabText: {
        fontSize: px(11),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    activeTabText: {},
    scrollTab: {
        flexDirection: 'row',
        marginLeft: px(16),
        marginTop: px(28),
        marginBottom: px(12),
    },
    itemWrap: {
        alignItems: 'center',
    },
    investWrap: {
        height: px(70),
        paddingHorizontal: px(61),
        justifyContent: 'center',
    },
    investView: {
        ...Style.flexBetween,
    },
    investLabel: {
        marginTop: px(4),
        fontSize: px(11),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    investValue: {
        fontSize: px(16),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.defaultColor,
    },
    autoInvestWrap: {
        flexDirection: 'row',
        position: 'absolute',
        top: px(62),
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    bottomWrap: {
        ...Style.flexBetween,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topView: {
        borderStyle: 'solid',
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: Colors.white,
        borderRadius: px(2),
        width: px(28),
        height: px(13),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#BDC2CC',
    },
    autoInvest: {
        width: deviceWidth - px(32),
        height: px(70),
    },
    header: {},
    automaticInvestDaysView: {
        marginLeft: px(16),
        marginTop: px(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: px(10),
        fontFamily: 'PingFang SC-中粗体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.white,
    },
    prevText: {
        fontSize: px(16),
        marginRight: px(1),
        fontFamily: 'PingFang SC-中黑体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.white,
    },
    nextText: {
        marginLeft: px(4),
        fontSize: px(16),
        fontFamily: 'PingFang SC-中黑体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.white,
        marginRight: px(9),
    },
    dayView: {
        width: px(15),
        marginLeft: px(3),
        alignItems: 'center',
        justifyContent: 'center',
        height: px(22),
        backgroundColor: '#F1F6FF',
        borderRadius: px(2),
    },
    dayText: {
        fontSize: px(16),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: '#3978F6',
    },
    labelView: {
        position: 'relative',
        left: px(6),
    },
});
