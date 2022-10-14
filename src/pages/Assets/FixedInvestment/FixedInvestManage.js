/*
 * @Date: 2022/10/10 09:48
 * @Author: yanruifeng
 * @Description: 定投管理
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {deviceWidth, px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import BottomDesc from '../../../components/BottomDesc';
import {FixedButton} from '../../../components/Button';
import InvestHeader from './components/InvestHeader';
import RenderItem from './components/RenderItem';
import {callFixedHeadDataApi, callHistoryDataApi, callTerminatedFixedApi} from './services';
import Loading from '../../Portfolio/components/PageLoading';
const {width} = Dimensions.get('window');
const FixedInvestManage = ({navigation, route}) => {
    const [terminatedCount, setTerminatedCount] = useState(0);
    const [data, setData] = useState({});
    const [detail, setDetail] = useState({});
    const [headList, setHeadList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEmpty, setShowEmpty] = useState(false);
    const {fund_code = '', poid = ''} = route?.params || {};
    const [unitType, setUnitType] = useState(200);
    const [tabList, setTabList] = useState([]);
    useEffect(() => {
        const initData = async (unitType) => {
            const res = await Promise.all([
                callFixedHeadDataApi({}),
                callHistoryDataApi({type: unitType, poid, code: fund_code}),
                callTerminatedFixedApi({}),
            ]);
            if (res[0].code == '000000') {
                const {title = '定投管理', detail = {}, head_list = [], tabs = []} = res[0].result || {};
                navigation.setOptions({title: '定投管理'});
                let tabList = tabs.map((el, index) => {
                    return {...el, checked: el.type == unitType ? true : false};
                });
                setTabList(tabList);
                setHeadList(head_list);
                setDetail(detail);
            }
            res[1].code == '000000' && setData(res[1].result);
            res[2].code == '000000' && setTerminatedCount(res[1].result?.data_list?.length);
            setLoading(false);
        };
        initData(unitType);
    }, [unitType]);

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
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={styles.container}>
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
                                    <ImageBackground
                                        style={{width: px(51), height: px(17)}}
                                        source={require('./assets/label.png')}>
                                        <View style={styles.labelView}>
                                            <Text style={styles.label}>{detail?.tip}</Text>
                                        </View>
                                    </ImageBackground>
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
                                                    fontFamily: el.checked ? Font.pingFangMedium : Font.pingFangMedium,
                                                    color: el.checked ? Colors.brandColor : Colors.defaultColor,
                                                },
                                            ]}>
                                            {el.text}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <InvestHeader />
                    <>
                        <RenderItem navigation={navigation} dataList={data.data_list ?? []} />
                    </>
                    {terminatedCount !== 0 && (
                        <TouchableOpacity onPress={() => navigation.navigate('TerminatedInvest')}>
                            <View style={{marginTop: px(12), ...Style.flexCenter}}>
                                <View style={Style.flexRow}>
                                    <Text style={styles.termintal}>查看已终止的定投({terminatedCount})</Text>
                                    <Image source={require('./assets/more.png')} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    <BottomDesc />
                    {Object.keys(data).length > 0 ? <FixedButton title="新建定投" onPress={() => {}} /> : null}
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
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    activeTabText: {},
    scrollTab: {
        flexDirection: 'row',
        marginLeft: px(16),
        marginTop: px(28),
        marginBottom: px(12),
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
