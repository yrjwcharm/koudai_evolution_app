/*
 * @Date: 2021-02-18 10:46:19
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-23 16:31:12
 * @Description: 交易密码管理
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';

const TradePwdManagement = ({navigation}) => {
    const [data, setData] = useState([
        [
            {
                title: '修改密码',
                type: 'link',
                jump_to: 'ModifyTradePwd',
            },
            {
                title: '找回密码',
                type: 'link',
                jump_to: 'ForgotTradePwd',
            },
        ],
    ]);

    const onPress = useCallback(
        (item) => {
            navigation.navigate(item.jump_to);
        },
        [navigation]
    );

    return (
        <ScrollView style={styles.container}>
            {data.map((part, i) => {
                return (
                    <View key={i} style={styles.box}>
                        {part.map((item, index) => {
                            if (item.type === 'link') {
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

export default TradePwdManagement;
