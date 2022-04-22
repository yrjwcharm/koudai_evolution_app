/*
 * @Date: 2021-03-06 12:00:27
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-22 11:51:44
 * @Description: 基金组合协议和产品概要
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {useJump} from '../../components/hooks';
import http from '../../services/index.js';

const TradeAgreements = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});

    useEffect(() => {
        const {fund_codes, poid, type} = route.params || {};
        const url = fund_codes ? '/fund/product_overview/20210101' : '/passport/trade/agreements/20210101';
        const params = fund_codes ? {fund_codes} : {poid, type};
        http.get(url, params).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '基金组合协议'});
                setData(res.result);
            }
        });
    }, [navigation, route]);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.partBox}>
                {(data.funds || data.agreements)?.map((item, index, arr) => {
                    return (
                        <View
                            key={item.name}
                            style={{
                                borderTopWidth: index !== 0 ? Space.borderWidth : 0,
                                borderColor: Colors.borderColor,
                            }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[Style.flexBetween, styles.item]}
                                onPress={() => jump(item.url)}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                            </TouchableOpacity>
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
    },
    partBox: {
        marginVertical: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    item: {
        // paddingHorizontal: Space.padding,
        // backgroundColor: '#fff',
        height: text(56),
    },
    name: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
});

export default TradeAgreements;
