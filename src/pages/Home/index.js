/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-25 15:50:39
 * @Description:
 */
import * as React from 'react';
import {View, Text, Button, ScrollView, PermissionsAndroid} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
    return (
        <ScrollView>
            <View style={{height: 2000, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20}}>Home Scree111n</Text>
                <Text style={{fontSize: 30, color: 'red', fontFamily: 'DINAlternate-Bold'}}>88888%</Text>
                <Button title={'获取权限'} onPress={requestCameraPermission} />
                <AntDesign name="setting" size={18} color={'#00f'} />
                <Button title="Go to Details" onPress={() => navigation.navigate('DetailScreen')} />
            </View>
        </ScrollView>
    );
}
export default HomeScreen;
