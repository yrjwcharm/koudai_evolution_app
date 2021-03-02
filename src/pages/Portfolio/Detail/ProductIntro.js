/*
 * @Author: xjh
 * @Date: 2021-03-01 17:09:55
 * @Description:产品说明书
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-01 17:21:06
 */
import React, {useState} from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import FitImage from 'react-native-fit-image';
import Http from '../../../services';
import {px as text} from '../../../utils/appUtil';
export default function ProductIntro() {
    const [data, setData] = useState([
        'https://static.licaimofang.com/wp-content/uploads/2021/03/1.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/03/2.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/03/3.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/03/4.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/03/5.png',
    ]);
    return (
        <ScrollView style={[styles.container]} scrollIndicatorInsets={{right: 1}}>
            {data.length > 0 &&
                data?.map((item, index) => {
                    return <FitImage key={index} source={{uri: item}} />;
                })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topRightBtn: {
        flex: 1,
        width: text(36),
        marginRight: text(8),
    },
});
