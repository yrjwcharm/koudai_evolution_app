/*
 * @Date: 2020-11-06 12:07:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-23 14:01:37
 * @Description: 首页
 */
import * as React from 'react';
import { View, Text, Button, Linking } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { update } from '../../redux/actions/userInfo'
import JPush from 'jpush-react-native';
function HomeScreen (props) {
  const { navigation } = props
  const userInfo = useSelector(store => store.userInfo);
  const dispatch = useDispatch()
  React.useEffect(() => {
    JPush.init();
    setTimeout(() => {
      //连接状态
      JPush.addConnectEventListener((result) => {
        console.log('1111')
        console.log("connectListener:" + JSON.stringify(result))
      });
      JPush.setBadge({ "badge": 1, appbadge: '123' })

      JPush.getRegistrationID(result =>
        console.log("registerID:" + JSON.stringify(result))
      )

      //通知回调
      JPush.addNotificationListener((result) => {
        console.log("notificationListener:" + JSON.stringify(result))
        if (JSON.stringify(result.extras.route)) {
          navigation.navigate(result.extras.route)
        }
      });
      //本地通知回调
      JPush.addLocalNotificationListener((result) => {
        console.log("localNotificationListener:" + JSON.stringify(result))
      });
      //自定义消息回调
      JPush.addCustomMessagegListener((result) => {
        console.log("customMessageListener:" + JSON.stringify(result))
      });
    }, 100)

    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // Prevent default behavior
      console.log('111')
      // e.preventDefault();

      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * @description: 处理通过深度链接进入app
   * @param {*} event
   * @return {*}
   */
  const handleOpenURL = (event) => {
    console.log(event.url);
    const route = event.url.replace(/.*?:\/\//g, '');
    console.log(route)
  }

  React.useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    return () => {
      Linking.removeEventListener('url', handleOpenURL);
    }
  }, [navigation])
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>首页</Text>
      <Text style={{ fontSize: 30, color: 'red', fontFamily: 'DINAlternate-Bold' }}>88888%</Text>
      <Text>{userInfo.toJS().name}啊啊啊</Text>


      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DetailScreen')}
      />
      <Button
        title="Go to Im"
        onPress={() => navigation.navigate('GesturePassword')}
      />
      <Button
        title="Go to LineChart"
        onPress={() => navigation.navigate('LineChart')}
      />
      <Button
        title="Dispatch"
        onPress={() => dispatch(update({ is_dav: '哈哈哈', name: '眼' }))}
      />
    </View>
  );
}
export default HomeScreen