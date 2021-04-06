/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: xjh
 * @Date: 2021-02-05 12:06:28
 * @Description:计划详情
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-06 11:53:51
 */
import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import {Button} from '../../components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Empty from '../../components/EmptyTip';
import {useFocusEffect} from '@react-navigation/native';
export default function PlanDetail(props) {
    const [data, setData] = useState({});

    const init = () => {
        Http.get('/trade/invest_plan/list/20210101', {poid: props.route?.params?.poid}).then((res) => {
            setData(res.result);
        });
    };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );
    const jumpPage = (invest_id) => {
        props.navigation.navigate('FixedPlanDetail', {invest_id});
    };
    return (
        <ScrollView style={Style.containerPadding}>
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
                                        borderBottomWidth: 0.5,
                                        borderColor: Colors.borderColor,
                                        paddingBottom: text(10),
                                    },
                                ]}>
                                <Text style={[styles.title_sty, {color: _item?.status == 1 ? '#292d39' : '#9AA1B2'}]}>
                                    {_item?.title}
                                </Text>
                                <Text style={{color: '#9AA1B2'}}>
                                    {_item?.status_text ? _item?.status_text : null}
                                    <AntDesign name={'right'} color={'#4E556C'} size={12} />
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
                                                        color: _item?.status == 1 ? '#292d39' : '#9AA1B2',
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
                                            fontSize: text(12),
                                            color: '#9AA1B2',
                                            lineHeight: text(18),
                                        }}>
                                        {_item?.notice}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })
            ) : (
                <Empty text={'暂无数据'} />
            )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingHorizontal: text(16),
        paddingVertical: text(20),
        marginBottom: text(16),
    },
    title_sty: {
        color: '#333',
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    desc_sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
        marginBottom: text(4),
    },
    num_sty: {
        color: Colors.defaultColor,
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
    },
    gray_wrap: {
        backgroundColor: '#F5F6F8',
        padding: text(15),
        marginTop: text(20),
    },
});
