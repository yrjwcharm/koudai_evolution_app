/*
 * @Date: 2021-03-10 15:02:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-19 18:05:52
 * @Description: 账号注销
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import Modal from '../../components/Modal/Modal';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, handlePhone} from '../../utils/appUtil';
import http from '../../services';
import HTML from '../../components/RenderHtml';
import Toast from '../../components/Toast';
import Storage from '../../utils/storage';
import {getUserInfo} from '../../redux/actions/userInfo';
import {VerifyCodeModal} from '../../components/Modal';

const AccountRemove = ({navigation, route}) => {
    const userInfo = useSelector((store) => store.userInfo);
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const codeModal = useRef(null);

    const onPress = () => {
        if (data?.avail) {
            Modal.show({
                confirm: true,
                confirmCallBack: () => {
                    getCode(data?.mobile);
                },
                title: data?.pop?.title,
                content: data?.pop?.content,
            });
        } else {
            Modal.show({
                title: data?.pop?.title,
                content: data?.pop?.content,
            });
        }
    };
    const getCode = useCallback((mobile) => {
        if (!mobile) {
            return false;
        }
        http.post('/passport/send_verify_code/20210101', {
            mobile,
            operation: 'passport_destroy',
        }).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                setTimeout(() => {
                    codeModal.current.show();
                }, 2000);
            }
        });
    }, []);
    const onChangeText = useCallback(
        (value) => {
            if (value.length === 6) {
                http.post('/passport/account/destroy/20210101', {
                    verify_code: value,
                }).then((res) => {
                    Toast.show(res.message);
                    if (res.code === '000000') {
                        codeModal.current.hide();
                        Storage.delete('loginStatus');
                        dispatch(getUserInfo());
                        navigation.navigate('Home');
                    }
                });
            }
        },
        [dispatch, navigation]
    );

    useEffect(() => {
        http.get('/passport/account/destroy/check/20210101').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '账号注销'});
                setData(res.result);
            }
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <VerifyCodeModal
                ref={codeModal}
                desc={`验证码已发送至${handlePhone(data?.mobile)}`}
                onChangeText={onChangeText}
                getCode={getCode}
                phone={data?.mobile}
            />
            <View style={Style.flexCenter}>
                <Image source={require('../../assets/personal/warn.png')} style={styles.warn} />
            </View>
            <View style={[Style.flexCenter, {borderBottomWidth: Space.borderWidth, borderColor: Colors.borderColor}]}>
                <Text style={styles.bigTitle}>{'账号注销'}</Text>
                <Text style={[styles.desc, styles.tips]}>{'当您决定注销账号时，请阅读以下内容'}</Text>
            </View>
            {data?.body?.map((item, index) => {
                return (
                    <View key={item + index}>
                        <Text style={[styles.title, {marginVertical: text(8)}]}>{item.title}</Text>
                        <HTML html={item.content} style={styles.desc} />
                    </View>
                );
            })}
            {Object.keys(data).length > 0 && (
                <Button title={'申请注销'} style={{...styles.btn, marginBottom: insets.bottom}} onPress={onPress} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: Space.padding,
    },
    warn: {
        marginVertical: Space.padding,
        width: text(50),
        height: text(50),
    },
    bigTitle: {
        fontSize: text(20),
        color: Colors.red,
        fontWeight: '500',
    },
    desc: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.lightGrayColor,
    },
    tips: {
        marginTop: text(8),
        marginBottom: text(16),
        color: Colors.lightBlackColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    btn: {
        marginTop: Space.marginVertical,
        marginHorizontal: text(20),
    },
});

export default AccountRemove;
