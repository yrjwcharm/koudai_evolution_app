import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {px} from '~/utils/appUtil';
import {getPKBetter} from '../../services';
import Icon from 'react-native-vector-icons/EvilIcons';
import FastImage from 'react-native-fast-image';

const BlackHint = ({addHigh}) => {
    const pkProducts = useSelector((state) => state.pkProducts);

    const [data, setData] = useState(null);

    useEffect(() => {
        getPKBetter({fund_code_list: pkProducts.join()}).then((res) => {
            setData(res.result?.better_fund);
        });
    }, [pkProducts]);

    return (
        data && (
            <View style={[styles.container]}>
                {/* icon */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setData(null);
                    }}>
                    <FastImage style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.text}>根据您的权重设置，有新的基金向您推荐</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.btn}
                    onPress={() => {
                        addHigh(data.code);
                    }}>
                    <Text style={styles.btnText}>添加PK </Text>
                </TouchableOpacity>
            </View>
        )
    );
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
    icon: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
});
