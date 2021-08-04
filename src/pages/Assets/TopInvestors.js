/*
 * @Date: 2021-07-27 17:00:06
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-04 16:50:43
 * @Description:牛人信号
 */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Octicons';
import HTML from '../../components/RenderHtml';
import {Chart} from '../../components/Chart';
import {baseAreaChart} from '../Portfolio/components/ChartOption';
import {FixedButton} from '../../components/Button';
import Empty from '../../components/EmptyTip';
import {useJump} from '../../components/hooks';
import {deviceWidth, isIphoneX, px, formaNum, deviceHeight} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {baseURL} from '../../services/config';
import http from '../../services';

const TopInvestors = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y3');
    const [chartData, setChartData] = useState({});
    const [showEmpty, setShowEmpty] = useState(false);

    useEffect(() => {
        http.get('/niuren/buy/signal/info/20210801', {poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result || {});
                setShowEmpty(true);
            }
        });
    }, [route.params]);

    useEffect(() => {
        setChartData((prev) => ({...prev, chart: ''}));
        http.get('/niuren/buy/signal/chart/20210801', {period, poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setChartData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    return Object.keys(data).length > 0 ? (
        <View style={{flex: 1, paddingBottom: isIphoneX() ? px(45) + px(8) + 34 : px(45) + px(8) + px(8)}}>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{flex: 1}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{width: deviceWidth, height: px(210)}}
                        onPress={() => jump(data.console?.buy_url)}>
                        {data.console ? (
                            <WebView
                                startInLoadingState={true}
                                scalesPageToFit={false}
                                source={{
                                    uri: `${baseURL.H5}${data.console.canvas}`,
                                }}
                            />
                        ) : null}
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['#f7f8f9', Colors.bgColor]}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        style={{paddingHorizontal: Space.padding, paddingBottom: px(20)}}>
                        {data.console?.desc ? (
                            <View style={Style.flexCenter}>
                                <Icon name={'triangle-up'} size={22} color={'#fff'} />
                                <View style={styles.suggestionSty}>
                                    <HTML html={data.console.desc} style={styles.suggestionTextSty} />
                                </View>
                            </View>
                        ) : null}
                        <Text style={styles.title}>{'牛人买入点走势图'}</Text>
                        <View style={{...styles.boxSty, minHeight: px(276)}}>
                            <View style={{height: px(216)}}>
                                {chartData.chart ? (
                                    <Chart
                                        initScript={baseAreaChart(
                                            chartData.chart,
                                            [Colors.defaultColor],
                                            ['transparent'],
                                            true,
                                            2,
                                            deviceWidth - px(64),
                                            10,
                                            chartData.tag_position,
                                            px(208),
                                            chartData.max_ratio,
                                            false
                                        )}
                                        style={{width: '100%'}}
                                    />
                                ) : null}
                            </View>
                            {chartData?.sub_tabs ? (
                                <View style={Style.flexRowCenter}>
                                    {chartData?.sub_tabs?.map?.((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={[
                                                    styles.btn_sty,
                                                    {
                                                        backgroundColor: period === item.val ? '#F1F6FF' : '#fff',
                                                        borderColor: period === item.val ? '#F1F6FF' : '#E2E4EA',
                                                    },
                                                ]}
                                                key={index}
                                                onPress={() => setPeriod(item.val)}>
                                                <Text
                                                    style={{
                                                        ...styles.contentSty,
                                                        color:
                                                            period === item.val ? Colors.brandColor : Colors.descColor,
                                                    }}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ) : null}
                        </View>
                        <Text style={styles.title}>{'牛人信号说明'}</Text>
                        <View style={styles.boxSty}>
                            <View style={Style.flexRow}>
                                <Image
                                    source={require('../../assets/personal/achievement.png')}
                                    style={styles.iconSty}
                                />
                                <Text style={styles.infoTitle}>{'牛人信号业绩'}</Text>
                            </View>
                            <View style={{marginTop: px(8)}}>
                                <Text style={styles.contentSty}>
                                    {'投资以来总收益可增加'}
                                    <Text style={styles.numSty}>{formaNum(data.diff_profit || 0)}</Text>
                                    {'元'}
                                </Text>
                            </View>
                            <View style={styles.contentBoxSty}>
                                <HTML
                                    html={`魔方认为进行一次性投资，长期来看累计收益最佳。<br />但个人投资者的资金很难进行一次性投资，因此用户很难清晰认知到何时进行加仓，导致于部分魔方用户收益低于智能组合收益，因此魔方根据平台优质用户的加仓点为用户进行推送追加购买时间点。<br />该时间点进行买入，根据历史回测数据，您投资以来的总收益可增加<span style="color: #E74949;font-family: DINAlternate-Bold;fontFamily: DINAlternate-Bold;">${formaNum(
                                        data.diff_profit || 0
                                    )}</span>元。`}
                                    style={{...styles.contentSty, lineHeight: px(20)}}
                                />
                            </View>
                            <View style={[Style.flexRow, {marginTop: px(20)}]}>
                                <Image source={require('../../assets/personal/remind.png')} style={styles.iconSty} />
                                <Text style={styles.infoTitle}>{'牛人信号提醒'}</Text>
                            </View>
                            <View style={{marginTop: px(8)}}>
                                <Text style={styles.contentSty}>
                                    {'热度值'}
                                    <Text style={styles.numSty}>{' >80℃'}</Text>
                                </Text>
                            </View>
                            <View style={styles.contentBoxSty}>
                                <HTML
                                    html={
                                        '理财魔方以牛人买入的热度提供温度计，超过<span style="color: #E74949;font-family: DINAlternate-Bold;fontFamily: DINAlternate-Bold;">80℃</span>时推荐用户进行加仓。'
                                    }
                                    style={{...styles.contentSty, lineHeight: px(20)}}
                                />
                            </View>
                        </View>
                        <Text style={styles.title}>{'牛人入选说明'}</Text>
                        <View style={styles.boxSty}>
                            <HTML
                                html={
                                    '牛人是指资金进出结构操作优秀，能稳定超越同时期组合收益率最高的的<span style="color: #E74949;font-family: DINAlternate-Bold;fontFamily: DINAlternate-Bold;">1%</span>用户。<br /><span style="color: #121D3A;font-weight: 500;">牛人每日进行更新</span>，保证魔方用户可收到<span style="color: #121D3A;font-weight: 500;">最优买入点</span>信息。'
                                }
                                style={styles.suggestionTextSty}
                            />
                        </View>
                    </LinearGradient>
                </ScrollView>
            )}
            <FixedButton
                title={data.button?.text || '追加购买'}
                disabled={!(data.button?.avail || 1)}
                onPress={() => jump(data.button?.url)}
            />
        </View>
    ) : showEmpty ? (
        <Empty img={require('../../assets/img/emptyTip/noSignal.png')} text={'页面不存在'} />
    ) : (
        <View style={[Style.flexCenter, {height: deviceHeight}]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    );
};

export default TopInvestors;

const styles = StyleSheet.create({
    con: {
        backgroundColor: '#fff',
        flex: 1,
    },
    suggestionSty: {
        marginTop: px(-7),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    suggestionTextSty: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.descColor,
    },
    title: {
        marginTop: px(20),
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    boxSty: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    iconSty: {
        width: px(20),
        height: px(20),
        marginRight: px(4),
        marginLeft: px(-2),
    },
    infoTitle: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    contentSty: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    numSty: {
        fontSize: px(18),
        lineHeight: px(18),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    contentBoxSty: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    btn_sty: {
        borderWidth: Space.borderWidth,
        borderColor: '#E2E4EA',
        paddingHorizontal: px(12),
        paddingVertical: px(6),
        borderRadius: px(20),
        marginHorizontal: px(6),
    },
});
