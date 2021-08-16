/*
 * @Author: xjh
 * @Date: 2021-02-22 16:42:30
 * @Description:私募持仓
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-16 16:05:47
 */
import React, {useState, useCallback, useRef} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    RefreshControl,
} from 'react-native';
import Image from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text, isIphoneX, px} from '../../utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Header from '../../components/NavBar';
import TabBar from '../../components/TabBar.js';
import Video from '../../components/Video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Http from '../../services';
import {Modal} from '../../components/Modal';
import {BottomModal} from '../../components/Modal';
import storage from '../../utils/storage';
import {baseAreaChart} from '../Portfolio/components/ChartOption';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Chart} from '../../components/Chart';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
const deviceWidth = Dimensions.get('window').width;

export default function PrivateAssets({navigation, route}) {
    const insets = useSafeAreaInsets();
    const [showEye, setShowEye] = useState('true');
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const bottomModal = React.useRef(null);
    const [period, setPeriod] = useState('m1');
    const [qa, setQa] = useState({});
    const [chart, setChart] = useState({});
    const [chartData, setChartData] = useState([]);
    const [curIndex, setCurIndex] = useState(0);
    const [curIndexNet, setCurIndexNet] = useState(0);
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const jump = useJump();
    const tabClick = useRef(true);

    const changePeriod = (p) => {
        if (!tabClick.current) {
            return false;
        }
        setPeriod((prev) => {
            if (prev !== p) {
                tabClick.current = false;
                getChartInfo(p);
            }
            return p;
        });
    };
    const ChangeTab = (i) => {
        setCurIndex(i);
    };
    const changeNetTab = (i) => {
        setCurIndexNet(i);
    };
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            storage.save('peEye', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    }, []);
    const init = useCallback(
        (type) => {
            type == 'refresh' && setRefreshing(true);
            Http.get('/pe/asset_detail/20210101', {
                fund_code: route.params.fund_code,
                poid: route.params.poid,
            })
                .then((res) => {
                    setLoading(false);
                    setRefreshing(false);
                    storage.get('peEye').then((result) => {
                        setShowEye(result ? result : 'true');
                    });
                    setData(res.result);
                    getChartInfo();
                })
                .catch(() => {
                    setLoading(false);
                });
        },
        [getChartInfo, route.params]
    );
    const renderLoading = () => {
        return (
            <View
                style={{
                    paddingTop: insets.top + Space.padding,
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <Image
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/personal/loading.png')}
                    resizeMode={Image.resizeMode.contain}
                />
            </View>
        );
    };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );
    const redeemBtn = () => {
        Modal.show({
            confirm: true,
            content: data.buttons[1].pop.content,
            title: data.buttons[1].pop.title,
            confirmText: '继续赎回',
            confirmCallBack: () => jump(data?.buttons[1].url),
        });
    };

    const getChartInfo = useCallback(
        (_period) => {
            setChartData([]);
            Http.get('/pe/chart/20210101', {
                fund_code: route.params.fund_code,
                poid: route.params.poid,
                period: _period || period,
            }).then((res) => {
                tabClick.current = true;
                setChart(res.result);
                setChartData(res.result.chart);
            });
        },
        [period, route]
    );
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            //时间取title setNativeProps中数据取前两条
            _textTime.current.setNativeProps({text: items[0]?.title});
            _textPortfolio.current.setNativeProps({
                text: items[0]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
            });
            _textBenchmark.current.setNativeProps({
                text: items[1]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[1]?.value)}],
            });
        },
        [getColor]
    );

    // 图表滑动结束
    const onHide = ({items}) => {
        _textTime.current.setNativeProps({text: chart?.label[0].val});
        _textPortfolio.current.setNativeProps({
            text: chart?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(chart?.label[1].val)}],
        });

        _textBenchmark.current.setNativeProps({
            text: chart?.label[2].val,
            style: [styles.legend_title_sty, {color: getColor(chart?.label[2].val)}],
        });
    };
    const tipShow = (q, a) => {
        qa.q = q;
        qa.a = a;
        setQa(qa);
        bottomModal.current.show();
    };
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replace(/,/g, '')) > 0) {
            return Colors.red;
        } else if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else {
            return Colors.defaultColor;
        }
    }, []);

    const renderContent = (index, contentData) => {
        if (index === 0) {
            return (
                <View style={{minHeight: 300, backgroundColor: '#fff', paddingVertical: Space.padding}}>
                    {Object.keys(chart).length > 0 && (
                        <View style={[Style.flexRow]}>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    ref={_textTime}
                                    style={styles.legend_title_sty}
                                    defaultValue={chart?.label[0]?.val}
                                />
                                <Text style={styles.legend_desc_sty}>{chart?.label[0]?.name}</Text>
                            </View>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    style={[styles.legend_title_sty]}
                                    ref={_textPortfolio}
                                    defaultValue={chart?.label[1]?.val}
                                />
                                <Text>
                                    <MaterialCommunityIcons
                                        name={'record-circle-outline'}
                                        color={'#E74949'}
                                        size={12}
                                    />
                                    <Text style={styles.legend_desc_sty}>{chart?.label[1]?.name}</Text>
                                </Text>
                            </View>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    style={[styles.legend_title_sty]}
                                    ref={_textBenchmark}
                                    defaultValue={chart?.label[2]?.val}
                                />
                                <Text>
                                    <MaterialCommunityIcons
                                        name={'record-circle-outline'}
                                        color={'#545968'}
                                        size={12}
                                    />
                                    <Text style={styles.legend_desc_sty}>{chart?.label[2]?.name}</Text>
                                </Text>
                            </View>
                        </View>
                    )}
                    <View style={{height: 220}}>
                        {chartData?.length > 0 && (
                            <Chart
                                initScript={baseAreaChart(
                                    chartData,
                                    ['l(90) 0:#E74949 1:#fff', Colors.lightBlackColor, 'transparent'],
                                    ['l(90) 0:#E74949 1:#fff', 'transparent', 'green'],
                                    true,
                                    2,
                                    deviceWidth - 10,
                                    10,
                                    {},
                                    220,
                                    chart.max_ratio
                                )}
                                onChange={onChartChange}
                                data={chart?.chart}
                                onHide={onHide}
                                style={{height: isIphoneX() ? px(200) : px(220)}}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 20,
                        }}>
                        {chart?.sub_tabs?.map((_item, _index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[
                                        styles.btn_sty,
                                        {backgroundColor: period == _item.val ? '#f5e9da' : '#fff'},
                                    ]}
                                    key={_index + 'sub'}
                                    onPress={() => changePeriod(_item.val, _item.type)}>
                                    <Text
                                        style={{
                                            color: period == _item.val ? '#B27B2A' : '#555B6C',
                                            fontSize: text(12),
                                        }}>
                                        {_item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        } else if (index === 1) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <View style={[Style.flexRow, styles.item_list]}>
                        <Text style={{flex: 1}}>{contentData.content.title}</Text>
                        <Text>{contentData.content.subtitle}</Text>
                    </View>
                    <View style={[Style.flexCenter]}>
                        <Video url={contentData.content.video} />
                    </View>
                </View>
            );
        } else if (index === 2) {
            return (
                <>
                    {contentData.content.map((_i, _d) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    jump(_i.url);
                                }}
                                style={[
                                    Style.flexRow,
                                    styles.item_list,
                                    {backgroundColor: _d % 2 == 0 ? '#fff' : '#F7F8FA'},
                                ]}
                                key={'content' + _d}>
                                <Text style={{flex: 1, fontSize: text(13)}}>{_i.title}</Text>
                                <Text style={{fontSize: text(13)}}>{_i.publish_at}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </>
            );
        }
    };

    const renderItem = (index, itemData) => {
        if (index === 0) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <View style={[Style.flexRow, {backgroundColor: '#F7F8FA'}]}>
                        {itemData?.table?.th?.map((_head, _index) => {
                            return (
                                <Text
                                    style={[
                                        styles.table_title_sty,
                                        {
                                            textAlign:
                                                _index == 0
                                                    ? 'left'
                                                    : _index == itemData.table.th.length - 1
                                                    ? 'right'
                                                    : 'center',
                                            color: '#9095A5',
                                            flex: _index == 0 ? 1 : 0,
                                        },
                                    ]}
                                    key={_index + '_head'}>
                                    {_head}
                                </Text>
                            );
                        })}
                    </View>
                    <View>
                        {itemData?.table?.tr_list?.slice(0, 6).map((_body, _index) => {
                            return (
                                <View
                                    key={_index + '_body'}
                                    style={[Style.flexRow, {backgroundColor: _index % 2 == 0 ? '#fff' : '#F7F8FA'}]}>
                                    {_body.map((_td, _i) => {
                                        return (
                                            <Text
                                                key={_i}
                                                style={[
                                                    styles.table_title_sty,
                                                    {
                                                        textAlign:
                                                            _i == 0
                                                                ? 'left'
                                                                : _i == _body.length - 1
                                                                ? 'right'
                                                                : 'center',
                                                        flex: _i == 0 ? 1 : 0,
                                                        color:
                                                            _i == _body.length - 1
                                                                ? parseFloat(_td.text?.replace(/,/g, '')) < 0
                                                                    ? Colors.green
                                                                    : Colors.red
                                                                : Colors.defaultColor,
                                                    },
                                                ]}>
                                                {_td.text}
                                            </Text>
                                        );
                                    })}
                                </View>
                            );
                        })}
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.text_sty}
                            onPress={() => navigation.navigate('AssetNav', {code: route.params?.fund_code})}>
                            <Text style={{color: '#545968'}}>更多净值</Text>
                            <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text style={styles.list_item_sty}>{itemData.table.th}</Text>
                    <View>
                        {itemData?.table?.tr_list?.map((_tr, _index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[Style.flexRow, {backgroundColor: _index % 2 == 0 ? '#fff' : '#F7F8FA'}]}
                                    onPress={() => tipShow(_tr.q, _tr.a)}
                                    key={_index + '_tr1'}>
                                    <Text
                                        style={[
                                            styles.list_item_sty,
                                            {
                                                color: '#121D3A',
                                                flex: 1,
                                                backgroundColor: 'transparent',
                                            },
                                        ]}>
                                        {_tr.text}
                                    </Text>
                                    <AntDesign
                                        name={'questioncircleo'}
                                        size={15}
                                        color={'#9095A5'}
                                        style={{marginRight: text(16)}}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        }
    };
    return loading ? (
        renderLoading()
    ) : (
        <View style={{flex: 1}}>
            {Object.keys(data).length > 0 && (
                <>
                    <Header
                        title={data.title}
                        leftIcon="chevron-left"
                        style={{backgroundColor: '#D7AF74'}}
                        fontStyle={{color: '#fff'}}
                        rightText={'交易记录'}
                        rightPress={() => jump(data.trade_record_url)}
                        rightTextStyle={styles.right_sty}
                    />
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
                        <View style={styles.assets_card_sty}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                    <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                        <Text style={styles.profit_text_sty}>总金额(元)</Text>
                                        <TouchableOpacity onPress={toggleEye} activeOpacity={1}>
                                            <Ionicons
                                                name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                                size={16}
                                                color={'rgba(255, 255, 255, 0.8)'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.profit_num_sty, {fontSize: text(24)}]}>
                                        {showEye === 'true' ? data?.total_amount : '***'}
                                    </Text>
                                </View>
                                <View>
                                    <View style={[Style.flexRow, {marginBottom: text(15), alignSelf: 'flex-end'}]}>
                                        <Text style={styles.profit_text_sty}>总份额(份)</Text>
                                        <Text style={styles.profit_num_sty}>
                                            {showEye === 'true' ? data?.total_share : '***'}
                                        </Text>
                                    </View>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.profit_text_sty}>累计收益(元)</Text>
                                        <Text style={styles.profit_num_sty}>
                                            {showEye === 'true' ? data?.profit_acc : '***'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <ScrollableTabView
                            renderTabBar={() => <TabBar btnColor={'#D7AF74'} />}
                            initialPage={0}
                            tabBarActiveTextColor={'#D7AF74'}
                            onChangeTab={(obj) => ChangeTab(obj.i)}
                            tabBarInactiveTextColor={'#545968'}>
                            {data?.tabs1.map((item, index) => {
                                return <View tabLabel={item?.title} key={index + 'tab'} />;
                            })}
                        </ScrollableTabView>
                        {renderContent(curIndex, data?.tabs1[curIndex])}
                        <ScrollableTabView
                            renderTabBar={() => <TabBar btnColor={'#D7AF74'} />}
                            initialPage={0}
                            style={{marginTop: text(16)}}
                            tabBarActiveTextColor={'#D7AF74'}
                            tabBarInactiveTextColor={'#545968'}
                            onChangeTab={(obj) => changeNetTab(obj.i)}>
                            {data?.tabs2?.map((item, index) => {
                                return <View tabLabel={item?.title} key={index + 'tab1'} />;
                            })}
                        </ScrollableTabView>
                        {renderItem(curIndexNet, data?.tabs2[curIndexNet])}
                        {data?.cards?.map((_item, _index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{...styles.list_sty, marginTop: _index === 0 ? Space.marginVertical : 0}}
                                    key={_index + 'card'}
                                    onPress={() => jump(_item.url)}>
                                    <Text style={{flex: 1}}>{_item?.text}</Text>
                                    <AntDesign name={'right'} size={12} color={'#9095A5'} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <BottomModal ref={bottomModal} confirmText={'确认'}>
                        <View style={{padding: text(16)}}>
                            <Text style={[styles.tips_sty, {marginBottom: text(10)}]}>{qa?.q}</Text>
                            <Text style={styles.tips_sty}>{qa?.a}</Text>
                        </View>
                    </BottomModal>
                    <View
                        style={[
                            Style.flexRow,
                            {
                                paddingBottom: isIphoneX() ? 34 : text(8),
                                backgroundColor: '#fff',
                                paddingHorizontal: text(16),
                                paddingTop: text(10),
                            },
                        ]}>
                        {data?.buttons[1] ? (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={[
                                    styles.button_sty,
                                    {borderColor: '#4E556C', borderWidth: 0.5, marginRight: text(10)},
                                ]}
                                onPress={() => {
                                    data?.buttons[1].avail == 1 && redeemBtn();
                                }}>
                                <Text style={{textAlign: 'center', color: '#545968'}}>{data?.buttons[1]?.text}</Text>
                            </TouchableOpacity>
                        ) : null}

                        {data?.buttons[0] ? (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={[
                                    styles.button_sty,
                                    {backgroundColor: data?.buttons[0].avail == 1 ? '#D7AF74' : '#ddd'},
                                ]}
                                onPress={() => {
                                    data?.buttons[0].avail == 1 && jump(data?.buttons[0].url);
                                }}>
                                <Text style={{textAlign: 'center', color: '#fff'}}>{data?.buttons[0]?.text}</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    assets_card_sty: {
        backgroundColor: '#D7AF74',
        paddingHorizontal: text(16),
        paddingVertical: text(15),
        paddingBottom: text(30),
    },
    profit_text_sty: {
        color: '#FFFFFF',
        opacity: 0.4,
        fontSize: Font.textH3,
        marginRight: text(5),
    },
    profit_num_sty: {
        color: '#fff',
        fontSize: text(17),
        fontFamily: Font.numFontFamily,
    },
    item_list: {
        paddingVertical: text(15),
        paddingHorizontal: Space.padding,
    },
    base_info_title: {
        minWidth: text(60),
        color: Colors.descColor,
    },
    base_info_content: {
        flex: 1,
        color: Colors.descColor,
    },
    backgroundVideo: {
        width: deviceWidth - 32,
        height: 200,
    },
    table_title_sty: {
        width: text(90),
        paddingHorizontal: text(16),
        paddingVertical: text(12),
        fontSize: text(13),
    },
    text_sty: {
        textAlign: 'center',
        color: '#9095A5',
        fontSize: text(13),
        paddingVertical: text(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list_sty: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: text(16),
        marginBottom: Space.marginVertical,
    },
    button_sty: {
        flex: 1,
        borderRadius: text(10),
        paddingVertical: text(12),
    },
    list_item_sty: {
        fontSize: text(13),
        color: '#9095A5',
        textAlign: 'center',
        paddingVertical: text(12),
        backgroundColor: '#F7F8FA',
    },
    tips_sty: {
        color: '#545968',
        fontSize: text(13),
        lineHeight: text(18),
    },
    legend_sty: {
        flex: 1,
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        // fontWeight: 'bold',
        fontSize: text(16),
        fontFamily: Font.numMedium,
        marginBottom: text(4),
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: '#545968',
    },
    radio_sty: {
        color: '#9AA1B2',
        fontSize: text(12),
        textAlign: 'center',
        marginTop: text(4),
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        borderRadius: text(15),
        marginRight: text(10),
    },
});
