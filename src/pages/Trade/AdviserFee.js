/*
 * @Date: 2021-11-29 11:18:44
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-02 14:23:24
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
                <ScrollView bounces={false} style={styles.container} scrollIndicatorInsets={{right: 1}}>
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
                    {data?.fee_list
                        ? data?.fee_list?.map((item, index) => (
                              <TouchableOpacity
                                  key={index}
                                  activeOpacity={0.8}
                                  onPress={() => jump(item?.url)}
                                  style={[Style.flexBetween, styles.card]}>
                                  <View>
                                      <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                                          <Text>{item.title}</Text>
                                          <Text style={styles.tag}>{item.tag}</Text>
                                      </View>
                                      <Text
                                          style={{
                                              color: Colors.darkGrayColor,
                                              fontFamily: Font.numRegular,
                                              fontSize: px(12),
                                          }}>
                                          {item.date}
                                      </Text>
                                  </View>
                                  <View>
                                      <Text style={{fontFamily: Font.numFontFamily, marginBottom: px(6)}}>
                                          {item.amount}
                                      </Text>
                                      <Text style={{color: Colors.lightBlackColor, fontSize: px(12)}}>
                                          {item.amount_desc}
                                      </Text>
                                  </View>
                              </TouchableOpacity>
                          ))
                        : null}
                    {data.fee_intro ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => jump(data.fee_intro.url)}
                            style={[Style.flexBetween, styles.feeIntro]}>
                            <Text style={styles.feeIntroText}>{data.fee_intro.title}</Text>
                            <Icon color={Colors.descColor} name="right" size={px(12)} />
                        </TouchableOpacity>
                    ) : null}
                    <BottomDesc fix_img={data.advisor_footer_img} style={styles.bottomDesc} />
                </ScrollView>
            ) : (
                <Loading />
            )}
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
        marginBottom: px(16),
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
    tag: {
        marginHorizontal: px(4),
        paddingVertical: px(4),
        paddingHorizontal: px(6),
        borderRadius: px(4),
        backgroundColor: '#F0F6FD',
        fontSize: px(12),
        color: Colors.btnColor,
    },
    card: {
        marginHorizontal: px(16),
        marginBottom: px(16),
        backgroundColor: '#fff',
        borderRadius: px(6),
        padding: px(16),
    },
});
