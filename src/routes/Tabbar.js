/*
 * @Author: yhc
 * @Description: 底部Tab路由
 */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {px, isIphoneX} from '~/utils/appUtil';
// import Index from '~/pages/MofangIndex'; //魔方首页
import Product from '~/pages/Product/Index';
// import Vision from '~/pages/Vision/Vision'; //视野
import Community from '~/pages/Community/CommunityIndex'; // 社区首页
import NewHome from '~/pages/Assets/Asset/Asset'; //资产页
import CreatorCenter from '~/pages/CreatorCenter/Index'; //管理中心
import {Colors} from '~/common/commonStyle';
import {useDispatch, useSelector} from 'react-redux';
import Storage from '~/utils/storage';
import {useFocusEffect} from '@react-navigation/native';
import CreatorAuthHome from '~/pages/CreatorCenter/Auth/Home/CreatorAuthHome';
// import Attention from '~/pages/Attention/Index';
import {getNewsData} from '~/pages/Community/CommunityIndex/services';
import actionTypes from '~/redux/actionTypes';

const Tab = createBottomTabNavigator();
const tabIconSize = px(22);
export default function Tabbar() {
    const dispatch = useDispatch();
    // const vision = useSelector((store) => store.vision);
    const userInfo = useSelector((store) => store.userInfo);
    const community = useSelector((store) => store.community).toJS();
    const {communityFollowNews, communityRecommendNews} = community;
    const [showVersion, setShowVersion] = React.useState(false);
    React.useEffect(() => {
        Storage.get('version' + userInfo.toJS().latest_version + 'tabBar').then((res) => {
            if (!res && global.ver < userInfo.toJS().latest_version) {
                setShowVersion(true);
            }
        });
    }, [userInfo]);

    const getNews = () => {
        getNewsData().then((res) => {
            if (res.code === '000000') {
                dispatch({
                    payload: {
                        communityFollowNews: res.result.follow_news,
                        communityRecommendNews: res.result.recommend_news,
                    },
                    type: actionTypes.Community,
                });
            }
        });
    };

    React.useEffect(() => {
        getNews();
        const timer = setInterval(getNews, 60000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            global.pkEntry = '2';
        }, [])
    );
    return (
        // //如需要在此插入元素,如tabbar底部弹窗 可添加 <RootSiblingParent inactive={true}>
        <Tab.Navigator
            initialRouteName="Product"
            screenOptions={({route, navigation}) => ({
                tabBarIcon: ({focused}) => {
                    global.navigation = navigation;
                    switch (route.name) {
                        case 'Community':
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={
                                        focused
                                            ? require('../assets/img/tabIcon/communityFocus.png')
                                            : require('../assets/img/tabIcon/community.png')
                                    }
                                />
                            );
                        case 'Home':
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={
                                        focused
                                            ? require('../assets/img/tabIcon/homeFocus.png')
                                            : require('../assets/img/tabIcon/home.png')
                                    }
                                />
                            );
                        case 'Product':
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={
                                        focused
                                            ? require('../assets/img/tabIcon/productFocus.png')
                                            : require('../assets/img/tabIcon/product.png')
                                    }
                                />
                            );
                        case 'CreatorCenter':
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={
                                        focused
                                            ? require('../assets/img/tabIcon/creatorCenterFocus.png')
                                            : require('../assets/img/tabIcon/creatorCenter.png')
                                    }
                                />
                            );
                        case 'CreatorAuthHome':
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={
                                        focused
                                            ? require('../assets/img/tabIcon/creatorCenterFocus.png')
                                            : require('../assets/img/tabIcon/creatorCenter.png')
                                    }
                                />
                            );
                    }
                },
            })}
            backBehavior={'none'}
            tabBarOptions={{
                activeTintColor: Colors.btnColor,
                inactiveTintColor: '#4E556C',
                allowFontScaling: false,
                labelStyle: {
                    marginBottom: isIphoneX() ? px(18) : px(10),
                    fontSize: px(11),
                },
                style: {height: isIphoneX() ? px(90) : px(56), paddingTop: isIphoneX() ? 0 : px(4)},
            }}>
            <Tab.Screen name="Product" options={{tabBarLabel: '产品'}} component={Product} />
            {userInfo?.toJS()?.show_manage_center ? (
                <Tab.Screen name="CreatorCenter" options={{tabBarLabel: '管理中心'}} component={CreatorCenter} />
            ) : null}
            {userInfo?.toJS()?.show_audit_center ? (
                <Tab.Screen name="CreatorAuthHome" options={{tabBarLabel: '审核中心'}} component={CreatorAuthHome} />
            ) : null}
            <Tab.Screen
                name="Community"
                component={Community}
                options={{
                    tabBarLabel: '社区',
                    tabBarBadge: '',
                    tabBarBadgeStyle: {
                        backgroundColor: Colors.red,
                        width: communityFollowNews || communityRecommendNews ? 8 : 0,
                        height: communityFollowNews || communityRecommendNews ? 8 : 0,
                        minWidth: 0,
                        marginLeft: 5,
                        borderRadius: 4,
                    },
                }}
            />
            <Tab.Screen
                name="Home"
                options={{
                    tabBarLabel: '我的',
                    tabBarBadge: '',
                    tabBarBadgeStyle: {
                        backgroundColor: Colors.red,
                        width: showVersion ? 8 : 0,
                        height: showVersion ? 8 : 0,
                        minWidth: 0,
                        marginLeft: 5,
                        borderRadius: 4,
                    },
                }}
                listeners={{
                    tabPress: (e) => {
                        if (showVersion) {
                            setShowVersion(false);
                            Storage.save('version' + userInfo.toJS().latest_version + 'tabBar', true);
                        }
                        // Prevent default action
                        // e.preventDefault();
                    },
                }}
                component={NewHome}
            />
        </Tab.Navigator>
    );
}
