/*
 * @Date: 2022-06-14 10:55:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-22 19:55:58
 * @Description:股债平衡组合
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import {deviceWidth, px} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {useFocusEffect} from '@react-navigation/native';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import FixedBtn from '../components/FixedBtn';
import GuideTips from '../../../components/GuideTips';
import BottomDesc from '../../../components/BottomDesc';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useJump} from '../../../components/hooks';
import RenderChart from '../components/RenderChart';
import LinearGradient from 'react-native-linear-gradient';
import FitImage from 'react-native-fit-image';
import FastImage from 'react-native-fast-image';
const BlancedPortfolio = ({navigation, route}) => {
    const [data, setData] = useState();
    const jump = useJump();
    const typeRef = useRef(route?.params?.tab_type);
    const getData = (tab_type) => {
        typeRef.current = tab_type || typeRef.current;
        global.LogTool(typeRef.current === 2 ? 'Blanced_Portfolio7030_Detail' : 'Blanced_Portfolio5050_Detail');
        Http.get('portfolio/account_balance_detail/20220614', {type: typeRef.current}).then((res) => {
            navigation.setOptions({title: res.result.title || '股债平衡组合'});
            setData(res.result);
        });
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    return data ? (
        <>
            <ScrollView>
                <Header
                    tab_list={data?.tab_list}
                    tabClick={(tab_type) => getData(tab_type)}
                    ratio_info={data?.ratio_info}
                    line_drawback={data?.line_drawback}
                    bar={data?.bar}
                    advantage={data?.advantage}
                    chartParams={{
                        upid: data?.upid,
                        allocation_id: data?.allocation_id,
                        period: data?.period,
                        poid: data?.poid,
                        benchmark_id: data?.benchmark_id,
                        // show_chart: data?.show_chart,
                    }}
                    show_chart={data?.show_chart}
                />
                <View style={{paddingHorizontal: px(16), marginTop: Space.marginVertical}}>
                    {data?.asset_intros?.map((img, index) => (
                        <FitImage source={{uri: img}} key={index} />
                    ))}
                    {data?.detail_button ? (
                        <TouchableOpacity
                            style={[Style.flexRowCenter, styles.detail_button]}
                            activeOpacity={0.9}
                            onPress={() => jump(data?.detail_button?.url)}>
                            <Text style={{color: Colors.btnColor, fontSize: px(12)}}>{data?.detail_button?.text}</Text>
                            <AntDesign name={'right'} color={Colors.btnColor} size={12} />
                        </TouchableOpacity>
                    ) : null}
                    {data?.signal_img ? (
                        <FitImage source={{uri: data?.signal_img}} style={{marginTop: Space.marginVertical}} />
                    ) : null}
                    {data?.intelligence_img ? (
                        <FitImage source={{uri: data?.intelligence_img}} style={{marginTop: Space.marginVertical}} />
                    ) : null}
                    {data?.emo_msg ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => jump(data.emo_msg.button.url)}
                            style={styles.emoBox}>
                            <FastImage source={{uri: data.emo_msg.title}} style={styles.emoImg} />
                            <Text numberOfLines={2} style={styles.emoText}>
                                {data.emo_msg.content}
                            </Text>
                            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                                <Text style={styles.emoCreated}>{data.emo_msg.created_at}</Text>
                                <View style={styles.emoBtnBox}>
                                    <Text style={styles.emoBtnText}>{data.emo_msg.button.text}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/* 常见问题 */}
                    {data?.qa_img ? (
                        <FitImage source={{uri: data?.qa_img}} style={{marginTop: Space.marginVertical}} />
                    ) : null}
                </View>
                {/* 底部菜单 */}
                <View style={[styles.card_sty, {paddingVertical: 0}]}>
                    {data?.gather_info.map((_info, _idx) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={[
                                    Style.flexRow,
                                    {
                                        borderBottomWidth: _idx < data?.gather_info.length - 1 ? 0.5 : 0,
                                        borderColor: '#DDDDDD',
                                    },
                                ]}
                                key={_idx + 'info'}
                                onPress={() => {
                                    global.LogTool('portfolioDetailFeatureStart', 'bottommenu', _idx);
                                    jump(_info.url);
                                }}>
                                <Text style={{flex: 1, paddingVertical: px(20)}}>{_info.title}</Text>
                                <View style={Style.flexRow}>
                                    {_info.desc ? (
                                        <Text style={{color: Colors.lightGrayColor, marginRight: px(8)}}>
                                            {_info.desc}
                                        </Text>
                                    ) : null}
                                    <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {data?.advisor_tip ? (
                    <View style={{marginTop: Space.marginVertical, paddingHorizontal: Space.padding}}>
                        <Text style={styles.bottomTip}>
                            {data?.advisor_tip.text}
                            {data?.advisor_tip.agreements
                                ? data?.advisor_tip.agreements?.map((item, index) => {
                                      return (
                                          <Text
                                              key={index}
                                              style={{color: Colors.btnColor}}
                                              onPress={() => {
                                                  jump(item.url);
                                              }}>
                                              {item?.title}
                                          </Text>
                                      );
                                  })
                                : null}
                        </Text>
                    </View>
                ) : null}
                <BottomDesc style={{marginTop: px(80)}} fix_img={data?.advisor_footer_img} />
            </ScrollView>
            {data?.guide_tip ? (
                <GuideTips data={data?.guide_tip} style={{position: 'absolute', bottom: px(120)}} />
            ) : null}
            {data?.btns && <FixedBtn btns={data.btns} />}
        </>
    ) : null;
};
const Header = ({tab_list, tabClick, ratio_info, line_drawback, bar, advantage, chartParams, show_chart = true}) => {
    const [active, setActive] = useState(0);
    const [period, setPeriod] = useState();
    const [chartData, setChartData] = useState();
    const _tabClick = useRef(true);
    const [type, setType] = useState(1);
    const [chart, setChart] = useState();
    const changeTab = (p, t) => {
        if (!_tabClick.current) {
            return false;
        }
        setPeriod(p);
        setType(t);
        if (p !== period) {
            _tabClick.current = false;
            global.LogTool('portfolioDetailChartSwitch', p);
            tabClick.current = false;
            setChart([]);
            Http.get('/portfolio/yield_chart/20210101', {
                ...chartParams,
                period: p,
                type: chartParams.type || t,
            }).then((resp) => {
                _tabClick.current = true;
                setChartData(resp.result);
                setChart(resp.result?.yield_info?.chart);
            });
        }
    };
    useEffect(() => {
        setPeriod(chartParams.period);
        Http.get('/portfolio/yield_chart/20210101', {
            ...chartParams,
            period: chartParams.period,
            type: chartParams.type,
        }).then((resp) => {
            setChartData(resp.result);
            setChart(resp.result?.yield_info?.chart);
        });
    }, [chartParams]);
    return (
        <View style={{backgroundColor: '#fff', paddingHorizontal: px(16), paddingTop: px(12)}}>
            {/* tab切换 */}
            <View style={[styles.tab_con, Style.flexBetween]}>
                {tab_list
                    ? tab_list?.map((item, index) => (
                          <TouchableOpacity
                              key={index}
                              activeOpacity={0.9}
                              style={[active == index && styles.activeButton, styles.button, Style.flexCenter]}
                              onPress={() => {
                                  setActive(index);
                                  setChart([]);
                                  tabClick && tabClick(item.tab_type);
                              }}>
                              <Text
                                  style={[
                                      active == index
                                          ? styles.activeText
                                          : {fontSize: px(12), color: Colors.lightBlackColor},
                                  ]}>
                                  {item.tab_name}
                              </Text>
                          </TouchableOpacity>
                      ))
                    : null}
            </View>
            {/* 收益率 */}
            <View
                style={[
                    Style.flexRowCenter,
                    {justifyContent: 'space-around', marginTop: px(24), alignItems: 'flex-end'},
                ]}>
                <View>
                    <Text
                        style={[
                            {fontSize: px(34), lineHeight: px(47), color: Colors.red, fontFamily: Font.numFontFamily},
                        ]}>
                        {ratio_info?.ratio_val}
                    </Text>
                    {ratio_info?.title && <Html html={ratio_info?.title} style={styles.radio_sty} />}
                </View>
                <View>
                    <Text
                        style={[
                            styles.line_drawback,
                            {
                                fontFamily: Font.numFontFamily,
                            },
                        ]}>
                        {line_drawback?.ratio_val}
                    </Text>
                    <Html style={styles.radio_sty} html={line_drawback?.ratio_desc} />
                </View>
            </View>
            {/* 标签label */}
            {ratio_info?.label ? (
                <View style={[Style.flexRowCenter, {marginTop: px(16), flexWrap: 'wrap'}]}>
                    {ratio_info?.label?.map((item, index) => (
                        <View style={styles.tag} key={index}>
                            <Text style={{fontSize: px(11), color: Colors.lightBlackColor}}>{item}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
            {/* bar */}
            {bar ? (
                <View style={{marginTop: px(20)}}>
                    <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                        <View style={[styles.left_bar, {width: bar?.left_round * (deviceWidth - px(32)) || '50%'}]} />
                        <View style={[styles.right_bar, {width: bar?.right_round * (deviceWidth - px(32)) || '50%'}]} />
                        <Image
                            source={require('../../../assets/img/account/processlabel.png')}
                            style={[
                                {left: bar?.left_round * (deviceWidth - px(32)) - px(5) || '50%'},
                                styles.bar_process_img,
                            ]}
                        />
                    </View>
                    <View style={Style.flexBetween}>
                        {bar?.bar_desc?.map((item, index) => (
                            <Text
                                key={index}
                                style={{fontSize: px(12), color: index == 1 ? '#9AA0B1' : Colors.lightBlackColor}}>
                                {' '}
                                {item}
                            </Text>
                        ))}
                    </View>
                </View>
            ) : null}
            {/* 组合优势 */}
            {advantage ? (
                <View style={{marginVertical: px(20)}}>
                    <LinearGradient
                        start={{x: 0, y: 0.3}}
                        end={{x: 0, y: 1}}
                        style={{borderRadius: 6}}
                        colors={['#F5F6F8', '#FFFFFF']}>
                        <View style={{padding: px(16)}}>
                            <Image
                                source={{uri: advantage?.title_img}}
                                style={{height: px(15), width: px(118), marginBottom: px(3)}}
                            />
                            <Html
                                style={{
                                    lineHeight: px(20),
                                    fontSize: px(12),
                                    color: '#121D3A',
                                }}
                                html={advantage?.content}
                            />
                        </View>
                    </LinearGradient>
                    <Image
                        source={{uri: advantage?.vs_img}}
                        style={{height: px(100), width: px(343), marginTop: px(12)}}
                    />
                </View>
            ) : null}
            {/* 图表 */}
            {show_chart && (
                <>
                    <View style={{marginHorizontal: px(-16)}}>
                        <RenderChart chartData={chartData} chart={chart} type={type} />
                    </View>
                    <View style={styles.chartTabCon}>
                        {/* 图表切换 */}
                        {chartData?.yield_info?.sub_tabs?.map((_item, _index, arr) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[
                                        styles.btn_sty,
                                        {
                                            backgroundColor: period == _item.val ? '#F1F6FF' : '#fff',
                                            borderWidth: period == _item.val ? 0 : 0.5,
                                            marginRight: _index < arr.length - 1 ? px(10) : 0,
                                        },
                                    ]}
                                    key={_index}
                                    onPress={() => changeTab(_item.val, _item.type)}>
                                    <Text
                                        style={{
                                            color: period == _item.val ? '#0051CC' : '#555B6C',
                                            fontSize: px(12),
                                        }}>
                                        {_item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </>
            )}
        </View>
    );
};
export default BlancedPortfolio;

const styles = StyleSheet.create({
    tab_con: {
        backgroundColor: '#f4f4f4',
        borderRadius: px(6),
        paddingHorizontal: px(4),
        height: px(44),
    },
    button: {
        width: px(166),
        height: px(34),
    },
    activeButton: {
        backgroundColor: '#fff',
        width: px(166),
        borderRadius: px(6),
        height: px(34),
    },
    activeText: {
        fontSize: px(14),
        fontWeight: '700',
        color: Colors.defaultColor,
    },
    tag: {
        paddingHorizontal: px(6),
        paddingVertical: px(3),
        borderRadius: px(2),
        marginRight: px(8),
        borderColor: '#BDC2CC',
        borderWidth: 0.5,
        marginBottom: px(6),
    },
    left_bar: {
        height: px(6),

        backgroundColor: '#E58065',
        borderRadius: px(10),
    },
    right_bar: {
        height: px(6),
        backgroundColor: '#D4AF6B',
        borderRadius: px(10),
    },
    bar_process_img: {
        position: 'absolute',
        height: px(6),
        width: px(10),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: px(10),
        padding: Space.padding,
        marginHorizontal: Space.padding,
        marginTop: px(12),
    },
    line_drawback: {fontSize: px(26), lineHeight: px(36), color: Colors.defaultColor},
    radio_sty: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        lineHeight: px(17),
    },
    chartTabCon: {
        flexDirection: 'row',
        height: px(60),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: px(12),
        paddingVertical: px(5),
        borderRadius: px(15),
    },
    detail_button: {
        paddingVertical: px(14),
        backgroundColor: '#fff',
        borderBottomEndRadius: px(6),
        borderBottomLeftRadius: px(6),
    },
    emoBox: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    emoImg: {
        width: px(88),
        height: px(26),
    },
    emoText: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    emoCreated: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    emoBtnBox: {
        paddingVertical: px(4),
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    emoBtnText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    bottomTip: {
        fontSize: Font.textSm,
        lineHeight: px(18),
        color: '#B8C1D3',
    },
});
