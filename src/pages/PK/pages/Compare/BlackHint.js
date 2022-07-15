import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {useSelector} from 'react-redux';
import {px} from '~/utils/appUtil';
import {getPKWeightBetter} from '../../services';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';

const BlackHint = ({addHigh}) => {
    const pkProducts = useSelector((state) => state.pkProducts[global.pkEntry]);

    const [data, setData] = useState(null);

    const getData = () => {
        setData(null);
        getPKWeightBetter({fund_code_list: pkProducts.join()}).then((res) => {
            const {plateid, rec_json} = res.result?.better_fund || {};
            plateid && rec_json && global.LogTool({ctrl: pkProducts.join(), event: 'rec_show', plateid, rec_json});
            setData(res.result?.better_fund);
        });
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pkProducts]);

    useEffect(() => {
        DeviceEventEmitter.addListener('pkDetailBackHintRefresh', (e) => {
            getData();
        });
        return () => {
            DeviceEventEmitter.removeAllListeners('pkDetailBackHintRefresh');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return data ? (
        <Animatable.View animation={'fadeInUp'} duration={500} style={[styles.container]}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconWrap}
                onPress={() => {
                    setData(null);
                }}>
                <FastImage
                    style={styles.icon}
                    source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/cha.png'}}
                />
            </TouchableOpacity>
            <Text style={styles.text}>根据您的权重设置，有新的基金向您推荐</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btn}
                onPress={() => {
                    const {code, plateid, rec_json} = data;
                    setData(null);
                    addHigh(code);
                    global.LogTool({ctrl: pkProducts.join(), event: 'rec_click', plateid, rec_json});
                }}>
                <Text style={styles.btnText}>添加PK</Text>
            </TouchableOpacity>
        </Animatable.View>
    ) : null;
};

export default BlackHint;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: px(35),
        width: px(343),
        alignSelf: 'center',
        backgroundColor: 'rgba(6, 6, 6, 0.8)',
        borderRadius: px(6),
        padding: px(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: px(12),
        lineHeight: px(18),
        color: '#fff',
    },
    btn: {
        backgroundColor: '#FF7D41',
        borderRadius: px(12),
        paddingHorizontal: px(8),
        paddingVertical: px(3),
    },
    btnText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
        textAlign: 'center',
    },
    iconWrap: {
        position: 'absolute',
        left: -7,
        top: -7,
    },
    icon: {
        width: px(18),
        height: px(18),
    },
});
