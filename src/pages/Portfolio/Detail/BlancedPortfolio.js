/*
 * @Date: 2022-06-14 10:55:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-14 18:06:21
 * @Description:股债平衡组合
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import {px} from '../../../utils/appUtil';
import {Colors, Space, Style} from '../../../common/commonStyle';
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
const BlancedPortfolio = () => {
    const [data, setData] = useState();
    const jump = useJump();
    const getData = (tab_type) => {
        Http.get('http://127.0.0.1:4523/mock2/587315/24149366', {type: tab_type}).then((res) => {
            setData(res.result);
        });
    };
    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    return (
        <>
            <ScrollView>
                <Header
                    tab_list={data?.tab_list}
                    tabClick={(tab_type) => getData(tab_type)}
                    ratio_info={data?.ratio_info}
                    line_drawback={data?.line_drawback}
                    bar={data?.bar}
                />
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
                <BottomDesc style={{marginTop: px(80)}} fix_img={data?.advisor_footer_img} />
            </ScrollView>
            {data?.guide_tip ? (
                <GuideTips data={data?.guide_tip} style={{position: 'absolute', bottom: px(120)}} />
            ) : null}
            {data?.btns && <FixedBtn btns={data.btns} />}
        </>
    );
};
const Header = ({tab_list, tabClick, ratio_info, line_drawback, bar}) => {
    const [active, setActive] = useState(0);
    const [period, setPeriod] = useState('y3');
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
            global.LogTool('portfolioDetailChartSwitch', p);
            tabClick.current = false;
            setChart([]);
            Http.get('/portfolio/yield_chart/20210101', {
                // allocation_id: data.allocation_id,
                // benchmark_id: data.benchmark_id,
                // poid: data.poid,
                period: p,
                type: t,
            }).then((resp) => {
                _tabClick.current = true;
                setChartData(resp.result);
                setChart(resp.result.yield_info.chart);
            });
        }
    };
    useEffect(() => {
        Http.get('/portfolio/yield_chart/20210101', {
            // upid: route.params.upid,
            // period: res.result.period,
            // type: type,
            // allocation_id: res.result.allocation_id,
            // benchmark_id: res.result.benchmark_id,
            // poid: route?.params?.poid,
        }).then((resp) => {
            setChartData(resp.result);
            setChart(resp.result.yield_info.chart);
        });
    }, []);
    return (
        <View style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
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
            <View style={Style.flexRow}>
                <View style={{flex: 1}}>
                    <Text style={[{fontSize: px(34), lineHeight: px(47), color: Colors.red}]}>
                        {ratio_info?.ratio_val}
                    </Text>
                    <Html html={ratio_info?.ratio_desc} style={styles.radio_sty} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={[{fontSize: px(26), lineHeight: px(36), color: Colors.defaultColor}]}>
                        {line_drawback?.ratio_val}
                    </Text>
                    <View style={Style.flexRowCenter}>
                        <Html style={styles.radio_sty} html={line_drawback?.ratio_desc} />
                    </View>
                </View>
            </View>
            {/* 标签label */}
            {ratio_info?.label ? (
                <View style={[Style.flexRowCenter, {marginTop: px(16), flexWrap: 'wrap'}]}>
                    {ratio_info?.label?.map((item, index) => (
                        <View style={styles.tag} key={index}>
                            <Text>{item}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
            {/* bar */}
            <View style={{marginTop: px(20)}}>
                <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                    <View style={[styles.left_bar, {width: '70%'}]} />
                    <View style={[styles.right_bar, {width: '30%'}]} />
                    <Image
                        source={require('../../../assets/img/account/processlabel.png')}
                        style={[{left: '68.5%'}, styles.bar_process_img]}
                    />
                </View>
                <View style={Style.flexBetween}>
                    <Text>12</Text>
                    <Text>12</Text>
                    <Text>12</Text>
                </View>
            </View>
            <View style={{marginTop: px(20)}}>
                <LinearGradient
                    start={{x: 0, y: 0.3}}
                    end={{x: 0, y: 1}}
                    style={{borderRadius: 6}}
                    colors={['#F5F6F8', '#FFFFFF']}>
                    <View style={{padding: px(16)}}>
                        <Html
                            style={{
                                lineHeight: px(20),
                                fontSize: px(12),
                                color: '#121D3A',
                            }}
                            html={
                                '  更专注于中国市场的研究，尤其是股市和债市的择时，板块轮动，风格变化和基金的筛选。通过股债搭配和投资系统的择时策略，能更加灵活的捕捉市场机会获取超额收益。'
                            }
                        />
                    </View>
                </LinearGradient>
            </View>
            {/* 图表 */}
            <RenderChart chartData={chartData} chart={chart} type={type} />
            <View
                style={{
                    flexDirection: 'row',
                    height: px(60),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                }}>
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
});
