/*
 * @Date: 2022-06-21 14:16:13
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-18 12:03:44
 * @Description:关注
 */
import {StyleSheet, View, Animated} from 'react-native';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {followAdd, getData, getFollowList} from './service';
import MessageCard from './MessageCard';
import {px} from '~/utils/appUtil';
import {Colors} from '~/common/commonStyle';
import HotFund from './HotFund';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import HeaderRight from './HeaderRight';
import FollowTable from './FollowTable';
import Toast from '../../../components/Toast';
import NavBar from '~/components/NavBar';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LoginMask from '~/components/LoginMask';
import {useJump} from '~/components/hooks';
import {SmButton} from '~/components/Button';
const Attention = () => {
    const is_login = useSelector((store) => store.userInfo).toJS().is_login;
    const [data, setData] = useState();
    const [followData, setFollowData] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const [headHeight, setHeaderHeight] = useState(0);
    const jump = useJump();
    const scrollY = useRef(new Animated.Value(0)).current;
    const _getData = async () => {
        let res = await getData();
        setData(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            _getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    useEffect(() => {
        setActiveTab(0);
    }, [is_login]);
    useEffect(() => {
        data?.follow && getFollowData({item_type: data?.follow?.tabs[activeTab]?.item_type});
    }, [activeTab, data]);
    const onChangeTab = (obj) => {
        setActiveTab(obj.i);
    };
    const getFollowData = async (params) => {
        let res = await getFollowList(params);
        setFollowData(res.result);
    };
    //一键关注
    const onFollow = async (params) => {
        let res = await followAdd(params);
        if (res.code == '000000') {
            _getData();
            getFollowData({item_type: 1});
        }
        Toast.show(res.message);
    };
    return (
        <View style={{flex: 1}}>
            <NavBar renderRight={<HeaderRight />} title="关注" />
            {!is_login && <LoginMask />}
            <Animated.ScrollView
                style={styles.con}
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                            },
                        ],
                        {useNativeDriver: true}
                    ) // 使用原生动画驱动
                }
                scrollEventThrottle={1}>
                <View
                    style={{paddingHorizontal: px(16)}}
                    onLayout={(e) => {
                        let {height} = e.nativeEvent.layout;
                        setHeaderHeight(height); // 给头部高度赋值
                    }}>
                    {/* 消息卡片 */}
                    {data?.notice && <MessageCard data={data?.notice} />}
                    {/* 热门基金 */}
                    {data?.hot_fund && <HotFund data={data?.hot_fund} onFollow={onFollow} />}
                </View>
                {/* 列表 */}

                {data?.follow?.tabs && (
                    <View style={{backgroundColor: '#fff', marginBottom: px(20)}}>
                        {data?.follow?.tabs_button ? (
                            <SmButton
                                style={styles.pkBtn}
                                title={data?.follow?.tabs_button?.text}
                                onPress={() => jump(data?.follow?.tabs_button?.url)}
                            />
                        ) : null}
                        <ScrollableTabView
                            prerenderingSiblingsNumber={data?.follow?.tabs?.length}
                            locked={true}
                            renderTabBar={() => <ScrollTabbar boxStyle={{paddingLeft: px(8)}} />}
                            onChangeTab={onChangeTab}>
                            {data?.follow?.tabs?.map((tab, index) => (
                                <View key={index} tabLabel={tab?.type_text}>
                                    <FollowTable
                                        data={followData}
                                        activeTab={data?.follow?.tabs[activeTab].item_type}
                                        handleSort={getFollowData}
                                        tabButton={data?.follow?.tabs[activeTab]?.button_list}
                                        scrollY={scrollY}
                                        stickyHeaderY={headHeight}
                                    />
                                </View>
                            ))}
                        </ScrollableTabView>
                    </View>
                )}
                {/* </StickyHeader> */}
            </Animated.ScrollView>
        </View>
    );
};

export default Attention;

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    pkBtn: {
        zIndex: 2,
        position: 'absolute',
        right: px(16),
        top: px(8),
    },
});
