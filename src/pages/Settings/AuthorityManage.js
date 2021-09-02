/*
 * @Date: 2021-09-02 14:18:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-02 15:12:08
 * @Description:权限管理
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {px as text, isIphoneX, px} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
const AuthorityManage = () => {
    return (
        <View style={styles.con}>
            <TouchableOpacity activeOpacity={0.8} style={[Style.flexBetween, {height: text(56)}]}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>开启消息通知</Text>
                <View style={Style.flexRow}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: Colors.lightGrayColor,
                            },
                        ]}>
                        1231
                    </Text>

                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default AuthorityManage;

const styles = StyleSheet.create({
    con: {flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)},
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
});
