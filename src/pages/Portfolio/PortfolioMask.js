/*
 * @Date: 2021-07-05 16:52:03
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-05-10 14:43:55
 * @Description:组合详情页蒙层
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {deviceWidth, px, isIphoneX} from '../../utils/appUtil';
import http from '../../services';
import {Font, Colors} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';

export default function PortfolioMask({navigation, route}) {
    const [data, setData] = useState({});
    const jump = useJump();
    useEffect(() => {
        http.get('/portfolio/mask/detail/20210601', {fr: route.params?.fr, plan_id: 1}).then((res) => {
            setData(res.result);
            navigation.setOptions({title: res.result.title});
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <View style={styles.con}>
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
                    style={{
                        position: 'absolute',
                        width: deviceWidth - px(32),
                        left: px(16),
                        bottom: isIphoneX() ? 34 + px(80) : px(80),
                    }}
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
    con: {flex: 1, backgroundColor: '#fff'},
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
