/*
 * @Date: 2022-09-22 22:33:12
 * @Description:持仓品类列表
 */
import {StyleSheet, Text, Animated, View, TouchableOpacity, Image, RefreshControl} from 'react-native';
import React, {useState, useRef, useCallback} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import Eye from '../../../components/Eye';
import Icon from 'react-native-vector-icons/Entypo';
import {getData as _getData, getHold} from './service';
import {useJump} from '~/components/hooks';
import RenderAlert from '../components/RenderAlert';
import BottomDesc from '~/components/BottomDesc';
import sortImg from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import TradeNotice from '../components/TradeNotice';
import TagInfo from '../components/TagInfo';
import YellowNotice from '~/components/YellowNotice';
import GuideTips from '~/components/GuideTips';
import ToolMenusCard from '../components/ToolMenusCard';
import PointCard from '../components/PointCard';
import AdInfo from '../components/AdInfo';
import StickyHeader from '~/components/Sticky';
import LoadingTips from '~/components/LoadingTips';
import RenderHtml from '~/components/RenderHtml';
import EmptyTip from '~/components/EmptyTip';
import {FixedButton} from '~/components/Button';
import {useFocusEffect} from '@react-navigation/native';
import AssetCard from '../components/AssetCard';
// type = 公墓 10;私募 20;投顾组合 30;计划 40;
const PortfolioAssetList = ({route, navigation}) => {
    const jump = useJump();
    const [showEye, setShowEye] = useState('true');
    const [data, setData] = useState({});
    const [hold, setHold] = useState({});
    const {type = 30} = route.params || {};
    const [headHeight, setHeaderHeight] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [refreshing, setRefreshing] = useState(false);
    const init = (refresh) => {
        refresh && setRefreshing(true);
        getData();
        getHoldData({type});
        setRefreshing(false);
    };
    const getData = async () => {
        let res = await _getData({type});

        setData(res.result);
    };
    const getHoldData = async (params) => {
        let res = await getHold(params);
        navigation.setOptions({title: res.result?.title});
        setHold(res.result);
    };
    const handleSort = (_data) => {
        global.LogTool('order', _data.sort_key);
        if (_data.sort_key) {
            getHoldData({
                type,
                sort_key: _data?.sort_key,
                sort_type: _data?.sort_type == 'asc' ? '' : _data?.sort_type == 'desc' ? 'asc' : 'desc',
            });
        }
    };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );
    const handleSortText = (isSort, text, activeText) => {
        if (activeText && isSort) {
            return text.split('|')?.map((item, index, arr) =>
                item == activeText ? (
                    <Text style={{color: Colors.defaultColor}}>
                        {index == 1 ? '|' : ''} {activeText} {index == 0 && arr.length > 1 ? '|' : ''}
                    </Text>
                ) : (
                    item
                )
            );
        }
        return text;
    };
    const {summary = {}} = hold;
    return Object.keys(data)?.length > 0 ? (
        <>
            <Animated.ScrollView
                scrollIndicatorInsets={{right: 1}}
                style={{backgroundColor: Colors.bgColor}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init(true)} />}
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                            },
                        ],
                        {useNativeDriver: true}
                    ) // 使用原生动画驱动
                }>
                <View
                    onLayout={(e) => {
                        let {height} = e.nativeEvent.layout;
                        setHeaderHeight(height); // 给头部高度赋值
                    }}>
                    {/* 系统通知 */}
                    {data?.system_notices?.length > 0 && <YellowNotice data={data?.system_notices} />}
                    {/* header */}
                    <TouchableOpacity
                        style={styles.headerCard}
                        activeOpacity={0.8}
                        onPress={() => {
                            global.LogTool('assets_card');
                            jump(summary?.url);
                        }}>
                        <View style={[styles.summaryTitle, Style.flexBetween]}>
                            <View style={Style.flexRow}>
                                <Text style={styles.summaryKey}>总资产(元)</Text>
                                <Text style={styles.date}>{summary?.asset_info?.date}</Text>
                                <View style={{position: 'absolute', top: -px(11), right: -px(30)}}>
                                    <Eye
                                        color={Colors.lightGrayColor}
                                        storageKey={'PortfolioAssetListEye'}
                                        onChange={(_data) => {
                                            setShowEye(_data);
                                        }}
                                    />
                                </View>
                            </View>
                            <Icon name="chevron-thin-right" color={Colors.lightBlackColor} />
                        </View>
                        {showEye === 'true' ? (
                            <Text style={styles.amount}>{summary?.asset_info?.value}</Text>
                        ) : (
                            <Text style={styles.amount}>****</Text>
                        )}
                        {/* 收益 */}
                        <View style={[Style.flexRow]}>
                            <View style={[{flex: 1}]}>
                                <Text style={styles.profitKey}>{summary?.profit_info?.text}</Text>
                                <Text
                                    style={[
                                        styles.profitVal,
                                        {
                                            color:
                                                showEye === 'true'
                                                    ? summary?.profit_info?.color || Colors.defaultColor
                                                    : Colors.defaultColor,
                                        },
                                    ]}>
                                    {showEye === 'true' ? summary?.profit_info?.value : '****'}
                                </Text>
                            </View>
                            <View style={[{flex: 1}]}>
                                <Text style={styles.profitKey}>{summary?.profit_acc_info?.text}</Text>
                                <Text
                                    style={[
                                        styles.profitVal,
                                        {
                                            color:
                                                showEye === 'true'
                                                    ? summary?.profit_acc_info?.color || Colors.defaultColor
                                                    : Colors.defaultColor,
                                        },
                                    ]}>
                                    {showEye === 'true' ? summary?.profit_acc_info?.value : '****'}
                                </Text>
                            </View>
                            <View style={[{flex: 1}]}>
                                <Text style={styles.profitKey}>{summary?.profit_acc?.text}</Text>
                                <Text
                                    style={[
                                        styles.profitVal,
                                        {
                                            color:
                                                showEye === 'true'
                                                    ? summary?.profit_acc?.color || Colors.defaultColor
                                                    : Colors.defaultColor,
                                        },
                                    ]}>
                                    {showEye === 'true' ? summary?.profit_acc?.value : '****'}
                                </Text>
                            </View>
                        </View>
                        {hold?.trade_notice && (
                            <TradeNotice
                                data={hold?.trade_notice}
                                style={{backgroundColor: '#F5F6F8'}}
                                textStyle={{color: Colors.lightBlackColor}}
                                iconColor={Colors.lightBlackColor}
                            />
                        )}
                    </TouchableOpacity>
                    {/* 运营位 */}
                    {data?.ad_info && <AdInfo ad_info={data?.ad_info} />}
                    {/* 工具菜单 */}
                    {data?.tool_list && <ToolMenusCard data={data?.tool_list} />}
                    {/* 投顾观点 */}
                    {data?.point_info ? <PointCard data={data?.point_info} /> : null}
                    {/* 持仓列表 */}
                    <View style={[Style.flexRow, {marginVertical: px(8)}]}>
                        <View style={styles.title_tag} />
                        <Text style={styles.bold_text}>
                            {'持仓'}({hold?.holding_info?.number})
                        </Text>
                    </View>
                </View>
                <StickyHeader
                    stickyHeaderY={headHeight} // 把头部高度传入
                    stickyScrollY={scrollY}>
                    <View style={[styles.portCard, Style.flexRow]}>
                        {hold?.holding_info?.header_list?.map((head, index) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={index}
                                onPress={() => handleSort(head)}
                                style={{
                                    flex: index == 0 ? 1.4 : 1,
                                    ...Style.flexRow,
                                    justifyContent: index == 0 ? 'flex-start' : 'flex-end',
                                }}>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(11)}}>
                                    {handleSortText(head.sort_type, head.text, head.sort_name)}
                                </Text>
                                {head?.sort_key && (
                                    <Image
                                        source={
                                            head?.sort_type == ''
                                                ? sortImg
                                                : head?.sort_type == 'asc'
                                                ? sortUp
                                                : sortDown
                                        }
                                        style={styles.sortImg}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </StickyHeader>
                {hold?.holding_info?.product ? (
                    hold?.holding_info?.product?.map((product, index) => {
                        return <AssetCard data={product} showEye={showEye} key={product?.log_id + index} />;
                    })
                ) : (
                    <View style={[Style.flexCenter, styles.portCard, {height: px(220)}]}>
                        <EmptyTip paddingTop={0} style={{paddingTop: px(20)}} type="part" />
                    </View>
                )}
                <BottomDesc />
            </Animated.ScrollView>
            {!!data?.bottom_button && (
                <FixedButton
                    title={data?.bottom_button?.text}
                    onPress={() => {
                        global.LogTool('go_financing_market');
                        jump(data?.bottom_button?.url);
                    }}
                />
            )}
            {data?.bottom_notice && (
                <GuideTips data={data?.bottom_notice} style={{position: 'absolute', bottom: px(17)}} />
            )}
        </>
    ) : (
        <LoadingTips />
    );
};

export default PortfolioAssetList;

const styles = StyleSheet.create({
    headerCard: {
        backgroundColor: '#fff',
        padding: px(16),
        borderRadius: px(6),
        marginHorizontal: px(16),
        marginVertical: px(12),
    },
    summaryTitle: {
        flexDirection: 'row',
        marginBottom: px(4),
    },
    summaryKey: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightBlackColor,
    },
    date: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
        marginHorizontal: px(10),
    },
    amount: {
        fontSize: px(26),
        lineHeight: px(36),
        fontFamily: Font.numFontFamily,
        marginBottom: px(12),
    },
    profitKey: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightBlackColor,
        marginRight: px(2),
    },
    profitVal: {
        fontSize: px(14),
        lineHeight: px(20),
        fontFamily: Font.numFontFamily,
    },
    bold_text: {fontSize: px(14), lineHeight: px(20), fontWeight: '700'},
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },
    portCard: {
        backgroundColor: '#fff',
        padding: px(12),
        borderRadius: px(6),
        marginHorizontal: px(16),
        marginBottom: px(8),
    },
    portCardUpdateHint: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#F1F6FF',
        paddingVertical: px(2),
        paddingHorizontal: px(3),
        borderRadius: px(4),
    },
    portCardUpdateHintText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#0051CC',
    },
    card_amount: {
        fontSize: px(12),
        fontFamily: Font.numFontFamily,
        lineHeight: px(16.8),
    },
    amountLightText: {fontSize: px(11), color: Colors.lightBlackColor, marginTop: px(5), fontFamily: Font.numRegular},
    sortImg: {
        width: px(6),
        height: px(10),
        marginLeft: px(1),
        marginBottom: px(-2),
    },
    name: {fontWeight: '700', fontSize: px(12)},
    holdingDays: {
        fontSize: px(11),
        color: Colors.lightBlackColor,
        lineHeight: px(15.4),
        marginBottom: px(4),
    },
    toolTag: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: px(2),
        paddingHorizontal: px(5),
        paddingVertical: 1,
        marginLeft: px(6),
    },
});
