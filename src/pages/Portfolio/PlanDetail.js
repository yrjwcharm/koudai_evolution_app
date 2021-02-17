/*
 * @Author: xjh
 * @Date: 2021-02-05 12:06:28
 * @Description:计划详情
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-05 14:55:59
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from './components/Slider';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import {Button} from '../../components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function PlanDetail(props) {
    const [data, setData] = useState({});

    useEffect(() => {
        Http.get('/trade/fix_invest/list/20210101').then((res) => {
            setData(res.result);
        });
    });
    const jumpPage = (url, params) => {
        props.navigation.navigate(url, params);
    };
    return (
        <View style={Style.containerPadding}>
            {Object.keys(data).length > 0 &&
                data.list.length > 0 &&
                data.list.map((_item, _index) => {
                    return (
                        <TouchableOpacity style={styles.card_sty} key={_index + '_item'} onPress={jumpPage()}>
                            <View
                                style={[
                                    Style.flexBetween,
                                    {borderBottomWidth: 0.5, borderColor: Colors.borderColor, paddingBottom: text(10)},
                                ]}>
                                <Text style={[styles.title_sty, {color: _item.available == 1 ? '' : '#9AA1B2'}]}>
                                    {_item.title}
                                </Text>
                                <AntDesign name={'right'} color={'#4E556C'} size={12} />
                            </View>
                            <View style={[Style.flexBetween, {marginTop: text(8)}]}>
                                {_item.map((_i, _d) => {
                                    return (
                                        <View>
                                            <Text style={styles.desc_sty}>{_i.key}</Text>
                                            <Text style={styles.num_sty}>{_i.val}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={styles.gray_wrap}>
                                <Text style={{fontSize: text(12), color: '#9AA1B2', lineHeight: text(18)}}>
                                    下次扣款：2012-01-25将从银行卡25将从银行卡25将从银行卡
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
        </View>
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
