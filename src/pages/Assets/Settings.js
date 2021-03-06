/*
 * @Date: 2021-02-03 11:26:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-05 15:22:45
 * @Description: 个人设置
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Http from '../../services/index.js';
import {useJump} from '../../components/hooks';
import {Modal, ShareModal} from '../../components/Modal';
import Storage from '../../utils/storage';
import Toast from '../../components/Toast';

const Settings = ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState([]);
    const shareModal = useRef(null);

    const onPress = useCallback(
        (item) => {
            if (item.type === 'bind_invitor') {
                Alert.prompt('填写邀请码', '', [
                    {
                        text: '取消',
                        onPress: () => console.log('取消'),
                    },
                    {
                        text: '确定',
                        onPress: () => {
                            Http.post('/polaris/bind_invite_code/20210101', {
                                invited_code: '202088',
                            }).then((res) => {
                                Toast.show('邀请码绑定成功');
                            });
                        },
                    },
                ]);
            } else if (item.type === 'share_mofang') {
                shareModal.current.show();
            } else if (item.type === 'logout') {
                Modal.show({
                    title: '退出登录',
                    content: '退出后，日收益和投资产品列表将不再展示，是否确认退出？',
                    confirm: true,
                    confirmCallBack: () => {
                        // Alert.alert('退出登录');
                        Storage.delete('loginStatus');
                        navigation.navigate({name: 'Login'});
                    },
                });
                // Alert.alert('退出登录', '退出后，日收益和投资产品列表将不再展示，是否确认退出？', [
                //     {
                //         text: '取消',
                //         onPress: () => console.log('取消'),
                //     },
                //     {
                //         text: '确定',
                //         onPress: () => console.log('确定'),
                //     },
                // ]);
            } else {
                jump(item.url);
            }
        },
        [navigation, jump]
    );

    useEffect(() => {
        Http.get('mapi/config/20210101').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index) => {
                    return (
                        <View key={index} style={styles.partBox}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.text} style={[i === 0 ? {} : styles.borderTop]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[Style.flexBetween, {paddingVertical: text(18)}]}
                                            onPress={() => onPress(item)}>
                                            <Text style={styles.title}>{item.text}</Text>
                                            <View style={Style.flexRow}>
                                                {item.desc ? (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            {marginRight: text(8), color: Colors.lightGrayColor},
                                                        ]}>
                                                        {item.desc}
                                                    </Text>
                                                ) : null}
                                                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
            <ShareModal ref={shareModal} title={'分享理财魔方'} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    partBox: {
        marginTop: Space.marginVertical,
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
});

export default Settings;
