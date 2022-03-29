/*
 * @Date: 2022-03-24 16:13:33
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-28 18:23:26
 * @Description:风险等级调整工具
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import AdjustSlider from '../../components/AdjustSlider';
import {deviceWidth, isIphoneX, px} from '../../utils/appUtil';
import {Colors, Font, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import http from '../../services';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Entypo';
import RenderHtml from '../../components/RenderHtml';
import LoadingTips from '../../components/LoadingTips';
import {useJump} from '../../components/hooks';
import {Chart} from '../../components/Chart';
import _ from 'lodash';
import {Modal, PageModal} from '../../components/Modal';
import {useFocusEffect} from '@react-navigation/native';
import Toast from '../../components/Toast';
import CheckBox from '../../components/CheckBox';
import Notice from '../../components/Notice';
const themeColor = '#2B7AF3';
const chartWidth = deviceWidth - px(24);
const Title = ({title}) => {
    return (
        <View style={[styles.title_con, Style.flexRow]}>
            <View style={styles.title_tag} />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};
//每个step的高度
const Steps = ({data, style}) => {
    const [stepHeight, setStepHeight] = useState([]);
    const onLayout = (evt, index) => {
        const {height} = evt.nativeEvent.layout;
        const arr = [...stepHeight];
        arr[index] = height;
        setStepHeight(arr);
    };
    return (
        <View style={style}>
            {data?.map((item, index) => {
                return (
                    <View
                        key={index}
                        style={{flexDirection: 'row'}}
                        onLayout={(e) => {
                            onLayout(e, index);
                        }}>
                        <>
                            <View style={styles.circle} />
                            <View style={[styles.line, {height: index == data.length - 1 ? 0 : stepHeight[index]}]} />
                        </>

                        <View style={{marginBottom: px(16), flex: 1}}>
                            <Text style={styles.steps_title}>{item.title}</Text>
                            <Text style={styles.steps_desc}>{item.desc}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
//table
const Table = ({data, risk, style, current_risk}) => {
    const jump = useJump();
    const table_data = data?.filter((item) => item.value == risk);
    return table_data && table_data?.length > 0 ? (
        <View style={{paddingBottom: px(20)}}>
            <View style={[{flexDirection: 'row', alignItems: 'flex-start'}, style]}>
                <View style={styles.column}>
                    <View style={[{backgroundColor: '#F7F8FA', height: px(40)}, Style.flexRow]}>
                        <Text style={{flex: 1}} />
                        <Text style={{flex: 1, textAlign: 'center', fontWeight: '600'}}>当前等级{current_risk}</Text>
                    </View>
                    {Object.values(table_data[0]?.table)?.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={[
                                    Style.flexRow,
                                    {backgroundColor: index % 2 == 0 ? '#fff' : '#F7F8FA', height: px(40)},
                                ]}>
                                <Text style={{flex: 1, textAlign: 'center', color: '#0B1E3E'}}>{item.key}</Text>
                                <Text style={styles.numMedium}>{item.value}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.floatColumn}>
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={['rgba(214, 229, 255, 1)', 'rgba(245, 249, 255, 1)']}
                        style={[Style.flexRowCenter, {height: px(44), paddingTop: px(4), borderRadius: px(4)}]}>
                        <Text>
                            调后
                            <Text style={{color: themeColor}}>等级{risk != current_risk ? risk : '-'}</Text>
                        </Text>
                    </LinearGradient>
                    {Object.values(table_data[0]?.table)?.map((item, index) => {
                        const length = Object.values(table_data[0]?.table)?.length;
                        return (
                            <View
                                key={index}
                                style={[
                                    Style.flexRowCenter,
                                    {
                                        height: index == length - 1 ? px(44) : px(40),
                                        borderRadius: index == length - 1 ? px(4) : 0,
                                        backgroundColor: index % 2 == 0 ? '#fff' : '#F5F9FF',
                                    },
                                ]}>
                                <Text style={{fontSize: px(14), fontFamily: Font.numMedium, color: themeColor}}>
                                    {item?.comp?.updown != '-' ? item?.comp?.diff : '-'}
                                </Text>
                                {item?.comp?.updown != '-' ? (
                                    <Icon
                                        name={`arrow-long-${item?.comp?.updown}`}
                                        color={item?.comp?.updown == 'down' ? Colors.green : Colors.red}
                                    />
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </View>
            {table_data[0]?.card?.content ? (
                <View style={styles.table_card}>
                    <RenderHtml
                        html={table_data[0]?.card?.content}
                        style={{fontSize: px(13), lineHeight: px(20), color: Colors.lightBlackColor}}
                    />
                </View>
            ) : null}
            {table_data[0]?.card?.button ? (
                <Button
                    title={table_data[0]?.card?.button?.text}
                    type="minor"
                    style={styles.btn}
                    textStyle={{color: Colors.btnColor, fontSize: px(15)}}
                    onPress={() => {
                        jump(table_data[0]?.card?.button?.url);
                    }}
                />
            ) : null}
        </View>
    ) : null;
};
const RiskAdjustTool = ({route, navigation}) => {
    const [data, setData] = useState();
    const [adjustRisk, setAdjustRisk] = useState('123');
    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState();
    const [signData, setSignData] = useState();
    const signModal = useRef(null);
    const [signTimer, setSignTimer] = useState(8);
    const [signSelectData, setSignSelectData] = useState([]);
    const intervalt_timer = useRef('');
    const adjustConfirm = useRef(0);
    const jump = useJump();
    const getInfo = () => {
        http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/tool/riskchange/detail/20220323').then((res) => {
            navigation.setOptions({title: route?.params?.title || '风险等级调整工具'});
            setAdjustRisk(res.result?.current_risk);
            setPeriod(period || res.result?.body?.part1?.default_period);
            setData(res.result);
        });
    };
    useEffect(() => {
        getInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (data) {
            http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/tool/riskchange/chart/20220323', {
                change_risk_level: adjustRisk,
                period,
            }).then((res) => {
                setChartData(res.result?.history_nav);
            });
        }
    }, [period, adjustRisk, data]);
    const onChange = (value) => {
        setAdjustRisk(value);
    };
    const changeSubTab = (per) => {
        setPeriod(per);
    };
    //checkBox 选中
    const checkBoxClick = (_check, poid) => {
        //选中
        if (_check) {
            if (poid) {
                setSignSelectData((prev) => {
                    return [...prev, poid];
                });
            } else {
                setSignSelectData((prev) => {
                    let poids = signData?.plan_list?.map((item) => {
                        return item.poid;
                    });
                    return [...new Set([...prev, ...poids])];
                });
            }
        } else {
            //非选中
            if (poid) {
                setSignSelectData((prev) => {
                    let data = [...prev];
                    _.remove(data, function (_poid) {
                        return _poid === poid;
                    });
                    return data;
                });
            } else {
                setSignSelectData([]);
            }
        }
    };
    const handleClick = () => {
        http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/tool/riskchange/predo/20220323', {
            is_confirm: adjustConfirm.current,
            new_risk: adjustRisk,
        }).then((res) => {
            if (res.code === '000000') {
                const _data = res.result;
                if (_data?.next == 'alert') {
                    Modal.show({
                        title: _data?.params?.title,
                        confirm: _data?.params?.sub_button?.length > 1,
                        content: _data?.params?.content,
                        confirmText: _data?.params?.sub_button[1]?.text || '',
                        cancelText: _data?.params?.sub_button[0]?.text,
                        confirmCallBack: () => {
                            if (_data?.params?.sub_button?.length > 1) {
                                if (_data?.params?.sub_button[1]?.type == 'jump') {
                                    jump(_data?.params?.sub_button[1]?.url);
                                } else {
                                    adjustConfirm.current = 1;
                                    handleClick();
                                }
                            }
                        },
                    });
                } else {
                    //签约
                }
            } else {
                Toast.show(res.message);
            }
        });
    };
    const handleSign = () => {};
    return data ? (
        <>
            <ScrollView>
                <LinearGradient
                    colors={['#FFFFFF', '#F5F6F8']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.4}}
                    style={styles.con}>
                    <View style={[styles.name_con, Style.flexRowCenter]}>
                        <View>
                            <Text style={styles.name}>{data?.head?.name}</Text>
                            <Text style={styles.name_desc}>{data?.head?.desc}</Text>
                        </View>
                        {data?.current_risk != adjustRisk ? (
                            <>
                                <Animatable.Image
                                    animation={'fadeIn'}
                                    source={require('../../assets/img/icon/arrowRight.png')}
                                    style={styles.arrow_right_image}
                                />
                                <Animatable.View animation={'fadeInLeft'}>
                                    <Text style={[styles.name, {color: '#2B7AF3'}]}>等级{adjustRisk}</Text>
                                    <Text style={styles.name_desc}>{'调整后风险等级'}</Text>
                                </Animatable.View>
                            </>
                        ) : null}
                    </View>
                    <View style={styles.card}>
                        <Title title={data?.body?.part1?.title} />
                        <View style={[Style.flexRowCenter, {marginTop: px(24)}]}>
                            <View style={[Style.flexRow, {marginRight: px(60)}]}>
                                <View style={styles.chart_tag} />
                                <Text>当前等级{data?.current_risk}</Text>
                            </View>
                            <View style={Style.flexRow}>
                                <View style={[styles.chart_tag, {backgroundColor: themeColor}]} />
                                <Text>调后等级{adjustRisk == data?.current_risk ? '-' : adjustRisk}</Text>
                            </View>
                        </View>
                        <View style={[Style.flexRow, {height: px(160)}]}>
                            {chartData?.yield_chart ? (
                                <>
                                    <Chart
                                        initScript={baseAreaChart(
                                            chartData?.yield_chart,
                                            [themeColor, Colors.darkGrayColor],
                                            ['l(90) 0:#2B7AF3 1:#fff', 'transparent']
                                        )}
                                        data={chartData?.yield_chart}
                                    />
                                    <Text style={styles.chartTitle}>{'收益'}</Text>
                                </>
                            ) : null}
                        </View>
                        <View style={[Style.flexRow, {height: px(160)}]}>
                            {chartData?.drawback_chart ? (
                                <>
                                    <Chart
                                        initScript={area(chartData?.drawback_chart)}
                                        data={chartData?.drawback_chart}
                                    />
                                    <Text style={styles.chartTitle}>{'回撤'}</Text>
                                </>
                            ) : null}
                        </View>
                        <View style={styles.sub_con}>
                            {data?.body?.part1?.tabs?.map((_item, _index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[
                                            styles.btn_sty,
                                            {
                                                backgroundColor: period == _item.key ? '#F1F6FF' : '#fff',
                                                borderWidth: period == _item.key ? 0 : 0.5,
                                            },
                                        ]}
                                        key={_index}
                                        onPress={() => changeSubTab(_item.key)}>
                                        <Text
                                            style={{
                                                color: period == _item.key ? '#0051CC' : '#555B6C',
                                                fontSize: px(12),
                                            }}>
                                            {_item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Title title={data?.body?.part2?.title} />
                        <Table
                            data={data?.table_data}
                            risk={adjustRisk}
                            style={{marginTop: px(30)}}
                            current_risk={data?.current_risk}
                        />
                    </View>
                    <View style={styles.card}>
                        <Title title={data?.body?.part3?.title} />
                        <Steps style={styles.steps_con} data={data?.body?.part3?.data?.step} />
                    </View>
                    {data?.body?.part3?.data?.tips ? (
                        <Text style={[styles.steps_desc, {marginTop: px(-4)}]}>{data?.body?.part3?.data?.tips}</Text>
                    ) : null}
                </LinearGradient>
            </ScrollView>
            {signData && (
                <PageModal
                    ref={signModal}
                    height={px(600)}
                    title={signData?.title}
                    onClose={() => {
                        intervalt_timer.current && clearInterval(intervalt_timer.current);
                        navigation.goBack();
                    }}>
                    <View style={{flex: 1}}>
                        {signData?.title_tip && <Notice content={{content: signData?.title_tip}} />}
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <ScrollView
                                bounces={false}
                                style={{
                                    flex: 1,
                                    paddingHorizontal: px(16),
                                    paddingTop: px(20),
                                    borderRadius: px(6),
                                }}>
                                {signData?.risk_disclosure_list?.length > 0 &&
                                signData?.risk_disclosure_list[0]?.title ? (
                                    <Text style={{fontSize: px(18), fontWeight: '700', marginBottom: px(12)}}>
                                        {signData?.risk_disclosure_list[0]?.title}
                                    </Text>
                                ) : null}
                                <View style={styles.sign_scrollview}>
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        style={{
                                            flex: 1,
                                            paddingRight: px(12),
                                        }}>
                                        {signData?.risk_disclosure_list
                                            ? signData?.risk_disclosure_list?.map((item, index) => {
                                                  return (
                                                      <RenderHtml
                                                          html={item?.content}
                                                          key={index}
                                                          style={{fontSize: px(13), lineHeight: px(20)}}
                                                      />
                                                  );
                                              })
                                            : null}
                                    </ScrollView>
                                </View>
                                <View style={[Style.flexBetween, {marginTop: px(12)}, styles.border_bottom]}>
                                    <View style={Style.flexRow}>
                                        <CheckBox
                                            checked={signSelectData?.length == signData?.plan_list?.length}
                                            style={{marginRight: px(6)}}
                                            onChange={(value) => {
                                                checkBoxClick(value);
                                            }}
                                        />
                                        <Text style={{fontSize: px(16), fontWeight: '700'}}>全选</Text>
                                    </View>
                                    <Text style={{fontSize: px(16)}}>
                                        {signSelectData?.length}/{signData?.plan_list?.length}
                                    </Text>
                                </View>
                                <View style={{marginBottom: px(40)}}>
                                    {signData?.plan_list?.map((item, index) => {
                                        return (
                                            <View key={index} style={styles.border_bottom}>
                                                <Text
                                                    style={{
                                                        fontSize: px(16),
                                                        fontWeight: '700',
                                                        marginBottom: px(6),
                                                    }}>
                                                    {item?.name}
                                                </Text>
                                                {item?.adviser_cost_desc ? (
                                                    <Text style={[styles.light_text, {marginBottom: px(6)}]}>
                                                        {item.adviser_cost_desc}
                                                    </Text>
                                                ) : null}
                                                <View style={[Style.flexRow, {alignItems: 'flex-start'}]}>
                                                    <CheckBox
                                                        checked={signSelectData?.includes(item?.poid)}
                                                        style={{marginRight: px(6)}}
                                                        onChange={(value) => {
                                                            checkBoxClick(value, item.poid);
                                                        }}
                                                    />
                                                    <Text style={[styles.light_text, {flex: 1}]}>
                                                        {item?.desc}

                                                        <Text>
                                                            {item?.link_list?.map((link, _index) => (
                                                                <Text
                                                                    style={{color: Colors.btnColor}}
                                                                    key={_index}
                                                                    onPress={() => {
                                                                        if (link?.url) {
                                                                            jump(link?.url);
                                                                        }
                                                                    }}>
                                                                    {link?.text}
                                                                    {item?.link_list?.length > 1 &&
                                                                    _index == item?.link_list?.length - 2
                                                                        ? '和'
                                                                        : _index == item?.link_list?.length - 1
                                                                        ? ''
                                                                        : '、'}
                                                                </Text>
                                                            ))}
                                                            {item?.desc_end ? (
                                                                <Text style={styles.light_text}>{item?.desc_end}</Text>
                                                            ) : null}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                        {signData?.button ? (
                            <Button
                                disabled={signTimer > 0 || !signSelectData?.length > 0}
                                style={{marginTop: px(12), marginHorizontal: px(16)}}
                                onPress={_.debounce(handleSign, 500)}
                                title={
                                    signTimer > 0 ? signTimer + 's' + signData?.button?.text : signData?.button?.text
                                }
                            />
                        ) : null}
                    </View>
                </PageModal>
            )}
            <Animatable.View animation={'fadeInUp'} style={{borderTopWidth: 0.5, borderTopColor: '#E2E4EA'}}>
                <AdjustSlider
                    value={data?.current_risk}
                    minimumValue={data?.table_data[0]?.value}
                    maximumValue={data?.table_data[data?.table_data?.length - 1]?.value}
                    onChange={onChange}
                />
                <Button
                    title={data?.footer?.button?.text}
                    disabled={data?.footer?.button?.avail != 1 || data?.current_risk == adjustRisk}
                    style={{marginBottom: isIphoneX() ? px(8) + 34 : px(8), marginHorizontal: px(16)}}
                    onPress={_.debounce(handleClick, 500)}
                />
            </Animatable.View>
        </>
    ) : (
        <LoadingTips />
    );
};

export default RiskAdjustTool;

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(16),
        paddingBottom: px(40),
    },
    card: {
        paddingHorizontal: px(16),
        borderRadius: px(6),
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: px(16),
    },
    name_con: {
        marginVertical: px(30),
    },
    name: {
        fontSize: px(28),
        lineHeight: px(32),
        color: Colors.lightBlackColor,
        textAlign: 'center',
        fontWeight: '700',
    },
    arrow_right_image: {
        width: px(63),
        height: px(8),
        marginHorizontal: px(20),
    },
    name_desc: {
        color: Colors.lightBlackColor,
        fontSize: px(12),
        marginTop: px(8),
        textAlign: 'center',
    },
    title_con: {
        height: px(55),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    title: {
        fontSize: px(16),
        fontWeight: '700',
        color: '#121D3A',
    },
    title_tag: {
        width: px(3),
        height: px(16),
        backgroundColor: '#2B7AF3',
        marginRight: px(4),
    },
    steps_con: {marginVertical: px(16)},
    steps_title: {
        color: Colors.defaultColor,
        fontWeight: '700',
        fontSize: px(13),
        lineHeight: px(18),
        marginBottom: px(4),
    },
    steps_desc: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        lineHeight: px(19),
    },
    line: {
        width: px(1),
        backgroundColor: '#E2E4EA',
        marginLeft: px(3),
        position: 'absolute',
        top: px(12),
    },
    circle: {
        width: px(6),
        height: px(6),
        borderRadius: px(3),
        backgroundColor: Colors.defaultColor,
        marginRight: px(12),
        position: 'relative',
        zIndex: 10,
        marginTop: px(5),
    },
    numMedium: {
        flex: 1,
        textAlign: 'center',
        fontSize: px(14),
        fontFamily: Font.numMedium,
    },
    floatColumn: {
        marginTop: px(-4),
        width: px(96),
        borderRadius: px(4),
        shadowColor: '#0051CC',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 20,
        shadowOpacity: 0.2,
    },
    column: {
        flex: 1,
        borderWidth: px(0.5),
        borderRightWidth: 0,
        borderColor: '#F7F8FA',
        borderBottomLeftRadius: px(6),
        borderTopLeftRadius: px(6),
    },
    table_card: {
        marginTop: px(20),
        backgroundColor: '#F5F6F8',
        padding: px(16),
        borderRadius: px(6),
    },
    btn: {
        borderRadius: px(22),
        marginHorizontal: px(28),
        marginTop: px(16),
        borderColor: Colors.btnColor,
    },
    sub_con: {
        flexDirection: 'row',
        height: px(50),
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: px(20),
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: px(12),
        paddingVertical: px(5),
        borderRadius: px(15),
    },
    chartTitle: {
        color: Colors.defaultColor,
        fontSize: px(11),
        width: px(11),
        lineHeight: px(16),
    },
    chart_tag: {
        width: px(8),
        height: px(8),
        backgroundColor: '#9AA1B2',
        marginRight: px(4),
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
    areaColors = [Colors.red, Colors.lightBlackColor],
    percent = true,
    tofixed = 2,
    max = null
) => `
(function(){
    chart = new F2.Chart({
        id: 'chart',
        pixelRatio: window.devicePixelRatio,
        width: ${chartWidth},
        height: ${px(160)},
        appendPadding: [15, 61, 5, 5],
    });
    chart.source(${JSON.stringify(data)});
    chart.scale('date', {
        type: 'timeCat',
        tickCount: 3,
        range: [0, 1]
    });
    chart.scale('value', {
        tickCount: 5,
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
    chart.tooltip(false);
    chart.area({startOnZero: false})
        .position('date*value')
        .shape('smooth')
        .color('type', ${JSON.stringify(areaColors)})
        .animate({
            appear: {
                animation: 'groupWaveIn',
                duration: 500
            }
        });
    chart.line()
        .position('date*value')
        .shape('smooth')
        .color('type', ${JSON.stringify(colors)})
        .animate({
            appear: {
                animation: 'groupWaveIn',
                duration: 500
            }
        })
        .style({
            lineWidth: 1
        });
    chart.render();
})();
`;
const area = (source, percent = true, tofixed = 2) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    height: ${px(160)},
    width: ${chartWidth},
    appendPadding: [5, 61, 15, 5]
  });
  
  chart.source(${JSON.stringify(source)}, {
    date: {
      range: [ 0, 1 ],
      type: 'timeCat',
      tickCount: 3,
    },
    value: {
      tickCount: 5,
      formatter: (value) => {
        return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
      }
    }
  });
  chart.tooltip({
    showCrosshairs: false,
    custom: true, // 自定义 tooltip 内容框
    showTooltipMarker: false,
  });
  chart.axis('date', false);
  chart.axis('value', {
    label: function label(text) {
        const cfg = {};
        cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
        cfg.fontFamily = 'DINAlternate-Bold';
        return cfg;
    }
  });
chart.legend(false);
  chart.line()
    .position('date*value')
    .color('type', ${JSON.stringify(['#2B7AF3', '#9aA1B2', '#9aA1B2', '#2B7AF3'])})
    .shape('smooth')
    .style('type', {
        lineWidth: 1,
        lineDash(val) {
            if (val === '最大回撤线1'||val === '最大回撤线2') return [5, 5, 5];
            else return [];
        }
    });
  chart.area()
    .position('date*value')
    .color('type', ${JSON.stringify(['#2B7AF3', 'transparent', 'transparent', 'transparent'])})
    .shape('smooth');
  chart.render();
})();
`;
