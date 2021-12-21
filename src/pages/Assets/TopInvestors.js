/*
 * @Date: 2021-07-27 17:00:06
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-12-21 14:29:58
 * @Description:牛人信号
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Octicons';
import HTML from '../../components/RenderHtml';
import {Chart} from '../../components/Chart';
import {baseAreaChart} from '../Portfolio/components/ChartOption';
import {FixedButton, Button} from '../../components/Button';
import Empty from '../../components/EmptyTip';
import {useJump} from '../../components/hooks';
import {deviceWidth, isIphoneX, px, deviceHeight} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {baseURL} from '../../services/config';
import Agreements from '../../components/Agreements';
import http from '../../services';
import Notice from '../../components/Notice';
import {BottomModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {debounce} from 'lodash';
import Loading from '../Portfolio/components/PageLoading';

const TopInvestors = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    const [chartData, setChartData] = useState({});
    const [showEmpty, setShowEmpty] = useState(false);
    const [signCheck, setSignCheck] = useState(false);
    const [signTimer, setSignTimer] = useState(8);
    const signModal = React.useRef(null);
    const show_sign_focus_modal = useRef(false);
    const intervalt_timer = useRef('');

    const init = () => {
        http.get('/niuren/buy/signal/info/20210801', {poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result || {});
                setShowEmpty(true);
                res.result.period && setPeriod(res.result.period);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            //解决弹窗里跳转 返回再次弹出
            if (data && show_sign_focus_modal.current) {
                signModal?.current?.show();
            }
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        setChartData((prev) => ({...prev, chart: ''}));
        http.get('/niuren/buy/signal/chart/20210801', {period, poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setChartData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);
    const handleClick = () => {
        if (!data.console?.adviser_sign?.is_signed) {
            setSignCheck(data?.console?.adviser_sign?.agreement_bottom?.default_agree);
            setSignTimer(data?.console?.adviser_sign?.risk_disclosure?.countdown);
            signModal.current?.show();
            intervalt_timer.current = setInterval(() => {
                setSignTimer((time) => {
                    if (time > 0) {
                        return --time;
                    } else {
                        intervalt_timer.current && clearInterval(intervalt_timer.current);
                        return time;
                    }
                });
            }, 1000);
        } else {
            jump(data.console?.button.url);
        }
    };
    //签约
    const handleSign = () => {
        http.post('adviser/sign/20210923', {poids: data?.console?.adviser_sign?.sign_po_ids}).then((res) => {
            signModal.current.toastShow(res.message);
            if (res.code === '000000') {
                setTimeout(() => {
                    signModal.current.hide();
                    jump(data.console?.button.url);
                }, 1000);
            }
        });
    };
    return Object.keys(data).length > 0 ? (
        <View style={{flex: 1, paddingBottom: isIphoneX() ? px(45) + px(8) + 34 : px(45) + px(8) + px(8)}}>
            {Object.keys(data).length > 0 && (
                <ScrollView bounces={false} style={{flex: 1}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{width: deviceWidth, height: px(210)}}
                        onPress={() => jump(data.console?.buy_url)}>
                        {data.console ? (
                            <WebView
                                renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                                startInLoadingState={true}
                                scalesPageToFit={false}
                                source={{
                                    uri: `${baseURL.H5}${data.console.canvas}`,
                                }}
                                textZoom={100}
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
                                <View style={[Style.flexCenter, styles.suggestionSty]}>
                                    <HTML html={data.console.desc} style={styles.suggestionTextSty} />
                                    {data.console?.button ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={handleClick}
                                            style={[
                                                Style.flexRowCenter,
                                                styles.followInvest,
                                                data.console?.is_autoing ? {backgroundColor: '#fff'} : {},
                                            ]}>
                                            {data.console?.is_autoing ? (
                                                <Image
                                                    source={require('../../assets/personal/open_follow.png')}
                                                    style={styles.openedFollow}
                                                />
                                            ) : null}
                                            <Text
                                                style={[
                                                    styles.followInvestText,
                                                    data.console?.is_autoing ? {color: '#FF7D41'} : {},
                                                ]}>
                                                {data.console?.button.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
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
                                            false,
                                            true
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
                                <Text style={styles.infoTitle}>{'牛人信号释义'}</Text>
                            </View>
                            {data.text?.diff_profit ? (
                                <View style={{marginTop: px(8)}}>
                                    <HTML
                                        html={data.text?.diff_profit}
                                        style={{...styles.contentSty, lineHeight: px(18)}}
                                    />
                                </View>
                            ) : null}
                            {data.text?.profit_intro ? (
                                <View style={[styles.contentBoxSty, {backgroundColor: '#fff', padding: 0}]}>
                                    <HTML
                                        html={data.text?.profit_intro}
                                        style={{...styles.contentSty, lineHeight: px(20)}}
                                    />
                                </View>
                            ) : null}
                        </View>
                        <View style={styles.boxSty}>
                            <View style={[Style.flexRow]}>
                                <Image source={require('../../assets/personal/remind.png')} style={styles.iconSty} />
                                <Text style={styles.infoTitle}>{'牛人信号提醒'}</Text>
                            </View>
                            <View style={{marginTop: px(8)}}>
                                <Text style={styles.contentSty}>
                                    {'热度值'}
                                    <Text
                                        style={{
                                            fontSize: px(18),
                                            lineHeight: px(18),
                                            color: Colors.red,
                                            fontWeight: 'bold',
                                        }}>
                                        {' ≥'}
                                    </Text>
                                    <Text style={styles.numSty}>{'80℃'}</Text>
                                </Text>
                            </View>
                            {data.text?.degree_intro ? (
                                <View style={styles.contentBoxSty}>
                                    <HTML
                                        html={data.text?.degree_intro}
                                        style={{...styles.contentSty, lineHeight: px(20)}}
                                    />
                                </View>
                            ) : null}
                        </View>
                        <Text style={styles.title}>{'牛人入选说明'}</Text>
                        {data.text?.niuren_intro ? (
                            <View style={styles.boxSty}>
                                <HTML html={data.text?.niuren_intro} style={styles.suggestionTextSty} />
                            </View>
                        ) : null}
                    </LinearGradient>
                    {data?.console?.adviser_sign && (
                        <BottomModal
                            style={{height: px(600), backgroundColor: '#fff'}}
                            ref={signModal}
                            title={data?.console?.adviser_sign?.title}
                            onClose={() => {
                                show_sign_focus_modal.current = false;
                                intervalt_timer.current && clearInterval(intervalt_timer.current);
                            }}>
                            <View style={{flex: 1}}>
                                {data?.console?.adviser_sign?.desc && (
                                    <Notice content={{content: data?.console?.adviser_sign?.desc}} />
                                )}
                                <ScrollView
                                    style={{
                                        paddingHorizontal: px(16),
                                        paddingTop: px(22),
                                    }}>
                                    <TouchableOpacity activeOpacity={1} style={{paddingBottom: px(40)}}>
                                        <Text style={{fontSize: px(18), fontWeight: '700', marginBottom: px(12)}}>
                                            {data?.console?.adviser_sign?.risk_disclosure?.title}
                                        </Text>
                                        {data?.console?.adviser_sign?.risk_disclosure?.content ? (
                                            <HTML
                                                html={data?.console?.adviser_sign?.risk_disclosure?.content}
                                                style={styles.light_text}
                                            />
                                        ) : null}
                                        {data?.console?.adviser_sign?.risk_disclosure2?.title ? (
                                            <Text
                                                style={{
                                                    fontSize: px(18),
                                                    fontWeight: '700',
                                                    marginTop: px(20),
                                                    marginBottom: px(12),
                                                }}>
                                                {data?.console?.adviser_sign?.risk_disclosure2?.title}
                                            </Text>
                                        ) : null}
                                        {data?.console?.adviser_sign?.risk_disclosure2?.content ? (
                                            <HTML
                                                html={data?.console?.adviser_sign?.risk_disclosure2?.content}
                                                style={styles.light_text}
                                            />
                                        ) : null}
                                    </TouchableOpacity>
                                </ScrollView>
                                <>
                                    {data?.console?.adviser_sign?.agreement_bottom ? (
                                        <Agreements
                                            style={{margin: px(16)}}
                                            check={data?.console?.adviser_sign?.agreement_bottom?.default_agree}
                                            data={data?.console?.adviser_sign?.agreement_bottom?.list}
                                            onChange={(checkStatus) => setSignCheck(checkStatus)}
                                            emitJump={() => {
                                                signModal?.current?.hide();
                                                show_sign_focus_modal.current = true;
                                            }}
                                        />
                                    ) : null}
                                    {data?.console?.adviser_sign?.button ? (
                                        <Button
                                            disabled={signTimer > 0 || !signCheck}
                                            style={{marginHorizontal: px(20)}}
                                            onPress={debounce(handleSign, 500)}
                                            title={
                                                signTimer > 0
                                                    ? signTimer + 's' + data?.console?.adviser_sign?.button?.text
                                                    : data?.console?.adviser_sign?.button?.text
                                            }
                                        />
                                    ) : null}
                                </>
                            </View>
                        </BottomModal>
                    )}
                </ScrollView>
            )}
            <FixedButton
                title={data.button?.text || '追加购买'}
                superscript={data.button?.superscript}
                disabled={!(data.button?.avail !== undefined ? data.button.avail : 1)}
                onPress={() => {
                    if (data.button?.action === 'buy') {
                        jump(data.button?.url);
                    } else {
                        http.post('/tool/manage/open/20211207', {type: 'niuren'}).then((res) => {
                            if (res.code === '000000') {
                                Toast.show('开启成功');
                                init();
                            }
                        });
                    }
                }}
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
        fontWeight: '700',
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
    followInvest: {
        marginTop: Space.marginVertical,
        marginBottom: px(4),
        borderWidth: Space.borderWidth,
        borderColor: '#FF7D41',
        borderRadius: px(20),
        width: px(240),
        height: px(40),
        backgroundColor: '#FF7D41',
    },
    followInvestText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    openedFollow: {
        marginRight: px(4),
        width: px(16),
        height: px(16),
    },
});
