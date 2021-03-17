/*
 * @Date: 2021-02-18 10:46:19
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-17 19:16:48
 * @Description: 密码管理
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import storage from '../../utils/storage';

const PasswordManagement = ({navigation}) => {
    const [open, setOpen] = useState(false);
    const [data] = useState([
        [
            {
                title: '登录密码修改',
                type: 'link',
                jump_to: 'ResetLoginPwd',
            },
            {
                title: '手势密码开启',
                type: 'switch',
                // jump_to: 'SetGestureCode',
            },
            {
                title: '交易密码修改',
                type: 'link',
                jump_to: 'TradePwdManagement',
            },
            {
                title: '手势密码修改',
                type: 'link',
                jump_to: 'GesturePassword',
                params: {option: 'modify'},
                hide: 'true',
            },
        ],
        [
            {
                title: '账号注销',
                type: 'link',
                jump_to: 'AccountRemove',
            },
        ],
    ]);

    const onPress = useCallback(
        (item) => {
            navigation.navigate(item.jump_to, item.params || {});
        },
        [navigation]
    );
    const onToggle = useCallback(() => {
        setOpen((prev) => !prev);
        if (!open) {
            // Toast.show('开启手势密码');
            storage.get('gesturePwd').then((res) => {
                if (res) {
                    storage.save('openGesturePwd', true);
                } else {
                    navigation.navigate('GesturePassword', {option: 'firstSet'});
                }
            });
        } else {
            // Toast.show('关闭手势密码');
            storage.save('openGesturePwd', false);
        }
    }, [navigation, open]);

    useFocusEffect(
        useCallback(() => {
            storage.get('openGesturePwd').then((res) => {
                res !== undefined ? setOpen(res) : setOpen(false);
            });
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            {data.map((part, i) => {
                return (
                    <View key={i} style={styles.box}>
                        {part.map((item, index) => {
                            if (item.type === 'link') {
                                if (item.hide === 'true' && !open) {
                                    return null;
                                }
                                return (
                                    <View
                                        key={`item${index}`}
                                        style={{
                                            borderTopWidth: index === 0 ? 0 : Space.borderWidth,
                                            borderColor: Colors.borderColor,
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => onPress(item)}
                                            style={[Style.flexBetween, styles.item, {borderTopWidth: 0}]}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            } else if (item.type === 'switch') {
                                return (
                                    <View
                                        key={`item${index}`}
                                        style={[
                                            Style.flexBetween,
                                            styles.item,
                                            index === 0 ? {borderTopWidth: 0} : {},
                                        ]}>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Switch
                                            ios_backgroundColor={'#CCD0DB'}
                                            onValueChange={onToggle}
                                            thumbColor={'#fff'}
                                            trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                            value={open}
                                        />
                                    </View>
                                );
                            }
                        })}
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    box: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    item: {
        paddingVertical: Space.padding,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
});

export default PasswordManagement;
