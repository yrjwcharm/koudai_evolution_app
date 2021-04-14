/*
 * @Date: 2021-04-14 17:43:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-14 20:35:41
 * @Description:保险
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {deviceWidth, px, isIphoneX} from '../../../utils/appUtil';
import {FixedButton} from '../../../components/Button';
import {useJump} from '../../../components/hooks';
import http from '../../../services';
const DetailInsurance = ({navigation}) => {
    const [data, setData] = useState();
    const [scale, setScale] = useState();
    const jump = useJump();
    useEffect(() => {
        http.get('/insurance/detail/20210101').then((res) => {
            setData(res.result);
            navigation.setOptions({title: res.result.title});
            Image.getSize(res.result.image, (w, h) => {
                setScale(h / w);
            });
        });
    }, []);
    return (
        <>
            <ScrollView style={{marginBottom: isIphoneX() ? 80 : px(48)}}>
                {scale && (
                    <FastImage
                        style={{width: deviceWidth, height: deviceWidth * scale}}
                        resizeMode="contain"
                        source={{uri: data?.image}}
                    />
                )}
            </ScrollView>
            {data?.button && (
                <FixedButton
                    onPress={() => {
                        jump(data?.button?.url);
                    }}
                    title={data?.button?.text}
                />
            )}
        </>
    );
};

export default DetailInsurance;

const styles = StyleSheet.create({});
