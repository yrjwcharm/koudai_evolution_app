/*
 * @Date: 2020-11-06 12:07:23
 * @Author: yhc
<<<<<<< HEAD
 * @LastEditors: dx
 * @LastEditTime: 2021-01-22 10:38:31
=======
<<<<<<< Updated upstream
 * @LastEditors: dx
 * @LastEditTime: 2021-01-21 17:54:35
=======
 * @LastEditors: dx
 * @LastEditTime: 2021-01-20 18:48:07
>>>>>>> Stashed changes
>>>>>>> 269255f306f5d8fc90f74e7787ae55451f4a7950
 * @Description: 首页
 */
import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Linking,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {update} from '../../redux/actions/userInfo';
import JPush from 'jpush-react-native';
import {px} from '../../utils/appUtil';
import {PasswordModal} from '../../components/Password';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Button} from '../../components/Button';
import {Modal, BottomModal, VerifyCodeModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
function HomeScreen(props) {
    // const refRBSheet = useRef();
    const {navigation} = props;
    const userInfo = useSelector((store) => store.userInfo);
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    React.useEffect(() => {
        JPush.init();
        setTimeout(() => {
            //连接状态
            JPush.addConnectEventListener((result) => {
                console.log('1111');
                console.log('connectListener:' + JSON.stringify(result));
            });
            JPush.setBadge({badge: 1, appbadge: '123'});

            JPush.getRegistrationID((result) => console.log('registerID:' + JSON.stringify(result)));

            //通知回调
            JPush.addNotificationListener((result) => {
                console.log('notificationListener:' + JSON.stringify(result));
                if (JSON.stringify(result.extras.route)) {
                    navigation.navigate(result.extras.route);
                }
            });
            //本地通知回调
            JPush.addLocalNotificationListener((result) => {
                console.log('localNotificationListener:' + JSON.stringify(result));
            });
            //自定义消息回调
            JPush.addCustomMessagegListener((result) => {
                console.log('customMessageListener:' + JSON.stringify(result));
            });
        }, 100);

        const unsubscribe = navigation.addListener('tabPress', (e) => {
            // Prevent default behavior
            console.log('111');
            // e.preventDefault();

            // Do something manually
            // ...
        });
        // refRBSheet.current.open();
        // verifyCodeModel.current.show();
        return unsubscribe;
    }, [navigation, visible]);
    const password = React.useRef();
    const bottomModal = React.useRef(null);
    const verifyCodeModel = React.useRef(null);
    /**
     * @description: 处理通过深度链接进入app
     * @param {*} event
     * @return {*}
     */
    const handleOpenURL = (event) => {
        console.log(event.url);
        const route = event.url.replace(/.*?:\/\//g, '');
        console.log(route);
    };
    const [password1, setPassword] = React.useState('');
    React.useEffect(() => {
        Linking.addEventListener('url', handleOpenURL);
        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        };
    }, [navigation]);
    return (
        <ScrollView style={{backgroundColor: Colors.bgColor}}>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 30, color: 'red', fontFamily: 'DINAlternate-Bold'}}>88888%</Text>
                <Text>{userInfo.toJS().name}11111111</Text>
                <Image
                    source={{
                        uri: 'https://static.licaimofang.com/wp-content/uploads/2020/12/双旦活动弹窗图带按钮.jpg',
                    }}
                    style={{width: 200, height: 200}}
                />
                <PasswordModal
                    backdrop
                    ref={password}
                    onDone={(p) => {
                        setPassword(p);
                    }}
                />
                {/* <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'transparent',
                        },
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        },
                        draggableIcon: {
                            backgroundColor: '#000',
                        },
                    }}>
                    <View style={Style.modelPadding}>
                        <Text style={({fontSize: Font.textH2}, styles.desc_text)}>验证码已发送至138****8888</Text>
                        <View style={[Style.flexRowCenter, styles.wrap_input]}>
                            <TextInput style={styles.verify_input} placeholder="请输入验证码" />
                            <TouchableOpacity style={[styles.verify_button, Style.flexCenter]}>
                                <Text style={{color: '#fff', fontSize: text(12)}}>重新发送验证码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </RBSheet>
                */}
                <BottomModal ref={bottomModal} confirmText={'确认'}>
                    <Text>1111</Text>
                </BottomModal>
                <Button
                    title="底部弹窗"
                    onPress={() => {
                        verifyCodeModel.current.show();
                    }}
                />
                <VerifyCodeModal ref={verifyCodeModel} mobile={'12321'} />
                <Button
                    title="密码弹窗"
                    onPress={() => {
                        password.current.show();
                    }}
                />
                <Button
                    title="普通弹窗"
                    onPress={() => {
                        Modal.show({
                            confirm: false,
                            content: 'https://static.licaimofang.com/wp-content/uploads/2020/12/银行转稳健弹窗1211.png',
                        });
                    }}
                />
                <Button
                    title="图片弹窗"
                    onPress={() => {
                        Modal.show({
                            type: 'image',
                            imageUrl:
                                'https://static.licaimofang.com/wp-content/uploads/2020/12/银行转稳健弹窗1211.png',
                        });
                    }}
                />
                <Button
                    title="Toast提示"
                    onPress={() => {
                        Toast.show('This is a message');
                    }}
                />
                <Button title="Go to Sticky" onPress={() => navigation.navigate('StickyScreen')} />
                <Button
                    type="minor"
                    style={{margin: 10}}
                    title="Go to Details"
                    onPress={() => navigation.navigate('DetailScreen')}
                />
                <Button title="Go to Im" onPress={() => navigation.navigate('GesturePassword')} />
                <Button title="Go to LineChart" onPress={() => navigation.navigate('LineChart')} />
                <Button title="Dispatch" onPress={() => dispatch(update({is_dav: '哈哈哈', name: '眼'}))} />
                <Button title="DynamicAdjustment" onPress={() => navigation.navigate('DynamicAdjustment')} />
                <Button title="TradeProcessing" onPress={() => navigation.navigate('TradeProcessing')} />
                <Button
                    title="AssetsConfigDetail"
                    onPress={() => navigation.navigate('AssetsConfigDetail', {amount: '2000'})}
                />
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    desc_text: {
        color: '#555B6C',
        paddingBottom: text(12),
    },
    verify_input: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        height: text(50),
        borderTopLeftRadius: text(5),
        borderBottomLeftRadius: text(5),
        paddingLeft: text(20),
    },
    verify_button: {
        backgroundColor: '#EF8743',
        fontSize: Font.textH3,
        height: text(50),
        borderTopRightRadius: text(5),
        borderBottomRightRadius: text(5),
        paddingHorizontal: text(10),
    },
    wrap_input: {
        width: '100%',
        height: text(50),
    },
});
export default HomeScreen;
