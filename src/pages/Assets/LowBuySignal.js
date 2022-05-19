import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Animated,
    PanResponder,
    ActivityIndicator,
    Platform,
    TextInput,
    Switch,
} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth, isIphoneX, px} from '../../utils/appUtil';
import {FixedButton, Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import FastImage from 'react-native-fast-image';
import http from '../../services';
import Header from '../../components/NavBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import URI from 'urijs';
import {baseURL} from '../../services/config';
import dayjs from 'dayjs';
import Html from '../../components/RenderHtml';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';
import Icon from 'react-native-vector-icons/AntDesign';
import {LowBuyAreaChart} from '../../components/Chart/chartOptions';
import {useFocusEffect} from '@react-navigation/native';
import Toast from '../../components/Toast';
import {PageModal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Agreements from '../../components/Agreements';
import Notice from '../../components/Notice';
import {Modal} from '../../components/Modal';

const LoadingComponent = () => {
    return (
        <View
            style={{
                paddingTop: Space.padding,
                flex: 1,
                backgroundColor: '#fff',
            }}>
            <FastImage
                style={{
                    flex: 1,
                }}
                source={require('../../assets/personal/loading.png')}
                resizeMode={FastImage.resizeMode.contain}
            />
        </View>
    );
};
const LoadingWebview = () => {
    return (
        <View
            style={[
                Style.flexCenter,
                {position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: '#fff'},
            ]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    );
};

const source = Platform.select({
    ios: require('../../components/Chart/f2chart.html'),
    android: {uri: 'file:///android_asset/f2chart.html'},
});

const LowBuySignalExplain = ({route}) => {
    const jump = useJump();
    const [loading, updateLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [data, setData] = useState({});
    const [isOpen, updateIsOpen] = useState(false);
    const [calcData, setCalcData] = useState({});
    const [curTab, setCurTab] = useState('');
    const [sliderMoveRate, setSliderMoveRate] = useState(undefined);
    const [movingSlider, updateMovingSlider] = useState(false);
    const [loadingChart, updateLoadingChart] = useState(false);
    const [moveDirection, setMoveDirection] = useState('left');
    const [webviewLoaded, setWebviewLoaded] = useState('1');
    const [calcTableLeft, setCalcTableLeft] = useState([]);
    const [calcTableCenter, seCalctTableCenter] = useState([]);
    const [calcTableRight, setCalcTableRight] = useState([]);
    const [annualTableLeft, setAnnualTableLeft] = useState([]);
    const [annualTableCenter, setAnnualTableCenter] = useState([]);
    const [annualTableRight, setAnnualTableRight] = useState([]);
    const [loadSecondWebView, updateLoadSecondWebView] = useState(false);
    const [buttonDistance, setButtonDistance] = useState(null);
    const [signCheck, setSignCheck] = useState(false);
    const [signTimer, setSignTimer] = useState(8);
    const [autoFlowState, updateAutoFlowState] = useState(false);
    const startDateRef = useRef(null);
    const textInputRef = useRef(null);
    const sliderWidth = useRef(0);
    const left = useRef(new Animated.Value(0));
    const initLeft = useRef(true);
    let prevTouchLeft = useRef(0);
    const prevMoveLeft = useRef(0);
    const chartRef = useRef(null);
    const panelChartRef = useRef(null);
    const signModal = useRef(null);
    const show_sign_focus_modal = useRef(false);
    const intervalt_timer = useRef(null);
    const passwordRef = useRef(null);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                updateMovingSlider(true);
            },
            onPanResponderMove: (event, {dx, moveX}) => {
                setMoveDirection(moveX > prevMoveLeft.current ? 'right' : 'left');
                prevMoveLeft.current = moveX;
                let distance = prevTouchLeft.current + dx;
                let sliderMaxDistance = px(311) - sliderWidth.current;
                if (distance < 0) {
                    left.current.setValue(0);
                } else if (distance > sliderMaxDistance) {
                    left.current.setValue(sliderMaxDistance);
                } else {
                    left.current.setValue(distance);
                }
                setSliderMoveRate(left.current._value / sliderMaxDistance);
            },
            onPanResponderRelease: (event, {dx}) => {
                let sliderMaxDistance = px(311) - sliderWidth.current;
                let _prevLeft = prevTouchLeft.current;
                if (_prevLeft + dx > sliderMaxDistance) {
                    prevTouchLeft.current = sliderMaxDistance;
                } else if (_prevLeft + dx < 0) {
                    prevTouchLeft.current = 0;
                } else {
                    prevTouchLeft.current += dx;
                }
                updateMovingSlider(false);
            },
        })
    ).current;

    const handlerTableInfo = (tableInfo, idx) => {
        return tableInfo.reduce((memo, cur) => {
            memo.push(cur[idx]);
            return memo;
        }, []);
    };

    useEffect(() => {
        if (calcData.chart) {
            if (webviewLoaded === '2') {
                chartRef.current?.injectJavaScript(`chart.hideTooltip();chart.clear();`);
                let injectedJavaScript = LowBuyAreaChart(
                    calcData?.chart,
                    [Colors.red, '#6694F3'],
                    ['l(90) 0:#E74949 1:#fff', 'transparent'],
                    calcData?.tag_position,
                    px,
                    calcData?.negative_yield_dates
                );
                chartRef.current?.injectJavaScript(injectedJavaScript);
                setTimeout(() => {
                    updateLoadSecondWebView(true);
                }, 500);
            }
            updateLoadingChart(false);
        }
    }, [calcData.chart, calcData.tag_position, calcData.negative_yield_dates, webviewLoaded]);

    const init = useCallback(() => {
        http.get('/signal/low_buy/detail/20220214', {poid: route.params?.poid}).then((res) => {
            setData(res.result);
            updateIsOpen(res.result.is_open);
            updateAutoFlowState(res.result.head?.settings?.is_autoing);
            let tableInfo = [res.result.annual_yield.table.th, ...res.result.annual_yield.table.td];
            setAnnualTableLeft(handlerTableInfo(tableInfo, 0));
            setAnnualTableCenter(handlerTableInfo(tableInfo, 1));
            setAnnualTableRight(handlerTableInfo(tableInfo, 2));
            updateLoading(false);
        });
    }, [route.params.poid]);

    useFocusEffect(
        useCallback(() => {
            //解决弹窗里跳转 返回再次弹出
            if (data && show_sign_focus_modal.current) {
                signModal?.current?.show();
                startTimer();
            }
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        if (!curTab || !startDateRef.current || movingSlider) return;
        updateLoadingChart(true);
        http.get('/signal/low_buy/chart/20220214', {
            start_date: startDateRef.current,
            type: curTab,
            poid: route.params?.poid,
        }).then((res) => {
            setCalcData(res.result);
            let tableInfo = [res.result.table_info.th, ...res.result.table_info.td];
            setCalcTableLeft(handlerTableInfo(tableInfo, 0));
            seCalctTableCenter(handlerTableInfo(tableInfo, 1));
            setCalcTableRight(handlerTableInfo(tableInfo, 2));
        });
    }, [curTab, route.params.poid, startDateRef, movingSlider]);

    useEffect(() => {
        const start_date = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
        textInputRef.current?.setNativeProps({text: start_date + '起一年'});
        startDateRef.current = start_date;
        setCurTab('nav');
    }, []);

    useEffect(() => {
        if (!isNaN(sliderMoveRate)) {
            let rate = sliderMoveRate.toFixed(4);
            let rangeStartDate = dayjs(calcData.date_bar?.start_date);
            let rangeEndDate = dayjs().subtract(1, 'year');
            let diffDays = rangeEndDate.diff(rangeStartDate, 'day');
            let addDays = Math.round(diffDays * rate);

            const start_date = rangeStartDate.add(addDays, 'day').format('YYYY-MM-DD');
            textInputRef.current?.setNativeProps({text: start_date + '起一年'});
            startDateRef.current = start_date;
        }
    }, [calcData.date_bar, sliderMoveRate]);

    //签约计时器
    const startTimer = () => {
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
    };

    /** @name 点击确认签约，完成输入交易密码 */
    const onSubmit = (password) => {
        const loading1 = Toast.showLoading('签约中...');
        http.post('/adviser/sign/20210923', {password, poids: data?.adviser_sign?.sign_po_ids}).then((res) => {
            Toast.hide(loading1);
            Toast.show(res.message);
            if (res.code === '000000') {
                setTimeout(() => {
                    signModal.current.hide();
                    jump(data.button.url);
                }, 1000);
            }
        });
    };

    const handlerOpenFlow = (val) => {
        if (!data.adviser_sign?.is_signed) {
            setSignCheck(data?.adviser_sign?.agreement_bottom?.default_agree);
            setSignTimer(data?.adviser_sign?.risk_disclosure?.countdown);
            signModal.current?.show();
            startTimer();
        } else if (val) {
            jump(data.head?.settings?.button?.url);
        } else if (!val) {
            Modal.show({
                title: data.head?.settings?.pop?.title,
                content: data.head?.settings?.pop?.content,
                confirmText: data.head?.settings?.pop?.confirm?.text,
                isTouchMaskToClose: false,
                confirm: true,
                confirmCallBack: () => {
                    http.post('/signal/follow_invest/setting/modify/20220214', {
                        ...data.head?.settings,
                        status: 0,
                        auto_charge_status: 0,
                    }).then((res) => {
                        console.log(res);
                    });
                    updateAutoFlowState(val);
                },
            });
        }
    };

    return loading ? (
        <LoadingComponent />
    ) : (
        <View
            style={[
                styles.container,
                {paddingBottom: scrollY > buttonDistance + px(285) ? (isIphoneX() ? text(85) : text(51)) : px(0)},
            ]}>
            {isOpen ? (
                <Header
                    leftIcon="chevron-left"
                    fontStyle={{
                        color: Colors.defaultFontColor,
                    }}
                    title={'低位买入信号'}
                    style={{
                        opacity: 1,
                        width: deviceWidth,
                        backgroundColor: '#fff',
                    }}
                />
            ) : (
                <Header
                    leftIcon="chevron-left"
                    fontStyle={{
                        color: scrollY > 0 ? Colors.defaultFontColor : '#fff',
                    }}
                    title={scrollY > 0 ? '低位买入信号' : ''}
                    style={{
                        opacity: 1,
                        width: deviceWidth,
                        backgroundColor: scrollY > 0 ? '#fff' : 'transparent',
                        position: 'absolute',
                    }}
                />
            )}

            <ScrollView
                bounces={false}
                onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={6}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {isOpen ? (
                    <LinearGradient colors={['#FFFFFF', '#F5F6F8']} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                        <View
                            style={{
                                height: px(285),
                                paddingTop: px(10),
                            }}>
                            {loadSecondWebView && (
                                <WebView
                                    bounces={false}
                                    allowFileAccess
                                    allowFileAccessFromFileURLs
                                    allowUniversalAccessFromFileURLs
                                    javaScriptEnabled
                                    ref={panelChartRef}
                                    scrollEnabled={false}
                                    onMessage={(e) => {
                                        console.log(e.nativeEvent.data);
                                        if (e.nativeEvent.data === 'click') {
                                            jump(data.button?.url);
                                        }
                                    }}
                                    style={{width: '100%', height: px(260), alignSelf: 'center', opacity: 0.99}}
                                    renderLoading={() => <LoadingWebview />}
                                    source={{
                                        uri: URI(baseURL.H5 + '/panelChartOfTool')
                                            .addQuery({
                                                data: JSON.stringify({
                                                    chart: data.head?.chart?.chart,
                                                    desc: data.head?.desc,
                                                }),
                                            })
                                            .valueOf(),
                                    }}
                                    startInLoadingState={true}
                                    originWhitelist={['*']}
                                    textZoom={100}
                                />
                            )}
                        </View>
                        <View style={{}}>
                            <View style={styles.summaryWrapper}>
                                <FastImage
                                    source={require('../../assets/img/comma.png')}
                                    style={styles.comma}
                                    resizeMode="contain"
                                />
                                <Html html={data?.head?.content} style={styles.summaryText} />
                            </View>
                            {/* auto flow */}
                            {data.head?.settings && (
                                <View style={styles.autoFlow}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={[styles.autoFlowItem]}
                                        onPress={() => handlerOpenFlow(!autoFlowState)}>
                                        <Text style={[styles.autoFlowItemLeft]}>
                                            {data.head?.settings?.button?.text}
                                        </Text>
                                        <Switch
                                            onValueChange={handlerOpenFlow}
                                            ios_backgroundColor={'#CCD0DB'}
                                            thumbColor={'#fff'}
                                            trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                            value={autoFlowState}
                                        />
                                    </TouchableOpacity>
                                    {autoFlowState && (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                jump(data.head?.settings?.button?.url);
                                            }}
                                            style={[
                                                styles.autoFlowItem,
                                                {
                                                    borderTopColor: '#E9EAEF',
                                                    borderTopWidth: px(1),
                                                },
                                            ]}>
                                            <Text style={[styles.autoFlowItemLeft]}>跟投金额(元)</Text>
                                            <View style={styles.autoFlowAmountWrapper}>
                                                <Text style={styles.autoFlowAmount}>
                                                    {data.head?.settings?.f_amount}
                                                </Text>
                                                <Icon
                                                    style={{marginLeft: px(5)}}
                                                    name="right"
                                                    size={15}
                                                    color="#9095A5"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* button */}
                            {data.button && (
                                <Button
                                    title={data.button.text}
                                    disabled={!(data?.button?.avail !== undefined ? data.button.avail : 1)}
                                    superscript={data.button.superscript}
                                    onLayout={(obj) => {
                                        setButtonDistance(obj.y + obj.height);
                                    }}
                                    onPress={() => {
                                        if (data.button?.action === 'buy') {
                                            jump(data.button?.url);
                                        } else {
                                            http.post('/tool/manage/open/20211207', {type: 'low_buy'}).then((res) => {
                                                if (res.code === '000000') {
                                                    Toast.show('开启成功');
                                                    init();
                                                }
                                            });
                                        }
                                    }}
                                    style={{
                                        marginTop: px(34),
                                        marginBottom: px(50),
                                        width: px(311),
                                        alignSelf: 'center',
                                        borderRadius: px(22),
                                    }}
                                />
                            )}
                        </View>
                    </LinearGradient>
                ) : (
                    <View>
                        <FastImage style={{width: '100%', height: px(354)}} source={{uri: data.head?.head_pic}} />
                    </View>
                )}

                <View style={styles.part}>
                    <Text style={styles.partTitle}>{calcData.title}</Text>
                    <View style={styles.amountWrapper}>
                        <View style={styles.amountBlock}>
                            <View style={styles.amountBlockTop}>
                                <Html style={{fontFamily: Font.numFontFamily}} html={calcData.yield_info?.[0].value} />
                            </View>
                            <Text style={styles.amountBlockBottom}>{calcData.yield_info?.[0].text}</Text>
                        </View>
                        <View style={styles.amountBlock}>
                            <View style={styles.amountBlockTop}>
                                <Html style={{fontFamily: Font.numFontFamily}} html={calcData.yield_info?.[1].value} />
                            </View>
                            <Text style={styles.amountBlockBottom}>{calcData.yield_info?.[1].text}</Text>
                        </View>
                    </View>
                    <ImageBackground source={require('../../assets/img/dialog-box.png')} style={styles.calcAmountTip}>
                        <Html html={calcData.yield_tip} />
                    </ImageBackground>
                    <View style={styles.tabsWrapper}>
                        {calcData?.sub_tabs?.map((tab, idx) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                key={tab.type}
                                style={[styles.tabItem, {marginLeft: px(idx > 0 ? 40 : 0)}]}
                                onPress={() => {
                                    setCurTab(tab.type);
                                }}>
                                <Text
                                    style={[
                                        styles.tabItemText,
                                        curTab === tab.type && {color: Colors.brandColor, fontWeight: '600'},
                                    ]}>
                                    {tab.name}
                                </Text>
                                <View
                                    style={[
                                        styles.tabUnderline,
                                        curTab === tab.type && {backgroundColor: Colors.brandColor},
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.chartWrapper}>
                        <WebView
                            allowFileAccess
                            allowFileAccessFromFileURLs
                            allowUniversalAccessFromFileURLs
                            javaScriptEnabled
                            ref={chartRef}
                            onLoadEnd={() => {
                                setWebviewLoaded('2');
                            }}
                            scrollEnabled={false}
                            style={{flex: 1, opacity: 0.99}}
                            renderLoading={() => <LoadingWebview />}
                            source={source}
                            startInLoadingState={true}
                            originWhitelist={['*']}
                            textZoom={100}
                            onMessage={(e) => {
                                console.log(e.nativeEvent.data);
                            }}
                        />
                        {loadingChart && <LoadingWebview />}
                    </View>
                    <View style={styles.chartSliderWrapper}>
                        <View style={styles.chartSliderBg} />
                        <Animated.View
                            style={[
                                styles.chartSlider,
                                {
                                    left: left.current,
                                },
                            ]}
                            {...panResponder.panHandlers}
                            onLayout={(e) => {
                                sliderWidth.current = e.nativeEvent.layout.width;
                                if (initLeft.current) {
                                    initLeft.current = false;
                                    let maxDistance = px(311) - sliderWidth.current;
                                    left.current.setValue(maxDistance);
                                    prevTouchLeft.current = maxDistance;
                                    if (startDateRef.current)
                                        textInputRef.current?.setNativeProps({text: startDateRef.current + '起一年'});
                                }
                            }}>
                            <View style={[styles.leftArrow, {opacity: moveDirection === 'left' ? 1 : 0.3}]} />
                            <View style={[styles.rightArrow, {opacity: moveDirection === 'right' ? 1 : 0.3}]} />
                            <TextInput
                                editable={false}
                                rejectResponderTermination={false}
                                ref={(e) => (textInputRef.current = e)}
                                style={styles.chartSliderText}
                            />
                        </Animated.View>
                    </View>
                    {curTab === 'nav' && calcData?.negative_yield_dates?.[0] && (
                        <View style={styles.greenAreaHintWrapper}>
                            <View style={styles.greenAreaHintFigure} />
                            <Text style={styles.greenAreaHintText}>{calcData.reminder}</Text>
                        </View>
                    )}
                    <View style={styles.tableWrapper}>
                        <View style={styles.tableLeft}>
                            {calcTableLeft.map((item, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        Style.flexCenter,
                                        {
                                            height: px(idx === 0 ? 40 : 48),
                                            borderTopLeftRadius: px(idx === 0 ? 4 : 0),
                                            borderBottomLeftRadius: px(idx === 4 ? 4 : 0),
                                            backgroundColor: idx % 2 === 0 ? '#F5F6F7' : '#fff',
                                        },
                                    ]}>
                                    <Html style={styles.tableText} html={item} />
                                </View>
                            ))}
                        </View>
                        <View style={[styles.tableCenter]}>
                            <BoxShadow
                                setting={{
                                    color: '#dc4949',
                                    opacity: 0.07,
                                    width: px(112),
                                    height: px(240),
                                    radius: px(4),
                                    x: -1,
                                    y: 0,
                                }}>
                                {calcTableCenter.map((item, idx) => {
                                    if (idx === 0) {
                                        return (
                                            <LinearGradient
                                                key={'linear'}
                                                style={[
                                                    Style.flexCenter,
                                                    {
                                                        height: px(44),
                                                        width: px(110),
                                                        borderTopLeftRadius: px(4),
                                                        borderTopRightRadius: px(4),
                                                    },
                                                ]}
                                                colors={['#FDA4A4', '#FFE6E4']}
                                                start={{x: 0, y: 0}}
                                                end={{x: 0, y: 1}}>
                                                <Html style={styles.tableTitle} html={item} />
                                            </LinearGradient>
                                        );
                                    } else {
                                        return (
                                            <View
                                                key={idx}
                                                style={[
                                                    Style.flexCenter,
                                                    {
                                                        height: px(idx === 4 ? 52 : 48),
                                                        width: px(110),
                                                        backgroundColor: idx % 2 === 0 ? '#FFE6E4' : '#fff',
                                                        borderBottomLeftRadius: px(idx === 4 ? 4 : 0),
                                                        borderBottomRightRadius: px(idx === 4 ? 4 : 0),
                                                    },
                                                ]}>
                                                <Html style={styles.tableText} html={item} />
                                            </View>
                                        );
                                    }
                                })}
                            </BoxShadow>
                        </View>
                        <View style={styles.tableRight}>
                            {calcTableRight.map((item, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        Style.flexCenter,
                                        {
                                            height: px(idx === 0 ? 40 : 48),
                                            backgroundColor: idx % 2 === 0 ? '#F5F6F7' : '#fff',
                                        },
                                    ]}>
                                    <Html html={item} style={idx === 0 ? styles.tableTitle : styles.tableText} />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.part}>
                    <Text style={styles.partTitle}>{data.annual_yield?.title}</Text>
                    <View style={styles.yieldInfo}>
                        <View>
                            <FastImage
                                source={require('../../assets/img/yield.png')}
                                style={{width: px(87), height: px(25)}}
                            />
                        </View>
                        <View style={styles.yieldInfoData}>
                            <View style={styles.yieldInfoDataRate}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.yieldInfoDataRateNum, {color: '#E74949'}]}>
                                        {data.annual_yield?.yield_info[1]?.value.slice(0, -1)}
                                    </Text>
                                    <Text style={[styles.yieldInfoDataRateNumSymbol, {color: '#E74949'}]}>%</Text>
                                </View>

                                <FastImage
                                    source={require('../../assets/img/top-right-arrow.png')}
                                    style={{width: px(42), height: px(30), marginHorizontal: px(13)}}
                                />
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.yieldInfoDataRateNum, {color: '#121D3A'}]}>
                                        {data.annual_yield?.yield_info[0]?.value.slice(0, -1)}
                                    </Text>
                                    <Text style={[styles.yieldInfoDataRateNumSymbol, {color: '#121D3A'}]}>%</Text>
                                </View>
                            </View>
                            <View style={styles.yieldInfoDataRateNumDescWrapper}>
                                <Text style={styles.yieldInfoDataRateNumDesc}>
                                    {data.annual_yield?.yield_info[1]?.text}
                                </Text>
                                <Text style={styles.yieldInfoDataRateNumDesc}>
                                    {data.annual_yield?.yield_info[0]?.text}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.annualDesc}>
                        <Html
                            style={{color: '#545968', fontWeight: '300', fontSize: px(13), lineHeight: px(21)}}
                            html={data.annual_yield?.desc}
                        />
                    </View>
                    <View style={styles.tableWrapper}>
                        <View style={styles.tableLeft}>
                            {annualTableLeft.map((item, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        Style.flexCenter,
                                        {
                                            height: px(idx === 0 ? 40 : 48),
                                            borderTopLeftRadius: px(idx === 0 ? 3 : 0),
                                            borderBottomLeftRadius: px(idx === 3 ? 4 : 0),
                                            backgroundColor: idx % 2 === 0 ? '#F5F6F7' : '#fff',
                                        },
                                    ]}>
                                    <Html style={styles.tableText} html={item} />
                                </View>
                            ))}
                        </View>
                        <View style={[styles.tableCenter]}>
                            <BoxShadow
                                setting={{
                                    color: '#dc4949',
                                    opacity: 0.07,
                                    width: px(112),
                                    height: px(193),
                                    radius: px(4),
                                    x: -1,
                                    y: 0,
                                }}>
                                {annualTableCenter.map((item, idx) => {
                                    if (idx === 0) {
                                        return (
                                            <LinearGradient
                                                key={'linear2'}
                                                style={[
                                                    Style.flexCenter,
                                                    {
                                                        height: px(44),
                                                        width: px(110),
                                                        borderTopLeftRadius: px(4),
                                                        borderTopRightRadius: px(4),
                                                    },
                                                ]}
                                                colors={['#FDA4A4', '#FFE6E4']}
                                                start={{x: 0, y: 0}}
                                                end={{x: 0, y: 1}}>
                                                <Html style={styles.tableTitle} html={item} />
                                            </LinearGradient>
                                        );
                                    } else {
                                        return (
                                            <View
                                                key={idx}
                                                style={[
                                                    Style.flexCenter,
                                                    {
                                                        height: px(idx === 3 ? 52 : 48),
                                                        width: px(110),
                                                        backgroundColor: idx % 2 === 0 ? '#FFE6E4' : '#fff',
                                                        borderBottomLeftRadius: px(idx === 3 ? 4 : 0),
                                                        borderBottomRightRadius: px(idx === 3 ? 4 : 0),
                                                    },
                                                ]}>
                                                <Html style={styles.tableText} html={item} />
                                            </View>
                                        );
                                    }
                                })}
                            </BoxShadow>
                        </View>
                        <View style={styles.tableRight}>
                            {annualTableRight.map((item, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        Style.flexCenter,
                                        {
                                            height: px(idx === 0 ? 40 : 48),
                                            backgroundColor: idx % 2 === 0 ? '#F5F6F7' : '#fff',
                                        },
                                    ]}>
                                    <Html html={item} style={idx === 0 ? styles.tableTitle : styles.tableText} />
                                </View>
                            ))}
                        </View>
                    </View>
                    {data.annual_yield?.data_time ? (
                        <Text style={styles.dataTime}>{data.annual_yield?.data_time}</Text>
                    ) : null}
                </View>
                <View style={{marginTop: px(16)}}>
                    <FastImage
                        style={{width: '100%', height: px(511), marginBottom: px(20)}}
                        source={{uri: data.profit_prob?.img}}
                    />
                </View>
            </ScrollView>
            {
                <FixedButton
                    disabled={!(data?.button?.avail !== undefined ? data.button.avail : 1)}
                    title={data.button?.text}
                    superscript={data.button?.superscript}
                    style={isOpen && !(data?.button && scrollY > buttonDistance + px(285)) ? {display: 'none'} : {}}
                    onPress={() => {
                        if (data?.button?.action === 'buy') {
                            jump(data?.button?.url);
                        } else {
                            http.post('/tool/manage/open/20211207', {type: 'low_buy'}).then((res) => {
                                if (res.code === '000000') {
                                    Toast.show('开启成功');
                                    init();
                                }
                            });
                        }
                    }}
                />
            }
            {data?.adviser_sign && (
                <PageModal
                    style={{height: px(600), backgroundColor: '#fff'}}
                    ref={signModal}
                    title={data?.adviser_sign?.title}
                    onClose={() => {
                        show_sign_focus_modal.current = false;
                        intervalt_timer.current && clearInterval(intervalt_timer.current);
                    }}>
                    <View style={{flex: 1, paddingBottom: px(20)}}>
                        {data?.adviser_sign?.desc && <Notice content={{content: data?.adviser_sign?.desc}} />}
                        <ScrollView
                            style={{
                                paddingHorizontal: px(16),
                                paddingTop: px(22),
                            }}>
                            <TouchableOpacity activeOpacity={1} style={{paddingBottom: px(40)}}>
                                <Text style={{fontSize: px(18), fontWeight: '700', marginBottom: px(12)}}>
                                    {data?.adviser_sign?.risk_disclosure?.title}
                                </Text>
                                {data?.adviser_sign?.risk_disclosure?.content ? (
                                    <Html
                                        html={data?.adviser_sign?.risk_disclosure?.content}
                                        style={styles.light_text}
                                    />
                                ) : null}
                                {data?.adviser_sign?.risk_disclosure2?.title ? (
                                    <Text
                                        style={{
                                            fontSize: px(18),
                                            fontWeight: '700',
                                            marginTop: px(20),
                                            marginBottom: px(12),
                                        }}>
                                        {data?.adviser_sign?.risk_disclosure2?.title}
                                    </Text>
                                ) : null}
                                {data?.adviser_sign?.risk_disclosure2?.content ? (
                                    <Html
                                        html={data?.adviser_sign?.risk_disclosure2?.content}
                                        style={styles.light_text}
                                    />
                                ) : null}
                            </TouchableOpacity>
                        </ScrollView>
                        <>
                            {data?.adviser_sign?.agreement_bottom ? (
                                <Agreements
                                    style={{margin: px(16)}}
                                    check={data?.adviser_sign?.agreement_bottom?.default_agree}
                                    data={data?.adviser_sign?.agreement_bottom?.list}
                                    onChange={(checkStatus) => setSignCheck(checkStatus)}
                                    emitJump={() => {
                                        signModal?.current?.hide();
                                        show_sign_focus_modal.current = true;
                                    }}
                                />
                            ) : null}
                            {data?.adviser_sign?.button ? (
                                <Button
                                    disabled={signTimer > 0 || !signCheck}
                                    style={{marginHorizontal: px(20)}}
                                    onPress={() => {
                                        passwordRef.current?.show?.();
                                    }}
                                    title={
                                        signTimer > 0
                                            ? signTimer + 's' + data?.adviser_sign?.button?.text
                                            : data?.adviser_sign?.button?.text
                                    }
                                />
                            ) : null}
                        </>
                    </View>
                </PageModal>
            )}
            <PasswordModal onDone={onSubmit} ref={passwordRef} />
        </View>
    );
};

export default LowBuySignalExplain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    part: {
        backgroundColor: '#fff',
        width: px(343),
        borderRadius: px(6),
        alignSelf: 'center',
        padding: px(16),
        marginTop: px(16),
    },
    partTitle: {
        fontSize: px(16),
        fontWeight: '500',
        color: Colors.defaultColor,
        lineHeight: px(22),
    },
    amountWrapper: {
        marginTop: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    amountBlock: {},
    amountBlockTop: {},
    amountBlockBottom: {
        marginTop: px(4),
        fontWeight: '400',
        color: Colors.lightGrayColor,
        fontSize: px(11),
        lineHeight: px(16),
    },
    calcAmountTip: {
        marginTop: px(8),
        width: px(311),
        paddingTop: px(16),
        paddingBottom: px(6),
        paddingLeft: px(15),
        paddingRight: px(3),
    },
    tabsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(20),
    },
    tabItem: {
        alignItems: 'center',
    },
    tabItemText: {
        fontSize: px(14),
        fontWeight: '400',
        color: Colors.descColor,
        lineHeight: px(20),
    },
    tabUnderline: {
        height: px(2),
        width: px(16),
        marginTop: px(5),
        backgroundColor: 'transparent',
        borderRadius: px(2),
    },
    chartWrapper: {
        height: px(200),
    },
    chartSliderWrapper: {
        width: '100%',
        marginTop: px(12),
    },
    chartSliderBg: {
        width: '100%',
        height: px(12),
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
    },
    chartSlider: {
        position: 'absolute',
        top: px(-5),
        width: px(103),
        height: px(24),
        backgroundColor: '#0051cc',
        borderRadius: px(14),
        shadowColor: 'rgba(0, 53, 203, 0.2)',
        shadowOffset: {
            height: px(2),
            width: px(0),
        },
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartSliderText: {
        color: '#fff',
        fontSize: px(10),
        fontFamily: Font.numFontFamily,
        marginTop: px(-1.5),
        textAlignVertical: 'center',
        lineHeight: px(12),
        textAlign: 'center',
        width: '100%',
    },
    leftArrow: {
        position: 'absolute',
        top: px(6),
        left: px(0),
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: px(4.5),
        borderColor: 'transparent',
        borderRightColor: '#fff',
    },
    rightArrow: {
        position: 'absolute',
        top: px(6),
        right: px(0),
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: px(4.5),
        borderColor: 'transparent',
        borderLeftColor: '#fff',
    },
    tableWrapper: {
        flexDirection: 'row',
        marginTop: px(26),
        width: px(311),
        borderRadius: px(4),
        borderWidth: px(1),
        borderColor: '#f5f6f8',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tableLeft: {
        width: px(100),
    },
    tableRight: {
        width: px(100),
    },
    tableTitle: {
        color: '#121D3A',
        fontSize: px(12),
        lineHeight: px(17),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableText: {
        color: '#545968',
        fontSize: px(12),
        lineHeight: px(17),
        textAlign: 'center',
    },
    tableCenter: {
        position: 'absolute',
        left: px(100),
        top: px(-4.5),
        width: px(110),
        backgroundColor: '#fff',
        zIndex: 1,
    },
    yieldInfo: {
        marginTop: px(16),
        paddingHorizontal: px(34),
    },
    yieldInfoData: {
        marginTop: px(6),
        marginHorizontal: px(16),
    },
    yieldInfoDataRate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: px(6),
        borderBottomWidth: 0.5,
        borderColor: '#E2E4EA',
    },
    yieldInfoDataRateNum: {
        fontSize: px(24),
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
    },
    yieldInfoDataRateNumSymbol: {
        fontSize: px(22),
        fontWeight: '300',
        fontFamily: Font.numFontFamily,
    },
    yieldInfoDataRateNumDescWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: px(3),
        paddingHorizontal: px(8),
    },
    yieldInfoDataRateNumDesc: {
        fontSize: px(11),
        color: '#9AA1B2',
        lineHeight: px(16),
    },
    annualDesc: {
        marginTop: px(12),
    },
    dataTime: {
        fontSize: px(11),
        fontWeight: '400',
        color: '#9AA1B2',
        lineHeight: px(16),
        marginTop: px(16),
    },
    summaryWrapper: {
        width: px(311),
        alignSelf: 'center',
    },
    comma: {
        width: px(24),
        height: px(13),
        position: 'absolute',
        left: px(-16),
        top: px(-2),
    },
    summaryText: {
        color: '#545968',
        fontSize: px(16),
        lineHeight: px(24),
    },
    autoFlow: {
        width: px(311),
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(16),
        marginTop: px(24),
    },
    autoFlowItem: {
        paddingVertical: px(18),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    autoFlowItemLeft: {
        fontSize: px(14),
        fontWeight: '400',
        color: '#545968',
        lineHeight: px(20),
    },
    autoFlowAmountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    autoFlowAmount: {
        fontWeight: 'bold',
        color: '#121D3A',
        lineHeight: px(19),
        fontSize: px(16),
        fontFamily: Font.numFontFamily,
    },
    greenAreaHintWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(8),
    },
    greenAreaHintFigure: {
        width: px(10),
        height: px(10),
        backgroundColor: '#62CF90',
        borderRadius: px(2),
        opacity: 0.2,
    },
    greenAreaHintText: {
        fontSize: px(11),
        fontWeight: '500',
        color: '#121D3A',
        lineHeight: px(16),
        marginLeft: px(8),
    },
});
