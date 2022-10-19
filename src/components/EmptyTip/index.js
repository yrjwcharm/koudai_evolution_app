/*
 * @Date: 2021-01-29 18:52:23
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-17 16:45:24
 * @Description: 数据空的时候提示组件
 */
import React, {PureComponent} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Font} from '../../common/commonStyle';
const image = require('../../assets/img/emptyTip/empty.png');
const EmptyTip = (props) => {
    const {text = '暂无数据', img = image, style, textStyle, imageStyle, type = 'page', desc = ''} = props;
    return (
        <View style={[styles.con, style]}>
            <Image style={[styles.image, imageStyle]} source={img} />
            <Text style={[styles.text, type === 'page' ? styles.title : {}, textStyle]}> {text} </Text>
            {desc ? <Text style={styles.desc}>{desc}</Text> : null}
        </View>
    );
};
const styles = StyleSheet.create({
    con: {
        alignItems: 'center',
        paddingTop: px(100),
    },
    image: {
        height: px(96),
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
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: '500',
        textAlign: 'center',
    },
    desc: {
        marginTop: px(6),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
});

export default EmptyTip;
