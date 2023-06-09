/*
 * @Author: xjh
 * @Date: 2021-03-01 17:09:55
 * @Description:产品说明书
 * @LastEditors: dx
 * @LastEditTime: 2021-08-05 15:20:45
 */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Http from '../../../services';
import {px as text, deviceWidth, deviceHeight} from '../../../utils/appUtil';
import {Colors, Style} from '../../../common/commonStyle';
import {cloneDeep} from 'lodash';
export default function ProductIntro({route}) {
    const [data, setData] = useState({});
    const [length, setLength] = useState(0);

    useEffect(() => {
        Http.get('/portfolio/introduce/20210101', {
            upid: route.params.upid,
        }).then((res) => {
            if (res.code === '000000') {
                setLength(res.result?.image_list?.length);
                res.result?.image_list?.map((item, index) => {
                    Image.getSize(item, (w, h) => {
                        const height = Math.floor(h / (w / deviceWidth));
                        setData((prev) => {
                            const next = cloneDeep(prev);
                            next[index] = {url: item, height};
                            return next;
                        });
                    });
                });
            }
        });
    }, [route.params]);

    return (
        <ScrollView style={[styles.container]} scrollIndicatorInsets={{right: 1}}>
            {Object.values(data).length > 0 && Object.values(data).length === length ? (
                Object.values(data)?.map?.((item, index) => {
                    return (
                        <FastImage
                            key={index}
                            source={{uri: item.url}}
                            style={{width: deviceWidth, height: item.height}}
                        />
                    );
                })
            ) : (
                <View style={{width: deviceWidth, height: deviceHeight, ...Style.flexCenter}}>
                    <ActivityIndicator color={Colors.brandColor} />
                </View>
            )}
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
