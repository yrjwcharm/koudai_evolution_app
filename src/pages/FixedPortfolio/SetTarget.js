/*
 * @Author: xjh
 * @Date: 2021-02-01 11:07:50
 * @Description:开启我的计划
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-22 14:46:30
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
// import Slider from '@react-native-community/slider';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Slider from 'react-native-slider';
import Http from '../../services';
import {Button} from '../../components/Button';
import Toast from '../../components/Toast';
import Html from '../../components/RenderHtml';
const deviceWidth = Dimensions.get('window').width;
var params;
export default function SetTarget({route, navigation}) {
    const [data, setData] = useState({});
    const [num, setNum] = useState();
    // const [target, setTarget] = useState('');
    const onChange = (val) => {
        params = {poid: route.params.poid, target: val / 100};
        init(params);
    };
    useEffect(() => {
        params = {poid: route.params.poid};
        init(params);
    }, [init]);
    const init = useCallback(() => {
        Http.get('/trade/fix_invest/target_info/20210101', {
            ...params,
        }).then((res) => {
            setData(res.result);
            setNum(res.result.target_info.default * 100);
        });
    }, []);
    const confirmData = () => {
        Http.get('/trade/set/invest_target/20210101', {
            target: num / 100,
            possible: data.target_info.possible,
            poid: route.params.poid,
        }).then((res) => {
            // Toast.show(res.message);
            // setTarget(res.result.target_id);
            navigation.goBack();
        });
    };
    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', color: Colors.defaultColor}}>{data.target_info.title}</Text>
                    <Text style={styles.ratio_sty}>{Number(num).toFixed(2)}%</Text>
                    <Html style={styles.desc_sty} html={data.target_info.desc} />
                    <View style={{marginVertical: text(24)}}>
                        <Slider
                            value={num}
                            onSlidingComplete={onChange}
                            maximumValue={data.target_info.max * 100}
                            minimumValue={data.target_info.min * 100}
                            step={1}
                            style={styles.slider}
                            minimumTrackTintColor={'#0051CC'}
                            maximumTrackTintColor={'#CCCCCC'}
                            thumbTintColor={'#ffffff'}
                            thumbStyle={{
                                width: 30,
                                height: 30,
                                borderRadius: 30,
                                borderWidth: text(5),
                                borderColor: '#0051CC',
                            }}
                        />
                    </View>
                    <Text style={styles.tips_sty}>{data.notice}</Text>
                    <Button title={data.button.text} style={{marginTop: text(30)}} onPress={confirmData} />
                </View>
            )}
        </>
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
    slider: {
        width: deviceWidth - text(84),
    },
});
