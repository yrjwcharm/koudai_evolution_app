/*
 * @Author: yhc
 * @Description: 底部Tab路由
 */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {px, isIphoneX} from '../utils/appUtil';
// import Index from '../pages/MofangIndex'; //魔方首页
import Product from '../pages/Product/Index';
import Vision from '../pages/Vision/Vision'; //视野
import Community from '../pages/Community/CommunityIndex'; // 社区首页
import NewHome from '../pages/Assets/Asset/Asset'; //资产页
import CreatorCenter from '../pages/CreatorCenter/Index'; //管理中心
import {Colors} from '../common/commonStyle';
import {useSelector} from 'react-redux';
import Storage from '../utils/storage';
import {useFocusEffect} from '@react-navigation/native';
import CreatorAuthHome from '~/pages/CreatorCenter/Auth/Home/CreatorAuthHome';
// import Attention from '~/pages/Attention/Index';
const Tab = createBottomTabNavigator();
const tabIconSize = px(22);
export default function Tabbar() {
    const vision = useSelector((store) => store.vision);
    const userInfo = useSelector((store) => store.userInfo);
    const [showVersion, setShowVersion] = React.useState(false);
    React.useEffect(() => {
        Storage.get('version' + userInfo.toJS().latest_version + 'tabBar').then((res) => {
            if (!res && global.ver < userInfo.toJS().latest_version) {
                setShowVersion(true);
            }
        });
    }, [userInfo]);

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
                    if (route.name === 'Index') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/mofangActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/mofang.png')}
                                />
                            );
                        }
                    } else if (route.name === 'Vision' || route.name === 'Community') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/shiyeActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/shiye.png')}
                                />
                            );
                        }
                    } else if (route.name === 'Home') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/wodeActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/wode.png')}
                                />
                            );
                        }
                    } else if (route.name === 'Attention') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/guanzhuActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/guanzhu.png')}
                                />
                            );
                        }
                    } else if (route.name === 'PKHome' || route.name === 'Product') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/pkActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/pk.png')}
                                />
                            );
                        }
                    } else if (route.name === 'ProjectHome') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/projectActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/project.png')}
                                />
                            );
                        }
                    } else if (route.name === 'CreatorCenter') {
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
            {/* <Tab.Screen name="Attention" options={{tabBarLabel: '关注'}} component={Attention} /> */}

            {/* <Tab.Screen name="ProjectHome" options={{tabBarLabel: '计划'}} component={ProjectHome} /> */}
            {userInfo?.toJS()?.show_vision_tab ? (
                <Tab.Screen
                    name="Vision"
                    options={{
                        tabBarLabel: '视野',
                        tabBarBadge: '',
                        tabBarBadgeStyle: {
                            backgroundColor: '#E74949',
                            width: vision.toJS().visionUpdate ? 8 : 0,
                            height: vision.toJS().visionUpdate ? 8 : 0,
                            minWidth: 0,
                            marginLeft: 5,
                            borderRadius: 4,
                        },
                    }}
                    component={Vision}
                />
            ) : null}
            {/* <Tab.Screen name="Index" options={{tabBarLabel: '魔方'}} component={Index} /> */}
            {/* <Tab.Screen name="PKHome" options={{tabBarLabel: '产品PK'}} component={PKHome} />
            <Tab.Screen name="ProjectHome" options={{tabBarLabel: '计划'}} component={ProjectHome} /> */}
            {/* userInfo?.toJS()?.show_manage_center */}
            {userInfo?.toJS()?.show_manage_center ? (
                <Tab.Screen name="CreatorCenter" options={{tabBarLabel: '管理中心'}} component={CreatorCenter} />
            ) : null}
            {userInfo?.toJS()?.show_audit_center ? (
                <Tab.Screen name="CreatorAuthHome" options={{tabBarLabel: '审核中心'}} component={CreatorAuthHome} />
            ) : null}
            <Tab.Screen name="Community" component={Community} options={{tabBarLabel: '社区'}} />
            <Tab.Screen
                name="Home"
                options={{
                    tabBarLabel: '我的',
                    tabBarBadge: '',
                    tabBarBadgeStyle: {
                        backgroundColor: '#E74949',
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
