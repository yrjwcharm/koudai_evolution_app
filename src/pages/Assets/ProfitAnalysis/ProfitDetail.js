/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, View, Platform, DeviceEventEmitter} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../../components/TabBar';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {deviceWidth, isEmpty, px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import {getEarningsUpdateNote, getHeadData} from './services';
import Loading from '../../Portfolio/components/PageLoading';
import {useDispatch} from 'react-redux';
import ScrollTabbar from '../../../components/ScrollTabbar';
const ProfitDetail = ({navigation, route}) => {
    const {fund_code = '', poid = '', page = 0, type = 200} = route.params || {};
    const scrollTab = useRef(null);
    const [loading, setLoading] = useState(false);
    const [locked, setLocked] = useState(false);
    const bottomModal = useRef(null);
    const [tabs, setTabs] = useState([
        {text: '全部', type: 200},
        {text: '公募基金', type: 10},
        {text: '投顾组合', type: 30},
        {text: '理财计划', type: 40},
        {text: '私募基金', type: 20},
    ]);
    const [declarePic, setDeclarePic] = useState('');
    const init = useCallback(() => {
        (async () => {
            const res = await Promise.all([getHeadData({type}), getEarningsUpdateNote({})]);
            if (res[0].code === '000000' && res[1].code === '000000') {
                const {title: navigationTitle = '', tabs = []} = res[0]?.result || {};
                const {title: rightTitle = '', declare_pic = ''} = res[1]?.result || {};
                setDeclarePic(declare_pic);
                setTabs(tabs);
                setLoading(false);
                navigation.setOptions({
                    title: navigationTitle,
                    headerRight: () => (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.topRightBtn, Style.flexCenter]}
                                onPress={() => {
                                    bottomModal.current.show();
                                }}>
                                <Text style={styles.title}>{rightTitle}</Text>
                            </TouchableOpacity>
                        </>
                    ),
                });
            }
        })();
    }, []);
    useEffect(() => {
        init();
    }, [init]);
    const setLoadingFn = useCallback((loading) => {
        setLoadingFn(loading);
    });
    useEffect(() => {
        Platform.OS === 'android' && page !== 0 && scrollTab.current?.goToPage(page);
    }, [tabs]);
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : isEmpty(poid) ? (
                <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
                    {tabs.length > 1 && (
                        <ScrollableTabView
                            ref={scrollTab}
                            renderTabBar={() => <ScrollTabbar boxStyle={{backgroundColor: Colors.white}} />}
                            initialPage={page}
                            locked={false}
                            onChangeTab={({i}) => {
                                global.LogTool('changeTab', tabs[i]);
                            }}>
                            {tabs.map((el, index) => {
                                return (
                                    <ProfitDistribution
                                        poid={poid}
                                        type={el.type}
                                        fund_code={fund_code}
                                        tabLabel={el.text}
                                        key={`${el + index}`}
                                    />
                                );
                            })}
                        </ScrollableTabView>
                    )}
                    <BottomModal title={'更新说明'} ref={bottomModal}>
                        <View style={{marginTop: px(30), alignItems: 'center'}}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.declareImg}
                                source={{
                                    uri: declarePic,
                                }}
                            />
                        </View>
                    </BottomModal>
                </View>
            ) : (
                <ProfitDistribution type={type} poid={poid} fund_code={fund_code} />
            )}
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.red,
    },
    title: {
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    declareImg: {
        height: px(140),
        width: deviceWidth - px(32),
        resizeMode: 'contain',
    },
    rightTitle: {
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        color: Colors.defaultColor,
    },
    topRightBtn: {
        flex: 1,
        marginRight: Space.marginAlign,
    },
});
export default ProfitDetail;
