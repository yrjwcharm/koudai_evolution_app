/*
 * @Date: 2021-03-06 12:00:27
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-20 22:35:36
 * @Description: 权益须知
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px, px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {useJump} from '../../components/hooks';
import http from '../../services/index.js';

const TradeAgreements = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});

    useEffect(() => {
        const url = '/trade/agreement/list/20220620';
        const params = route.params;
        http.get(url, params).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '基金组合协议'});
                setData(res.result);
            }
        });
    }, [navigation, route]);
    return (
        <ScrollView style={styles.container}>
            {(data.funds || data.agreements)?.map((agree, index, arr) => (
                <View style={[styles.partBox]} key={index}>
                    {agree?.map((item, _key) => (
                        <View key={_key}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    Style.flexBetween,
                                    styles.item,
                                    {
                                        borderTopWidth: _key !== 0 ? Space.borderWidth : 0,
                                        borderColor: Colors.borderColor,
                                    },
                                ]}
                                onPress={() => jump(item.url)}>
                                <Text style={styles.name}>{item.name || item?.title}</Text>
                                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingTop: px(12),
    },
    partBox: {
        marginBottom: Space.marginVertical,
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
