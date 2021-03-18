import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import OkGesturePassword from '../../components/gesturePassword/OkGesturePassword';
import Toast from '../../components/Toast';
import storage from '../../utils/storage';
import Header from '../../components/NavBar';
import {updateVerifyGesture} from '../../redux/actions/userInfo';
import {useDispatch} from 'react-redux';
var isOpen,
    password,
    refresh = true;
// 修复了偏移的bug，在navigation存在或者statusBar的情况都可以适用

export default function GesturePassword({navigation, route}) {
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
    // const [password, setPassword] = useState('');
    const [status, setStatus] = useState(false);
    const [isWarning, setIsWarning] = useState(false); //设置警告
    const [title, setTitle] = useState('请绘制解锁图案');
    const dispatch = useDispatch();
    useEffect(() => {
        // storage.delete('gesturePwd');
        // 修改手势密码
        if (route?.params?.option == 'modify') {
            setTitle('请输入旧的手势密码');
        }
        storage.get('gesturePwd').then((res) => {
            if (res) {
                password = res;
                // setPassword(res);
            }
        });
        // 开启手势密码
        storage.get('openGesturePwd').then((result) => {
            isOpen = result;
        });
    }, []);

    const _onEnd = (pwd) => {
        console.log(pwd);
        // Alert.alert('密码', password);
        //手势密码登陆
        if (isOpen && route?.params?.option !== 'modify') {
            if (password == pwd) {
                setStatus(true);
                setIsWarning(false);
                dispatch(updateVerifyGesture());
                Toast.show('登陆成功');
            } else {
                setStatus(false);
                setIsWarning(true);
                setTimeout(() => {
                    setIsWarning(false);
                }, 1000);
                setTitle('手势密码错误');
            }
            // 修改手势密码
        } else if (route?.params?.option == 'modify' && refresh) {
            if (password == pwd) {
                setStatus(true);
                setIsWarning(false);
                setTitle('请输入新的手势密码');
                password = '';
                refresh = false;
                console.log(password, '---password');
                // setPassword('');
            } else {
                setStatus(false);
                setIsWarning(true);
                setTimeout(() => {
                    setIsWarning(false);
                }, 1000);
                setTitle('请输入正确的旧密码');
            }
        } else {
            refreshPwd(pwd);
        }
    };
    const refreshPwd = (pwd, status) => {
        if (!password) {
            password = pwd;
            if (!status) {
                setTitle('请再次绘制解锁图案');
            }
            // setPassword(pwd);
        } else if (password == pwd) {
            //第二次绘制密码
            setStatus(true);
            setIsWarning(false);
            //保存手势密码和开启状态
            storage.save('gesturePwd', pwd);
            storage.save('openGesturePwd', true);
            setTitle('');
            if (route?.params?.option == 'modify') {
                Toast.show('修改成功');
            } else {
                Toast.show('设置成功');
            }
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } else {
            setTitle('两次手势密码不一致，请再次输入');
            setStatus(false);
            setIsWarning(true);
            setTimeout(() => {
                setIsWarning(false);
            }, 1000);
            // Toast.show('密码不一致，请重新绘制');
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
            {/* <View style={{height: 70, marginTop: 10}}>
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
            </View> */}
            <Text>{title}</Text>
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
