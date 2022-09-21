/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {View, RefreshControl, Animated, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import HoldCard from './HoldCard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getHolding, getInfo, getNotice, getReadMes} from './service';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import Header from './Header';
import {useShowGesture} from '~/components/hooks';
import GesturePassword from '~/pages/Settings/GesturePassword';
import LoginMask from '~/components/LoginMask';
import YellowNotice from '~/components/YellowNotice';
import AdInfo from './AdInfo';
import withNetState from '~/components/withNetState';
import Feather from 'react-native-vector-icons/Feather';
import Storage from '~/utils/storage';
import ToolMenus from './ToolMenus';
import GuideTips from '~/components/GuideTips';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from '~/components/Button';
const Index = ({navigation, _ref}) => {
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
    useEffect(() => {
        Storage.get('myAssetsEye').then((res) => {
            setShowEye(res ? res : 'true');
        });
    }, []);
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
                    {/* tradeMes={data?.trade} */}
                    <AssetHeaderCard summary={holding?.summary} showEye={showEye}>
                        <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
                            <Feather
                                name={showEye === 'true' ? 'eye' : 'eye-off'}
                                size={px(16)}
                                color={'rgba(255, 255, 255, 0.8)'}
                            />
                        </TouchableOpacity>
                    </AssetHeaderCard>
                    {/* 运营位 */}
                    {data?.ad_info && <AdInfo ad_info={data?.ad_info} />}
                </LinearGradient>
                <Button onPress={() => navigation.navigate('ToolListManage')} />
                {/* 工具菜单 */}
                {<ToolMenus data={data?.tool_list} />}
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
            <GuideTips data={data?.bottom_notice} style={{position: 'absolute', bottom: px(17)}} />
        </>
    ) : (
        // 手势密码
        <GesturePassword option={'verify'} />
    );
};
export default withNetState(Index);
