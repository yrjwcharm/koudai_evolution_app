/*
 * @Date: 2022-07-11 14:31:52
 * @Description:资产页金额卡片
 */
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';

import {Colors, Font, Space, Style} from '~/common/commonStyle';

import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
import LinearGradient from 'react-native-linear-gradient';
import TradeNotice from '../components/TradeNotice';
import {getChart} from './service';
import {Chart, chartOptions} from '~/components/Chart';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
const AssetHeaderCard = ({summary = {}, tradeMes, showEye, children}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const [chart, setChart] = useState();
    const getChartData = async () => {
        let res = await getChart();
        setChart(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getChartData();
        }, [])
    );
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                //type获取
                dispatch({type: 'updateType', payload: 200});
                jump(summary?.url);
            }}>
            <LinearGradient
                colors={['#F1F9FF', Colors.bgColor]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={{marginBottom: px(12), paddingTop: px(8)}}>
                <LinearGradient
                    colors={['#1C58E7', '#528AED']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.assetsContainer}>
                    <Icon name="right" color="#fff" size={px(14)} style={styles.rightIcon} />
                    {/* 资产信息 */}
                    <View style={Style.flexRowCenter}>
                        <Text style={styles.summaryKey}>总资产(元)</Text>
                        <Text style={styles.date}>{summary?.asset_info?.date}</Text>
                        {children}
                    </View>
                    <View style={[Style.flexRow, styles.profitContainer]}>
                        <View style={{flex: 1}}>
                            <Text>
                                {showEye === 'true' ? (
                                    <Text style={styles.amount}>{summary?.asset_info?.value}</Text>
                                ) : (
                                    <Text style={styles.amount}>****</Text>
                                )}
                            </Text>
                            <View style={[Style.flexRow, {marginTop: px(12)}]}>
                                <View style={[{flex: 1}]}>
                                    <Text style={styles.profitKey}>{summary?.profit_info?.text || '日收益'}</Text>
                                    <Text style={styles.profitVal}>
                                        {showEye === 'true' ? summary?.profit_info?.value : '****'}
                                    </Text>
                                </View>
                                <View style={[{flex: 1}]}>
                                    <Text style={styles.profitKey}>{summary?.profit_acc_info?.text || '累计收益'}</Text>
                                    <Text style={styles.profitVal}>
                                        {showEye === 'true' ? summary?.profit_acc_info?.value : '****'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {chart?.length > 0 ? (
                            <View style={{width: px(120), height: px(70)}}>
                                <Chart
                                    style={{backgroundColor: 'transparent'}}
                                    initScript={chartOptions.smAssetChart(chart)}
                                />
                            </View>
                        ) : null}
                    </View>
                    {/* 交易通知 */}
                    {tradeMes ? <TradeNotice data={tradeMes} /> : null}
                </LinearGradient>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
};

export default AssetHeaderCard;

const styles = StyleSheet.create({
    assetsContainer: {
        backgroundColor: Colors.brandColor,
        borderRadius: px(6),
        alignItems: 'flex-start',
        padding: px(20),
        marginHorizontal: px(16),
    },
    mofang: {
        position: 'absolute',
        bottom: px(-40),
        right: 0,
        width: px(150),
        height: px(220),
    },
    rightIcon: {position: 'absolute', right: px(16), top: px(16)},
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.marginAlign,
    },
    systemMsgText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.yellow,
        textAlign: 'justify',
        flex: 1,
    },
    summaryKey: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
    },
    date: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
        marginHorizontal: px(10),
    },
    amount: {
        fontSize: px(24),
        lineHeight: px(30),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    profitContainer: {
        marginTop: px(4),
        alignItems: 'flex-start',
    },
    profitKey: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        opacity: 0.6,
        marginBottom: px(4),
    },
    profitVal: {
        fontSize: px(17),
        lineHeight: px(20),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
});
