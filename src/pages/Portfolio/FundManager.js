/*
 * @Date: 2021-01-30 18:01:57
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-08 18:29:20
 * @Description: 基金经理
 */
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';

const FundManager = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([]);

    const init = useCallback(
        (first) => {
            // setRefreshing(true);
            http.get('/fund/managers/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '基金经理'});
                setList([...(res.result.list || [])]);
            });
        },
        [navigation, route]
    );
    // 下拉刷新
    const onRefresh = useCallback(() => {
        init();
    }, [init]);

    useEffect(() => {
        init(true);
    }, [init]);
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {list.map((item, index) => {
                return (
                    <View key={index} style={{marginBottom: text(12)}}>
                        <Text style={styles.name}>{item.name}</Text>
                        {item.profile ? <HTML style={styles.desc} html={item.profile} /> : null}
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
        paddingHorizontal: Space.padding,
        paddingTop: text(12),
    },
    name: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
        marginBottom: text(4),
    },
    desc: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.descColor,
        textAlign: 'justify',
    },
});

export default FundManager;
