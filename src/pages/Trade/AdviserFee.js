/*
 * @Date: 2021-11-29 11:18:44
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-29 15:12:39
 * @Description: 投顾服务费
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Font, Colors, Space, Style} from '../../common/commonStyle';
import BottomDesc from '../../components/BottomDesc';
import {useJump} from '../../components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/adviser/fee/20211101').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '投顾服务费'});
                setData(res.result || {});
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {Object.keys(data).length > 0 ? (
                <ScrollView bounces={false} style={styles.container}>
                    <View style={styles.topPart}>
                        <Text style={styles.label}>{data.fee[0]?.text}</Text>
                        <Text style={styles.bigFee}>{data.fee[0]?.value}</Text>
                        <View style={[Style.flexRow, {marginTop: px(24)}]}>
                            <View style={{flex: 1}}>
                                <Text style={styles.label}>{data.fee[1]?.text}</Text>
                                <Text style={styles.smallFee}>{data.fee[1]?.value}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={styles.label}>{data.fee[2]?.text}</Text>
                                <Text style={styles.smallFee}>{data.fee[2]?.value}</Text>
                            </View>
                        </View>
                    </View>
                    {data.fee_intro ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => jump(data.fee_intro.url)}
                            style={[Style.flexBetween, styles.feeIntro]}>
                            <Text style={styles.feeIntroText}>{data.fee_intro.title}</Text>
                            <Icon color={Colors.descColor} name="right" size={px(12)} />
                        </TouchableOpacity>
                    ) : null}
                </ScrollView>
            ) : (
                <Loading />
            )}
            <BottomDesc fix_img={data.advisor_footer_img} style={styles.bottomDesc} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        paddingTop: px(34),
        paddingBottom: px(20),
        backgroundColor: '#fff',
    },
    label: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightGrayColor,
        textAlign: 'center',
    },
    bigFee: {
        marginTop: px(6),
        fontSize: px(35),
        lineHeight: px(41),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    smallFee: {
        marginTop: px(8),
        fontSize: px(18),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    feeIntro: {
        marginTop: Space.marginVertical,
        paddingVertical: px(20),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    feeIntroText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    bottomDesc: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: isIphoneX() ? 34 : 0,
    },
});
