import React, {useMemo, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Image from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import Html from '../../../components/RenderHtml';
import {px} from '../../../utils/appUtil';

const TextSwiper = ({list = [], speed = 1500, style = {}}) => {
    const [textSwiperWidth, setTextSwiperWidth] = useState(0);
    const duration = useMemo(() => {
        return Math.round(Math.abs(textSwiperWidth) / 100) * speed;
    }, [textSwiperWidth, speed]);
    return list?.[0] ? (
        <Animatable.View
            useNativeDriver={true}
            easing="linear"
            duration={duration}
            iterationCount="infinite"
            animation={{
                0: {
                    transform: [{translateX: 0}],
                },
                1: {
                    transform: [{translateX: textSwiperWidth}],
                },
            }}
            style={[styles.textSwiper, style]}
            onLayout={(e) => {
                const layoutWidth = e.nativeEvent.layout.width;
                setTextSwiperWidth(-layoutWidth);
            }}>
            <View style={{width: px(343)}} />
            {list?.map((item, idx) => (
                <View key={idx + item} style={[styles.textItem, idx > 0 && {marginLeft: px(12)}]}>
                    <Image source={{uri: item.icon}} style={{width: px(16), height: px(16)}} />
                    <View
                        style={{
                            marginLeft: px(6),
                        }}>
                        <Html html={item.desc} />
                    </View>
                    <Text style={styles.textItemTime}>{item.order_time}</Text>
                </View>
            ))}
        </Animatable.View>
    ) : null;
};
export default TextSwiper;

const styles = StyleSheet.create({
    textSwiper: {
        flexDirection: 'row',
        flexGrow: 0,
        width: '100%',
    },
    textItem: {
        backgroundColor: '#f5F6F8',
        borderRadius: px(20),
        padding: px(12),
        flexDirection: 'row',
        alignItems: 'center',
    },

    textItemTime: {
        marginLeft: px(8),
        fontSize: px(12),
        fontWeight: '300',
        color: '#9AA1B2',
        lineHeight: px(17),
    },
});
