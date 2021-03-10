import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import OkGesturePassword from 'react-native-ok-gesture-password';
import Toast from '../../components/Toast';
// 修复了偏移的bug，在navigation存在或者statusBar的情况都可以适用

export default function GesturePassword() {
    const [data, setData] = useState({
        point1: '#FFFFFF', //从0开始
        point2: '#FFFFFF',
        point3: '#FFFFFF',
        point4: '#FFFFFF',
        point5: '#FFFFFF',
        point6: '#FFFFFF',
        point7: '#FFFFFF',
        point8: '#FFFFFF',
        point9: '#FFFFFF',
    });
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(false);
    const [isWarning, setIsWarning] = useState(false);

    const _onEnd = (pwd) => {
        // Alert.alert('密码', password);
        if (!password) {
            setPassword(pwd);
        } else if (password == pwd) {
            setStatus(true);
            setIsWarning(false);
            Toast.show('Password is right, success.');
        } else {
            setStatus(false);
            setIsWarning(true);
            setTimeout(() => {
                setIsWarning(false);
            }, 1000);
            Toast.show('Password is wrong, try again.');
        }
    };
    const _resetHeadPoint = () => {
        setData({
            point1: '#FFFFFF',
            point2: '#FFFFFF',
            point3: '#FFFFFF',
            point4: '#FFFFFF',
            point5: '#FFFFFF',
            point6: '#FFFFFF',
            point7: '#FFFFFF',
            point8: '#FFFFFF',
            point9: '#FFFFFF',
        });
    };

    const _changeHeadPoint = (point) => {
        switch (point + 1) {
            case 1:
                data.point1 = '#1F67B9';
                setData(data);
                break;
            case 2:
                data.point2 = '#1F67B9';
                setData(data);
                break;
            case 3:
                data.point3 = '#1F67B9';
                setData(data);
                break;
            case 4:
                data.point4 = '#1F67B9';
                setData(data);
                break;
            case 5:
                data.point5 = '#1F67B9';
                setData(data);
                break;
            case 6:
                data.point6 = '#1F67B9';
                setData(data);
                break;
            case 7:
                data.point7 = '#1F67B9';
                setData(data);
                break;
            case 8:
                data.point8 = '#1F67B9';
                setData(data);
                break;
            case 9:
                data.point8 = '#1F67B9';
                setData(data);
                break;
        }
    };
    return (
        <View style={styles.container}>
            <View style={{height: 70, marginTop: 10}}>
                <View style={styles.headContent}>
                    <View style={[styles.headCircle, {backgroundColor: data.point1}]} />
                    <View style={[styles.headCircle, {backgroundColor: data.point2}]} />
                    <View style={[styles.headCircle, {backgroundColor: data.point3}]} />
                </View>
                <View style={styles.headContent}>
                    <View style={[styles.headCircle, {backgroundColor: data.point4}]} />
                    <View style={[styles.headCircle, {backgroundColor: data.point5}]} />
                    <View style={[styles.headCircle, {backgroundColor: data.point6}]} />
                </View>
                <View style={styles.headContent}>
                    <View style={[styles.headCircle, {backgroundColor: data.point7}]} />
                    <View style={[styles.headCircle, {backgroundColor: data.point8}]} />
                    <View style={[styles.headCircle, {backgroundColor: data.point9}]} />
                </View>
            </View>
            <OkGesturePassword
                style={styles.gesturePassword}
                pointBackgroundColor={'white'}
                showArrow={false}
                color={'#1F67B9'}
                activeColor={'#1F67B9'}
                warningColor={'red'}
                warningDuration={1000}
                isWarning={isWarning}
                allowCross={false}
                onMove={(p) => {
                    console.log('onMove:' + p);
                    _changeHeadPoint(p);
                }}
                onFinish={(pwd) => {
                    _onEnd(pwd);
                    setTimeout(() => {
                        _resetHeadPoint();
                    }, 500);
                }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    gesturePassword: {
        backgroundColor: 'white',
    },
    headContent: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    headCircle: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#1F67B9',
        width: 15,
        height: 15,
        margin: 4,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
