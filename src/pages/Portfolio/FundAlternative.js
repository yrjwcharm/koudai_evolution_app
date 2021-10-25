/*
 * @Date: 2021-09-24 14:15:43
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-10-25 16:35:18
 * @Description: 基金备选库
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';
import Loading from './components/PageLoading';

const FundAlternative = ({route}) => {
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/adviser/funds/20210923', {poid: route.params.poid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <ScrollView bounces={false} style={styles.container}>
            <Text style={styles.textSty}>{data.tip}</Text>
            <View style={[styles.buyTableWrap, {marginBottom: isIphoneX() ? px(20) + 34 : px(20)}]}>
                <View style={styles.buyTableHead}>
                    <View style={styles.buyTableCell}>
                        <Text style={[styles.buyTableItem, styles.boldSty]}>{data?.table?.th[0]}</Text>
                    </View>
                    <View style={[styles.buyTableCell, {flex: 2}]}>
                        <Text style={[styles.buyTableItem, styles.boldSty]}>{data?.table?.th[1]}</Text>
                    </View>
                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                        <Text style={[styles.buyTableItem, styles.boldSty]}>{data?.table?.th[2]}</Text>
                    </View>
                </View>
                {data?.table?.tr_list?.map((item, index) => {
                    return (
                        <View
                            style={[styles.buyTableBody, {backgroundColor: index % 2 === 1 ? '#F7F8FA' : '#fff'}]}
                            key={item + index}>
                            <View style={styles.buyTableCell}>
                                <Html html={item[0]} style={styles.buyTableItem} />
                            </View>
                            <View style={[styles.buyTableCell, {flex: 2}]}>
                                <Text style={styles.buyTableItem}>{item[1]}</Text>
                            </View>
                            <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                <Html html={item[2]} style={styles.buyTableItem} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: Space.padding,
        borderColor: '#fff',
        borderWidth: 0.5,
    },
    textSty: {
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.descColor,
    },
    buyTableWrap: {
        marginVertical: Space.marginVertical,
        borderColor: Colors.borderColor,
        borderWidth: Space.borderWidth,
        borderRadius: px(6),
        overflow: 'hidden',
    },
    buyTableHead: {
        flexDirection: 'row',
        backgroundColor: '#F7F8FA',
        height: px(43),
    },
    buyTableBody: {
        flexDirection: 'row',
        height: px(40),
    },
    buyTableCell: {
        paddingHorizontal: px(6),
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flex: 1,
        height: '100%',
        ...Style.flexRowCenter,
    },
    buyTableItem: {
        flex: 1,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    boldSty: {
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
});

export default FundAlternative;
