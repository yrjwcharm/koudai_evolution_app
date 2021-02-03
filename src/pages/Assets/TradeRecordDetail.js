/*
 * @Date: 2021-02-02 12:27:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-03 10:55:24
 * @Description:交易记录详情
 */
import React, {useCallback, useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {px} from '../../utils/appUtil';
import {Style, Colors, Font} from '../../common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Modal} from '../../components/Modal';
const TradeRecordDetail = (props) => {
    const [heightArr, setHeightArr] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const cardLayout = (index, e) => {
        const arr = [...heightArr];
        arr[index] = e.nativeEvent.layout.height;
        setHeightArr(arr);
    };
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.header_right}>撤单</Text>
                    </TouchableOpacity>
                );
            },
        });
    });
    const handleCancel = () => {
        Modal.show({
            title: '确认撤单',
            content: '撤单后需要重新进行购买，撤单金额需要T+1日到账，确认要撤单吗？',
            confirm: true,
        });
    };
    const handleMore = () => {
        setShowMore(!showMore);
    };
    return (
        <ScrollView style={styles.container}>
            <View style={[styles.header, Style.flexCenter]}>
                <View style={Style.flexRow}>
                    <View style={[Style.tag, {backgroundColor: '#FFF2F2', marginRight: px(9)}]}>
                        <Text style={{fontSize: px(11)}}>购买</Text>
                    </View>
                    <Text style={{color: Colors.defaultColor, fontSize: px(16)}}>某某某组合名称</Text>
                </View>
            </View>
            <View style={{paddingHorizontal: px(14)}}>
                <Text style={[styles.card_title, {fontWeight: '700', marginBottom: px(16)}]}>购买进度明细</Text>

                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View>
                        <View style={styles.circle} />
                        <View style={[styles.line]} />
                    </View>
                    <View style={[styles.card]}>
                        <View style={[Style.flexBetween, {height: px(42)}]}>
                            <View style={styles.trangle} />
                            <Text style={styles.name}>通过魔方宝买入基金</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={[Style.flexRow, {height: '100%'}]}
                                onPress={handleMore}>
                                <Text style={styles.date}>2020-07-07</Text>
                                <FontAwesome
                                    name={'angle-down'}
                                    size={18}
                                    style={{paddingLeft: px(11)}}
                                    color={Colors.lightGrayColor}
                                />
                            </TouchableOpacity>
                        </View>
                        {showMore && (
                            // <View style={styles.buy_table}>
                            //     <View style={[Style.flexBetween, {height: px(30)}]}>
                            //         <Text style={styles.light_text}>基金</Text>
                            //         <Text style={styles.light_text}>买入金额(元)</Text>
                            //     </View>
                            //     <View style={styles.fund_item}>
                            //         <View style={[Style.flexBetween, {marginBottom: px(4)}]}>
                            //             <Text style={styles.fund_name}>华安黄金ETF连接C</Text>
                            //             <Text style={styles.fund_amount}>123.34</Text>
                            //         </View>
                            //         <Text style={styles.light_text}>确认份额136.46，手续费0.25元</Text>
                            //     </View>
                            //     <View style={styles.fund_item}>
                            //         <View style={[Style.flexBetween, {marginBottom: px(4)}]}>
                            //             <Text style={styles.fund_name}>华安黄金ETF连接C</Text>
                            //             <Text style={styles.fund_amount}>123.34</Text>
                            //         </View>
                            //         <Text style={styles.light_text}>确认份额136.46，手续费0.25元</Text>
                            //     </View>
                            // </View>
                            <View style={styles.buy_table}>
                                <View style={[Style.flexBetween, {height: px(30)}]}>
                                    <Text style={[styles.light_text, {width: px(163)}]}>基金</Text>
                                    <Text style={styles.light_text}>调仓前</Text>
                                    <Text style={styles.light_text}>调仓后</Text>
                                </View>
                                <View style={[Style.flexBetween, styles.fund_item]}>
                                    <Text numberOfLines={1} style={styles.fund_name}>
                                        华安黄金ETF连接C华安黄金ETF连接C
                                    </Text>
                                    <Text style={styles.fund_amount}>12%</Text>
                                    <Text style={styles.fund_amount}>123.34</Text>
                                </View>
                                <View style={[Style.flexBetween, styles.fund_item]}>
                                    <Text numberOfLines={1} style={styles.fund_name}>
                                        华安黄金ETF连接C华安黄金ETF连接C
                                    </Text>
                                    <Text style={styles.fund_amount}>12%</Text>
                                    <Text style={styles.fund_amount}>123.34</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    header: {
        marginTop: 1,
        backgroundColor: '#fff',
        paddingVertical: px(20),
        marginBottom: px(16),
    },
    header_right: {
        fontSize: px(14),
        width: px(48),
        color: Colors.defaultColor,
    },

    name: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: '700',
        lineHeight: px(20),
    },
    card_title: {
        fontSize: px(14),
        color: Colors.defaultColor,
    },
    line: {
        width: px(1),
        backgroundColor: '#E2E4EA',
        marginLeft: px(4),
        position: 'absolute',
        top: px(22),
    },
    circle: {
        width: px(8),
        height: px(8),
        borderRadius: px(4),
        backgroundColor: Colors.darkGrayColor,
        marginRight: px(17),
        position: 'relative',
        zIndex: 10,
        marginTop: px(18),
    },
    card: {
        borderRadius: 8,
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: px(12),
        marginBottom: px(12),
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    trangle: {
        borderWidth: px(7),
        borderRightColor: '#fff',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        position: 'absolute',
        left: px(-26),
    },
    buy_table: {
        borderTopWidth: 1,
        borderColor: Colors.borderColor,
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    fund_item: {
        borderTopWidth: 1,
        borderColor: Colors.borderColor,
        paddingVertical: px(8),
    },
    fund_name: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightBlackColor,
        width: px(163),
    },
    fund_amount: {
        fontSize: px(12),
        fontFamily: Font.numMedium,
        color: Colors.lightBlackColor,
    },
});
export default TradeRecordDetail;
