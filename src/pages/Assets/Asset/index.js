/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {View, RefreshControl, Animated, ActivityIndicator, TouchableOpacity} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import RationalCard from './RationalCard';
import HoldList from './HoldList';
import {useFocusEffect} from '@react-navigation/native';
import {getHolding, getInfo, getNotice, getReadMes} from './service';
import BottomMenus from './BottomMenus';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import Header from './Header';
import {useShowGesture} from '~/components/hooks';
import GesturePassword from '~/pages/Settings/GesturePassword';
import LoginMask from '~/components/LoginMask';
import YellowNotice from './YellowNotice';
import AdInfo from './AdInfo';
import withNetState from '~/components/withNetState';
import Feather from 'react-native-vector-icons/Feather';
import Storage from '~/utils/storage';
const Index = ({navigation, _ref}) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState(null);
    const [notice, setNotice] = useState(null);
    const [holding, setHolding] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const is_login = useSelector((store) => store.userInfo)?.toJS().is_login;
    const [headHeight, setHeaderHeight] = useState(0);
    const [newMes, setNewmessage] = useState(0);
    const [showEye, setShowEye] = useState('true');
    const scrollRef = useRef();
    const showGesture = useShowGesture();
    const getData = async () => {
        let res = await getInfo();
        setRefreshing(false);
        setData(res.result);
    };
    const getHoldingData = async () => {
        let res = await getHolding();
        setHolding(res.result);
    };
    // 小黄条
    const getNoticeData = async () => {
        let res = await getNotice();
        setNotice(res.result);
    };
    const readInterface = async () => {
        let res = await getReadMes();
        setNewmessage(res.result.all);
    };
    // 显示|隐藏金额信息
    const toggleEye = () => {
        setShowEye((show) => {
            global.LogTool('click', show === 'true' ? 'eye_close' : 'eye_open');
            Storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };
    const init = (refresh) => {
        refresh && setRefreshing(true);
        getData();
        getHoldingData();
        is_login && getNoticeData();
        is_login && readInterface();
    };
    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [is_login])
    );
    useEffect(() => {
        const listener = navigation.addListener('tabPress', () => {
            if (is_login) {
                scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                init(true);
                global.LogTool('tabDoubleClick', 'Home');
            }
        });
        return () => listener();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_login]);
    useEffect(() => {
        Storage.get('myAssetsEye').then((res) => {
            setShowEye(res ? res : 'true');
        });
    }, []);
    return !showGesture ? (
        <>
            <Header newMes={newMes} />
            <Animated.ScrollView
                ref={scrollRef}
                style={{backgroundColor: Colors.bgColor, flex: 1}}
                scrollEventThrottle={1}
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                            },
                        ],
                        {
                            useNativeDriver: true,
                        }
                    ) // 使用原生动画驱动
                }
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init(true)} />}>
                <View
                    onLayout={(e) => {
                        let {height} = e.nativeEvent.layout;
                        setHeaderHeight(height); // 给头部高度赋值
                    }}>
                    {/* 系统通知 */}
                    {notice?.system_list?.length > 0 ? <YellowNotice data={notice?.system_list} /> : null}
                    {/* 资产卡片 */}
                    <AssetHeaderCard summary={holding?.summary} tradeMes={notice?.trade} showEye={showEye}>
                        <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
                            <Feather
                                name={showEye === 'true' ? 'eye' : 'eye-off'}
                                size={px(16)}
                                color={'rgba(255, 255, 255, 0.8)'}
                            />
                        </TouchableOpacity>
                    </AssetHeaderCard>
                    {/* 理性等级和投顾 */}
                    <RationalCard im_info={data?.im_info} rational_info={data?.rational_info} />
                    {/* 运营位 */}
                    {data?.ad_info && <AdInfo ad_info={data?.ad_info} />}
                </View>
                {/* 持仓列表 */}
                {holding?.products ? (
                    <>
                        <HoldList
                            products={holding?.products}
                            scrollY={scrollY}
                            showEye={showEye}
                            stickyHeaderY={headHeight}
                            reload={getHoldingData}
                        />
                        {/* 底部列表 */}
                        <BottomMenus data={data?.bottom_menus} />
                        <BottomDesc />
                    </>
                ) : (
                    <View style={{height: px(300)}}>
                        <ActivityIndicator style={{marginTop: px(30)}} color={Colors.btnColor} />
                    </View>
                )}
            </Animated.ScrollView>
            {!is_login && <LoginMask />}
        </>
    ) : (
        // 手势密码
        <GesturePassword option={'verify'} />
    );
};
export default withNetState(Index);
