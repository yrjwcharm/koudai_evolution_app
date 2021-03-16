/*
 * @Date: tabIconSizetabIconSize-11-04 11:56:24
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-16 15:36:13
 * @Description: 底部Tab路由
 */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Assets/index';
// import IndexScreen from '../pages/Index/index';
import {px} from '../utils/appUtil';
import Find from '../pages/Find'; //发现页
import Index from '../pages/MofangIndex'; //魔方首页
import {Colors} from '../common/commonStyle';
import storage from '../utils/storage';
import {useSelector, useDispatch} from 'react-redux';

const Tab = createBottomTabNavigator();
const tabIconSize = px(24);
export default function Tabbar() {
    const userInfo = useSelector((store) => store.userInfo);
    return (
        <Tab.Navigator
            initialRouteName="Index"
            screenOptions={({route, navigation}) => ({
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
                    } else if (route.name === 'Index') {
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
            <Tab.Screen name="Index" options={{tabBarLabel: '魔方'}} component={Index} />
            <Tab.Screen
                name="Home"
                options={{tabBarLabel: '我的'}}
                component={Home}
                listeners={({navigation, route}) => {
                    return {
                        tabPress: (e) => {
                            // e.preventDefault();
                            console.log(userInfo.toJS(), '0000');
                            if (userInfo.toJS().uid) {
                                navigation.navigate('Home');
                            } else {
                                storage.get('GesturesPassword').then((res) => {
                                    navigation.replace('GesturePassword');
                                });
                            }
                        },
                    };
                }}
            />
        </Tab.Navigator>
    );
}
