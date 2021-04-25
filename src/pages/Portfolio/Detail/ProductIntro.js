/*
 * @Author: xjh
 * @Date: 2021-03-01 17:09:55
 * @Description:产品说明书
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-20 16:18:44
 */
import React, {useState, useEffect} from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import FitImage from 'react-native-fit-image';
import Http from '../../../services';
import {px as text} from '../../../utils/appUtil';
export default function ProductIntro({route}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        Http.get('/portfolio/introduce/20210101', {
            upid: route.params.upid,
        }).then((res) => {
            setData(res.result.image_list);
        });
    }, []);
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
