/*
 * @Author: xjh
 * @Date: 2021-02-05 12:06:28
 * @Description:计划详情
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-08 10:45:11
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Empty from '../../components/EmptyTip';
import {useFocusEffect} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

export default function PlanDetail(props) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showEmpty, setShowEmpty] = useState(false);

    useEffect(() => {
        props.navigation.dispatch((state) => {
            let removeRoutes = ['FixedUpdate', 'FixedPlanDetail'];
            const routes = state.routes.filter((r) => {
                if (removeRoutes.includes(r.name)) {
                    return false;
                } else {
                    return true;
                }
            });
            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            });
        });
    }, [props.navigation]);

    useFocusEffect(
        useCallback(() => {
            Http.get('/trade/invest_plan/list/20210101', {poid: props.route?.params?.poid})
                .then((res) => {
                    setLoading(false);
                    if (res.code === '000000') {
                        const {list, title = '计划详情'} = res.result || {};
                        props.navigation.setOptions({title});
                        setData(list || []);
                    }
                    setShowEmpty(true);
                })
                .catch(() => {
                    setLoading(false);
                    setShowEmpty(true);
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    const jumpPage = (invest_id) => {
        props.navigation.navigate('FixedPlanDetail', {invest_id});
    };
    return loading ? (
        <View style={[Style.flexCenter, {flex: 1}]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    ) : (
        <ScrollView style={Style.containerPadding} scrollIndicatorInsets={{right: 1}}>
            {Object.keys(data).length > 0 ? (
                data.map((_item, _index) => {
                    return (
                        <TouchableOpacity
                            style={styles.card_sty}
                            key={_index + '_item'}
                            activeOpacity={1}
                            onPress={() => {
                                jumpPage(_item.invest_id);
                            }}>
                            <View
                                style={[
                                    Style.flexBetween,
                                    {
                                        borderBottomWidth: Space.borderWidth,
                                        borderColor: Colors.borderColor,
                                        paddingBottom: text(10),
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.title_sty,
                                        {color: _item?.status == 1 ? Colors.defaultColor : Colors.lightGrayColor},
                                    ]}>
                                    {_item?.title}
                                </Text>
                                <Text style={{color: Colors.lightGrayColor}}>
                                    {_item?.status_text ? _item?.status_text : null}
                                    <AntDesign name={'right'} color={Colors.descColor} size={12} />
                                </Text>
                            </View>
                            <View style={[Style.flexBetween, {marginTop: text(8)}]}>
                                {_item?.items.map((_i, _d) => {
                                    return (
                                        <View key={_d + '_i'}>
                                            <Text style={styles.desc_sty}>{_i?.key}</Text>
                                            <Text
                                                style={[
                                                    styles.num_sty,
                                                    {
                                                        textAlign: _d == 1 ? 'right' : 'left',
                                                        color:
                                                            _item?.status == 1
                                                                ? Colors.defaultColor
                                                                : Colors.lightGrayColor,
                                                    },
                                                ]}>
                                                {_i?.val}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                            {_item?.notice && (
                                <View style={styles.gray_wrap}>
                                    <Text
                                        style={{
                                            fontSize: Font.textH3,
                                            color: Colors.lightGrayColor,
                                            lineHeight: text(18),
                                        }}>
                                        {_item?.notice}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })
            ) : showEmpty ? (
                <Empty text={'暂无数据'} />
            ) : null}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingHorizontal: Space.padding,
        paddingVertical: text(20),
        marginBottom: Space.marginVertical,
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    desc_sty: {
        color: Colors.lightGrayColor,
        fontSize: Font.textH3,
        marginBottom: text(4),
    },
    num_sty: {
        color: Colors.defaultColor,
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
    },
    gray_wrap: {
        backgroundColor: Colors.bgColor,
        padding: text(15),
        marginTop: text(20),
    },
});
