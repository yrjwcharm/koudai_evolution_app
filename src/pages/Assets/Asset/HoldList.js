/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';

import NoAccountRender from './NoAccountRender';
import StickyHeader from '~/components/Sticky';
const ListTitle = ({title, desc}) => {
    return (
        <View style={[Style.flexRow, {marginBottom: px(10)}]}>
            <View style={styles.title_tag} />
            <View style={Style.flexRow}>
                <Text style={styles.bold_text}>
                    {title} {''} {''}
                </Text>
                <Text style={{fontSize: px(16)}}>
                    | {''} {''}
                </Text>
                <Text style={{marginBottom: px(-4), ...styles.light_text}}>{desc}</Text>
            </View>
        </View>
    );
};
// 信号
const RenderSingal = () => {};
const HoldList = ({products, stickyHeaderY, scrollY}) => {
    return (
        <>
            {/* <StickyHeader
                style={[Style.flexBetween, styles.table_header]}
                stickyHeaderY={stickyHeaderY} // 把头部高度传入
                stickyScrollY={scrollY}>
                <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                <Text style={styles.light_text}>日收益</Text>
                <Text style={styles.light_text}>累计收益</Text>
            </StickyHeader> */}
            <View style={{position: 'relative'}}>
                {products?.map((account, key) => (
                    <View key={key} style={{marginBottom: px(16)}}>
                        <ListTitle title={account.title} desc={account?.desc} />
                        <View style={{marginHorizontal: px(16), backgroundColor: '#fff'}}>
                            {/* header */}

                            {/* <StickyHeader
                                style={[Style.flexBetween, styles.table_header]}
                                stickyHeaderY={stickyHeaderY} // 把头部高度传入
                                stickyScrollY={scrollY}>
                                <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                                <Text style={styles.light_text}>日收益</Text>
                                <Text style={styles.light_text}>累计收益</Text>
                            </StickyHeader> */}

                            <View style={[Style.flexBetween, styles.table_header]}>
                                <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                                <Text style={styles.light_text}>日收益</Text>
                                <Text style={styles.light_text}>累计收益</Text>
                            </View>
                            <View style={styles.line} />
                            {/* 列表卡片 */}
                            {account?.items?.length ? (
                                account?.items?.map((product = {}, index, arr) => {
                                    // 卡片是否只有一个或者是最后一个
                                    const flag = index + 1 == arr.length || index == arr.length - 1;
                                    const {name, tag, profit, amount, profit_acc} = product;
                                    return (
                                        <React.Fragment key={index}>
                                            <View
                                                style={[
                                                    styles.card,
                                                    flag && {
                                                        borderBottomRightRadius: px(6),
                                                        borderBottomLeftRadius: px(6),
                                                    },
                                                ]}>
                                                <View style={[Style.flexRow, {marginBottom: px(16)}]}>
                                                    <View style={styles.tag}>
                                                        <Text style={styles.tag_text}>{tag}</Text>
                                                    </View>
                                                    <Text numberOfLines={1}>{name}</Text>
                                                </View>
                                                <View style={[Style.flexBetween]}>
                                                    <Text style={[styles.amount_text, {width: px(120)}]}>{amount}</Text>
                                                    <Text style={styles.amount_text}>{profit}</Text>
                                                    <Text style={styles.amount_text}>{profit_acc}</Text>
                                                </View>
                                            </View>
                                            {!flag && (
                                                <View style={styles.line_circle}>
                                                    <View style={{...styles.leftCircle, left: -px(5)}} />
                                                    <View style={{...styles.line, flex: 1}} />
                                                    <View style={{...styles.leftCircle, right: -px(5)}} />
                                                </View>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <NoAccountRender
                                    empty_button={account?.empty_button}
                                    empty_desc={account?.empty_desc}
                                />
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </>
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
        position: 'relative',
        zIndex: 100,
    },
    card: {
        paddingHorizontal: px(16),
        paddingVertical: px(20),
        // backgroundColor: '#fff',
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
