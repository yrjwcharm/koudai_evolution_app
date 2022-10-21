/*
 * @Date: 2022/10/10 09:48
 * @Author: yanruifeng
 * @Description: 定投管理
 */

import React, {useCallback, useState} from 'react';
import {Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {deviceWidth, px, isEmpty} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import BottomDesc from '../../../components/BottomDesc';
import {FixedButton} from '../../../components/Button';
import InvestHeader from './components/InvestHeader';
import Loading from '../../Portfolio/components/PageLoading';
import RenderItem from './components/RenderItem';
import Empty from '../../../components/EmptyTip';
import {BoxShadow} from 'react-native-shadow';
import {callFixedHeadDataApi, callHistoryDataApi, callTerminatedFixedApi} from './services';
import {useFocusEffect} from '@react-navigation/native';
import {isIPhoneX} from '../../../components/IM/app/chat/utils';
import {useJump} from '../../../components/hooks';
const image = require('../../../assets/img/emptyTip/empty.png');
const {width} = Dimensions.get('window');
const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.102,
    x: 0,
    y: 1,
    style: {
        position: 'relative',
        left: px(16),
    },
};
const FixedInvestManage = ({navigation, route}) => {
    const jump = useJump();
    const [showEmpty, setShowEmpty] = useState(false);
    const [emptyMsg, setEmptyMsg] = useState('');
    const [terminateUrl, setTerminateUrl] = useState({});
    const [data, setData] = useState({});
    const [headList, setHeadList] = useState([]);
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const {fund_code = '', poid = '', type = 200} = route?.params || {};
    const [unitType, setUnitType] = useState(type);
    const [tabList, setTabList] = useState([]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const res = await Promise.all([
                    callFixedHeadDataApi({type, fund_code, poid}),
                    callHistoryDataApi({type: unitType, fund_code, poid}),
                ]);
                if (res[0].code === '000000' && res[1].code === '000000') {
                    const {title = '', detail = {}, head_list = [], tabs = []} = res[0].result || {};
                    const {terminate_url} = res[1].result;
                    navigation.setOptions({title});
                    let tabList = tabs.map((el, index) => {
                        return {...el, checked: el.type == unitType ? true : false};
                    });
                    setTabList(tabList);
                    setDetail(detail);
                    setHeadList(head_list);
                    setData(res[1].result);
                    setTerminateUrl(terminate_url);
                    setLoading(false);
                }
            })();
        }, [unitType])
    );
    const selTab = (item) => {
        setUnitType(item.type);
        tabList.map((_item) => {
            _item.checked = false;
            if (JSON.stringify(_item) == JSON.stringify(item)) {
                _item.checked = true;
            }
        });
        setTabList([...tabList]);
    };
    const renderEmpty = useCallback(() => {
        return showEmpty ? <Empty text={emptyMsg || '暂无数据'} /> : null;
    }, [emptyMsg, showEmpty]);
    const EmptyData = () => {
        return (
            <View style={{marginTop: px(12)}}>
                <BoxShadow
                    setting={{
                        ...shadow,
                        width: deviceWidth - px(32),
                        height: px(211),
                    }}>
                    <View style={styles.emptyView}>
                        <Image source={image} style={styles.emptyImg} />
                        <Text style={styles.emptyText}>暂无数据</Text>
                    </View>
                </BoxShadow>
            </View>
        );
    };
    const executeSort = useCallback((data) => {
        if (data.sort_key) {
            callHistoryDataApi({
                type: unitType,
                sort_key: data?.sort_key,
                sort: data?.sort_type == 'asc' ? '' : data?.sort_type == 'desc' ? 'asc' : 'desc',
            }).then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            });
        }
    }, []);
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={styles.container}>
                    {headList.length > 0 && (
                        <View style={styles.header}>
                            <ImageBackground
                                style={{width, height: px(120)}}
                                source={require('./assets/lineargradient.png')}>
                                {Object.keys(detail).length > 0 ? (
                                    <View style={styles.automaticInvestDaysView}>
                                        <Text style={styles.prevText}>{detail?.left}</Text>
                                        {detail?.days
                                            ?.toString()
                                            .split('')
                                            .map((el, index) => {
                                                return (
                                                    <View style={styles.dayView} key={el + '' + index}>
                                                        <Text style={styles.dayText}>{el}</Text>
                                                    </View>
                                                );
                                            })}
                                        <Text style={[styles.nextText, {marginRight: px(9)}]}>{detail?.right}</Text>
                                        {!isEmpty(detail?.tip) && (
                                            <ImageBackground
                                                style={{width: px(51), height: px(17)}}
                                                source={require('./assets/label.png')}>
                                                <View style={styles.labelView}>
                                                    <Text style={styles.label}>{detail?.tip}</Text>
                                                </View>
                                            </ImageBackground>
                                        )}
                                    </View>
                                ) : (
                                    <View style={styles.emptyInvest}>
                                        <Text style={styles.emptyInvestText}>暂未定投，现在开始定投，一点点变富</Text>
                                    </View>
                                )}
                            </ImageBackground>
                            <View style={styles.autoInvestWrap}>
                                <ImageBackground source={require('./assets/rect.png')} style={styles.autoInvest}>
                                    <View style={styles.investWrap}>
                                        <View style={styles.investView}>
                                            <View style={styles.itemWrap}>
                                                <Text style={styles.investValue}>{headList[0]?.value}</Text>
                                                <Text style={styles.investLabel}>{headList[0]?.text}</Text>
                                            </View>
                                            <View style={styles.itemWrap}>
                                                <Text style={styles.investValue}>{headList[1]?.value}</Text>
                                                <Text style={styles.investLabel}>{headList[1]?.text}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                    )}
                    {tabList.length > 0 && (
                        <View style={styles.scrollTab}>
                            {tabList.map((el, index) => {
                                return (
                                    <TouchableOpacity key={el + ' ' + index} onPress={() => selTab(el)}>
                                        <View
                                            style={[
                                                styles.defaultTab,
                                                {backgroundColor: el.checked ? '#DEE8FF' : '#FFFFFF'},
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.defaultTabText,
                                                    {
                                                        fontFamily: el.checked
                                                            ? Font.pingFangMedium
                                                            : Font.pingFangRegular,
                                                        color: el.checked ? Colors.brandColor : Colors.defaultColor,
                                                    },
                                                ]}>
                                                {el?.text}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                    <InvestHeader
                        style={{marginTop: px(12)}}
                        headList={data?.head_list ?? []}
                        handleSort={executeSort}
                    />
                    <FlatList
                        windowSize={300}
                        data={data?.data_list || []}
                        initialNumToRender={20}
                        keyExtractor={(item, index) => item + index}
                        ListEmptyComponent={<EmptyData />}
                        onEndReachedThreshold={0.5}
                        refreshing={false}
                        renderItem={({item, index}) => <RenderItem navigation={navigation} item={item} index={index} />}
                    />
                    {Object.keys(terminateUrl).length > 0 && (
                        <TouchableOpacity style={{marginTop: px(20)}} onPress={() => jump(terminateUrl.url)}>
                            <View style={{alignItems: 'center'}}>
                                <View style={Style.flexRow}>
                                    <Text style={styles.termintal}>{terminateUrl.text}</Text>
                                    <Image source={require('./assets/more.png')} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    <BottomDesc style={{marginBottom: isIPhoneX() ? px(104) : px(78)}} />

                    {Object.keys(data).length > 0 && (
                        <FixedButton title={data?.button?.text} onPress={() => jump(data?.button?.url)} />
                    )}
                </View>
            )}
        </>
    );
};
export default FixedInvestManage;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    emptyView: {
        backgroundColor: Colors.white,
        ...Style.flexCenter,
        height: px(211),
        borderRadius: px(6),
    },
    emptyImg: {
        height: px(96),
        width: px(120),
    },
    emptyText: {
        marginTop: px(15),
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    emptyInvest: {
        marginLeft: px(16),
        marginTop: px(20),
    },
    emptyInvestText: {
        fontSize: px(16),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.white,
    },
    termintal: {
        fontSize: px(12),
        marginRight: px(5),
        fontFamily: Font.pingFangRegular,
        color: '#545968',
    },
    defaultTab: {
        marginRight: px(5),
        paddingHorizontal: px(12),
        paddingVertical: px(6),
        borderRadius: px(20),
    },
    defaultTabText: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    activeTabText: {},
    scrollTab: {
        flexDirection: 'row',
        marginLeft: px(16),
        marginTop: px(28),
    },
    itemWrap: {
        alignItems: 'center',
    },
    investWrap: {
        height: px(70),
        paddingHorizontal: px(61),
        justifyContent: 'center',
    },
    investView: {
        ...Style.flexBetween,
    },
    investLabel: {
        marginTop: px(4),
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    investValue: {
        fontSize: px(16),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.defaultColor,
    },
    autoInvestWrap: {
        flexDirection: 'row',
        position: 'absolute',
        top: px(62),
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    bottomWrap: {
        ...Style.flexBetween,
    },
    autoInvest: {
        width: deviceWidth - px(32),
        height: px(70),
    },
    header: {},
    automaticInvestDaysView: {
        marginLeft: px(16),
        marginTop: px(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: px(10),
        fontFamily: 'PingFang SC-中粗体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.white,
    },
    prevText: {
        fontSize: px(16),
        marginRight: px(1),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.white,
    },
    nextText: {
        marginLeft: px(4),
        fontSize: px(16),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.white,
        marginRight: px(9),
    },
    dayView: {
        width: px(15),
        marginLeft: px(3),
        alignItems: 'center',
        justifyContent: 'center',
        height: px(22),
        backgroundColor: '#F1F6FF',
        borderRadius: px(2),
    },
    dayText: {
        fontSize: px(16),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: '#3978F6',
    },
    labelView: {
        position: 'relative',
        left: px(6),
    },
});
