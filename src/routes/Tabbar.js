/*
 * @Date: 2020-11-04 11:56:24
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-08 19:58:22
 * @Description: 底部Tab路由
 */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IMScreen from '../pages/IM/index';
import HomeScreen from '../pages/Home/index';
import IndexScreen from '../pages/Index/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Tab = createBottomTabNavigator();
export default function Tabbar() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    if (route.name === 'IndexScreen') {
                    if (focused) {
                        return <AntDesign name="setting" size={size} color={color} />;
                    }
                    return <AntDesign name="home" size={size} color={color} />;
                    } else if (route.name === 'IMScreen') {
                        return <AntDesign name="cloudo" size={size} color={color} />;
                    } else if (route.name === 'HomeScreen') {
                        return <AntDesign name="mail" size={size} color={color} />;
                    } else if (route.name === 'setting') {
                        return <AntDesign name="setting" size={size} color={color} />;
                    }
                },
            })}
            backBehavior={'none'}
            tabBarOptions={{
                // activeTintColor: 'tomato',
                // inactiveTintColor: 'gray',
                allowFontScaling: false,
                labelStyle:{
                    fontSize:16
                }
            }}>
            <Tab.Screen
                name="IndexScreen"
                component={IndexScreen}
                options={{
                    tabBarLabel: '首页',
                }}
            />
            <Tab.Screen name="IMScreen" options={{ tabBarLabel: '发现'}} component={IMScreen} />
            <Tab.Screen name="HomeScreen" options={{ tabBarLabel: '资产'}} component={HomeScreen} />
        </Tab.Navigator>
    );
}
