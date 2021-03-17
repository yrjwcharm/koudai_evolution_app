/*
 * @Date: 2021-03-17 17:44:16
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-17 22:12:26
 * @Description: 登录注册蒙层
 */
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
import {Button} from './Button';
import {px as text} from '../utils/appUtil';
import {Colors, Space} from '../common/commonStyle';

const width = Dimensions.get('window').width;

const LoginMask = () => {
    const navigation = useNavigation();
    return (
        <BlurView
            blurAmount={10}
            blurType={'light'}
            reducedTransparencyFallbackColor={'white'}
            style={[styles.container, {bottom: 0}]}>
            <Button title={'注册'} style={styles.registerBtn} onPress={() => navigation.navigate('Register')} />
            <Button
                title={'登录'}
                color={'#fff'}
                onPress={() => navigation.navigate('Login')}
                style={styles.loginBtn}
                textStyle={{color: Colors.lightBlackColor}}
            />
        </BlurView>
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
