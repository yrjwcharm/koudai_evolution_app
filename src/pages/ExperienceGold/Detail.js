/*
 * @Date: 2021-02-24 14:09:57
 * @Author: dx
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-25 15:15:45
 * @Description: 体验金首页
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import {BottomModal} from '../../components/Modal';
import HTML from '../../components/RenderHtml';

const ExperienceGold = ({navigation}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const bottomModal = useRef(null);

    const init = useCallback(() => {
        console.log('refresh');
        setRefreshing(false);
    }, []);
    const getColor = useCallback((t) => {
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <TouchableOpacity style={[Style.flexCenter, styles.topRightBtn]}>
                        <Text style={{...styles.bigTitle, color: '#fff', fontWeight: '400'}}>{'规则说明'}</Text>
                    </TouchableOpacity>
                </>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={{flex: 1}} refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}>
                <LinearGradient
                    style={styles.bg}
                    colors={['#D4AC6F', 'rgba(212, 172, 111, 0)']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                />
                <View style={styles.topBox}>
                    <View style={[Style.flexRow, styles.noticeBar]}>
                        <Image source={require('../../assets/personal/volume.png')} style={styles.noticeIcon} />
                        <Text style={styles.noticeText}>{'体验金是理财魔方虚拟金额, 产生的收益奖励归你'}</Text>
                    </View>
                    <Text style={[styles.title, {marginBottom: text(10)}]}>{'7天体验金 (元)'}</Text>
                    <Text style={[styles.num]}>{'20000.00'}</Text>
                    <View style={styles.profitBox}>
                        <Text style={styles.profitText}>{'暂无收益'}</Text>
                    </View>
                    <View style={[Style.flexBetween, styles.items]}>
                        <View style={Style.flexCenter}>
                            <Text style={[styles.profitText, {color: Colors.lightGrayColor}]}>{'累计收益'}</Text>
                            <Text style={[styles.itemValue, {marginTop: text(7)}]}>{'0.00'}</Text>
                        </View>
                        <View style={Style.flexCenter}>
                            <Text style={[styles.profitText, {color: Colors.lightGrayColor}]}>{'开始日期'}</Text>
                            <Text style={[styles.itemValue, {marginTop: text(7)}]}>{'2020.5.10'}</Text>
                        </View>
                        <View style={Style.flexCenter}>
                            <Text style={[styles.profitText, {color: Colors.lightGrayColor}]}>{'到期日期'}</Text>
                            <Text style={[styles.itemValue, {marginTop: text(7)}]}>{'2020.5.10'}</Text>
                        </View>
                    </View>
                    <Text style={[styles.noticeText, styles.expireText]}>{'2020.06.20 过期'}</Text>
                    <Button
                        title={'立即使用'}
                        disabled={false}
                        color={'#D7AF74'}
                        style={styles.useBtn}
                        textStyle={{...styles.title, color: '#fff', fontWeight: '500'}}
                    />
                </View>
                <Text style={[styles.bigTitle, {marginTop: text(22), marginLeft: Space.marginAlign}]}>
                    {'为您精选'}
                </Text>
                <TouchableOpacity style={[Style.flexBetween, styles.productBox]}>
                    <View style={{flex: 1}}>
                        <Text style={styles.title}>
                            <Text style={{fontWeight: '500'}}>{'稳健组合 '}</Text>
                            <Text style={{fontSize: Font.textH3, color: Colors.descColor}}>
                                {'| 无惧黑天鹅，安心增值必备'}
                            </Text>
                        </Text>
                        <View style={[Style.flexRow, styles.yieldBox]}>
                            <Text style={[styles.yieldVal, {marginRight: text(5)}]}>
                                <Text>{'6.41'}</Text>
                                <Text style={{fontSize: text(18)}}>{'%'}</Text>
                            </Text>
                            <Text style={[styles.yieldKey, {marginBottom: text(2)}]}>{'过去两年年收益率'}</Text>
                        </View>
                        <View style={Style.flexRow}>
                            <Text style={[styles.yieldKey, styles.tag]}>{'优秀固收+'}</Text>
                            <Text style={[styles.yieldKey, styles.tag]}>{'更先进的 量化算法'}</Text>
                        </View>
                    </View>
                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                </TouchableOpacity>
                <View style={[Style.flexBetween, styles.withdrawBox]}>
                    <View style={{position: 'relative'}}>
                        <Text style={styles.title}>
                            {'收益余额(元) :  '}
                            <Text style={{fontSize: Font.textH1, fontFamily: Font.numMedium}}>{'12.05'}</Text>
                        </Text>
                        <TouchableOpacity
                            style={[Style.flexCenter, styles.fill]}
                            onPress={() => bottomModal.current.show()}>
                            <Text style={[styles.yieldKey, {color: '#fff'}]}>{'补'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'flex-end', marginTop: text(4)}}>
                        <Button
                            title={'立即提现'}
                            disabled={true}
                            disabledColor={'#F2F2F2'}
                            color={'#D7AF74'}
                            style={styles.withdrawBtn}
                            textStyle={{...styles.profitText, color: '#C1C1C1', fontWeight: '500'}}
                        />
                        <Text style={{...styles.yieldKey, color: '#DC4949'}}>{'23:59:59内提现, 收益翻倍!'}</Text>
                    </View>
                </View>
                <View style={[Style.flexRow, {paddingLeft: Space.padding}]}>
                    <Text style={{...styles.bigTitle, marginRight: text(8)}}>{'持有的产品'}</Text>
                    <Text style={{...styles.noticeText, color: Colors.lightGrayColor}}>{'仅展示体验金购买的产品'}</Text>
                </View>
                <View style={[Style.flexBetween, styles.productBox, {paddingRight: text(13)}]}>
                    <View style={{flex: 1}}>
                        <Text style={[styles.title, {fontWeight: '500'}]}>{'稳健 | 稳健组合'}</Text>
                        <View style={[Style.flexBetween, {marginTop: text(8)}]}>
                            <View>
                                <Text
                                    style={{...styles.noticeText, color: Colors.lightGrayColor, marginBottom: text(4)}}>
                                    {'总金额'}
                                </Text>
                                <Text style={{...styles.itemValue, fontFamily: Font.numFontFamily}}>{'20,912.48'}</Text>
                            </View>
                            <View>
                                <Text
                                    style={{...styles.noticeText, color: Colors.lightGrayColor, marginBottom: text(4)}}>
                                    {'累计收益'}
                                </Text>
                                <Text
                                    style={{
                                        ...styles.itemValue,
                                        color: getColor('912.48'),
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {'912.48'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        title={'买同款'}
                        disabled={false}
                        color={'#fff'}
                        style={styles.buyBtn}
                        textStyle={{...styles.profitText, color: '#376CCC', fontWeight: '500'}}
                    />
                </View>
            </ScrollView>
            <BottomModal
                title={'收益补贴说明'}
                ref={bottomModal}
                confirmText={'确定'}
                children={
                    <View style={{padding: Space.padding}}>
                        <HTML
                            html={
                                '受大盘波动影响，短期会存在亏损情况，根据过往数据，长期c收益率在**.**%-**.**%之间\n\n本次补贴您20元理财红包，点击下方立即提现，即可进入提现流程哦！'
                            }
                            style={styles.htmlStyle}
                        />
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(64),
        marginRight: text(14),
    },
    bg: {
        height: text(224),
    },
    topBox: {
        marginTop: text(-214),
        marginHorizontal: Space.marginAlign,
        paddingTop: Space.padding,
        paddingHorizontal: text(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    noticeBar: {
        marginBottom: text(24),
        paddingVertical: text(5),
        paddingLeft: text(6),
        borderRadius: text(2),
        backgroundColor: '#FEF6E9',
        width: '100%',
    },
    noticeIcon: {
        width: text(24),
        height: text(24),
        marginRight: text(7),
    },
    noticeText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#A0793E',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    fill: {
        position: 'absolute',
        right: text(-21),
        top: text(-16),
        backgroundColor: '#F96450',
        borderTopRightRadius: text(16),
        borderBottomRightRadius: text(16),
        borderTopLeftRadius: text(8),
        borderBottomLeftRadius: 0,
        width: text(21),
        height: text(16),
    },
    num: {
        fontSize: text(34),
        lineHeight: text(41),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    expireText: {
        lineHeight: text(15),
        color: Colors.lightGrayColor,
        marginTop: text(5),
    },
    useBtn: {
        marginVertical: text(20),
        borderRadius: text(6),
        width: text(152),
        height: text(38),
        backgroundColor: '#D7AF74',
    },
    profitBox: {
        marginTop: text(13),
        paddingVertical: text(7),
        paddingHorizontal: text(30),
        borderRadius: text(16),
        backgroundColor: '#F7F7F7',
    },
    profitText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.lightBlackColor,
    },
    items: {
        paddingTop: text(24),
        paddingBottom: text(16),
        paddingHorizontal: text(10),
        width: '100%',
    },
    itemValue: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: Colors.defaultColor,
        fontFamily: Font.numRegular,
    },
    withdrawBox: {
        margin: Space.marginAlign,
        paddingHorizontal: text(18),
        borderRadius: Space.borderRadius,
        height: text(80),
        backgroundColor: '#fff',
    },
    withdrawBtn: {
        marginBottom: text(6),
        width: text(84),
        height: text(32),
        backgroundColor: '#D7AF74',
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    productBox: {
        marginTop: text(12),
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    yieldBox: {
        paddingTop: text(6),
        paddingBottom: text(8),
        alignItems: 'flex-end',
    },
    yieldVal: {
        fontSize: text(22),
        lineHeight: text(26),
        color: '#DC4949',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    yieldKey: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.lightGrayColor,
    },
    tag: {
        marginRight: text(8),
        paddingVertical: text(2),
        paddingHorizontal: text(6),
        backgroundColor: '#F0F6FD',
        color: '#266EFF',
    },
    buyBtn: {
        marginLeft: text(32),
        borderRadius: text(6),
        borderWidth: Space.borderWidth,
        borderColor: '#376CCC',
        backgroundColor: '#fff',
        width: text(72),
        height: text(32),
    },
    htmlStyle: {
        fontSize: text(13),
        lineHeight: text(20),
        color: Colors.descColor,
    },
});

export default ExperienceGold;
