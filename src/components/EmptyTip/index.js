/*
 * @Date: 2021-01-29 18:52:23
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 11:08:51
 * @Description: 数据空的时候提示组件
 */
import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Font} from '../../common/commonStyle';
const image = require('../../assets/img/emptyTip/empty.png');
const EmptyTip = (props) => {
    const {children, text = '暂无数据', img = image, style, textStyle, imageStyle, type = 'page', desc = ''} = props;
    return (
        <View style={[styles.con, style]}>
            <Image style={[styles.image, imageStyle]} source={img} />
            <Text style={[styles.text, type === 'page' ? styles.title : {}, textStyle]}> {text} </Text>
            {desc ? <Text style={styles.desc}>{desc}</Text> : null}
            {children}
        </View>
    );
};
const styles = StyleSheet.create({
    con: {
        alignItems: 'center',
        paddingTop: px(80),
    },
    image: {
        height: px(64),
        width: px(120),
    },
    text: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        marginTop: px(8),
        fontWeight: '500',
        color: Colors.descColor,
    },
    title: {
        marginTop: px(30),
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: '700',
        textAlign: 'center',
    },
    desc: {
        marginTop: px(2),
        fontSize: px(11),
        color: Colors.descColor,
    },
});

export default EmptyTip;
