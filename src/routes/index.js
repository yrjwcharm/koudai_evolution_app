import React from 'react'
import { View } from 'react-native'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import TabScreen from './Tabbar'
import DetailScreen from "../pages/Detail/index";
import GesturePassword from '../pages/personal/GesturePassword'
import LineChart from '../pages/Chart/lineChart.js'
import Feather from 'react-native-vector-icons/Feather';
import { commonStyle } from '../common/commonStyle';
import { deviceWidth } from '../utils/screenUtils'
import { BlurView } from '@react-native-community/blur';
const Stack = createStackNavigator()


export default function AppStack () {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        headerBackImage: () => {
          return <Feather name='chevron-left' size={30} />
        },
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: commonStyle.navTitleColor,
          fontSize: 16
        },
        headerTitleAllowFontScaling: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
        headerTransparent: true, //实现模糊玻璃效果
        headerBackground: () => {
          return <BlurView style={{ position: 'absolute', bottom: 0, top: 0, width: deviceWidth, backgroundColor: 'rgba(255,255,255,0.8)' }} blurType="light"></BlurView>
        },
        headerStyle: {
          // height: 64,
          backgroundColor: commonStyle.themeColor,
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          elevation: 0,
        }
      }
      }
    >
      <Stack.Screen name="Tab" component={TabScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{
        headerShown: false,
      }} />
      <Stack.Screen name="GesturePassword" component={GesturePassword} />
      <Stack.Screen name="LineChart" component={LineChart} />
    </ Stack.Navigator>
  )
}
