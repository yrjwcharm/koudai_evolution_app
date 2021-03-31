/*
 * @Date: 2021-01-29 18:52:23
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-31 18:32:17
 * @Description: 数据空的时候提示组件
 */
import React, {PureComponent} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {px} from '../../utils/appUtil';
const image = require('../../assets/img/emptyTip/empty.png');
const index = (props) => {
    const {text = '暂无数据', img = image, style} = props;
    return (
        <View style={[styles.con, {...style}]}>
            <Image style={styles.image} source={img} />
            <Text style={styles.text}> {text} </Text>
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
        fontSize: px(12),
        marginTop: px(8),
        fontWeight: '500',
        color: '#545968',
    },
});

export default index;
