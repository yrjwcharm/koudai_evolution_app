/*
 * @Date: tabIconSizetabIconSize-11-04 11:56:24
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-02 11:20:58
 * @Description: 底部Tab路由
 */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IMScreen from '../pages/IM/index';
import HomeScreen from '../pages/Assets/index';
// import IndexScreen from '../pages/Index/index';
import {px} from '../utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Find from '../pages/Find'; //发现页
import {Colors} from '../common/commonStyle';
const Tab = createBottomTabNavigator();
const tabIconSize = px(24);

export default function Tabbar() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused}) => {
                    if (route.name === 'Find') {
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
                    } else if (route.name === 'IMScreen') {
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
                    } else if (route.name === 'HomeScreen') {
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
                    fontSize: px(12),
                },
            }}>
            <Tab.Screen
                name="Find"
                component={Find}
                options={{
                    tabBarLabel: '发现',
                }}
            />
            <Tab.Screen name="IMScreen" options={{tabBarLabel: '魔方'}} component={IMScreen} />
            <Tab.Screen name="HomeScreen" options={{tabBarLabel: '我的'}} component={HomeScreen} />
        </Tab.Navigator>
    );
}
