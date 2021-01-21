/*
 * @Author: dx
 * @Date: 2021-01-20 17:33:06
 * @LastEditTime: 2021-01-21 11:45:38
 * @LastEditors: dx
 * @Description: 交易确认页
 * @FilePath: /koudai_evolution_app/src/pages/TradeState/TradeProcessing.js
 */
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';

const TradeProcessing = (props) => {
    const {txn_id, code} = props.route.params || {};
    const navigation = useNavigation();
    const [data, setData] = useState({});
    const init = () => {
        http.get('/trade/order/processing/20210101', {txn_id: '20210119A00163XS', code: '123456'}).then((res) => {
            setData(res.result);
            res.result.loop === 1 && navigation.setOptions({title: res.result.title});
        });
    };
    const onLayout = (index, e) => {
        console.log(index, e.nativeEvent.layout);
        const tempItems = data.items;
        tempItems[index].height = e.nativeEvent.layout.height;
        setData({
            ...data,
            items: tempItems,
        });
    };
    const items = [
        {
            k: '订单已受理',
            v: '2020/07/07 15:23:03',
            done: 1,
            d: ['购买金额(元)：10,000.00', '支付银行卡：招商银行(8888)'],
        },
        {
            k: '在玄元下单',
            v: '2020/07/07 15:23:03',
            done: -1,
        },
        {
            k: '努力下单中，请稍后…',
            v: '2020/07/07 15:23:03',
            done: 0,
        },
    ];
    useEffect(() => {
        // init();
        // const timer = setInterval(() => {
        //     init();
        // }, 1000);
        // return () => clearInterval(timer);
        setData({
            title: '交易确认页',
            loop: 1,
            need_verify_code: false,
            finish: false,
            items: [
                {
                    k: '订单已受理',
                    v: '2020/07/07 15:23:03',
                    done: 1,
                    d: ['购买金额(元)：10,000.00', '支付银行卡：招商银行(8888)'],
                },
                {
                    k: '在玄元下单',
                    v: '2020/07/07 15:23:03',
                    done: -1,
                },
                {
                    k: '努力下单中，请稍后…',
                    v: '2020/07/07 15:23:03',
                    done: 0,
                },
            ],
        });
    }, []);
    useEffect(() => {
        const timer = setInterval(() => {
            const randomNum = Math.round(2 * Math.random());
            setData({
                ...data,
                items: [...data.items, items[randomNum]],
            });
        }, 1000);
        return () => clearInterval(timer);
    });
    return (
        <ScrollView style={[styles.container]}>
            <Text style={[styles.title]}>购买进度明细</Text>
            <View style={[styles.processContainer]}>
                {Object.keys(data).length > 0 &&
                    data.items.map((item, index) => {
                        return (
                            <View key={index} style={[styles.processItem]} onLayout={(e) => onLayout(index, e)}>
                                <View style={[styles.icon, Style.flexCenter]}>
                                    {(item.done === 1 || item.done === -1) && (
                                        <Ionicons
                                            name={item.done === 1 ? 'checkmark-circle' : 'close-circle'}
                                            size={17}
                                            color={item.done === 1 ? Colors.green : Colors.red}
                                        />
                                    )}
                                    {item.done === 0 && (
                                        <FontAwesome
                                            name={'circle-thin'}
                                            size={16}
                                            color={'#CCD0DB'}
                                            style={{marginRight: text(2)}}
                                        />
                                    )}
                                </View>
                                <View style={[styles.contentBox]}>
                                    <View style={[styles.content]}>
                                        <View style={[styles.processTitle, Style.flexBetween]}>
                                            <Text style={[styles.desc]}>{item.k}</Text>
                                            <Text style={[styles.date]}>{item.v}</Text>
                                        </View>
                                        {index === 0 && (
                                            <View style={[styles.moreInfo]}>
                                                {item.d &&
                                                    item.d.map((val, i) => {
                                                        return (
                                                            <Text key={val} style={[styles.moreInfoText]}>
                                                                {val}
                                                            </Text>
                                                        );
                                                    })}
                                            </View>
                                        )}
                                    </View>
                                </View>
                                {index !== data.items.length - 1 && (
                                    <View
                                        style={[
                                            styles.line,
                                            {height: item.height ? text(item.height - 3.5) : text(52)},
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.marginAlign,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
        paddingVertical: Space.marginVertical,
        paddingLeft: text(8),
    },
    processContainer: {
        paddingLeft: text(8),
    },
    processItem: {
        flexDirection: 'row',
        position: 'relative',
        marginBottom: text(12),
    },
    icon: {
        width: text(16),
        height: text(16),
        marginTop: text(16),
        marginRight: text(8),
        position: 'relative',
        zIndex: 2,
        // backgroundColor: Colors.bgColor,
    },
    contentBox: {
        paddingLeft: text(6),
        width: text(310.5),
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingVertical: text(14),
        paddingHorizontal: Space.marginAlign,
    },
    processTitle: {
        flexDirection: 'row',
    },
    desc: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    date: {
        fontSize: Font.textSm,
        lineHeight: text(13),
        color: Colors.darkGrayColor,
        fontFamily: Font.numRegular,
    },
    moreInfo: {
        paddingLeft: Space.marginAlign,
    },
    moreInfoText: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: Colors.descColor,
    },
    line: {
        position: 'absolute',
        top: text(29),
        left: text(6.5),
        width: text(1),
        backgroundColor: '#CCD0DB',
        zIndex: 1,
    },
});

export default TradeProcessing;
