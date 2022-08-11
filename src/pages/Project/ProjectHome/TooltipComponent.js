/*
 * @Date: 2022-08-11 17:46:42
 * @Description:
 */
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {isIphoneX, px} from '~/utils/appUtil';
import gesture from '~/assets/animation/gesture.gif';

const TooltipComponent = ({handleNext, handlePrev, handleStop, currentStep, handlerTooltipStyle}) => {
    useEffect(() => {
        if (currentStep?.order === 2) {
            setTimeout(() => {
                handlerTooltipStyle((state) => {
                    return {tooltip: {...state.tooltip, bottom: isIphoneX() ? px(120) : px(80)}};
                });
            }, 350);
        }
    }, [currentStep, handlerTooltipStyle]);
    return (
        <View style={styles.container}>
            {currentStep?.order === 1 ? (
                <View style={{alignItems: 'center'}}>
                    <FastImage source={gesture} style={{width: px(240), height: px(53)}} resizeMode="contain" />
                    <Text style={styles.text}>点击查看工具叠加各大盘指数的买卖信号</Text>
                    <Button title="我知道了" style={{marginTop: px(12)}} onPress={handleNext} />
                </View>
            ) : currentStep?.order === 2 ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={[styles.text, {textAlign: 'right'}]}>点击查看更多的指数买卖信号</Text>
                    <Button title="我知道了" style={{marginTop: px(12)}} onPress={handleStop} />
                </View>
            ) : null}
        </View>
    );
};

export default TooltipComponent;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
        textAlign: 'center',
    },
});

const Button = ({title = '', onPress = () => {}, style = {}}) => {
    return (
        <TouchableOpacity
            style={{
                borderRadius: px(14),
                paddingHorizontal: px(12),
                paddingVertical: px(5),
                borderWidth: 1,
                borderColor: '#fff',
                width: 'auto',
                ...style,
            }}
            activeOpacity={0.8}
            onPress={onPress}>
            <Text style={{fontSize: px(13), lineHeight: px(18), color: '#fff'}}>{title}</Text>
        </TouchableOpacity>
    );
};
