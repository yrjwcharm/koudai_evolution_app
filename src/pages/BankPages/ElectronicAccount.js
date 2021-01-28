/*
 * @Author: xjh
 * @Date: 2021-01-25 19:19:56
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-26 11:05:08
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
export default function ElectronicAccount() {
    const [num, setNum] = useState('6579976588086535678');
    const list = ['更换绑定银行卡', '跟换手机号', '更新身份证信息'];
    useEffect(() => {
        setNum(num.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, '$1    '));
    }, []);
    const accountBtn = (url) => {
        props.navigation.navigate(url);
    };
    return (
        <View style={Style.containerPadding}>
            <FastImage
                style={styles.bank_bg_sty}
                source={{
                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/zhaoshang.png',
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.fixed_sty}>
                <View style={[Style.flexRow, styles.fixed_wrap]}>
                    <Text style={styles.fixed_title_sty}>湖南三湘银行</Text>
                    <TouchableOpacity>
                        <Text style={styles.copy_sty}>复制卡号</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.bank_no_sty}>{num}</Text>
            </View>
            <TouchableOpacity style={[Style.flexRow, styles.account_wrap_sty]} onPress={accountBtn}>
                <Text style={styles.account_sty}>我的电子账户</Text>
                <View style={[Style.flexRow, {minWidth: text(100)}]}>
                    <Text style={[styles.account_sty, {textAlign: 'right', marginRight: text(5)}]}>123.334.22</Text>
                    <AntDesign name={'right'} color={'#4E556C'} size={12} />
                </View>
            </TouchableOpacity>
            <View style={styles.card_wrap_sty}>
                {list.map((_item, _index) => {
                    return (
                        <TouchableOpacity style={[Style.flexRow]} onPress={accountBtn} key={_index + '_item'}>
                            <View style={[styles.list_wrap_sty, Style.flexRow]}>
                                <Text style={styles.list_title_sty}>{_item}</Text>
                                <AntDesign name={'right'} color={'#4E556C'} size={12} />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={{marginTop: text(12)}}>
                <Text style={styles.gray_title_sty}>什么是电子账户？</Text>
                <Text style={styles.gray_content_sty}>
                    电子账户是用户自己在银行中开设的二类电子电子账户是用户自己在银行中开设的二类电子
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    bank_bg_sty: {
        height: text(150),
    },
    fixed_sty: {
        position: 'relative',
    },
    fixed_title_sty: {
        fontSize: Font.textH1,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
    },
    fixed_wrap: {
        marginTop: text(-215),
        marginLeft: text(70),
    },
    copy_sty: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: text(6),
        paddingVertical: text(5),
        borderRadius: text(4),
        fontWeight: 'bold',
        marginRight: text(16),
    },
    bank_no_sty: {
        color: '#fff',
        fontFamily: Font.numFontFamily,
        marginTop: text(-60),
        fontSize: text(22),
        marginLeft: text(32),
    },
    account_wrap_sty: {
        padding: text(15),
        backgroundColor: '#fff',
        marginTop: text(12),
        borderRadius: text(10),
    },
    list_title_sty: {
        color: Colors.defaultFontColor,
        flex: 1,
    },
    account_sty: {
        color: Colors.defaultFontColor,
        flex: 1,
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        fontSize: text(16),
    },
    list_wrap_sty: {
        paddingVertical: text(20),
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
    card_wrap_sty: {
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
        marginTop: text(12),
        borderRadius: text(10),
    },
    gray_title_sty: {
        color: '#9095A5',
        marginBottom: text(5),
    },
    gray_content_sty: {
        color: '#9095A5',
        fontSize: text(12),
        lineHeight: text(16),
    },
});
