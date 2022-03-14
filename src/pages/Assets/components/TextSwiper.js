import React, {useMemo, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Image from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import Html from '../../../components/RenderHtml';
import {px} from '../../../utils/appUtil';

const TextSwiper = ({list = [], speed = 1500, style = {}}) => {
    const [textSwiperWidth, setTextSwiperWidth] = useState([px(311)]);
    const duration = useMemo(() => {
        return Math.round(textSwiperWidth.reduce((memo, cur) => (memo += +cur), 0) / 100) * speed;
    }, [textSwiperWidth, speed]);
    return list?.[0] ? (
        <Animatable.View
            useNativeDriver={true}
            easing="linear"
            duration={duration}
            iterationCount="infinite"
            delay={1000}
            animation={{
                0: {
                    transform: [{translateX: 0}],
                },
                1: {
                    transform: [{translateX: textSwiperWidth.reduce((memo, cur) => (memo -= +cur), 0)}],
                },
            }}
            style={[styles.textSwiper, style]}>
            <View style={{width: px(311)}} />
            {list?.map((item, idx) => (
                <View
                    key={idx + item}
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onLayout={(e) => {
                        const layoutWidth = e.nativeEvent.layout.width;
                        setTextSwiperWidth((val) => {
                            let index = idx + 1;
                            let newVal = [...val];
                            newVal[index] = +layoutWidth.toFixed(2);
                            return newVal;
                        });
                    }}>
                    {<View style={{width: px(12), height: px(20)}} />}
                    <View style={[styles.textItem]}>
                        <View style={{width: px(12)}} />
                        <Image source={{uri: item.icon}} style={{width: px(16), height: px(16)}} />
                        <View style={{width: px(6)}} />
                        <Html html={item.desc} />
                        <View style={{width: px(8)}} />
                        <Text style={styles.textItemTime}>{item.order_time}</Text>
                        <View style={{width: px(12)}} />
                    </View>
                </View>
            ))}
        </Animatable.View>
    ) : null;
};
export default TextSwiper;

const styles = StyleSheet.create({
    textSwiper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 0,
    },
    textItem: {
        backgroundColor: '#f5F6F8',
        borderRadius: px(20),
        paddingVertical: px(12),
        flexDirection: 'row',
        alignItems: 'center',
    },

    textItemTime: {
        fontSize: px(12),
        fontWeight: '300',
        color: '#9AA1B2',
        lineHeight: px(17),
    },
});
