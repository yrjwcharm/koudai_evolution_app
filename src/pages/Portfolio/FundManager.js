/*
 * @Date: 2021-01-30 18:01:57
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-30 18:16:47
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
    const [list, setList] = useState([
        {
            name: '仇秉则',
            desc:
                'CFA，CPA，中山大学经济学学士，具有证券从业资格，多年证券、基金行业从业经历，曾任职普华永道中天会计师事务所审计经理，嘉实基金管理有限公司固定收益部高级信用分析师，\n2016年6月起任汇安基金管理有限责任公司信用分析主管，从事信用债投资研究工作。\n2016年12月至2019年10月任汇安嘉汇纯债债券型证券投资基金基金经理。\n2016年12月至2019年10月担任汇安嘉裕纯债债券型证券投资基金基金经理。\n2016年12月至2018年2月担任汇安丰利灵活配置混合型证券投资基金基金经理。',
        },
        {
            name: '仇秉则',
            desc:
                'CFA，CPA，中山大学经济学学士，具有证券从业资格，多年证券、基金行业从业经历，曾任职普华永道中天会计师事务所审计经理，嘉实基金管理有限公司固定收益部高级信用分析师，\n2016年6月起任汇安基金管理有限责任公司信用分析主管，从事信用债投资研究工作。\n2016年12月至2019年10月任汇安嘉汇纯债债券型证券投资基金基金经理。\n2016年12月至2019年10月担任汇安嘉裕纯债债券型证券投资基金基金经理。\n2016年12月至2018年2月担任汇安丰利灵活配置混合型证券投资基金基金经理。',
        },
    ]);

    const init = useCallback(
        (first) => {
            setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/trade_timing/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '交易时间说明'});
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
        // init();
    }, [init]);
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {list.map((item, index) => {
                return (
                    <View key={index} style={{marginBottom: text(12)}}>
                        <Text style={styles.name}>{item.name}</Text>
                        <HTML style={styles.desc} html={item.desc} />
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
