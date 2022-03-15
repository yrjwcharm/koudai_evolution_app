/*
 * @Date: 2021-07-27 17:00:06
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-17 13:43:26
 * @Description:牛人信号
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Switch} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import HTML from '../../components/RenderHtml';
import {Chart} from '../../components/Chart';
import {FixedButton, Button} from '../../components/Button';
import Empty from '../../components/EmptyTip';
import {useJump} from '../../components/hooks';
import {deviceWidth, isIphoneX, px, deviceHeight} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Agreements from '../../components/Agreements';
import http from '../../services';
import Notice from '../../components/Notice';
import {BottomModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import URI from 'urijs';
import {baseURL} from '../../services/config';
import {debounce} from 'lodash';
import {Modal} from '../../components/Modal';

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

const TopInvestors = ({route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    const [chartData, setChartData] = useState({});
    const [showEmpty, setShowEmpty] = useState(false);
    const [signCheck, setSignCheck] = useState(false);
    const [signTimer, setSignTimer] = useState(8);
    const [buttonDistance, setButtonDistance] = useState(null);
    const [scrollY, setScrollY] = useState(0);
    const [autoFlowState, updateAutoFlowState] = useState(false);
    const signModal = React.useRef(null);
    const show_sign_focus_modal = useRef(false);
    const intervalt_timer = useRef('');
    const hotChartRef = useRef(null);
    const panelChartRef = useRef(null);
    const init = () => {
        http.get('/signal/niuren/detail/20220214', {poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result || {});
                setShowEmpty(true);
                updateAutoFlowState(res.result.head?.settings?.is_autoing);
                res.result.period && setPeriod(res.result.period);
            }
        });
    };

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
        setChartData((prev) => ({...prev, chart: ''}));
        http.get('/signal/niuren/chart/20220214', {period, poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setChartData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

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
    //签约
    const handleSign = () => {
        http.post('adviser/sign/20210923', {poids: data?.adviser_sign?.sign_po_ids}).then((res) => {
            signModal.current.toastShow(res.message);
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

    return Object.keys(data).length > 0 ? (
        <View
            style={{
                flex: 1,
                paddingBottom: scrollY > buttonDistance + px(285) ? (isIphoneX() ? px(85) : px(51)) : px(0),
            }}>
            {Object.keys(data).length > 0 && (
                <ScrollView
                    bounces={false}
                    style={{flex: 1}}
                    scrollEventThrottle={6}
                    scrollIndicatorInsets={{right: 1}}
                    onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}>
                    <LinearGradient colors={['#FFFFFF', '#F5F6F8']} start={{x: 0, y: 0}} end={{x: 0, y: 0.4}}>
                        <View
                            style={{
                                height: px(285),
                            }}>
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
                                style={{width: '100%', alignSelf: 'center'}}
                                renderLoading={() => <LoadingWebview />}
                                source={{
                                    uri: URI(baseURL.H5)
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
                        </View>
                        <View style={{}}>
                            <View style={styles.summaryWrapper}>
                                <Image
                                    source={require('../../assets/img/comma.png')}
                                    style={styles.comma}
                                    resizeMode="contain"
                                />
                                <HTML html={data?.head?.content} style={styles.summaryText} />
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
                                            http.post('/tool/manage/open/20211207', {type: 'niuren'}).then((res) => {
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
                        <View style={styles.niewRenWrapper}>
                            <Text style={styles.title}>{'牛人买入点走势图'}</Text>
                            <View style={{...styles.boxSty, minHeight: px(276)}}>
                                <View style={{height: px(216)}}>
                                    {chartData.chart ? (
                                        <Chart
                                            initScript={baseAreaChart(
                                                chartData.chart,
                                                [Colors.red],
                                                ['l(90) 0:#E74949 1:#fff'],
                                                true,
                                                2,
                                                deviceWidth - px(64),
                                                10,
                                                chartData.tag_position,
                                                px(208),
                                                chartData.max_ratio,
                                                true,
                                                true
                                            )}
                                            onChange={(obj) => {
                                                let cur = chartData?.chart.find(
                                                    (item) => item.date === obj?.items?.[0].title
                                                );
                                                const str = `var p = chart.getPosition(${JSON.stringify(
                                                    cur
                                                )});chart.showTooltip(p)`;
                                                hotChartRef?.current?.chart?.current.injectJavaScript(str);
                                            }}
                                            style={{width: '100%'}}
                                        />
                                    ) : null}
                                </View>
                                <View style={{height: px(70), marginTop: px(-10)}}>
                                    {chartData.chart ? (
                                        <Chart
                                            initScript={baseHotChart(chartData.chart, deviceWidth - px(64), px(70))}
                                            ref={hotChartRef}
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
                                                                period === item.val
                                                                    ? Colors.brandColor
                                                                    : Colors.descColor,
                                                        }}>
                                                        {item.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                ) : null}
                            </View>
                        </View>
                        <Image
                            source={{uri: data.instructions.img}}
                            style={{width: px(375), height: px(566), marginTop: px(16), marginBottom: px(30)}}
                            resizeMode={Image.resizeMode.contain}
                        />
                    </LinearGradient>
                </ScrollView>
            )}
            <FixedButton
                title={data.button?.text || '追加购买'}
                superscript={data.button?.superscript}
                disabled={!(data.button?.avail !== undefined ? data.button.avail : 1)}
                style={!(data?.button && scrollY > buttonDistance + px(285)) && {display: 'none'}}
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
            {data?.adviser_sign && (
                <BottomModal
                    style={{height: px(600), backgroundColor: '#fff'}}
                    ref={signModal}
                    title={data?.adviser_sign?.title}
                    onClose={() => {
                        show_sign_focus_modal.current = false;
                        intervalt_timer.current && clearInterval(intervalt_timer.current);
                    }}>
                    <View style={{flex: 1}}>
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
                                    <HTML
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
                                    <HTML
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
                                    onPress={debounce(handleSign, 500)}
                                    title={
                                        signTimer > 0
                                            ? signTimer + 's' + data?.adviser_sign?.button?.text
                                            : data?.adviser_sign?.button?.text
                                    }
                                />
                            ) : null}
                        </>
                    </View>
                </BottomModal>
            )}
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
    niewRenWrapper: {
        width: px(343),
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingVertical: px(20),
        paddingHorizontal: px(16),
        borderTopLeftRadius: px(20),
        borderTopRightRadius: px(20),
    },
    con: {
        backgroundColor: '#fff',
        flex: 1,
    },
    suggestionTextSty: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.descColor,
    },
    title: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: '700',
    },
    boxSty: {
        marginTop: px(12),
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
});

const baseAreaChart = (
    data,
    colors = [
        '#E1645C',
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    areaColors,
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    tag_position = {},
    height = 220,
    max = null,
    showArea = true,
    showDate = false
) => {
    return `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    width: ${width},
    height:${height},
    appendPadding: ${JSON.stringify(appendPadding)},
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    type: 'timeCat',
    tickCount: 3,
    range: [0, 1]
  });
  chart.scale('value', {
    tickCount: 5,
    // range: [ 0, 1 ],
    max: ${JSON.stringify(max)},
    formatter: (value) => {
      return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
    }
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1 ) {
        textCfg.textAlign = 'right';
      }
      textCfg.fontFamily = 'DINAlternate-Bold';
      return textCfg;
    }
  });
  chart.axis('value', {
    label: function label(text) {
      const cfg = {};
      cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
      cfg.fontFamily = 'DINAlternate-Bold';
      return cfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    crosshairsStyle: ${JSON.stringify(showDate)} ? {
      stroke: ${JSON.stringify(colors[0])},
      lineWidth: 0.5,
      lineDash: [2],
    } : {},
    crosshairsType: 'y',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    showXTip: ${JSON.stringify(showDate)},
    // showYTip: true,
    snap: false,
    tooltipMarkerStyle: {
      radius: 1
    },
  });
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.buy)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.buy?.position)},
        content: ${JSON.stringify(tag_position?.buy?.name)},
        limitInPlot:true,
        offsetY: -5,
        background: {
          fill: '#E74949',
          padding: 2,
        },
        pointStyle: {
          fill: '#E74949'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.redeem)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.redeem?.position)},
        content: ${JSON.stringify(tag_position?.redeem?.name)},
        limitInPlot:true,
        background: {
          fill: '#4BA471',
          padding: 2,
        },
        pointStyle: {
          fill: '#4BA471'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.adjust)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.adjust?.position)},
        content: ${JSON.stringify(tag_position?.adjust?.name)},
        limitInPlot:true,
        background: {
          fill: '#0051CC',
          padding: 2,
        },
        pointStyle: {
          fill: '#0051CC'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };

    if(${JSON.stringify(showArea)}){
      chart.area({startOnZero: false, connectNulls: true})
        .position('date*value')
        .shape('smooth')
        .color(${JSON.stringify(areaColors)})
        .animate({
          appear: {
            animation: 'groupWaveIn',
            duration: 500
          }
        });
    }

  chart.line()
    .position('date*value')
    .shape('smooth')
    .color(${JSON.stringify(colors)})
   
    .animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 500
      }
    })
    .style('type', {
      lineWidth: 1,
      lineDash(val) {
        if (val === '底线') return [4, 4, 4];
        else return [];
      }
    });
    chart.point().position('date*value').size('tag', function(val) {
      return val ? 3 : 0;
    }).style('tag', {
      fill: function fill(val) {
        if (val === 2) {
          return '#4BA471';
        } else if (val === 1) {
          return '#E74949';
        }else if (val === 3) {
            return '#0051CC';
         }
      },
      stroke: '#fff',
      lineWidth: 1
    });
  chart.render();
})();
`;
};
const baseHotChart = (data, width, height) => {
    return `
    (function(){
        chart = new F2.Chart({
            id: 'chart',
            pixelRatio: window.devicePixelRatio,
            width: ${width},
            height:${height},
            appendPadding: [10,10,10,0],
          });
          chart.source(${JSON.stringify(data)});
          chart.scale('date', {
            type:'timeCat',
          });
          chart.scale('degree', {
            tickCount: 3,
            ticks:[0,80,150],
            min:0,
            max: 150,
            formatter: (value) => {
                return value + '℃'
            }
          });
          chart.axis('date',false);
          chart.axis('degree',{grid: null});
          chart.legend(false);
          chart.tooltip({
              custom:true,
              triggerOn:[],
              showCrosshairs: true,
              crosshairsStyle: {
                stroke: '#E1645C',
                lineWidth: 0.5,
                lineDash: [2],
              } 
          });
          chart.line()
          .shape('smooth')
            .style({lineWidth:1})
            .position('date*degree')
            .color('#4C87F8')
            .animate({
                appear: {
                  animation: 'groupWaveIn',
                  duration: 500
                }
            });
        chart.guide().regionFilter({
            start: ['min', 80],
            end: ['max', 'max'],
            color: '#E74949',
        });
        chart.guide().rect({ //  分割背景透明区域
            start: ['min', '80'], // 左上角
            end: ['max', 'min'], // 右下角
            style: {
              fill: '#CCD6EC',
              opacity: 0.09
            }
       });
       chart.guide().rect({ //  分割背景透明区域
            start: ['min', '150'], // 左上角
            end: ['max', '80'], // 右下角
            style: {
                fill: '#E74949',
                opacity: 0.09
            }
        });
        chart.render();
    })()`;
};
