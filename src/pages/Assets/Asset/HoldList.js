/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';

import NoAccountRender from './NoAccountRender';
const ListTitle = () => {
    return (
        <View style={[Style.flexRow, {marginBottom: px(10)}]}>
            <View style={styles.title_tag} />
            <View style={Style.flexRow}>
                <Text style={styles.bold_text}>
                    产品 {''} {''}
                </Text>
                <Text style={{fontSize: px(16)}}>
                    | {''} {''}
                </Text>
                <Text style={{marginBottom: px(-4), ...styles.light_text}}>包含公募、投顾组合、私募等产品</Text>
            </View>
        </View>
    );
};

const HoldList = () => {
    return (
        <View>
            <ListTitle />
            <View style={{marginHorizontal: px(16)}}>
                <View>
                    {/* header */}
                    <View style={[Style.flexBetween, styles.table_header]}>
                        <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                        <Text style={styles.light_text}>日收益</Text>
                        <Text style={styles.light_text}>累计收益</Text>
                    </View>
                    <View style={styles.line} />
                    {/* 列表卡片 */}
                    <NoAccountRender />
                    <View style={styles.card}>
                        <View style={[Style.flexRow, {marginBottom: px(16)}]}>
                            <View style={styles.tag}>
                                <Text style={styles.tag_text}>基金</Text>
                            </View>
                            <Text numberOfLines={1}>嘉实中证基建ETF发起式联接A</Text>
                        </View>
                        <View style={[Style.flexBetween]}>
                            <Text style={[styles.amount_text, {width: px(120)}]}>422,123,912.48</Text>
                            <Text style={styles.amount_text}>-3111.46</Text>
                            <Text style={styles.amount_text}>+993146.12</Text>
                        </View>
                    </View>
                    <View style={styles.line_circle}>
                        <View style={{...styles.leftCircle, left: -px(5)}} />
                        <View style={{...styles.line, flex: 1}} />
                        <View style={{...styles.leftCircle, right: -px(5)}} />
                    </View>

                    <View>
                        <View style={styles.card}>
                            <View style={[Style.flexRow, {marginBottom: px(16)}]}>
                                <View style={styles.tag}>
                                    <Text style={styles.tag_text}>基金</Text>
                                </View>
                                <Text numberOfLines={1}>嘉实中证基建ETF发起式联接A</Text>
                            </View>
                            <View style={[Style.flexBetween]}>
                                <Text style={[styles.amount_text, {width: px(120)}]}>422,123,912.48</Text>
                                <Text style={styles.amount_text}>-3111.46</Text>
                                <Text style={styles.amount_text}>+993146.12</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default HoldList;

const styles = StyleSheet.create({
    bold_text: {fontSize: px(18), lineHeight: px(25), color: Colors.defaultColor, fontWeight: '700'},
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },
    table_header: {
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
        backgroundColor: '#fff',
        height: px(40),
        paddingHorizontal: px(16),
    },
    card: {
        paddingHorizontal: px(16),
        paddingVertical: px(20),
        backgroundColor: '#fff',
    },
    fund_name: {
        color: Colors.defaultColor,
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: '700',
        flex: 1,
    },
    tag: {
        borderColor: '#BDC2CC',
        borderWidth: 0.5,
        borderRadius: px(2),
        paddingHorizontal: px(4),
        marginRight: px(6),
        paddingVertical: px(2),
    },
    tag_text: {
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.lightBlackColor,
    },
    amount_text: {
        fontSize: px(14),
        lineHeight: px(19),
        fontFamily: Font.numFontFamily,
    },
    line: {
        backgroundColor: '#E9EAEF',
        height: 0.5,
        marginHorizontal: px(16),
    },
    leftCircle: {
        width: px(10),
        height: px(10),
        backgroundColor: Colors.bgColor,
        borderRadius: px(10),
        position: 'absolute',
    },
    line_circle: {
        ...Style.flexBetween,
        backgroundColor: '#fff',
        zIndex: 10,
    },
});
