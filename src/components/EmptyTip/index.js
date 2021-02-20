/*
 * @Date: 2021-01-29 18:52:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-03 20:49:50
 * @Description: 数据空的时候提示组件
 */
import React, {PureComponent} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {px} from '../../utils/appUtil';
const image = require('../../assets/img/emptyTip/empty.png');
const index = (props) => {
    const {text = '暂无数据'} = props;
    return (
        <View style={styles.con}>
            <Image style={styles.image} source={image} />
            <Text style={styles.text}> {text} </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    con: {
        alignItems: 'center',
        paddingTop: px(100),
        flex: 1,
    },
    image: {
        height: px(96),
        width: px(172),
    },
    text: {
        fontSize: px(16),
        marginTop: px(20),
        fontWeight: '500',
    },
});

export default index;
