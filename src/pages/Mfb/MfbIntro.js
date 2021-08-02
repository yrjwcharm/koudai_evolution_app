/*
 * @Description:魔方宝说明
 * @Author: xjh
 * @Date: 2021-01-23 18:18:59
 * @LastEditors: dx
 * @LastEditTime: 2021-08-02 15:08:53
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Http from '../../services';
import {px as text} from '../../utils/appUtil';
export default function MfbIntro(props) {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/wallet/intro/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    return (
        <View style={{backgroundColor: '#fff', flex: 1, paddingVertical: Space.padding}}>
            <ScrollView style={{flex: 1, paddingHorizontal: Space.padding}}>
                {Object.keys(data).length > 0 &&
                    data?.content?.map((_item, _index) => {
                        return (
                            <View key={_index + 'item'}>
                                <Text style={styles.title_sty}>{_item.key}</Text>
                                <View style={{marginBottom: text(24)}}>
                                    {_item.type == 1 &&
                                        _item?.val?.map((_i, _d) => {
                                            return (
                                                <Text style={[Style.descSty, {lineHeight: text(22)}]} key={_d + '_i'}>
                                                    {_i}
                                                </Text>
                                            );
                                        })}

                                    {_item.type == 2 && (
                                        <View style={styles.table_sty}>
                                            <View style={[Style.flexRow, styles.thead_sty]}>
                                                {_item?.val?.head.map((_t, _y, arr) => {
                                                    const _flex = _y == 0 ? 1 : 0;
                                                    const _border = _y < _item?.val?.head.length - 1 ? 0.5 : 0;
                                                    return (
                                                        <View
                                                            key={_y + '_t'}
                                                            style={[
                                                                styles.line_sty,
                                                                {flex: _flex, borderRightWidth: _border},
                                                            ]}>
                                                            <Text style={[styles.text_sty, {fontWeight: 'bold'}]}>
                                                                {_t}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                            {_item?.val?.body.map((_tbody, _e, arr) => {
                                                const backgroundColor = _e % 2 == 0 ? '#fff' : '#F7F8FA';
                                                return (
                                                    <View
                                                        key={_e + '_tbody'}
                                                        style={[
                                                            Style.flexRow,
                                                            {
                                                                backgroundColor: backgroundColor,
                                                                borderBottomLeftRadius:
                                                                    _e == arr.length - 1 ? text(8) : 0,
                                                                borderBottomRightRadius:
                                                                    _e == arr.length - 1 ? text(8) : 0,
                                                            },
                                                        ]}>
                                                        {_tbody.map((_td, _f) => {
                                                            const _flex = _f == 0 ? 1 : 0;
                                                            const _border = _f < _tbody.length - 1 ? 0.5 : 0;
                                                            return (
                                                                <View
                                                                    key={_f + '_td'}
                                                                    style={[
                                                                        styles.line_sty,
                                                                        {
                                                                            flex: _flex,
                                                                            borderRightWidth: _border,
                                                                        },
                                                                    ]}>
                                                                    <Text style={styles.text_sty}>{_td}</Text>
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    title_sty: {
        color: Colors.defaultColor,
        fontSize: text(15),
        fontWeight: 'bold',
        paddingBottom: text(7),
    },
    line_sty: {
        // flex: 1,
        width: text(80),
        color: '#555B6C',
        fontSize: Font.textH3,
        borderColor: '#E2E4EA',
        paddingVertical: text(12),
    },
    thead_sty: {
        backgroundColor: '#F7F8FA',
        borderTopLeftRadius: text(8),
        borderTopRightRadius: text(8),
    },
    table_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        marginTop: text(7),
        borderRadius: text(8),
        overflow: 'hidden',
    },

    text_sty: {
        textAlign: 'center',
        fontSize: text(12),
    },
});
