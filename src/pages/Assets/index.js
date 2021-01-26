/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-23 15:56:43
 * @Description:
 */
import React, {useState, useEffect} from 'react';
import {View, Text, Button, ScrollView, PermissionsAndroid} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceWidth} from '../../utils/appUtil.js';
import Header from '../../components/NavBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
};
function HomeScreen({navigation}) {
    const [scrollY, setScrollY] = useState(0);
    const _onScroll = (event) => {
        let y = event.nativeEvent.contentOffset.y;
        setScrollY(y);
    };

    const insets = useSafeAreaInsets();
    console.log(insets);

    return (
        <>
            <Header
                title={'123'}
                scrollY={scrollY}
                style={{opacity: 0, position: 'absolute', width: deviceWidth, backgroundColor: 'red'}}
            />
            <ScrollView onScroll={_onScroll} scrollEventThrottle={16} style={{backgroundColor: 'pink'}}>
                <View style={{height: 2000, alignItems: 'center'}}>
                    <Text style={{fontSize: 20}}>Home Scree111n</Text>
                    <Text style={{fontSize: 30, color: 'red', fontFamily: 'DINAlternate-Bold'}}>88888%</Text>
                    <Button title={'获取权限'} onPress={requestCameraPermission} />
                    <AntDesign name="setting" size={18} color={'#00f'} />
                    <Button title="Go to Details" onPress={() => navigation.navigate('DetailScreen')} />
                </View>
            </ScrollView>
        </>
    );
}
export default HomeScreen;
