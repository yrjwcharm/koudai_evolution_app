/*
 * @Author: xjh
 * @Date: 2021-03-01 17:09:55
 * @Description:产品说明书
 * @LastEditors: dx
 * @LastEditTime: 2021-04-28 18:20:12
 */
import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Image} from 'react-native';
import FitImage from 'react-native-fit-image';
import FastImage from 'react-native-fast-image';
import Http from '../../../services';
import {px as text, deviceWidth} from '../../../utils/appUtil';
export default function ProductIntro({route}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        Http.get('/portfolio/introduce/20210101', {
            upid: route.params.upid,
        }).then((res) => {
            res.result?.image_list?.map((item) => {
                Image.getSize(item, (w, h) => {
                    const height = Math.floor(h / (w / deviceWidth));
                    setData((prev) => {
                        return [...prev, {url: item, height}];
                    });
                });
            });
        });
    }, [route.params]);
    return (
        <ScrollView style={[styles.container]} scrollIndicatorInsets={{right: 1}}>
            {data.length > 0 &&
                data?.map((item, index) => {
                    return (
                        <FastImage
                            key={index}
                            source={{uri: item.url}}
                            style={{width: deviceWidth, height: item.height}}
                        />
                    );
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
