/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-25 16:29:16
 * @Description:路由表
 */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import TabScreen from './Tabbar';
import DetailScreen from '../pages/Detail/index';
import GesturePassword from '../pages/personal/GesturePassword';
import LineChart from '../pages/Chart/lineChart.js';
import Feather from 'react-native-vector-icons/Feather';
import {commonStyle} from '../common/commonStyle';
const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                // headerShown: false,
                headerBackImage: () => {
                    return <Feather name="chevron-left" size={30} />;
                },
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: commonStyle.navTitleColor,
                    fontSize: 16,
                },
                headerTitleAllowFontScaling: false,
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
                // headerTransparent: true, //实现模糊玻璃效果
                // headerBackground: () => {
                //     return (
                //         <BlurView
                //             style={{
                //                 position: 'absolute',
                //                 bottom: 0,
                //                 top: 0,
                //                 width: deviceWidth,
                //                 backgroundColor: 'rgba(255,255,255,0.8)',
                //             }}
                //             blurType="light"
                //         />
                //     );
                // },
                headerStyle: {
                    backgroundColor: commonStyle.themeColor,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    elevation: 0,
                },
            }}>
            <Stack.Screen name="Tab" component={TabScreen} />
            <Stack.Screen
                name="DetailScreen"
                component={DetailScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="GesturePassword"
                component={GesturePassword}
                options={({route}) => ({title: route.params?.title ? route.params?.title : route.name})}
            />
            <Stack.Screen
                name="LineChart"
                component={LineChart}
                options={{
                    ...TransitionPresets.ModalTransition,
                }}
            />
        </Stack.Navigator>
    );
}
