/*
 * @Date: 2022/10/11 14:00
 * @Author: yanruifeng
 * @Description: 渲染列表
 */
import React from 'react';
import PropTypes from 'prop-types';
import {deviceWidth, px, isEmpty} from '../../../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import {useNavigation} from '@react-navigation/native';
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
const RenderItem = ({item, index}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={{marginTop: px(8)}}
            key={item + `` + index}
            onPress={() => navigation.navigate('AutomaticInvestDetail')}>
            <View>
                <BoxShadow
                    setting={{
                        ...shadow,
                        width: deviceWidth - px(32),
                        height: !isEmpty(item.detail) ? px(111) : px(70),
                    }}>
                    <View style={[styles.listRowWrap]}>
                        <View
                            style={[
                                styles.status,
                                {
                                    backgroundColor:
                                        item.status == '定投中'
                                            ? '#EDF7EC'
                                            : item.status == '已暂停'
                                            ? '#FDEFE4'
                                            : '#E9EAEF',
                                },
                            ]}>
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            item.status == '定投中'
                                                ? Colors.green
                                                : item.status == '已暂停'
                                                ? '#FF7D41'
                                                : Colors.lightGrayColor,
                                    },
                                ]}>
                                {item.status}
                            </Text>
                        </View>
                        <View style={styles.listRowTopView}>
                            <View style={styles.listRowTopWrap}>
                                <View style={styles.top}>
                                    <View style={styles.topView}>
                                        <Text style={styles.type}>{item.type}</Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.invest_num,
                                            {
                                                fontSize: px(12),
                                                marginLeft: px(8),
                                                fontWeight: 'normal',
                                                fontFamily: Font.pingFangMedium,
                                            },
                                        ]}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={[styles.bottom, {marginTop: px(11)}]}>
                                    <View style={styles.bottomWrap}>
                                        <View style={Style.flexRow}>
                                            <Text style={styles.autoInvestIssure}>{item.unit}</Text>
                                            <Text
                                                style={[
                                                    styles.invest_num,
                                                    {
                                                        fontSize: px(14),
                                                        fontWeight: '500',
                                                        fontFamily: Font.numMedium,
                                                    },
                                                ]}>
                                                {item.values}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.invest_num,
                                                {
                                                    fontSize: px(14),
                                                    fontWeight: '500',
                                                    fontFamily: Font.numMedium,
                                                },
                                            ]}>
                                            {item.times}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.invest_num,
                                                {
                                                    fontSize: px(14),
                                                    fontWeight: '500',
                                                    fontFamily: Font.numMedium,
                                                },
                                            ]}>
                                            {item.sum}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {!isEmpty(item.detail) && (
                            <View style={styles.listRowBottomView}>
                                <Text style={styles.desc}>{item.detail}</Text>
                            </View>
                        )}
                    </View>
                </BoxShadow>
            </View>
        </TouchableOpacity>
    );
};

RenderItem.propTypes = {};

export default RenderItem;
const styles = StyleSheet.create({
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
    top: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.white,
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
    desc: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        fontWeight: '400',
        color: Colors.lightGrayColor,
    },
    statusText: {
        fontSize: px(10),
        fontFamily: Font.pingFangRegular,
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
        fontFamily: Font.pingFangRegular,
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
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E9EAEF',
        borderStyle: 'solid',
        height: px(40),
        justifyContent: 'center',
    },
});
