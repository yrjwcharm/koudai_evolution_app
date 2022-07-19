/*
 * @Date: 2022-07-11 15:28:34
 * @Description: 持仓详情页
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Picker from 'react-native-picker';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import leftQuota2 from '~/assets/personal/leftQuota2.png';
import upgradeBg from '~/assets/personal/upgradeBg.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {Chart} from '~/components/Chart';
import CircleLegend from '~/components/CircleLegend';
import FormItem from '~/components/FormItem';
import {useJump} from '~/components/hooks';
import Mask from '~/components/Mask';
import NumText from '~/components/NumText';
import ScrollTabbar from '~/components/ScrollTabbar';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {baseAreaChart} from '~/pages/Portfolio/components/ChartOption';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {getChartData, getPageData} from './services';
import CenterControl from './CenterControl';
import {TextInput} from 'react-native-gesture-handler';

/** @name 顶部基金信息 */
const TopPart = ({trade_notice = {}, top_info, top_menus}) => {
    const jump = useJump();
    const {amount, desc, name, profit, profit_acc, tags = [], top_button} = top_info;

    return (
        <View style={styles.topPart}>
            <View style={{paddingHorizontal: Space.padding}}>
                <View style={[Style.flexBetween, {alignItems: 'flex-end'}]}>
                    <View style={styles.rowEnd}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={[styles.desc, {marginLeft: px(8), color: Colors.lightGrayColor}]}>{desc}</Text>
                    </View>
                    {top_button?.text ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => jump(top_button.url)}>
                            <Text style={styles.linkText}>{top_button.text}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                {tags?.length > 0 && (
                    <View style={[Style.flexRow, {marginTop: px(10)}]}>
                        {tags.map((tag, i) => {
                            return (
                                <View key={tag + i} style={styles.labelBox}>
                                    <Text style={styles.smallText}>{tag}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
                <View style={[Style.flexBetween, {marginTop: px(20)}]}>
                    <View>
                        <Text style={[styles.desc, {opacity: 0.6}]}>{amount.label}</Text>
                        <Text style={[styles.bigNumText, {marginTop: px(6)}]}>{amount.value}</Text>
                    </View>
                    <View>
                        <View style={Style.flexRow}>
                            <Text style={[styles.desc, {opacity: 0.6}]}>{profit.label}</Text>
                            <NumText style={styles.profitText} text={profit.value} />
                        </View>
                        <View style={[Style.flexRow, {marginTop: px(12)}]}>
                            <Text style={[styles.desc, {opacity: 0.6}]}>{profit_acc.label}</Text>
                            <NumText style={styles.profitText} text={profit_acc.value} />
                        </View>
                    </View>
                </View>
                {trade_notice?.desc ? (
                    <View style={Style.flexRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => jump(trade_notice.url)}
                            style={{marginTop: px(2)}}>
                            <Octicons color={'#F1F6FF'} name={'triangle-up'} size={16} style={{marginLeft: px(18)}} />
                            <View style={[Style.flexRow, styles.tradeMsgBox]}>
                                <Text style={[styles.linkText]}>{trade_notice.desc}</Text>
                                <Feather color={Colors.brandColor} name="chevron-right" size={18} />
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
            <View style={[Style.flexRow, {marginTop: px(20)}]}>
                {top_menus?.map((item, index) => {
                    const {icon, text, url} = item;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={text + index}
                            onPress={() => jump(url)}
                            style={[Style.flexCenter, {flex: 1}]}>
                            <Image source={{uri: icon}} style={styles.menuIcon} />
                            <Text style={[styles.smallText, {color: Colors.defaultColor}]}>{text}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

/** @name 次级中控 */
const ConsoleSub = ({data = {}}) => {
    const jump = useJump();
    const {button: consoleBtn, content: consoleContent, icon: consoleIcon, signal_mode, type: consoleType} = data;

    const consoleSubSty = {
        adjust: {
            backgroundColor: '#F1F6FF',
            borderColor: Colors.brandColor,
        },
        signal: {
            backgroundColor: signal_mode === 'buy' ? '#EDF7EC' : '#FFF2F2',
            borderColor: signal_mode === 'buy' ? Colors.green : Colors.red,
        },
        upgrade: {
            backgroundColor: '#FFFBF5',
            borderColor: '#FF7D41',
        },
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => jump(consoleBtn?.url)}
            style={[Style.flexRow, styles.consoleSub, consoleSubSty[consoleType]]}>
            {consoleType === 'upgrade' ? <Image source={upgradeBg} style={styles.upgradeBg} /> : null}
            <Image source={{uri: consoleIcon}} style={styles.typeIcon} />
            <Text style={styles.consoleSubText}>{consoleContent}</Text>
            {consoleBtn?.text ? (
                <View
                    style={[
                        Style.flexCenter,
                        styles.consoleSubBtn,
                        {borderColor: consoleSubSty[consoleType].borderColor},
                    ]}>
                    <Text style={[styles.desc, {color: consoleSubSty[consoleType].borderColor}]}>
                        {consoleBtn.text}
                    </Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

/** @name 组合快报 */
const GroupBulletIn = ({data = {}}) => {
    const jump = useJump();
    const {
        button: groupBtn,
        content: groupContent,
        date: groupDate,
        icon: groupIcon,
        // id: groupId,
        // title: groupTitle,
        top_button: groupTopBtn,
    } = data;

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => jump(groupBtn?.url)} style={styles.groupBulletIn}>
            <View style={Style.flexBetween}>
                <Image source={{uri: groupIcon}} style={styles.typeIcon} />
                {groupTopBtn?.text ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(groupTopBtn.url)}>
                        <Text style={styles.desc}>{groupTopBtn.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={{marginTop: px(14)}}>
                <Image source={leftQuota2} style={styles.leftQuota} />
                <Text numberOfLines={2} style={styles.desc}>
                    {groupContent}
                </Text>
            </View>
            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>{groupDate}</Text>
                {groupBtn?.text ? (
                    <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                        <Text style={styles.linkText}>{groupBtn.text}</Text>
                        <Feather color={Colors.brandColor} name="chevron-right" size={18} />
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

/** @name 图表tab */
const ChartTabs = ({tabs = []}) => {
    return (
        <View style={styles.chartTabs}>
            <ScrollableTabView
                initialPage={0}
                locked
                renderTabBar={() => (
                    <ScrollTabbar
                        boxStyle={{backgroundColor: '#fff', paddingLeft: px(8)}}
                        btnColor={Colors.defaultColor}
                    />
                )}>
                {tabs.map((tab, i) => {
                    const {key, title} = tab;
                    return (
                        <View key={key + i} tabLabel={title}>
                            <RenderChart data={tab} />
                        </View>
                    );
                })}
            </ScrollableTabView>
        </View>
    );
};

/** @name 渲染图表 */
const RenderChart = ({data = {}}) => {
    const {key, params, period: initPeriod} = data;
    const [period, setPeriod] = useState(initPeriod);
    const [chartData, setChartData] = useState({});
    const {chart, label, sub_tabs, tag_position} = chartData;
    const [loading, setLoading] = useState(true);
    const legendTitleArr = useRef([]);

    const getColor = (t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.toString().replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.toString().replace(/,/g, '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    };

    /** @name 图表滑动legend变化 */
    const onChartChange = ({items}) => {
        legendTitleArr.current?.forEach((item, index) => {
            const _props = {text: index === 0 ? items[0].title : `${items[index - 1].value}`};
            if (index > 0) {
                _props.style = [styles.legendTitle, {color: getColor(items[index - 1].value)}];
            }
            item?.setNativeProps(_props);
        });
    };

    /** @name 图表滑动结束 */
    const onHide = () => {
        label?.forEach((item, index) => {
            const {val} = item;
            const _props = {text: `${val}`};
            if (index > 0) {
                _props.style = [styles.legendTitle, {color: getColor(val)}];
            }
            legendTitleArr.current[index]?.setNativeProps(_props);
        });
    };

    useEffect(() => {
        getChartData({...params, period, poid: 'X00F490481', type: key})
            .then((res) => {
                if (res.code === '000000') {
                    setChartData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [key, params, period]);

    return (
        <>
            {/* 根据key区分不同图表 */}
            {label?.length > 0 ? (
                <View style={[Style.flexRow, {marginTop: px(8)}]}>
                    {label.map((item, index) => {
                        const {color, name, type, val} = item;
                        return (
                            <View key={name + index} style={[Style.flexCenter, {flex: 1}]}>
                                <TextInput
                                    defaultValue={`${val}`}
                                    editable={false}
                                    ref={(ref) => (legendTitleArr.current[index] = ref)}
                                    style={[styles.legendTitle, index > 0 ? {color: getColor(val)} : {}]}
                                />
                                <View style={Style.flexRowCenter}>
                                    {type ? (
                                        type === 'circle' ? (
                                            <CircleLegend color={color} />
                                        ) : type === 'line' ? (
                                            <View style={[styles.lineLegend, {backgroundColor: color}]} />
                                        ) : null
                                    ) : null}
                                    <Text style={styles.smallText}>{name}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            ) : null}
            <View style={{height: px(200)}}>
                {loading ? null : (
                    <Chart
                        initScript={baseAreaChart(
                            chart,
                            [Colors.red, Colors.lightBlackColor, 'transparent'],
                            ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                            true,
                            2,
                            deviceWidth - px(32),
                            [10, 20, 10, 18],
                            tag_position,
                            220,
                            chartData.max_ratio
                        )}
                        onChange={onChartChange}
                        onHide={onHide}
                        style={{width: '100%'}}
                    />
                )}
            </View>
            {sub_tabs?.length > 0 ? (
                <View style={[Style.flexRowCenter, {marginTop: px(8), marginBottom: Space.marginVertical}]}>
                    {sub_tabs.map((tab, i) => {
                        const {name, val} = tab;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={loading || period === val}
                                key={val + i}
                                onPress={() => {
                                    setLoading(true);
                                    setPeriod(val);
                                }}
                                style={[styles.subTabBox, period === val ? styles.activeTab : {}]}>
                                <Text
                                    style={[
                                        styles.desc,
                                        {
                                            color: period === val ? Colors.brandColor : Colors.descColor,
                                            fontWeight: period === val ? Font.weightMedium : '400',
                                        },
                                    ]}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : null}
        </>
    );
};

export default ({navigation}) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const {
        button_list,
        chart_tabs,
        console: consoleData,
        console_sub,
        gather_info,
        group_bulletin,
        notice_info = {},
        service_info,
        top_info = {},
        top_menus = [],
    } = data;
    const {desc: serviceDesc, icon: serviceIcon, title: serviceTitle, url: serviceUrl} = service_info || {};
    const {trade_notice} = notice_info;
    const [showMask, setShowMask] = useState(false);

    const init = () => {
        getPageData({})
            .then((res) => {
                if (res.code === '000000') {
                    navigation.setOptions({title: res.result.title || '资产详情'});
                    setData(res.result);
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    return (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <View style={styles.topLine} />
            {Object.keys(data).length > 0 ? (
                <>
                    <ScrollView
                        refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}
                        scrollIndicatorInsets={{right: 1}}
                        style={{flex: 1}}>
                        <TopPart trade_notice={trade_notice} top_info={top_info} top_menus={top_menus} />
                        <LinearGradient colors={['#fff', Colors.bgColor]} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                            <CenterControl data={consoleData} refresh={init} />
                        </LinearGradient>
                        <View style={{paddingHorizontal: Space.padding}}>
                            {console_sub ? <ConsoleSub data={console_sub} /> : null}
                            {group_bulletin ? <GroupBulletIn data={group_bulletin} /> : null}
                            {chart_tabs ? <ChartTabs tabs={chart_tabs} /> : null}
                            {service_info ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => jump(serviceUrl)}
                                    style={[Style.flexRow, styles.serviceInfo]}>
                                    <View style={[Style.flexRow, {flex: 1}]}>
                                        <Image source={{uri: serviceIcon}} style={styles.serviceIcon} />
                                        <View style={{flex: 1}}>
                                            <Text style={styles.title}>{serviceTitle}</Text>
                                            <Text
                                                style={[styles.desc, {marginTop: px(4), color: Colors.lightGrayColor}]}>
                                                {serviceDesc}
                                            </Text>
                                        </View>
                                    </View>
                                    <Feather color={Colors.defaultFontColor} name="chevron-right" size={18} />
                                </TouchableOpacity>
                            ) : null}
                            {gather_info?.length > 0 && (
                                <View style={styles.bottomList}>
                                    {gather_info.map((item, index) => {
                                        const {label} = item;
                                        return (
                                            <View key={label + index}>
                                                {index === 0 ? null : (
                                                    <View style={[styles.divider, {marginVertical: 0}]} />
                                                )}
                                                <View style={{height: px(60)}}>
                                                    <FormItem
                                                        data={item}
                                                        onChange={(val) => console.log(val)}
                                                        setShowMask={setShowMask}
                                                    />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                        <BottomDesc />
                    </ScrollView>
                    {button_list?.length > 0 && (
                        <View style={[Style.flexRow, styles.bottomBtns]}>
                            {button_list.map((btn, i) => {
                                const {avail, text, url} = btn;
                                if (i === 0) {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={avail === 0}
                                            onPress={() => jump(url)}
                                            key={text + i}
                                            style={[Style.flexCenter, {paddingHorizontal: px(26)}]}>
                                            <Text
                                                style={[
                                                    styles.bottomBtnText,
                                                    {color: avail === 0 ? '#BDC2CC' : Colors.defaultColor},
                                                ]}>
                                                {text}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                } else if (i === 1) {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={avail === 0}
                                            onPress={() => jump(url)}
                                            key={text + i}
                                            style={[
                                                Style.flexCenter,
                                                styles.fixedBtn,
                                                {backgroundColor: avail === 0 ? Colors.bgColor : '#E6F0FF'},
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.bottomBtnText,
                                                    {
                                                        color: avail === 0 ? '#BDC2CC' : Colors.brandColor,
                                                        fontWeight: Font.weightMedium,
                                                    },
                                                ]}>
                                                {text}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                } else if (i === 2) {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={avail === 0}
                                            onPress={() => jump(url)}
                                            key={text + i}
                                            style={[
                                                Style.flexCenter,
                                                styles.buyBtn,
                                                {backgroundColor: avail === 0 ? '#E9EAEF' : Colors.brandColor},
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.bottomBtnText,
                                                    {
                                                        color: avail === 0 ? '#BDC2CC' : '#fff',
                                                        fontWeight: Font.weightMedium,
                                                    },
                                                ]}>
                                                {text}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }
                            })}
                        </View>
                    )}
                </>
            ) : (
                <Loading />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topLine: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    topPart: {
        paddingTop: px(20),
        backgroundColor: '#fff',
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    linkText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    labelBox: {
        marginRight: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(2),
        borderWidth: px(1),
        borderColor: '#BDC2CC',
    },
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    bigNumText: {
        fontSize: px(24),
        lineHeight: px(29),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    profitText: {
        marginLeft: px(8),
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    tradeMsgBox: {
        marginTop: -5,
        paddingVertical: px(4),
        paddingHorizontal: px(12),
        borderRadius: px(40),
        backgroundColor: '#F1F6FF',
        alignItems: 'flex-end',
    },
    menuIcon: {
        marginBottom: px(6),
        width: px(28),
        height: px(28),
    },
    divider: {
        marginVertical: px(12),
        borderTopWidth: Space.borderWidth,
        borderTopColor: Colors.borderColor,
    },
    consoleSub: {
        marginTop: Space.marginVertical,
        paddingVertical: px(8),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
    typeIcon: {
        width: px(32),
        height: px(16),
    },
    consoleSubText: {
        marginHorizontal: px(8),
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        flex: 1,
    },
    consoleSubBtn: {
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        height: px(24),
    },
    upgradeBg: {
        position: 'absolute',
        top: px(2),
        right: px(56),
        width: px(40),
        height: px(36),
    },
    groupBulletIn: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        borderTopWidth: px(2),
        borderColor: Colors.brandColor,
        backgroundColor: '#fff',
    },
    leftQuota: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        top: px(-10),
        left: 0,
    },
    chartTabs: {
        marginTop: Space.marginVertical,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    serviceInfo: {
        marginTop: Space.marginVertical,
        paddingVertical: px(14),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    serviceIcon: {
        marginRight: px(8),
        width: px(44),
        height: px(44),
    },
    bottomList: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    bottomBtns: {
        paddingTop: px(12),
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
    },
    bottomBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
    },
    fixedBtn: {
        borderTopLeftRadius: Space.borderRadius,
        borderBottomLeftRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
    },
    buyBtn: {
        marginRight: px(12),
        borderTopRightRadius: Space.borderRadius,
        borderBottomRightRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
    },
    legendTitle: {
        padding: 0,
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        width: '100%',
        textAlign: 'center',
    },
    lineLegend: {
        marginRight: px(4),
        width: px(8),
        height: px(2),
    },
    subTabBox: {
        marginHorizontal: px(6),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
    },
    activeTab: {
        backgroundColor: '#DEE8FF',
    },
});
