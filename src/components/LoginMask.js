/*
 * @Date: 2021-03-17 17:44:16
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-17 18:10:42
 * @Description: 登录注册蒙层
 */
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {RootSiblingPortal} from 'react-native-root-siblings';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {Button} from './Button';
import {px as text} from '../utils/appUtil';
import {Colors, Space} from '../common/commonStyle';

const width = Dimensions.get('window').width;

const LoginMask = () => {
    const height = useBottomTabBarHeight();
    const navigation = useNavigation();
    return (
        <RootSiblingPortal>
            <View style={[styles.container, {bottom: height}]}>
                <Button title={'注册'} style={styles.registerBtn} onPress={() => navigation.navigate('Register')} />
                <Button
                    title={'登录'}
                    color={'#fff'}
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginBtn}
                    textStyle={{color: Colors.lightBlackColor}}
                />
            </View>
        </RootSiblingPortal>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: text(20),
        paddingBottom: text(40),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width,
        zIndex: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    registerBtn: {
        marginBottom: text(20),
        width: width - text(40),
    },
    loginBtn: {
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
        width: width - text(40),
    },
});

export default LoginMask;
