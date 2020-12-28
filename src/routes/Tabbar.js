/*
 * @Date: 2020-11-04 11:56:24
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-25 16:10:49
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
            tabBarOptions={{
                // activeTintColor: 'tomato',
                // inactiveTintColor: 'gray',
                allowFontScaling: false,
                // style: { backgroundColor: '#ddd', opacity: 0.9, position: 'absolute', filter: 10 }
            }}>
            <Tab.Screen
                name="IndexScreen"
                component={IndexScreen}
                options={{
                    tabBarLabel: '首页',
                    tabBarBadge: 3,
                }}
            />
            <Tab.Screen name="IMScreen" options={{tabBarBadge: 3}} component={IMScreen} />
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
        </Tab.Navigator>
    );
}
