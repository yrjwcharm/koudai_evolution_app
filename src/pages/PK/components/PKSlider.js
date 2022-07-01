import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Slider from 'react-native-slider';
import LinearGradient from 'react-native-linear-gradient';
import {px} from '~/utils/appUtil';

const PKSlider = ({total, tickNum, style = {}}) => {
    const [rate, setRate] = useState(0);

    return (
        <View style={[styles.sliderWrap, style]}>
            {/* verticle line */}
            {new Array(tickNum).fill('').map((_, index) => (
                <View key={index} style={styles.line} />
            ))}

            {/* slider bg*/}
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                locations={[0, rate, rate, 1]}
                colors={['#CEDDF5', '#6FA0EE', '#E9EAEF', '#E9EAEF']}
                style={styles.sliderBg}
            />
            {/* slider */}
            <Slider
                style={styles.slider}
                trackStyle={{height: px(6)}}
                minimumValue={0}
                maximumValue={total}
                thumbStyle={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#0051CC',
                    borderRadius: 30 / 2,
                    borderWidth: 4,
                    borderColor: '#fff',
                    shadowColor: 'rgb(26, 75, 211)',
                    shadowOffset: {width: 0, height: 3},
                    shadowRadius: 3,
                    shadowOpacity: 0.3,
                }}
                step={total / (tickNum - 1)}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                onValueChange={(val) => {
                    setRate(val / total);
                }}
            />
        </View>
    );
};

export default PKSlider;

const styles = StyleSheet.create({
    container: {},
    sliderWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: px(243),
        height: '100%',
    },
    line: {
        height: '100%',
        width: 1,
        backgroundColor: '#E9EAEF',
    },
    slider: {
        position: 'absolute',
        width: px(243) + 20,
        left: -10,
    },
    sliderBg: {
        position: 'absolute',
        height: px(6),
        width: '100%',
    },
});
