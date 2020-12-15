// In App.js in a new project
import * as React from 'react';
import { Provider } from 'react-redux'
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native-appearance';
import AppStack from './src/routes'
import configStore from './src/redux'
import './src/common/appConfig'
const MyTheme = {
  dark: true,
  colors: {
    primary: 'rgb(0, 0, 0)',
    background: 'rgb(0, 255, 255)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(255, 0, 255)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
const { store, persistor } = configStore()
function App () {
  const scheme = useColorScheme()
  React.useEffect(() => {
    console.log(__DEV__)
  })
  return (
    <>
      <StatusBar
        animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
        hidden={false}  //是否隐藏状态栏。
        backgroundColor={'transparent'} //状态栏的背景色
        translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
        barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
      ></StatusBar>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AppStack />
          </NavigationContainer >

        </PersistGate>
      </Provider>
    </>
  );
}

export default App;