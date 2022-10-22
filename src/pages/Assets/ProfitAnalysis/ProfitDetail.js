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
import {deviceWidth, px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import {getEarningsUpdateNote, getHeadData} from './services';
import Loading from '../../Portfolio/components/PageLoading';
import {useDispatch} from 'react-redux';
const ProfitDetail = ({navigation, route}) => {
    const {fund_code = '', poid = '', page = 0, type: initType = 200} = route.params || {};
    const scrollTab = useRef(null);
    const [loading, setLoading] = useState(true);
    const [locked, setLocked] = useState(false);
    const bottomModal = useRef(null);
    const tabsRef = useRef([]);
    const [declarePic, setDeclarePic] = useState('');
    const [headData, setHeadData] = useState({});
    const [type, setType] = useState(initType);
    const dispatch = useDispatch();
    const init = useCallback(() => {
        (async () => {
            const res = await Promise.all([getHeadData({type}), getEarningsUpdateNote({})]);
            if (res[0].code === '000000' && res[1].code === '000000') {
                const {title: navigationTitle = '', tabs = [], header = {}} = res[0]?.result || {};
                const {title: rightTitle = '', declare_pic = ''} = res[1]?.result || {};
                tabsRef.current = tabs;
                setHeadData(header);
                setDeclarePic(declare_pic);
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
    }, [type]);
    useEffect(() => {
        init();
        let listener = DeviceEventEmitter.addListener('sendChangeTrigger', (bool) => setLocked(bool));
        return () => listener && listener.remove();
    }, [init]);
    const setLoadingFn = useCallback((loading) => {
        setLoadingFn(loading);
    });
    useEffect(() => {
        Platform.OS === 'android' && page !== 0 && scrollTab.current?.goToPage(page);
    }, [page]);
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
                    {tabsRef.current.length > 1 && (
                        <ScrollableTabView
                            ref={scrollTab}
                            renderTabBar={() => (
                                <Tab btnColor={Colors.defaultColor} inActiveColor={Colors.lightBlackColor} />
                            )}
                            // prerenderingSiblingsNumber={Infinity}
                            initialPage={page}
                            locked={locked}
                            onChangeTab={({i}) => {
                                setType(tabsRef.current[i].type);
                                dispatch({type: 'updateType', payload: tabsRef.current[i].type});
                            }}>
                            {tabsRef.current.map((el, index) => {
                                return (
                                    <ProfitDistribution
                                        type={type}
                                        headData={headData}
                                        tabLabel={el.text}
                                        key={`${el + '' + index}`}
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
