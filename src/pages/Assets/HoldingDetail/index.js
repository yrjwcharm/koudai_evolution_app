/*
 * @Date: 2022-07-11 15:28:34
 * @Description: 持仓详情页
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import Picker from 'react-native-picker';
import RootSibling from 'react-native-root-siblings';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import leftQuota2 from '~/assets/personal/leftQuota2.png';
import tip from '~/assets/img/tip.png';
import upgradeBg from '~/assets/personal/upgradeBg.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {Chart} from '~/components/Chart';
import CircleLegend from '~/components/CircleLegend';
import Empty from '~/components/EmptyTip';
import FormItem from '~/components/FormItem';
import GuideTips from '~/components/GuideTips';
import {useJump} from '~/components/hooks';
import Mask from '~/components/Mask';
import {Modal} from '~/components/Modal';
import Notice from '~/components/Notice';
import {PasswordModal} from '~/components/Password';
import HTML from '~/components/RenderHtml';
import ScrollTabbar from '~/components/ScrollTabbar';
import Toast from '~/components/Toast';
import Video from '~/components/Video';
import withPageLoading from '~/components/withPageLoading';
import {baseAreaChart} from '~/pages/Portfolio/components/ChartOption';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import {getChartData, getCommonData, getDsData, getPageData, setDividend} from './services';
import CenterControl from './CenterControl';
import RenderAlert from '../components/RenderAlert';
import ToolMenusCard from '../components/ToolMenusCard';

/** @name 顶部基金信息 */
const TopPart = ({setShowEye, showEye, trade_notice = {}, top_button, top_info = {}}) => {
    const jump = useJump();
    const {asset_info, code, indicators, name, profit_acc_info, profit_info, tags = []} = top_info;
    const [expand, setExpand] = useState(false);

    /** @name 显示|隐藏金额信息 */
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            global.LogTool('click', show === 'true' ? 'eye_close' : 'eye_open');
            Storage.save('portfolioAssets', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** @name 处理隐藏金额信息 */
    const hideAmount = (value) => {
        return showEye === 'true' ? value : '****';
    };

    return (
        <View style={styles.topPart}>
            <View style={[Style.flexBetween, {alignItems: 'flex-end'}]}>
                <Text style={styles.title}>{name}</Text>
                {top_button?.text ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(top_button.url)}>
                        <Text style={styles.linkText}>{top_button.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            {tags?.length > 0 && (
                <View style={[Style.flexRow, {marginTop: px(6)}]}>
                    <Text style={styles.smallText}>{code}</Text>
                    {tags.map((tag, i) => {
                        return (
                            <View key={tag + i} style={styles.labelBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
            <View style={[Style.flexBetween, styles.profitBox]}>
                <View>
                    <View style={Style.flexRow}>
                        <Text style={[styles.desc, {color: Colors.descColor}]}>
                            {asset_info.text}
                            &nbsp;<Text style={styles.smallText}>{asset_info.date}</Text>
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={toggleEye} style={{marginLeft: px(8)}}>
                            <Ionicons
                                color={Colors.defaultColor}
                                name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                size={px(14)}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.bigNumText, {marginTop: px(2)}]}>{hideAmount(asset_info.value)}</Text>
                </View>
                <View>
                    <View style={Style.flexRow}>
                        <Text style={[styles.smallText, {marginRight: px(4)}]}>{profit_info.text}</Text>
                        <HTML html={hideAmount(`${profit_info.value}`)} style={styles.profitText} />
                    </View>
                    <View style={[Style.flexRow, {marginTop: px(8)}]}>
                        <Text style={[styles.smallText, {marginRight: px(4)}]}>{profit_acc_info.text}</Text>
                        <HTML html={hideAmount(`${profit_acc_info.value}`)} style={styles.profitText} />
                    </View>
                </View>
            </View>
            {trade_notice?.desc ? (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => jump(trade_notice.url)}
                    style={[Style.flexRow, styles.tradeMsgBox]}>
                    <Text style={styles.smallText}>{trade_notice.desc}</Text>
                    <Feather color={Colors.descColor} name="chevron-right" size={px(10)} />
                </TouchableOpacity>
            ) : null}
            {indicators ? (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setExpand((prev) => !prev)}
                        style={[Style.flexCenter, {paddingTop: px(8), paddingBottom: expand ? 0 : px(8)}]}>
                        <Feather
                            color={Colors.lightGrayColor}
                            name={expand ? 'chevron-up' : 'chevron-down'}
                            size={px(16)}
                        />
                    </TouchableOpacity>
                    {expand && (
                        <View style={Style.flexCenter}>
                            <View style={styles.angle} />
                            <View style={[Style.flexRow, styles.expandBox]}>
                                {indicators.map?.((item, index) => {
                                    const {text, value} = item;
                                    return (
                                        <View key={text + index} style={[Style.flexCenter, {flex: 1}]}>
                                            <Text style={styles.smallText}>{text}</Text>
                                            <Text style={[styles.numText, {marginTop: px(4)}]}>
                                                {showEye === 'true' ? value : '****'}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </>
            ) : null}
        </View>
    );
};

/** @name 次级中控 */
const ConsoleSub = ({data = {}, showModal}) => {
    const jump = useJump();
    const {
        button: consoleBtn,
        content: consoleContent,
        icon: consoleIcon,
        signal_console,
        signal_mode,
        type: consoleType,
    } = data;
    const {signal_icon, signal_items, title} = signal_console || {};

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

    const renderHeader = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingTop: Space.padding, paddingBottom: px(8)}]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => Modal.close({})}
                    style={[Style.flexCenter, styles.closeBtn]}>
                    <AntDesign name={'close'} size={18} />
                </TouchableOpacity>
                <Text style={styles.bigTitle}>{title}</Text>
                <Image source={{uri: signal_icon}} style={styles.signalModeIcon} />
            </View>
        );
    };

    const onPress = () => {
        if (signal_console) {
            showModal({
                options: {
                    header: renderHeader(),
                    style: {backgroundColor: signal_mode === 'buy' ? '#EDF7EC' : '#FFF2F2'},
                },
                renderData: {signal_items, signal_mode, type: consoleType},
                type: 'slide',
            });
        } else {
            jump(consoleBtn?.url);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
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
    const jump = useJump();
    const [current, setCurrent] = useState(0);

    return (
        <View style={styles.partBox}>
            <ScrollableTabView
                initialPage={0}
                locked
                onChangeTab={({i}) => setCurrent(i)}
                prerenderingSiblingsNumber={Infinity}
                renderTabBar={() => (
                    <ScrollTabbar
                        activeFontSize={px(13)}
                        boxStyle={styles.chartTabs}
                        btnColor={Colors.defaultColor}
                        inActiveFontSize={px(12)}
                    />
                )}>
                {tabs.map((tab, i) => {
                    const {title} = tab;
                    const {data, key} = tabs[current];
                    return (
                        <View key={title + i} tabLabel={title}>
                            {key === 'video' ? (
                                <View style={[Style.flexCenter, styles.videoBox]}>
                                    <Video url={data.video} />
                                </View>
                            ) : key === 'notice' ? (
                                <View style={{paddingHorizontal: Space.padding}}>
                                    {data?.map?.((item, index) => {
                                        const {publish_at, title: noticeTitle, url} = item;
                                        return (
                                            <View
                                                key={noticeTitle + index}
                                                style={{
                                                    borderColor: Colors.borderColor,
                                                    borderTopWidth: index === 0 ? 0 : Space.borderWidth,
                                                }}>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => jump(url)}
                                                    style={[Style.flexBetween, {paddingVertical: px(12)}]}>
                                                    <Text numberOfLines={1} style={[styles.desc, {maxWidth: px(226)}]}>
                                                        {noticeTitle}
                                                    </Text>
                                                    <Text style={styles.publishAt}>{publish_at}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            ) : (
                                <View style={{paddingBottom: px(12)}}>
                                    <RenderChart data={tab} />
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollableTabView>
        </View>
    );
};

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

    /** @name 弹窗展示提示 */
    const showTips = (tips) => {
        const {content, img, title} = tips;
        Modal.show(
            {
                children: (
                    <View style={{padding: Space.padding}}>
                        {img ? <Image source={{uri: img}} style={{width: '100%', height: px(140)}} /> : null}
                        {content?.map((item, index) => {
                            const {key: _key, val} = item;
                            return (
                                <View key={val + index} style={{marginTop: index === 0 ? 0 : Space.marginVertical}}>
                                    {_key ? <HTML html={`${_key}:`} style={styles.title} /> : null}
                                    {val ? (
                                        <View style={{marginTop: px(4)}}>
                                            <HTML html={val} style={styles.tipsVal} />
                                        </View>
                                    ) : null}
                                </View>
                            );
                        })}
                    </View>
                ),
                title,
            },
            'slide'
        );
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

    const init = () => {
        const apiParams = {...params, ...(route.params || {}), period, type: key};
        if (currentIndex.current) {
            apiParams.index = currentIndex.current;
        }
        getChartData(apiParams)
            .then((res) => {
                if (res.code === '000000') {
                    setChartData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
                setShowEmpty(true);
            });
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, params, period]);

    useEffect(() => {
        label && onHide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label]);

    return (
        <>
            {/* 根据key区分不同图表 */}
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
                                    index === 1 ? {marginLeft: px(40), marginRight: arr.length === 3 ? px(40) : 0} : {},
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
                                    {tips ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => showTips(tips)}
                                            style={{marginLeft: px(4)}}>
                                            <Image source={tip} style={{width: px(12), height: px(12)}} />
                                        </TouchableOpacity>
                                    ) : null}
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
                            key === 'amount_change' ? ['red'] : ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
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

/** @name 计划买卖模式 */
const BuyMode = ({data = {}}) => {
    const jump = useJump();
    const {button, list, name, tags} = data;
    const [current, setCurrent] = useState(0);

    return (
        <View style={styles.partBox}>
            <View style={[Style.flexBetween, styles.modeTitle]}>
                <View style={Style.flexRow}>
                    <Text style={[styles.tipsVal, {fontWeight: Font.weightMedium}]}>{name}</Text>
                    {tags?.map?.((tag, i) => {
                        return (
                            <View key={tag + i} style={styles.labelBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        );
                    })}
                </View>
                {button?.text ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(button.url)} style={Style.flexRow}>
                        <Text style={[styles.desc, {color: Colors.descColor}]}>{button.text}</Text>
                        <AntDesign color={Colors.descColor} name="right" size={px(12)} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <ScrollableTabView
                initialPage={0}
                locked
                onChangeTab={({i}) => setCurrent(i)}
                prerenderingSiblingsNumber={Infinity}
                renderTabBar={() => (
                    <ScrollTabbar
                        activeFontSize={px(13)}
                        boxStyle={styles.chartTabs}
                        btnColor={Colors.defaultColor}
                        inActiveFontSize={px(12)}
                    />
                )}>
                {list?.map?.((item, index) => {
                    const {name: tabLabel} = item;
                    const {indicators, remind_info, signals} = list[current];
                    return (
                        <View key={tabLabel + index} style={{paddingBottom: Space.padding}} tabLabel={tabLabel}>
                            <View style={[Style.flexRow, {marginTop: px(12)}]}>
                                {signals?.length > 0 && (
                                    <View style={[Style.flexBetween, styles.signalWrapper]}>
                                        {signals.map?.((signal, i) => {
                                            const {amount, icon: signalIcon, text, url} = signal;
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    key={text + i}
                                                    onPress={() => jump(url)}
                                                    style={Style.flexCenter}>
                                                    {signalIcon ? (
                                                        <Image
                                                            source={{uri: signalIcon}}
                                                            style={{width: px(30), height: px(30)}}
                                                        />
                                                    ) : null}
                                                    {text ? (
                                                        <View style={{marginTop: px(4)}}>
                                                            <HTML
                                                                html={text}
                                                                style={{
                                                                    ...styles.desc,
                                                                    color: Colors.descColor,
                                                                    fontWeight: Font.weightMedium,
                                                                }}
                                                            />
                                                        </View>
                                                    ) : null}
                                                    {amount ? (
                                                        <View style={{marginTop: px(2)}}>
                                                            <HTML
                                                                html={amount}
                                                                style={{...styles.smallText, color: Colors.descColor}}
                                                            />
                                                        </View>
                                                    ) : null}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                )}
                                {indicators?.length > 0 && (
                                    <View style={[Style.flexRow, styles.indicatorWrapper]}>
                                        {indicators.map?.((indicator, i) => {
                                            const {text, value} = indicator;
                                            return (
                                                <View key={text + i} style={[Style.flexCenter, {marginLeft: px(32)}]}>
                                                    <HTML html={value} style={styles.indicatorVal} />
                                                    <Text style={[styles.smallText, {marginTop: px(4)}]}>{text}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                            {remind_info ? (
                                <View style={{paddingHorizontal: Space.padding}}>
                                    <RenderAlert alert={remind_info} />
                                </View>
                            ) : null}
                        </View>
                    );
                })}
            </ScrollableTabView>
            {list?.[current]?.icon ? <Image source={{uri: list[current].icon}} style={styles.signalModeIcon} /> : null}
        </View>
    );
};

const DsList = ({data = [], showEye}) => {
    const jump = useJump();

    const getColor = useCallback(
        (val) => {
            return showEye === 'true'
                ? parseFloat(val) < 0
                    ? Colors.green
                    : parseFloat(val) === 0
                    ? Colors.defaultColor
                    : Colors.red
                : Colors.defaultColor;
        },
        [showEye]
    );

    return (
        <View style={{marginTop: px(12)}}>
            {data.map?.((item, index) => {
                const {color, funds, name} = item;
                return (
                    <React.Fragment key={name}>
                        <View style={[Style.flexRow, {marginTop: Space.marginVertical}]}>
                            <View style={[styles.circle, {backgroundColor: color || Colors.red}]} />
                            <Text style={styles.desc}>{name}</Text>
                        </View>
                        {funds?.map?.((fund, i) => {
                            const {
                                amount,
                                button,
                                name: fundName,
                                profit,
                                profit_acc,
                                profit_date_raw,
                                share,
                                url,
                            } = fund;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={fundName + i}
                                    onPress={() => jump(url)}
                                    style={styles.dsFundBox}>
                                    <View style={Style.flexBetween}>
                                        <Text style={styles.desc}>{fundName}</Text>
                                        {button?.text ? (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                disabled={button.avail === 0}
                                                onPress={() => jump(button.url)}
                                                style={[styles.redeemBtn, {opacity: button.avail === 0 ? 0.3 : 1}]}>
                                                <Text style={[styles.smallText, {color: Colors.brandColor}]}>
                                                    {button.text}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                        <View style={[Style.flexRow, {width: '50%', marginTop: px(12)}]}>
                                            <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>
                                                日收益(元)
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.numText,
                                                    {
                                                        marginLeft: px(4),
                                                        color: getColor(profit),
                                                    },
                                                ]}>
                                                {showEye === 'true' ? profit : '****'}
                                            </Text>
                                            <Text style={[styles.numText, {marginLeft: px(4)}]}>
                                                ({profit_date_raw})
                                            </Text>
                                        </View>
                                        <View style={[Style.flexRow, {width: '50%', marginTop: px(12)}]}>
                                            <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>
                                                累计收益(元)
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.numText,
                                                    {
                                                        marginLeft: px(4),
                                                        color: getColor(profit_acc),
                                                    },
                                                ]}>
                                                {showEye == 'true' ? profit_acc : '****'}
                                            </Text>
                                        </View>
                                        <View style={[Style.flexRow, {width: '50%', marginTop: px(12)}]}>
                                            <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>
                                                份额(份)
                                            </Text>
                                            <Text style={[styles.numText, {marginLeft: px(4)}]}>
                                                {showEye == 'true' ? share : '****'}
                                            </Text>
                                        </View>
                                        <View style={[Style.flexRow, {width: '50%', marginTop: px(12)}]}>
                                            <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>
                                                金额(元)
                                            </Text>
                                            <Text style={[styles.numText, {marginLeft: px(4)}]}>
                                                {showEye == 'true' ? amount : '****'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const {
        code,
        button_list,
        chart_tabs,
        console_info: consoleData,
        console_sub,
        group_bulletin,
        mode_info,
        name,
        service_info,
        summary,
        tags,
        top_button,
        trade_notice,
    } = data;
    const {desc: serviceDesc, icon: serviceIcon, title: serviceTitle, url: serviceUrl} = service_info || {};
    const [commonData, setCommonData] = useState({});
    const [dsList, setDsList] = useState([]);
    const {ad_info, bottom_notice, gather_list, system_notices, tool_list} = commonData;
    const [showMask, setShowMask] = useState(false);
    const [showEye, setShowEye] = useState('true');
    const centerControl = useRef();
    const passwordModal = useRef();

    const init = () => {
        getPageData(route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    const {need_ds, title = '资产详情'} = res.result;
                    navigation.setOptions({title});
                    if (need_ds) {
                        getDsData(route.params || {}).then((resp) => {
                            if (resp.code === '000000') {
                                setDsList(resp.result?.list || []);
                            }
                        });
                    }
                    setData(res.result);
                }
            })
            .finally(() => {
                setRefreshing(false);
                setLoading(false);
            });
        getCommonData(route.params || {}).then((res) => {
            if (res.code === '000000') {
                setCommonData(res.result);
            }
        });
    };

    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };

    const showSignalModal = ({options, renderData, type}) => {
        Modal.show(
            {
                ...options,
                children: (
                    <View style={{paddingHorizontal: Space.padding}}>
                        {centerControl.current?.renderSignalItems(renderData)}
                    </View>
                ),
            },
            type
        );
    };

    const onDone = (password, params) => {
        setDividend({password, ...params}).then((res) => {
            res.message && Toast.show(res.message);
            if (res.code === '000000') {
                init();
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            Storage.get('portfolioAssets').then((res) => {
                setShowEye(res ? res : 'true');
            });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    return (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <PasswordModal onDone={onDone} ref={passwordModal} />
            <View style={styles.topLine} />
            {Object.keys(data).length > 0 ? (
                <>
                    <ScrollView
                        refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}
                        scrollIndicatorInsets={{right: 1}}
                        style={{flex: 1}}>
                        {system_notices?.length > 0 && <Notice content={system_notices} />}
                        <TopPart
                            setShowEye={setShowEye}
                            showEye={showEye}
                            top_button={top_button}
                            top_info={{code, name, ...(summary || {}), tags}}
                            trade_notice={trade_notice}
                        />
                        {ad_info ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(ad_info.url)}
                                style={{marginTop: px(12), marginHorizontal: Space.marginAlign}}>
                                <Image source={{uri: ad_info.cover}} style={{height: px(60), borderRadius: px(30)}} />
                            </TouchableOpacity>
                        ) : null}
                        {consoleData ? <CenterControl data={consoleData} ref={centerControl} refresh={init} /> : null}
                        <View style={{paddingHorizontal: Space.padding}}>
                            {console_sub ? <ConsoleSub data={console_sub} showModal={showSignalModal} /> : null}
                            {dsList?.length > 0 && <DsList data={dsList} showEye={showEye} />}
                            {group_bulletin ? <GroupBulletIn data={group_bulletin} /> : null}
                            {mode_info ? <BuyMode data={mode_info} refresh={init} /> : null}
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
                            {tool_list?.length > 0 && <ToolMenusCard data={tool_list} style={styles.menuBox} />}
                            {gather_list?.length > 0 && (
                                <View style={styles.bottomList}>
                                    {gather_list.map((item, index) => {
                                        const {label} = item;
                                        return (
                                            <View key={label + index}>
                                                {index === 0 ? null : (
                                                    <View style={[styles.divider, {marginVertical: 0}]} />
                                                )}
                                                <View style={{height: px(60)}}>
                                                    <FormItem
                                                        data={item}
                                                        onChange={(val) => {
                                                            // console.log(val);
                                                            item.label === '分红方式' &&
                                                                passwordModal.current?.show({
                                                                    dividend: val,
                                                                    ...item.params,
                                                                });
                                                        }}
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
                            {button_list.map((btn, i, arr) => {
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
                                } else {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={avail === 0}
                                            onPress={() => jump(url)}
                                            key={text + i}
                                            style={[
                                                Style.flexCenter,
                                                i === 1 ? styles.fixedBtn : {},
                                                i === arr.length - 1 ? styles.buyBtn : {},
                                                i === arr.length - 1
                                                    ? {backgroundColor: avail === 0 ? '#E9EAEF' : Colors.brandColor}
                                                    : {backgroundColor: avail === 0 ? Colors.bgColor : '#E6F0FF'},
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.bottomBtnText,
                                                    i === arr.length - 1
                                                        ? {color: avail === 0 ? '#BDC2CC' : '#fff'}
                                                        : {color: avail === 0 ? '#BDC2CC' : Colors.brandColor},
                                                ]}>
                                                {text}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }
                            })}
                        </View>
                    )}
                    {bottom_notice ? (
                        <GuideTips data={bottom_notice} style={{position: 'absolute', bottom: px(106)}} />
                    ) : null}
                </>
            ) : null}
        </View>
    );
};

export default withPageLoading(Index);

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
        top: px(50),
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
