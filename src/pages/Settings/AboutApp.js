/*
 * @Date: 2021-09-02 14:24:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-14 11:13:39
 * @Description:关于理财魔方
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import {useJump} from '../../components/hooks';
import {baseURL} from '../../services/config';
import {useSelector} from 'react-redux';
import Storage from '../../utils/storage';
const AboutApp = () => {
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo);
    const [showCircle, setShowCircle] = useState(false);
    const [data, setData] = useState([
        {
            text: '去鼓励一下',
            type: 'encourage',
            url: {
                path: 'https://itunes.apple.com/cn/app/li-cai-mo-fang/id975987023?action=write-review',
                type: 2,
            },
        },
        {
            desc: '最新版本：6.2.0',
            text: '版本更新',
            type: 'update',
            url: {
                path: 'https://itunes.apple.com/cn/app/li-cai-mo-fang/id975987023',
                type: 2,
            },
        },
        {
            text: '功能介绍',
            type: 'features',
            url: {
                path: 'WebView',
                params: {link: `${baseURL.H5}/features`},
                type: 1,
            },
        },
        {
            text: '第三方软件协议',
            type: 'protocol',
            url: {
                path: 'WebView',
                params: {link: `${baseURL.H5}/agreement/0`},
                type: 1,
            },
        },
        {
            text: '经营证件及执照',
            type: 'licenses',
            url: {
                path: 'WebView',
                params: {link: `${baseURL.H5}/licenses`},
                type: 1,
            },
        },
    ]);
    useEffect(() => {
        Storage.get('version' + userInfo.toJS().latest_version + 'about_page').then((res) => {
            if (!res && global.ver < userInfo.toJS().latest_version) {
                setShowCircle(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={[Style.flexCenter, {paddingTop: text(50)}]}>
                <Image source={require('../../assets/img/logo-1024.png')} style={styles.logo} />
            </View>
            <Text style={styles.appName}>理财魔方</Text>
            <Text style={styles.version}>v6.1.2</Text>
            <View style={styles.partBox}>
                {data.map((item, i) => {
                    return (
                        <View key={item.text} style={[i === 0 ? {} : styles.borderTop]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[Style.flexBetween, {height: text(56)}]}
                                onPress={() => {
                                    jump(item.url);
                                    if (item.type === 'update') {
                                        setShowCircle(false);
                                        Storage.save('version' + userInfo.toJS().latest_version + 'about_page', true);
                                    }
                                }}>
                                <Text style={styles.title}>{item.text}</Text>
                                <View style={Style.flexRow}>
                                    {item.desc ? (
                                        <Text
                                            style={[
                                                styles.title,
                                                {
                                                    marginRight: text(8),
                                                    color: Colors.lightGrayColor,
                                                },
                                            ]}>
                                            {item.desc}
                                        </Text>
                                    ) : null}
                                    {item.type === 'update' && showCircle ? <View style={styles.redDot} /> : null}
                                    {item.url ? (
                                        <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
            <Text style={styles.protocols}>
                <Text
                    onPress={() =>
                        jump({
                            path: 'Agreement',
                            type: 1,
                            params: {
                                id: 20,
                            },
                        })
                    }>
                    《理财魔方用户协议》
                </Text>
                {`\n`}
                <Text
                    onPress={() =>
                        jump({
                            path: 'Agreement',
                            type: 1,
                            params: {
                                id: 32,
                            },
                        })
                    }>
                    《理财魔方隐私权政策》
                </Text>
            </Text>
            <Text
                style={[
                    styles.copyright,
                    {marginBottom: isIphoneX() ? text(20) + 34 : text(20)},
                ]}>{`理财魔方 版权所有\nCopyright ©2015-2021 Licaimofang. All Rights Reserved.`}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    logo: {
        width: text(63),
        height: text(63),
        borderRadius: text(17),
    },
    appName: {
        fontSize: text(22),
        lineHeight: text(31),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: text(12),
    },
    version: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.lightBlackColor,
        textAlign: 'center',
        marginTop: text(2),
    },
    partBox: {
        marginTop: text(40),
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
    redDot: {
        width: text(8),
        height: text(8),
        marginRight: text(8),
        borderRadius: text(8),
        backgroundColor: Colors.red,
    },
    protocols: {
        fontSize: Font.textSm,
        lineHeight: text(22),
        color: Colors.brandColor,
        textAlign: 'center',
        marginTop: text(80),
    },
    copyright: {
        fontSize: Font.textSm,
        lineHeight: text(20),
        color: Colors.lightGrayColor,
        textAlign: 'center',
        marginTop: text(16),
    },
});

export default AboutApp;
