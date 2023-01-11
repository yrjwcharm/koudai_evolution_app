/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {View, RefreshControl, ScrollView, ActivityIndicator, Image, TouchableOpacity, Text} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import HoldCard from './HoldCard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getHolding, getInfo, getReadMes} from './service';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import Header from './Header';
import {useJump, useShowGesture} from '~/components/hooks';
import GesturePassword from '~/pages/Settings/GesturePassword';
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
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const [newMes, setNewmessage] = useState(0);
    const [showEye, setShowEye] = useState('true');
    const scrollRef = useRef();
    const showGesture = useShowGesture();
    const isFocused = useIsFocused();
    const jump = useJump();
    const getData = async () => {
        let res = await getInfo();
        setRefreshing(false);
        setData(res.result);
    };
    const getHoldingData = async () => {
        let res = await getHolding();
        // res.result.login_card = {
        //     button_text: '登录/开户',
        //     button_url: {path: 'Login'},
        //     pic_url: {path: 'Login'},
        //     pic: 'http://wp0.licaimofang.com/wp-content/uploads/2023/01/logindesc.png',
        // };
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
    };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            userInfo.is_login && readInterface();
        }, [userInfo.is_login])
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
    }, [isFocused]);

    return !showGesture ? (
        <>
            <Header newMes={newMes} light={!!holding?.login_card} bgColor={holding?.login_card ? '#0051CC' : ''} />
            <ScrollView
                style={{backgroundColor: Colors.bgColor, flex: 1}}
                refreshControl={
                    <RefreshControl
                        {...(holding?.login_card ? {tintColor: '#fff'} : {})}
                        refreshing={refreshing}
                        onRefresh={() => init(true)}
                    />
                }>
                {holding ? (
                    <View>
                        {holding?.login_card ? (
                            <View>
                                <View
                                    style={[
                                        {
                                            backgroundColor: '#0051CC',
                                            width: '100%',
                                            paddingTop: px(2),
                                            alignItems: 'center',
                                        },
                                    ]}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            jump(holding?.login_card.pic_url);
                                        }}>
                                        <Image
                                            source={{uri: holding?.login_card.pic}}
                                            style={{width: px(330), height: px(170)}}
                                        />
                                    </TouchableOpacity>
                                    <LinearGradient
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}
                                        colors={['#FFDF95', '#FFD04F']}
                                        style={{marginTop: px(14), borderRadius: px(17)}}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{width: px(202), paddingVertical: px(8), borderRadius: px(17)}}
                                            onPress={() => {
                                                jump(holding?.login_card?.button_url);
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: px(12),
                                                    lineHeight: px(17),
                                                    color: '#121D3A',
                                                    textAlign: 'center',
                                                }}>
                                                {holding?.login_card?.button_text}
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>
                                <LinearGradient
                                    start={{x: 0, y: 0}}
                                    end={{x: 0, y: 1}}
                                    colors={['rgba(0,81,204,1)', Colors.bgColor]}
                                    style={{height: px(75)}}
                                />
                            </View>
                        ) : (
                            <LinearGradient
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#ECF5FF', Colors.bgColor]}>
                                {/* 系统通知 */}
                                {data?.system_notices?.length > 0 && <YellowNotice data={data?.system_notices} />}
                                {/* 资产卡片 */}
                                <AssetHeaderCard
                                    summary={holding?.summary}
                                    showEye={showEye}
                                    tradeMes={holding?.trade_notice}
                                    showChart={holding?.show_chart}>
                                    <Eye onChange={(_data) => setShowEye(_data)} size={px(14)} />
                                </AssetHeaderCard>
                                {/* 运营位 */}
                                {data?.ad_info && <AdInfo ad_info={data?.ad_info} />}
                            </LinearGradient>
                        )}
                    </View>
                ) : null}
                {/* 工具菜单 */}
                {data?.tool_list && (
                    <View style={{marginTop: holding?.login_card ? px(-57) : 0}}>
                        <ToolMenus data={data?.tool_list} />
                    </View>
                )}
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
