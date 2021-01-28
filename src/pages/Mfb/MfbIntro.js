/*
 * @Description:魔方宝说明
 * @Author: xjh
 * @Date: 2021-01-23 18:18:59
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-27 18:22:42
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Font, Style} from '../../common/commonStyle';
import Http from '../../services';
import {px as text} from '../../utils/appUtil';

export default function MfbIntro(props) {
    const [data, setData] = useState({});
    useEffect(() => {
        console.log(props);
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/wallet/intro/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    const isArrayFn = (o) => {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    const isObject = (o) => {
        return Object.prototype.toString.call(o) === '[object Object]';
    };
    return (
        <ScrollView style={Style.containerPadding}>
            {Object.keys(data).length > 0 &&
                data.content.map((_item, _index) => {
                    return (
                        <View>
                            <Text style={styles.title_sty}>{_item.title}</Text>
                            <View style={{marginBottom: text(24)}}>
                                {isArrayFn(_item.desc) &&
                                    _item.desc.map((_i, _d) => {
                                        return (
                                            <Text style={[Style.descSty, {lineHeight: text(18)}]} key={_d + '_i'}>
                                                {_i}
                                            </Text>
                                        );
                                    })}

                                {isObject(_item.desc) && (
                                    <View style={styles.table_sty}>
                                        <View style={[Style.flexRow, styles.thead_sty]}>
                                            {_item.desc.header.map((_t, _y) => {
                                                const _flex = _y == 0 ? 1 : 0;
                                                const _border = _y < _item.desc.header.length - 1 ? 0.5 : 0;
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
                                        {isObject(_item.desc) &&
                                            _item.desc.rows.map((_tbody, _e) => {
                                                const backgroundColor = _e % 2 == 0 ? '#fff' : '#F7F8FA';
                                                return (
                                                    <View
                                                        key={_e + '_tbody'}
                                                        style={[Style.flexRow, {backgroundColor: backgroundColor}]}>
                                                        {_tbody.map((_td, _f) => {
                                                            const _flex = _f == 0 ? 1 : 0;
                                                            const _border = _f < _item.desc.header.length - 1 ? 0.5 : 0;
                                                            return (
                                                                <View
                                                                    key={_f + '_td'}
                                                                    style={[
                                                                        styles.line_sty,
                                                                        {flex: _flex, borderRightWidth: _border},
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
        borderRightWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingVertical: text(12),
    },
    thead_sty: {
        backgroundColor: '#F7F8FA',
    },
    table_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        marginTop: text(10),
    },

    text_sty: {
        textAlign: 'center',
    },
});
