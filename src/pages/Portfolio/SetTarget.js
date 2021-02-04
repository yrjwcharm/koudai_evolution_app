/*
 * @Author: xjh
 * @Date: 2021-02-01 11:07:50
 * @Description:开启我的计划
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-04 16:00:59
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Slider from './components/Slider';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import {Button} from '../../components/Button';
const deviceWidth = Dimensions.get('window').width;
export default function SetTarget(props) {
    const [value, SetValue] = useState(2);
    const AfterChange = (val) => {
        SetValue(val);
    };
    useEffect(() => {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/position/goal_detail/20210101').then((res) => {
            console.log(res);
        });
    }, [props.navigation]);
    return (
        <View style={styles.container}>
            <Text style={{textAlign: 'center', color: Colors.defaultColor}}>目标受益率</Text>
            <Text style={styles.ratio_sty}>15.00%</Text>
            <Text style={styles.desc_sty}>根据对应指数历史数据，参考实现概率80%</Text>
            <View style={{marginVertical: text(24)}}>
                <Slider
                    height={40}
                    min={0}
                    max={30}
                    defaultValue={0}
                    step={1}
                    maximumTrackTintColor="#CCCCCC"
                    minimumTrackTintColor="#0051CC"
                    processHeight={6}
                    style={{marginTop: 40}}
                    onAfterChange={AfterChange}
                    thumbSize={25}
                    width={deviceWidth - text(84)}
                />
            </View>
            <Text style={styles.tips_sty}>
                风险提示：目标实现概率、产品收益率随市场风险提示：目标实现概率、产品收益率随市场
            </Text>
            <Button title="确认" style={{marginTop: text(30)}} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop: text(25),
        paddingHorizontal: text(42),
    },
    ratio_sty: {
        color: '#E13D37',
        fontSize: text(32),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
        marginTop: text(8),
        marginBottom: text(12),
    },
    desc_sty: {
        color: '#545968',
        fontSize: text(12),
        textAlign: 'center',
    },
    tips_sty: {
        fontSize: text(12),
        textAlign: 'left',
        lineHeight: text(16),
        color: '#9AA1B2',
    },
});
