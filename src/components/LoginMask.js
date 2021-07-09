/*
 * @Date: 2021-03-17 17:44:16
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-09 19:19:05
 * @Description: 登录注册蒙层
 */
import React, {useState, useRef} from 'react';
import {Dimensions, StyleSheet, View, findNodeHandle, Platform, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
import {Button} from './Button';
import {px as text, px} from '../utils/appUtil';
import {Colors, Space} from '../common/commonStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
const width = Dimensions.get('window').width;

const LoginMask = ({scene}) => {
    const navigation = useNavigation();
    const [blurRef, setBlurRef] = useState(null);
    const viewRef = useRef(null);
    const inset = useSafeAreaInsets();
    return Platform.OS == 'android' && scene == 'vision' ? (
        <>
            <ImageBackground
                source={require('../assets/img/vision/visionMask.jpg')}
                style={[styles.container, {top: inset.top - px(6), width: width - px(10), left: px(5)}]}>
                <Button title={'注册'} style={styles.registerBtn} onPress={() => navigation.navigate('Register')} />
                <Button
                    title={'登录'}
                    color={'#fff'}
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginBtn}
                    textStyle={{color: Colors.lightBlackColor}}
                />
            </ImageBackground>
        </>
    ) : (
        <>
            <View
                style={[styles.container, {zIndex: 10}]}
                ref={viewRef}
                onLayout={() => {
                    viewRef && setBlurRef(findNodeHandle(viewRef.current));
                }}>
                <Button title={'注册'} style={styles.registerBtn} onPress={() => navigation.navigate('Register')} />
                <Button
                    title={'登录'}
                    color={'#fff'}
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginBtn}
                    textStyle={{color: Colors.lightBlackColor}}
                />
            </View>
            <BlurView blurAmount={4} viewRef={blurRef} blurType={'light'} style={styles.container} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width,
        zIndex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    registerBtn: {
        marginBottom: text(20),
        width: width - text(40),
    },
    loginBtn: {
        borderWidth: Space.borderWidth,
        borderColor: '#545968',
        backgroundColor: '#fff',
        width: width - text(40),
        marginBottom: text(40),
    },
});

export default LoginMask;
