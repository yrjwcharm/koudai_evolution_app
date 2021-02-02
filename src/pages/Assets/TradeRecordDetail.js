/*
 * @Date: 2021-02-02 12:27:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-02 15:45:30
 * @Description:交易记录详情
 */
import React, {useCallback, useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {px} from '../../utils/appUtil';
import {Style, Colors, Font} from '../../common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const TradeRecordDetail = () => {
    const [heightArr, setHeightArr] = useState([]);
    const cardLayout = (index, e) => {
        const arr = [...heightArr];
        arr[index] = e.nativeEvent.layout.height;
        setHeightArr(arr);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.header, Style.flexCenter]}>
                <View style={Style.flexRow}>
                    <View style={[styles.tag, {backgroundColor: '#FFF2F2'}]}>
                        <Text style={{fontSize: px(11)}}>购买</Text>
                    </View>
                    <Text style={[styles.name, {fontWeight: '400'}]}>某某某组合名称</Text>
                </View>
            </View>
            <View style={{paddingHorizontal: px(14)}}>
                <Text style={[styles.card_title, {fontWeight: '700', marginBottom: px(16)}]}>购买进度明细</Text>
                <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}
                    onLayout={(e) => {
                        cardLayout(0, e);
                    }}>
                    <View>
                        <View style={styles.circle} />
                        <View style={[styles.line, {height: heightArr[0]}]} />
                    </View>
                    <View style={[styles.card, Style.flexBetween]}>
                        <View style={styles.trangle} />
                        <Text style={styles.name}>购买下单</Text>
                        <Text style={styles.date}>2020-07-07</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View>
                        <View style={styles.circle} />
                        <View style={[styles.line]} />
                    </View>
                    <View style={[styles.card, Style.flexBetween]}>
                        <View style={styles.trangle} />
                        <Text style={styles.name}>买入魔方宝</Text>
                        <View style={Style.flexRow}>
                            <Text style={styles.date}>2020-07-07</Text>
                            <FontAwesome
                                name={'angle-down'}
                                size={18}
                                style={{marginLeft: px(11)}}
                                color={Colors.lightGrayColor}
                            />
                        </View>
                    </View>
                </View>
                <>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        <View>
                            <View style={styles.circle} />
                            <View style={[styles.line]} />
                        </View>
                        <View style={styles.card}>
                            <View style={Style.flexBetween}>
                                <View style={styles.trangle} />
                                <Text style={styles.name}>通过魔方宝买入基金</Text>
                                <View style={Style.flexRow}>
                                    <Text style={styles.date}>2020-07-07</Text>
                                    <FontAwesome
                                        name={'angle-down'}
                                        size={18}
                                        style={{marginLeft: px(11)}}
                                        color={Colors.lightGrayColor}
                                    />
                                </View>
                            </View>
                            <View style={styles.buy_table}>
                                <View style={[Style.flexBetween, {height: px(30)}]}>
                                    <Text style={styles.light_text}>基金</Text>
                                    <Text style={styles.light_text}>买入金额(元)</Text>
                                </View>
                                <View>
                                    <View style={[Style.flexBetween, {marginBottom: px(4)}]}>
                                        <Text style={styles.fund_name}>华安黄金ETF连接C</Text>
                                        <Text style={styles.fund_amount}>123.34</Text>
                                    </View>
                                    <Text style={styles.light_text}>确认份额136.46，手续费0.25元</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
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
    tag: {
        paddingHorizontal: px(7),
        justifyContent: 'center',
        borderRadius: 4,
        height: px(20),
        marginRight: px(9),
    },
    name: {
        fontSize: px(16),
        color: Colors.defaultColor,
        fontWeight: '700',
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
        padding: px(14),
        marginBottom: px(12),
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    trangle: {
        borderWidth: px(7),
        borderColor: 'transparent',
        borderRightColor: '#fff',
        position: 'absolute',
        left: px(-14),
    },
    buy_table: {
        marginTop: px(16),
        borderTopWidth: 1,
        borderColor: Colors.borderColor,
    },
    light_text: {
        fontSize: px(12),
        color: Colors.lightGrayColor,
    },
    fund_name: {
        fontSize: px(13),
        color: Colors.lightBlackColor,
    },
    fund_amount: {
        fontSize: px(12),
        fontFamily: Font.numMedium,
        color: Colors.lightBlackColor,
    },
});
export default TradeRecordDetail;
