/*
 * @Date: 2021-02-03 11:26:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-18 11:42:20
 * @Description: 个人设置
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const Settings = ({navigation}) => {
    const [data, setData] = useState([
        [
            {key: '密码管理', val: '', type: 'link', jump_to: 'PasswordManagement'},
            {key: '账号注销', val: '', type: 'link', jump_to: ''},
        ],
        [
            {key: '邀请码', val: '', type: 'link', jump_to: ''},
            {key: '分享理财魔方', val: '', type: 'link', jump_to: ''},
        ],
        [
            {key: '联系我们', val: '', type: 'link', jump_to: 'ContactUs'},
            {key: '鼓励一下', val: '', type: 'link', jump_to: ''},
            {key: '投诉建议', val: '', type: 'link', jump_to: 'ComplaintsAdvices'},
            {key: '关于理财魔方', val: '当前版本：5.2.9', type: 'link', jump_to: ''},
            {key: '版本更新', val: '', type: 'link', jump_to: ''},
        ],
        [{key: '安全退出', val: '', type: 'link', jump_to: ''}],
    ]);

    const onPress = useCallback(
        (item) => {
            navigation.navigate(item.jump_to);
        },
        [navigation]
    );
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index) => {
                    return (
                        <View key={index} style={styles.partBox}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.key} style={[i === 0 ? {} : styles.borderTop]}>
                                        <TouchableOpacity
                                            style={[Style.flexBetween, {paddingVertical: text(18)}]}
                                            onPress={() => onPress(item)}>
                                            <Text style={styles.title}>{item.key}</Text>
                                            <View style={Style.flexRow}>
                                                {item.val ? (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            {marginRight: text(8), color: Colors.lightGrayColor},
                                                        ]}>
                                                        {item.val}
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
