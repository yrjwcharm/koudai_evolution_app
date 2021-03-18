/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import SplashScreen from 'react-native-splash-screen';
AppRegistry.registerComponent(appName, () => {
    setTimeout(() => {
        SplashScreen.hide(); //关闭启动页
    }, 2000);
    return App;
});
