/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {View, RefreshControl, ScrollView, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import HoldCard from './HoldCard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getHolding, getInfo} from './service';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import Header from './Header';
import {useShowGesture} from '~/components/hooks';
import GesturePassword from '~/pages/Settings/GesturePassword';
import LoginMask from '~/components/LoginMask';
import YellowNotice from '~/components/YellowNotice';
import AdInfo from '../components/AdInfo';
import withNetState from '~/components/withNetState';
import ToolMenus from '../components/ToolMenusCard';
import GuideTips from '~/components/GuideTips';
import LinearGradient from 'react-native-linear-gradient';
import PointCard from '../components/PointCard';
import Eye from '../../../components/Eye';
const Index = ({navigation}) => {
    const [data, setData] = useState(null);
    const [holding, setHolding] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const is_login = useSelector((store) => store.userInfo)?.toJS().is_login;
    const [newMes, setNewmessage] = useState(0);
    const [showEye, setShowEye] = useState('true');
    const scrollRef = useRef();
    const showGesture = useShowGesture();
    const isFocused = useIsFocused();
    const getData = async () => {
        let res = await getInfo();
        setRefreshing(false);
        setData(res.result);
    };
    const getHoldingData = async () => {
        let res = await getHolding();
        setHolding(res.result);
    };

    const readInterface = async () => {
        let res = await getReadMes();
        setNewmessage(res.result.all);
    };
    const init = (refresh) => {
        refresh && setRefreshing(true);
        getData();
        getHoldingData();
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
            if (isFocused) {
                scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                init(true);
                global.LogTool('tabDoubleClick', 'Home');
            }
        });
        return () => listener();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    return !showGesture ? (
        <>
            <Header newMes={newMes} />
            <ScrollView
                style={{backgroundColor: Colors.bgColor, flex: 1}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init(true)} />}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#ECF5FF', Colors.bgColor]}>
                    {/* 系统通知 */}
                    {data?.system_notices?.length > 0 && <YellowNotice data={data?.system_notices} />}
                    {/* 资产卡片 */}
                    <AssetHeaderCard summary={holding?.summary} showEye={showEye} tradeMes={holding?.trade_notice}>
                        <Eye onChange={(_data) => setShowEye(_data)} />
                    </AssetHeaderCard>
                    {/* 运营位 */}
                    {data?.ad_info && <AdInfo ad_info={data?.ad_info} />}
                </LinearGradient>
                {/* 工具菜单 */}
                {data?.tool_list && <ToolMenus data={data?.tool_list} />}
                {/* 投顾观点 */}
                {data?.point_info ? <PointCard data={data?.point_info} /> : null}
                {/* 持仓列表 */}
                {holding ? (
                    <>
                        <HoldCard data={holding} showEye={showEye} reload={getHoldingData} />
                        <BottomDesc />
                    </>
                ) : (
                    <View style={{height: px(300)}}>
                        <ActivityIndicator style={{marginTop: px(30)}} color={Colors.btnColor} />
                    </View>
                )}
            </ScrollView>
            {!is_login && <LoginMask />}
            {data?.bottom_notice && (
                <GuideTips data={data?.bottom_notice} style={{position: 'absolute', bottom: px(17)}} />
            )}
        </>
    ) : (
        // 手势密码
        <GesturePassword option={'verify'} />
    );
};
export default withNetState(Index);
