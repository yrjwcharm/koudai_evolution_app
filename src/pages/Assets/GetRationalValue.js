/*
 * @Date: 2021-02-27 14:40:24
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-09 19:49:33
 * @Description: 信任值获取方法
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';

const GetRationalValue = ({navigation}) => {
    const [data, setData] = useState({
        title: '信任值获取方法',
        rule_list: [
            {
                title: '1.投资获得信任值',
                style: 'table',
                table: {
                    th: {
                        key: '购买产品',
                        val: '购买10,000元最低可获得的信任值',
                    },
                    td_list: [
                        {
                            key: '智能组合',
                            val: '11,000',
                        },
                        {
                            key: '稳健组合',
                            val: '11,000',
                        },
                        {
                            key: '低估值智能定投',
                            val: '10,500',
                        },
                        {
                            key: '牛市组合',
                            val: '10,000',
                        },
                        {
                            key: '货币组合',
                            val: '1,000',
                        },
                    ],
                    remark: '*投资信任值在系统购买确认后获得，购买确认后，信任值将不晚于3个工作日计入您的会员账户中。',
                },
                items: [
                    {
                        content: '投资不同类型的组合产品对应获得的信任值见下表',
                    },
                ],
            },
            {
                title: '2.持续持仓获得信任值',
                items: [
                    {
                        content:
                            '用户可以通过持续持有所投资的产品获得信任值。每10000元投资每天可以获得5至30信任值，不同组合产品每日获得信任值不同。',
                    },
                ],
                style: 'text',
            },
            {
                title: '3.调仓获得信任值',
                items: [
                    {
                        content:
                            '用户跟随系统提示进行调仓操作能够获得可观信任值。每10000元持仓产品进行调仓操作能够获得500信任值。7日内完成调仓将额外奖励信任值，调仓越及时，奖励越多。',
                    },
                ],
                style: 'text',
            },
            {
                title: '4.邀请好友获得信任值',
                items: [
                    {
                        content:
                            '好物分享：用户通过APP点击分享给好友，好友通过分享的链接注册，且15天内投资基金组合产品金额>=1万元，每成功邀请一名满足上述条件的好友您可获得1500信任值；',
                    },
                    {
                        content: '共同成长：您可以额外获得前3位满足上述条件好友在注册后30天内获得信任值的15%。',
                        link: {
                            title: '点击立即前往>>',
                            url: '/inviteRational',
                        },
                    },
                ],
                style: 'text',
            },
        ],
    });
    return (
        <ScrollView style={styles.container}>
            {data.rule_list.map((item, index) => {
                return (
                    <View style={{marginBottom: Space.marginVertical}} key={item.title}>
                        <Text style={[styles.title]}>{item.title}</Text>
                        {item.style === 'text' && (
                            <View style={{marginTop: text(8)}}>
                                {item.items.map((c, i) => {
                                    return (
                                        <Text key={c.content} style={styles.content}>
                                            {c.content}
                                            {c.link && (
                                                <Text style={{color: '#2B77FF', fontWeight: 'bold'}}>
                                                    {c.link.title}
                                                </Text>
                                            )}
                                        </Text>
                                    );
                                })}
                            </View>
                        )}
                        {item.style === 'table' && (
                            <View style={{marginTop: text(8)}}>
                                {item.items.map((c, i) => {
                                    return (
                                        <Text key={c.content} style={styles.content}>
                                            {c.content}
                                        </Text>
                                    );
                                })}
                            </View>
                        )}
                        {item.style === 'table' && (
                            <>
                                <View style={styles.tableWrap}>
                                    <View style={[Style.flexRow, styles.tableTr, {backgroundColor: '#EDEDED'}]}>
                                        <View style={[Style.flexCenter, {width: text(128), height: '100%'}]}>
                                            <Text
                                                style={[styles.desc, {color: Colors.defaultColor, fontWeight: '500'}]}>
                                                {item.table.th.key}
                                            </Text>
                                        </View>
                                        <View style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                            <Text
                                                style={[styles.desc, {color: Colors.defaultColor, fontWeight: '500'}]}>
                                                {item.table.th.val}
                                            </Text>
                                        </View>
                                    </View>
                                    {item.table.td_list.map((td, l) => {
                                        return (
                                            <View
                                                key={td.key}
                                                style={[
                                                    Style.flexRow,
                                                    styles.tableTr,
                                                    {backgroundColor: l % 2 === 0 ? '#fff' : '#F7F7F7'},
                                                ]}>
                                                <View
                                                    style={[
                                                        Style.flexCenter,
                                                        styles.borderRight,
                                                        {width: text(128), height: '100%'},
                                                    ]}>
                                                    <Text
                                                        style={[
                                                            styles.desc,
                                                            {color: Colors.defaultColor, fontWeight: '500'},
                                                        ]}>
                                                        {td.key}
                                                    </Text>
                                                </View>
                                                <View style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                                    <Text style={[styles.desc, {color: Colors.defaultColor}]}>
                                                        {td.val}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                                {item.table.remark && (
                                    <Text style={[styles.desc, {marginTop: text(4)}]}>{item.table.remark}</Text>
                                )}
                            </>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: Space.padding,
    },
    title: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    tableWrap: {
        marginTop: text(8),
        borderWidth: Space.borderWidth,
        borderTopWidth: 0,
        borderColor: Colors.borderColor,
    },
    tableTr: {
        height: text(33),
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    content: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: Colors.descColor,
    },
});

export default GetRationalValue;
