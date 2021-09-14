/*
 * @Date: tabIconSizetabIconSize-11-04 11:56:24
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-14 11:56:25
 * @Description: 底部Tab路由
 */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {px, isIphoneX} from '../utils/appUtil';
import Find from '../pages/Find'; //发现页
import Index from '../pages/MofangIndex'; //魔方首页
import Vision from '../pages/Vision/Vision'; //视野
import Home from '../pages/Assets/index'; //资产页
import {Colors} from '../common/commonStyle';
import {useSelector} from 'react-redux';
import Storage from '../utils/storage';
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
    return (
        <Tab.Navigator
            initialRouteName="Index"
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
                    } else if (route.name === 'Find') {
                        if (focused) {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/faxianActive.png')}
                                />
                            );
                        } else {
                            return (
                                <FastImage
                                    style={{width: tabIconSize, height: tabIconSize}}
                                    source={require('../assets/img/tabIcon/faxian.png')}
                                />
                            );
                        }
                    } else if (route.name === 'Vision') {
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
            <Tab.Screen name="Index" options={{tabBarLabel: '魔方'}} component={Index} />
            <Tab.Screen name="Find" options={{tabBarLabel: '发现'}} component={Find} />
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
                component={Home}
            />
        </Tab.Navigator>
    );
}
