import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {px} from '~/utils/appUtil';

const TooltipComponent = ({
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStop,
    currentStep,
    handlerTooltipStyle,
}) => {
    return (
        <View style={styles.container}>
            {currentStep?.order === 1 ? (
                <View
                    style={{
                        alignItems: 'flex-end',
                        alignSelf: 'flex-end',
                        width: px(135),
                        right: px(-10),
                    }}>
                    <Text style={[styles.text, {textAlign: 'right'}]}>点击去订阅各大指数买卖信号</Text>
                    <Button title="我知道了" style={{marginTop: px(12)}} onPress={handleNext} />
                </View>
            ) : currentStep?.order === 2 ? (
                <View
                    style={{
                        alignItems: 'center',
                    }}>
                    <Text style={[styles.text]}>点击查看指数叠加各大工具的买卖信号</Text>
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
