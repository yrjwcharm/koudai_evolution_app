/*
 * @Date: 2021-02-04 11:39:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-23 10:31:04
 * @Description: 个人资料
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const Profile = ({navigation}) => {
    const [data, setData] = useState([
        [
            {
                key: '头像',
                val: 'https://static.licaimofang.com/wp-content/uploads/2020/10/schoolseason_course4.png',
                type: 'img',
            },
            {
                key: '手机号',
                val: '180****9999',
                type: 'text',
            },
            {
                key: '绑定微信',
                val: '去绑定',
                type: 'link',
                jump_to: '',
            },
            {
                key: '身份认证',
                val: '已认证',
                type: 'text',
                color: Colors.green,
            },
            {
                key: '银行卡管理',
                val: '6张',
                type: 'link',
                jump_to: 'BankCardList',
            },
        ],
        [
            {
                key: '风险等级',
                val: '稳健型',
                type: 'link',
                desc: '已过期，请重新测试',
                jump_to: '',
            },
            {
                key: '家庭可投资资产',
                val: '10-50万',
                type: 'link',
                jump_to: '',
            },
            {
                key: '月收入',
                val: '10,000',
                type: 'link',
                jump_to: '',
            },
            {
                key: '月支出',
                val: '5,000',
                type: 'link',
                jump_to: '',
            },
            {
                key: '投资经验',
                val: '3年',
                type: 'link',
                jump_to: '',
            },
            {
                key: '投资偏好',
                val: '收益10%，风险12%',
                type: 'text',
            },
        ],
    ]);

    const onPress = useCallback(
        (item) => {
            navigation.navigate(item.jump_to);
        },
        [navigation]
    );

    useEffect(() => {
        http.get('/user_info/20210101', {}).then((res) => {
            console.log(res);
        });
    }, []);
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index) => {
                    return (
                        <View key={`part${index}`} style={styles.partBox}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.key} style={[i === 0 ? {} : styles.borderTop]}>
                                        {item.type === 'link' ? (
                                            <TouchableOpacity
                                                style={[Style.flexBetween, {height: text(56)}]}
                                                onPress={() => onPress(item)}>
                                                <Text style={styles.title}>{item.key}</Text>
                                                <View style={Style.flexRow}>
                                                    {item.desc ? (
                                                        <Text style={[styles.val, styles.desc]}>{item.desc}</Text>
                                                    ) : null}
                                                    {item.val ? (
                                                        <Text
                                                            style={[styles.title, styles.val, {marginRight: text(12)}]}>
                                                            {item.val}
                                                        </Text>
                                                    ) : null}
                                                    <Icon
                                                        name={'angle-right'}
                                                        size={20}
                                                        color={Colors.lightGrayColor}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={[Style.flexBetween, {height: text(56)}]}>
                                                <Text style={styles.title}>{item.key}</Text>
                                                {item.type === 'img' ? (
                                                    <Image source={{uri: item.val}} style={styles.avatar} />
                                                ) : (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            styles.val,
                                                            item.color ? {color: item.color} : {},
                                                        ]}>
                                                        {item.val}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
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
        color: Colors.descColor,
    },
    val: {
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    desc: {
        fontSize: Font.textH3,
        color: Colors.red,
        marginRight: text(12),
    },
    avatar: {
        width: text(32),
        height: text(32),
        borderRadius: text(16),
    },
});

export default Profile;
