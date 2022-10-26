/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../../components/TabBar';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {deviceWidth, isEmpty, px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import {getEarningsUpdateNote, getHeadData} from './services';
import Loading from '../../Portfolio/components/PageLoading';
import {useDispatch} from 'react-redux';
const ProfitDetail = ({navigation, route}) => {
    const {poid = '', fund_code = '', page = 0, type: initType = 200} = route.params || {};
    const scrollTab = useRef(null);
    const [loading, setLoading] = useState(true);
    const bottomModal = useRef(null);
    const tabsRef = useRef([
        // {text: '全部', type: 200},
        // {text: '公募基金', type: 10},
        // {text: '投顾组合', type: 30},
        // {text: '理财计划', type: 40},
        // {text: '私募基金', type: 20},
    ]);
    const [declarePic, setDeclarePic] = useState('');
    const [type, setType] = useState(initType);
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();
    const init = useCallback(() => {
        (async () => {
            const res = await Promise.all([getHeadData({type}), getEarningsUpdateNote({})]);
            if (res[0].code === '000000' && res[1].code === '000000') {
                const {title = '', tabs = [], header = {}} = res[0].result || {};
                navigation.setOptions({title});
                tabsRef.current = tabs;
                const {title: rightTitle = '', declare_pic = ''} = res[1].result || {};
                navigation.setOptions({
                    headerRight: () => (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.topRightBtn, Style.flexCenter]}
                                onPress={() => {
                                    bottomModal.current.show();
                                }}>
                                <Text style={styles.title}>{title}</Text>
                            </TouchableOpacity>
                        </>
                    ),
                });
                setDeclarePic(declare_pic);
                setTitle(title);
                setLoading(false);
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
    }, [page]);
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : isEmpty(poid) ? (
                <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
                    {tabsRef.current.length > 1 && (
                        <ScrollableTabView
                            ref={scrollTab}
                            renderTabBar={() => (
                                <Tab btnColor={Colors.defaultColor} inActiveColor={Colors.lightBlackColor} />
                            )}
                            initialPage={page}
                            // prerenderingSiblingsNumber={0}
                            locked={false}
                            onChangeTab={({i}) => {
                                dispatch({type: 'updateType', payload: tabsRef.current[i].type});
                            }}>
                            {tabsRef.current.map((el, index) => {
                                return <ProfitDistribution tabLabel={el.text} key={`${el + '' + index}`} />;
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
                <ProfitDistribution poid={poid} fund_code={fund_code} />
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
