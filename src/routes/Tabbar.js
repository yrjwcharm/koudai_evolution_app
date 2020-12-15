import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IMScreen from '../pages/IM/index'
import HomeScreen from '../pages/Home/index'
import IndexScreen from '../pages/Index/index'
import TabBarBadge from '../components/TabBarBadge'
import { BlurView, VibrancyView } from '@react-native-community/blur';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { deviceWidth, deviceHeight, px, isIphoneX } from '../utils/screenUtils'
const Tab = createBottomTabNavigator();
import { View, Text, TouchableOpacity } from 'react-native';
function MyTabBar ({ state, descriptors, navigation }) {
  console.log(deviceWidth, deviceHeight)
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <VibrancyView style={{ flexDirection: 'row', height: isIphoneX() ? px(76) : px(48), backgroundColor: 'rgba(255,255,255,0.6)', position: 'absolute', bottom: 0, width: deviceWidth }} blurType="light"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Text style={{ color: isFocused ? 'red' : 'black' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </VibrancyView>
  );
}

// ...


export default function Tabbar () {
  return (
    <Tab.Navigator
      // tabBar={props => <MyTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'IndexScreen') {
            if (focused) {
              return <AntDesign name="setting" size={size} color={color} />
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
      }}
    >
      <Tab.Screen name="IndexScreen" component={IndexScreen} options={{
        tabBarLabel: '首页',
        tabBarBadge: 3
      }} />
      <Tab.Screen name="IMScreen" options={{ tabBarBadge: 3 }} component={IMScreen} />
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
    </Tab.Navigator>
  );
} 