/*
 * @Description: 创作者中心首页
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:22
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getData} from './services';

const CreatorCenterIndex = () => {
    const [data, setData] = useState();

    useEffect(() => {
        getData().then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text>123</Text>
        </View>
    );
};

export default CreatorCenterIndex;

const styles = StyleSheet.create({
    container: {},
});
