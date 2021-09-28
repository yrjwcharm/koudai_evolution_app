/*
 * @Date: 2021-09-24 10:49:47
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-27 10:33:50
 * @Description: 投资策略
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import {Colors, Font, Space} from '../../common/commonStyle';
import Loading from './components/PageLoading';

const InvestStrategy = ({route}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        http.get('/adviser/investment/strategy/20210923', {poid: route.params.poid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScrollView bounces={false} style={styles.container}>
            {data?.length > 0 ? (
                data?.map?.((item, index, arr) => {
                    return (
                        <View
                            key={item + index}
                            style={[
                                styles.partBox,
                                index === 0 ? {marginTop: 0} : {},
                                index === arr.length - 1
                                    ? {marginBottom: isIphoneX() ? Space.marginVertical + 34 : Space.marginVertical}
                                    : {},
                            ]}>
                            <Text style={styles.partTitle}>{item.title}</Text>
                            {item.items?.map?.((content, idx, array) => {
                                return (
                                    <Text key={content + idx} style={styles.contentText}>
                                        {array.length > 1 && <Text style={styles.blueCircle}>•&nbsp;</Text>}
                                        {content}
                                    </Text>
                                );
                            })}
                        </View>
                    );
                })
            ) : (
                <Loading />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    partBox: {
        marginTop: px(10),
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    contentText: {
        marginTop: px(12),
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    blueCircle: {
        fontSize: px(17),
        lineHeight: px(22),
        color: Colors.brandColor,
    },
});

export default InvestStrategy;
