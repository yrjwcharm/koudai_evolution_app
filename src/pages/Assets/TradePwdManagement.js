/*
 * @Date: 2021-02-18 10:46:19
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-25 15:40:32
 * @Description: 交易密码管理
 */
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Modal} from '../../components/Modal';
import {useSelector} from 'react-redux';

const TradePwdManagement = ({navigation}) => {
    const userInfo = useSelector((store) => store.userInfo);
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
            global.LogTool('click', item.jump_to);
            if (userInfo.toJS().has_account) {
                if (item.jump_to === 'ModifyTradePwd') {
                    if (userInfo.toJS().has_trade_pwd) {
                        navigation.navigate(item.jump_to);
                    } else {
                        Modal.show({
                            title: '您还未设置交易密码',
                            confirm: true,
                            confirmCallBack: () => navigation.navigate('SetTradePassword', {action: 'firstSet'}),
                            confirmText: '设置交易密码',
                            content: `为了交易安全，您必须先设置<font style="color: ${Colors.red};">数字交易密码</font>`,
                        });
                    }
                } else if (item.jump_to === 'ForgotTradePwd') {
                    navigation.navigate(item.jump_to);
                }
            } else {
                Modal.show({
                    title: '您还未开户',
                    confirm: true,
                    confirmCallBack: () => navigation.navigate('CreateAccount', {fr: 'TradePwdManagement'}),
                    confirmText: '开户',
                    content: '在您操作之前，需要先进行开户',
                });
            }
        },
        [navigation, userInfo]
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
                                            activeOpacity={0.8}
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
