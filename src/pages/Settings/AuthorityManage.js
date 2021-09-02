/*
 * @Date: 2021-09-02 14:18:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-02 14:56:46
 * @Description:权限管理
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
const AuthorityManage = () => {
    return (
        <View>
            <TouchableOpacity activeOpacity={0.8} style={[Style.flexBetween, {height: text(56)}]}>
                <Text style={styles.title}>哈哈哈</Text>
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
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
});
