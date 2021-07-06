/*
 * @Date: 2021-07-05 16:52:03
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-06 10:39:03
 * @Description:组合详情页蒙层
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {deviceWidth, px} from '../../utils/appUtil';
import http from '../../services';
import {Font, Colors} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';

export default function PortfolioMask({navigation}) {
    const [data, setData] = useState({});
    const jump = useJump();
    useEffect(() => {
        http.get('/portfolio/mask/detail/20210601?plan_id=1').then((res) => {
            setData(res.result);
            navigation.setOptions({title: res.result.title});
        });
    }, [navigation]);
    return (
        <View style={{flex: 1}}>
            {data?.ratio_info?.length > 0 ? (
                <View style={{backgroundColor: '#fff', paddingVertical: px(10)}}>
                    <Text style={styles.amount_sty}>{data.ratio_info[1]}</Text>
                    <Text style={styles.radio_sty}>{data.ratio_info[0]}</Text>
                </View>
            ) : null}

            <FastImage
                source={require('../../assets/img/find/portfolioMask.png')}
                resizeMode={FastImage.resizeMode.stretch}
                style={{width: deviceWidth, flex: 1}}
            />
            {data?.button ? (
                <Button
                    style={{position: 'absolute', width: deviceWidth - px(32), left: px(16), bottom: px(80)}}
                    title={data.button.text}
                    onPress={() => {
                        global.LogTool('portfolioRiskEvaStart');
                        jump(data.button.url, 'replace');
                    }}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    amount_sty: {
        color: Colors.red,
        fontSize: px(34),
        lineHeight: px(40),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    radio_sty: {
        color: Colors.darkGrayColor,
        fontSize: Font.pxH3,
        lineHeight: px(17),
        textAlign: 'center',
        marginTop: px(4),
    },
});
