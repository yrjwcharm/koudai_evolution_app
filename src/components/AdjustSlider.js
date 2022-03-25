/*
 * @Date: 2022-03-24 16:12:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-25 15:14:39
 * @Description:调整风险slider
 */
import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useRef} from 'react';
// 导入 Silder组件
import Slider from 'react-native-slider';
import {px} from '../utils/appUtil';
import {Style} from '../common/commonStyle';
const thumbWidth = px(30);
const tickWidth = px(8);
const AdjustSlider = ({
    value = 1,
    minimumValue = 1,
    maximumValue = 7,
    tickColor = '#BDC2CC',
    perfixText = '等级',
    onChange = () => {},
    tickTextStyle,
    currentTag = true, //标记当前默认值
}) => {
    const [tickCount, setTickCount] = useState(0);
    const [activeTick, setActiveTick] = useState(value);
    const width = useRef(0);
    //生成某个范围的数字
    const proArr = (start, end) => {
        var length = end - start + 1;
        var step = start - 1;
        return Array.apply(null, {length: length}).map(function (v, i) {
            step++;
            return step;
        });
    };
    const onValueChange = (_value) => {
        setActiveTick(_value);
        onChange(_value);
    };
    return (
        <View style={{backgroundColor: '#fff', padding: px(20)}}>
            <View
                onLayout={(evt) => {
                    width.current = evt.nativeEvent.layout.width - thumbWidth / 2;
                    const _tickCount = Math.round(width.current / tickWidth);
                    setTickCount(_tickCount);
                }}>
                <Slider
                    value={value}
                    minimumValue={minimumValue}
                    step={1}
                    maximumValue={maximumValue}
                    minimumTrackTintColor={'#E9EAEF'}
                    thumbImage={require('../assets/img/thumb.png')}
                    thumbStyle={styles.thunbImage}
                    thumbTintColor={'#2B7AF3'}
                    trackStyle={{height: px(8), backgroundColor: '#E9EAEF'}}
                    onValueChange={onValueChange}
                />
                {/* tick */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginLeft: thumbWidth / 4,
                    }}>
                    {new Array(tickCount).fill(0).map((_, index) => {
                        const _value = maximumValue - minimumValue;
                        const _oneTickCount = Math.floor(tickCount / _value);
                        // 由于四舍五入误差造成的差
                        const _awidth = width.current - _oneTickCount * _value * tickWidth;
                        // index > _value * _oneTickCount 有可能算出来的刻度个数不能整除，把不能整除的舍弃
                        //例如 tickCount为39，每一个大刻度为9个小刻度，总共4个小刻度，所以渲染36就可以，所以要舍弃37，38，39
                        return index > _value * _oneTickCount ? null : (
                            <View
                                style={{
                                    width: tickWidth + _awidth / tickCount,
                                }}>
                                <View
                                    style={{
                                        width: px(1),
                                        height: index % _oneTickCount == 0 ? px(5) : px(3),
                                        backgroundColor: tickColor,
                                    }}
                                />
                            </View>
                        );
                    })}
                </View>
                {/* tickText */}
                <View style={[Style.flexBetween, {marginTop: px(12), marginLeft: thumbWidth / 8}]}>
                    {proArr(minimumValue, maximumValue).map((_, index) => {
                        return (
                            <Text
                                style={[
                                    {
                                        textAlign:
                                            index == 0
                                                ? 'left'
                                                : index == maximumValue - minimumValue
                                                ? 'right'
                                                : 'center',
                                        fontSize: _ == activeTick || (value == _ && currentTag) ? px(14) : px(11),
                                        color:
                                            _ == activeTick && value != _
                                                ? '#545968'
                                                : value == _ && currentTag
                                                ? '#2B7AF3'
                                                : '#9AA1B2',
                                    },
                                    tickTextStyle,
                                ]}>
                                {perfixText}
                                {_}
                            </Text>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default AdjustSlider;

const styles = StyleSheet.create({
    tickText: {
        fontSize: px(11),
        color: 'red',
        textAlign: 'center',
    },
    thunbImage: {
        width: thumbWidth,
        height: px(30),
        borderRadius: px(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
