/*
 * @Date: 2022/9/30 13:28
 * @Author: yanruifeng
 * @Description:
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, TextInput, TouchableOpacity, StyleSheet, View} from 'react-native';
import {getChartData} from './service';
import {useRoute} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import RootSibling from 'react-native-root-siblings';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceWidth, isIphoneX, px} from '../../../utils/appUtil';
import {Chart} from '../../../components/Chart';
import {baseAreaChart} from '../../Portfolio/components/ChartOption';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Empty from '~/components/EmptyTip';
import CircleLegend from '../../../components/CircleLegend';
import RenderList from './components/RenderList';
import dayjs from 'dayjs';

const TotalProfit = (props) => {
    const [selCurYear, setSelCurYear] = useState(dayjs().year());
    const [mockData] = useState([
        {
            date: '2022-08-07',
            profit: '+20.94',
        },
        {
            date: '2022-08-12',
            profit: '-245.08',
        },
        {
            date: '2022-08-23',
            profit: '+3,420',
        },
        {
            date: '2022-08-01',
            profit: '+20.94',
        },
        {
            date: '2022-09-08',
            profit: '-245.08',
        },
        {
            date: '2022-09-11',
            profit: '+3,420',
        },
        {
            date: '2022-09-12',
            profit: '+57,420',
        },
        {
            date: '2022-09-14',
            profit: '+420.94',
        },
        {
            date: '2022-09-18',
            profit: '+8.94',
        },
        {
            date: '2022-09-19',
            profit: '-2,245',
        },
        {
            date: '2022-09-20',
            profit: '-75.23',
        },
        {
            date: '2022-10-01',
            profit: '+75.23',
        },
        {
            date: '2022-10-02',
            profit: '-25.23',
        },
        // {
        //     date: '2022-10-08',
        //     profit: '-25.23',
        // },
    ]);
    const [profitData] = useState([
        {
            type: 1,
            title: '黑天鹅FOF1号',
            profit: '82,325.59',
        },
        {
            type: 2,
            title: '智能｜全天候组合等级6',
            profit: '+7,632.04',
        },
        {
            type: 3,
            title: '低估值定投计划',
            profit: '-1,552.27',
        },
        {
            type: 4,
            title: '平安策略先锋混合',
            profit: '-62.54',
        },
    ]);
    const [tab] = useState([
        {
            key: 'acc_profit',
            title: '累计收益',
            period: 'y1',
            params: {
                poid: 'X00F000003',
            },
        },
    ]);
    const [data, setData] = useState([]);
    const sortRenderList = useCallback(() => {}, []);
    /** @name 渲染图表 */
    const RenderChart = ({data = {}}) => {
        const route = useRoute();
        const {key, params, period: initPeriod} = data;
        const [period, setPeriod] = useState(initPeriod);
        const [chartData, setChartData] = useState({});
        const {chart, label, max_amount, max_ratio, sub_tabs, tag_position} = chartData;
        const [loading, setLoading] = useState(true);
        const [showEmpty, setShowEmpty] = useState(false);
        const legendTitleArr = useRef([]);
        const rootRef = useRef();
        const currentIndex = useRef('');

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

        /** @name 渲染指数下拉选择框 */
        const showChooseIndex = (e, index_list, indexKey) => {
            // console.log(e.nativeEvent);
            const {locationX, locationY, pageX, pageY} = e.nativeEvent;
            rootRef.current = new RootSibling(
                (
                    <>
                        <View onTouchStart={() => rootRef.current.destroy()} style={styles.rootMask} />
                        <View
                            style={[
                                styles.keyChooseCon,
                                {
                                    top: pageY - locationY + px(16),
                                    left: pageX - locationX - px(8),
                                },
                            ]}>
                            {index_list?.map?.((_index, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={_index.key + i}
                                        onPress={() => {
                                            rootRef.current.destroy();
                                            setLoading(true);
                                            currentIndex.current = _index.key;
                                            init();
                                        }}
                                        style={[
                                            styles.indexBox,
                                            {
                                                borderTopWidth: i === 0 ? 0 : Space.borderWidth,
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.smallText,
                                                _index.key === indexKey
                                                    ? {
                                                          color: Colors.brandColor,
                                                          fontWeight: Font.weightMedium,
                                                      }
                                                    : {},
                                            ]}>
                                            {_index.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )
            );
        };

        const init = async () => {
            const res = await getChartData({
                poid: 'X00F000003',
                period: 'y1',
                type: 'acc_profit',
                app: '4000',
                ts: '1665375248360',
                did: 'd7012f521452990f',
                uid: '1000000002',
                utid: 'e9faa52d3cefa609',
            });
            if (res.code == '000000') {
                setChartData(res.result);
                setLoading(false);
                setShowEmpty(true);
            }
        };

        useEffect(() => {
            init();
        }, [key, params, period]);

        useEffect(() => {
            label && onHide();
        }, [label]);
        return (
            <>
                {label?.length > 0 ? (
                    <View style={[Style.flexRowCenter, {marginTop: px(8)}]}>
                        {label.map((item, index, arr) => {
                            const {color, index_list, key: indexKey, name, tips, type, val} = item;
                            const n = index_list?.find?.((i) => i.key === indexKey)?.text || name;
                            return (
                                <View
                                    key={name + index}
                                    style={[
                                        Style.flexCenter,
                                        index === 1
                                            ? {marginLeft: px(40), marginRight: arr.length === 3 ? px(40) : 0}
                                            : {},
                                    ]}>
                                    <TextInput
                                        defaultValue={`${val}`}
                                        editable={false}
                                        ref={(ref) => (legendTitleArr.current[index] = ref)}
                                        style={[styles.legendTitle, index > 0 ? {color: getColor(val)} : {}]}
                                    />
                                    <View style={[Style.flexRowCenter, {marginTop: px(4)}]}>
                                        {type ? (
                                            type === 'circle' ? (
                                                <CircleLegend color={color} />
                                            ) : type === 'line' ? (
                                                <View style={[styles.lineLegend, {backgroundColor: color}]} />
                                            ) : null
                                        ) : null}
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={!(index_list?.length > 0)}
                                            onPress={(e) => showChooseIndex(e, index_list, indexKey)}
                                            style={Style.flexRow}>
                                            <Text style={styles.smallText}>{n}</Text>
                                            {index_list?.length > 0 && (
                                                <AntDesign
                                                    color={Colors.lightBlackColor}
                                                    name="caretdown"
                                                    size={px(6)}
                                                    style={{marginLeft: px(2)}}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : null}
                <View style={{height: px(200)}}>
                    {loading ? null : chart?.length > 0 ? (
                        <Chart
                            initScript={baseAreaChart(
                                chart,
                                key === 'amount_change'
                                    ? ['transparent']
                                    : [Colors.red, Colors.lightBlackColor, 'transparent'],
                                key === 'amount_change'
                                    ? ['red']
                                    : ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                ['nav', 'roe7d'].includes(key),
                                ['nav', 'roe7d'].includes(key) ? 2 : 0,
                                deviceWidth - px(32),
                                [10, 20, 10, 18],
                                tag_position,
                                px(200),
                                max_ratio || max_amount
                            )}
                            onChange={onChartChange}
                            onHide={onHide}
                            style={{width: '100%'}}
                        />
                    ) : (
                        showEmpty && (
                            <Empty
                                style={{paddingTop: px(40)}}
                                imageStyle={{width: px(150), resizeMode: 'contain'}}
                                type={'part'}
                            />
                        )
                    )}
                </View>
                {sub_tabs?.length > 0 ? (
                    <View style={[Style.flexRowCenter, {marginTop: px(8)}]}>
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
                                    style={[
                                        styles.subTabBox,
                                        {marginLeft: i === 0 ? px(6) : 0},
                                        period === val ? styles.activeTab : {},
                                    ]}>
                                    <Text
                                        style={[
                                            styles.smallText,
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
    return (
        <View style={styles.container}>
            <RenderChart data={tab} />
            <View
                style={{
                    paddingHorizontal: px(12),
                }}>
                <RenderList data={profitData} onPress={sortRenderList} date={selCurYear} />
            </View>
        </View>
    );
};

TotalProfit.propTypes = {};

export default TotalProfit;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: px(22),
        borderBottomRightRadius: px(5),
        borderBottomLeftRadius: px(5),
    },
    topLine: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    topPart: {
        marginTop: px(12),
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        paddingBottom: 0,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bigTitle: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
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
    tipsVal: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    labelBox: {
        marginLeft: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    tagText: {
        fontSize: px(9),
        lineHeight: px(13),
        color: Colors.descColor,
    },
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    bigNumText: {
        fontSize: px(22),
        lineHeight: px(27),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    numText: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    profitBox: {
        marginTop: px(12),
        paddingTop: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    profitText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    tradeMsgBox: {
        marginTop: px(12),
        paddingVertical: px(8),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    expandBox: {
        marginBottom: Space.marginVertical,
        paddingVertical: px(12),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        width: '100%',
    },
    angle: {
        position: 'relative',
        top: px(3),
        width: px(6),
        height: px(6),
        backgroundColor: Colors.bgColor,
        transform: [{rotate: '45deg'}],
    },
    menuBox: {
        marginTop: px(12),
        marginBottom: 0,
        marginHorizontal: 0,
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
    closeBtn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 60,
    },
    signalModeIcon: {
        position: 'absolute',
        top: -px(32),
        right: 0,
        width: px(34),
        height: px(24),
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
    partBox: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    videoBox: {
        paddingTop: px(8),
        paddingHorizontal: Space.marginAlign,
        paddingBottom: Space.padding,
        height: px(200),
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
        marginTop: px(12),
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
        fontWeight: Font.weightMedium,
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
    chartTabs: {
        backgroundColor: '#fff',
        marginLeft: px(8),
    },
    legendTitle: {
        padding: 0,
        fontSize: px(13),
        lineHeight: px(19),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        width: '100%',
        textAlign: 'center',
    },
    lineLegend: {
        marginRight: px(4),
        width: px(8),
        height: px(2),
    },
    subTabBox: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    activeTab: {
        backgroundColor: '#DEE8FF',
    },
    tabelHeader: {
        marginTop: px(8),
        borderTopLeftRadius: Space.borderRadius,
        borderTopRightRadius: Space.borderRadius,
        height: px(37),
        backgroundColor: Colors.bgColor,
    },
    tabelRow: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        height: px(44),
    },
    toolNameBox: {
        paddingVertical: px(1),
        paddingRight: px(8),
        paddingLeft: px(1),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
    },
    toolIcon: {
        marginRight: px(4),
        width: px(18),
        height: px(18),
    },
    toolNum: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    toolBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    rootMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    keyChooseCon: {
        paddingHorizontal: px(4),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        position: 'absolute',
        zIndex: 2,
    },
    indexBox: {
        paddingVertical: px(8),
        paddingHorizontal: px(4),
        borderColor: Colors.borderColor,
        alignItems: 'center',
    },
    publishAt: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
        fontFamily: Font.numRegular,
    },
    modeTitle: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    signalWrapper: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: px(32),
    },
    indicatorWrapper: {
        flex: 4,
        borderLeftWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    indicatorVal: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    circle: {
        marginRight: px(8),
        borderRadius: px(10),
        width: px(10),
        height: px(10),
    },
    dsFundBox: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    redeemBtn: {
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
});
