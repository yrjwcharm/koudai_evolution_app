/*
 * @Date: 2021-02-18 09:56:37
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-25 11:24:38
 * @Description: 联系我们
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import {Modal} from '../../components/Modal';
import * as WeChat from 'react-native-wechat-lib';

const ContactUs = ({navigation}) => {
    const [data, setData] = useState({});

    const onPress = (item) => {
        global.LogTool('click', item.type);
        if (item.type === 'online') {
            navigation.navigate('IM');
        } else if (item.type === 'phone') {
            const url = `tel:${item.value}`;
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (!supported) {
                        return Toast.show(`您的设备不支持该功能，请手动拨打 ${item.value}`);
                    }
                    return Linking.openURL(url);
                })
                .catch((err) => Alert(err));
        } else {
            Clipboard.setString(item.value);
            Modal.show({
                confirm: true,
                content: `微信公众账号(${item.value})已经复制成功`,
                confirmText: '去粘贴',
                confirmCallBack: () => {
                    WeChat.isWXAppInstalled().then((isInstalled) => {
                        if (isInstalled) {
                            try {
                                WeChat.openWXApp();
                            } catch (e) {
                                if (e instanceof WeChat.WechatError) {
                                    console.error(e.stack);
                                } else {
                                    throw e;
                                }
                            }
                        } else {
                            Toast.show('请安装微信');
                        }
                    });
                },
                title: '关注微信公众号',
            });
        }
    };

    useEffect(() => {
        http.get('/mapi/contact/us/20210101').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '联系我们'});
                setData(res.result);
            }
        });
    }, [navigation]);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{'您有问题？'}</Text>
                <Text style={styles.title}>{'欢迎联系我们'}</Text>
            </View>
            {data.service?.map((item, index) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={index}
                        style={[Style.flexRow, styles.contactBox]}
                        onPress={() => onPress(item)}>
                        <View style={[Style.flexRow, {flex: 1, marginRight: text(18)}]}>
                            <Image source={{uri: item.icon}} style={styles.icon} />
                            <View style={{flex: 1}}>
                                <Text style={[styles.itemTitle, {marginBottom: text(4)}]}>{item.text}</Text>
                                <Text style={styles.itemDesc}>{item.desc}</Text>
                            </View>
                        </View>
                        <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                    </TouchableOpacity>
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
    titleContainer: {
        paddingVertical: text(24),
        paddingHorizontal: text(20),
    },
    title: {
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    contactBox: {
        marginBottom: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        paddingVertical: text(20),
        paddingHorizontal: text(20),
        paddingRight: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    icon: {
        width: text(40),
        height: text(40),
        marginRight: text(18),
    },
    itemTitle: {
        fontSize: Font.textH1,
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    itemDesc: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.lightGrayColor,
    },
});

export default ContactUs;
