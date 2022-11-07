/*
 * @Description: 产品首页
 * @Autor: wxp
 * @Date: 2022-09-13 11:45:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 15:54:16
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Space} from '~/common/commonStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';
import BottomDesc from '~/components/BottomDesc';
import http from '~/services';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import withNetState from '~/components/withNetState';
import {AlbumCard, ProductList} from '~/components/Product';
import LoadingTips from '~/components/LoadingTips';
import LogView from '~/components/LogView';
import LinearHeader from './LinearHeader';
import OptionalPage from './OptionalPage';
import Menu from './Menu';
import Banner from './Banner';
import Security from './Security';
import LiveList from './LiveList';
import {useSelector} from 'react-redux';

const Product = ({navigation}) => {
    const jump = useJump();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    const userInfo = useSelector((store) => store.userInfo)?.toJS();

    const [refreshing, setRefreshing] = useState(false);
    const [tabActive, setTabActive] = useState(1);
    const [proData, setProData] = useState(null);
    const [subjectLoading, setSubjectLoading] = useState(false);
    const [subjectData, setSubjectsData] = useState({});
    const [subjectList, setSubjectList] = useState([]);
    const [followTabs, setFollowTabs] = useState();
    const [followData, setFollowData] = useState();

    const tabRef = useRef(null);
    const optionalTabRef = useRef(null);
    const scrollViewRef = useRef();
    const pageRef = useRef(1);
    const subjectToBottomHeight = useRef(0);
    const subjectLoadingRef = useRef(false);
    const prevUserInfo = useRef(null);

    const bgType = useMemo(() => {
        return tabActive === 1 && proData?.popular_banner_list ? false : true;
    }, [tabActive, proData]);

    // 自选tab focus时重新刷新
    useFocusEffect(
        useCallback(() => {
            let cPage = tabRef.current?.state?.currentPage;
            setTabActive(cPage);
            cPage === 0 && tabRef.current.goToPage(cPage);
        }, [])
    );

    // 产品tab 登录状态更换时更新
    useFocusEffect(
        useCallback(() => {
            if (prevUserInfo.current?.is_login !== userInfo?.is_login) {
                getProData();
                prevUserInfo.current = userInfo;
            }
        }, [userInfo.is_login])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if (isFocused) {
                scrollViewRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                setTimeout(() => {
                    [getFollowTabs, getProData][tabRef.current?.state?.currentPage]?.(0);
                }, 0);
                global.LogTool('tabDoubleClick', 'ProductIndex');
            }
        });
        return () => unsubscribe();
    }, [isFocused, navigation]);

    const onChangeTab = useCallback((cur) => {
        setTabActive(cur.i);
        [getFollowTabs, getProData][cur.i]();
    }, []);

    const getProData = (type) => {
        if (type === 0) {
            setRefreshing(true);
        }
        http.get('/products/index/20220901')
            .then((res) => {
                if (res.code === '000000') {
                    res?.result?.app_tag_url && jump(res?.result?.app_tag_url);
                    setProData(res.result);
                    if (res.result?.popular_subject) {
                        global.LogTool({
                            event: 'rec_show',
                            oid: res.result?.popular_subject?.items?.[0]?.product_id,
                            plateid: res.result?.popular_subject.plateid,
                            rec_json: res.result?.popular_subject.rec_json,
                        });
                    }
                    // 获取专题
                    pageRef.current = 1;
                    getSubjects(res.result?.page_type);
                }
            })
            .finally((_) => {
                setRefreshing(false);
            });
    };

    const getSubjects = (page_type) => {
        if (subjectLoadingRef.current) return;
        setSubjectLoading(true);
        subjectLoadingRef.current = true;
        http.get('/products/subject/list/20220901', {page_type, page: pageRef.current++})
            .then((res) => {
                if (res.code === '000000') {
                    setSubjectsData(res.result);
                    // 分页
                    const newList = res.result.items || [];
                    setSubjectList((val) => (pageRef.current === 2 ? newList : val.concat(newList)));

                    global.LogTool({
                        event: 'rec_show',
                        plateid: res.result.plateid,
                        rec_json: res.result.rec_json,
                    });
                }
            })
            .finally((_) => {
                setSubjectLoading(false);
                subjectLoadingRef.current = false;
            });
    };

    const getFollowTabs = (type) => {
        if (type === 0) {
            setRefreshing(true);
        }
        http.get('/follow/index/202206')
            .then((res) => {
                if (res.code === '000000') {
                    setFollowTabs(res.result);
                    getFollowData({
                        item_type: res.result?.follow?.tabs?.[optionalTabRef.current?.state?.currentPage]?.item_type,
                    });
                }
            })
            .finally((_) => {
                setRefreshing(false);
            });
    };

    const getFollowData = async (params) => {
        let res = await http.get('/follow/list/202206', params);

        const obj = res.result.body?.tr?.[0]?.[0];
        if (obj) {
            obj.LogTool = () => {
                global.LogTool({
                    event: 'optionalDetail',
                    oid: obj?.url?.params?.params?.plan_id || obj?.url?.params?.code,
                    ctrl: followTabs?.follow?.tabs[optionalTabRef.current?.state?.currentPage]?.type_text,
                });
            };
        }
        setFollowData(res.result);
    };

    const proScroll = useCallback(
        (e, cHeight, cScrollHeight) => {
            // 分页
            let resetHeight = cScrollHeight - cHeight;
            let y = e.nativeEvent.contentOffset.y;

            if (
                !subjectLoading &&
                subjectList?.[0] &&
                subjectData?.has_more &&
                resetHeight - y <= subjectToBottomHeight.current + 20
            ) {
                getSubjects(proData.page_type);
            }
        },
        [subjectLoading, subjectList, subjectData, proData]
    );

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: bgType ? proData?.bg_colors?.[1] : proData?.popular_banner_list?.bg_colors?.[1]},
            ]}>
            {/* 渐变头 */}
            {proData ? <LinearHeader bgType={bgType} proData={proData} tabActive={tabActive} tabRef={tabRef} /> : null}
            {/* tab 内容 */}
            <ScrollableTabView
                ref={tabRef}
                style={{flex: 1, marginTop: insets.top - px(128)}}
                initialPage={1}
                renderTabBar={false}
                locked={true}
                onChangeTab={onChangeTab}>
                {/* 自选 */}
                <OptionalPage
                    scrollViewRef={scrollViewRef}
                    optionalTabRef={optionalTabRef}
                    refreshing={refreshing}
                    getFollowTabs={getFollowTabs}
                    followTabs={followTabs}
                    getFollowData={getFollowData}
                    followData={followData}
                />
                {/* 产品 */}
                <LogView.Wrapper
                    ref={scrollViewRef}
                    style={{flex: 1}}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            {...(bgType ? {} : {tintColor: '#fff'})}
                            refreshing={refreshing}
                            onRefresh={() => getProData(0)}
                        />
                    }
                    onScroll={proScroll}>
                    {Object.keys(proData || {}).length ? (
                        <>
                            {/* 菜单 */}
                            <Menu proData={proData} bgType={bgType} />
                            {/* banner */}
                            <Banner proData={proData} bgType={bgType} key={proData.banner_list} />
                            <View style={styles.othersWrap}>
                                {/* 安全保障 */}
                                {proData?.menu_list ? <Security menu_list={proData?.menu_list} /> : null}
                                {/* 推荐位 */}
                                {proData?.popular_subject ? (
                                    <LinearGradient
                                        colors={['#FFFFFF', '#F4F5F7']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}
                                        style={{marginTop: px(12), borderRadius: px(6)}}>
                                        <View
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: Space.borderRadius,
                                                overflow: 'hidden',
                                            }}>
                                            <ProductList
                                                data={proData?.popular_subject?.items}
                                                type={proData?.popular_subject.type}
                                                logParams={{
                                                    event: 'rec_click',
                                                    plateid: proData?.popular_subject.plateid,
                                                    rec_json: proData?.popular_subject.rec_json,
                                                }}
                                                slideLogParams={{
                                                    event: 'rec_slide',
                                                    plateid: proData?.popular_subject.plateid,
                                                    rec_json: proData?.popular_subject.rec_json,
                                                }}
                                            />
                                        </View>
                                    </LinearGradient>
                                ) : null}
                                {/* 直播列表 */}
                                {proData?.live_list && <LiveList proData={proData} />}
                                {/* 专题们 */}
                                {subjectList?.[0] ? (
                                    <>
                                        <View style={{backgroundColor: Colors.bgColor}}>
                                            {subjectList?.map?.((subject, index, ar) => (
                                                <View key={index} style={{marginTop: px(12)}}>
                                                    <AlbumCard {...subject} />
                                                </View>
                                            ))}
                                        </View>
                                        {subjectLoading ? (
                                            <View style={{paddingVertical: px(20)}}>
                                                <ActivityIndicator />
                                            </View>
                                        ) : null}
                                    </>
                                ) : (
                                    <View style={{paddingVertical: px(20)}}>
                                        <ActivityIndicator />
                                    </View>
                                )}
                            </View>
                            {/* subjectList以下的内容请写到这里，因为在计算其距底部的距离 */}
                            <View
                                style={{backgroundColor: '#f5f6f8'}}
                                onLayout={(e) => {
                                    subjectToBottomHeight.current = e.nativeEvent.layout.height;
                                }}>
                                <BottomDesc />
                            </View>
                        </>
                    ) : (
                        <View style={{marginTop: px(20)}}>
                            <LoadingTips color="#ddd" size={30} />
                        </View>
                    )}
                </LogView.Wrapper>
            </ScrollableTabView>
        </View>
    );
};

export default withNetState(Product);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    othersWrap: {
        backgroundColor: '#f5f6f8',
        paddingHorizontal: px(16),
    },
    emptyWrap: {
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
    },
});
