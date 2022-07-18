/*
 * @Date: 2022-07-16 15:02:12
 * @Description:设置收益率
 */
import {StyleSheet, Text, View, Animated, Platform, TextInput} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import lodash from 'lodash';
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Font} from '~/common/commonStyle';
const Ruler = (props) => {
    const {
        defaultValue,
        snapSegment = px(20),
        onChangeValue,
        height = px(40),
        width = deviceWidth,
        minimum = 0,
        maximum = 20,
        step = 5,
        stepHeight = px(6),
        normalHeight = px(10),
        segmentWidth = px(1), //刻度宽
        segmentSpacing = snapSegment - segmentWidth, // 间距,
        stepColor = '#D0D0D0',
        normalColor = '#E7E7E7',
        unit = '%',
        numberSize = px(40),
        unitSize = px(20),
    } = props;
    const scrollViewRef = useRef();
    const scrollX = useRef(new Animated.Value(0)).current;
    const [content, setContent] = useState();
    const textInputRef = useRef();
    const _props = Platform.OS == 'android' ? {} : {snapToInterval: snapSegment};
    console.log(snapSegment);
    const rulerWidth = (maximum - minimum) * snapSegment + width - segmentWidth;
    const spacerWidth = (width - segmentWidth) / 2;
    useEffect(() => {
        const scrollListener = scrollX.addListener(({value}) => {
            textInputRef.current.setNativeProps({
                text: `${Math.round(value / snapSegment) + minimum}`,
            });
        });
        return () => scrollX.removeListener(scrollListener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const renderRuler = () => {
        const data = [...Array(maximum - minimum + 1).keys()].map((i) => i + minimum);
        const arr = new Array(data.length);
        return (
            <View
                style={{
                    width: rulerWidth,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                }}>
                <View
                    style={{
                        width: spacerWidth,
                    }}
                />
                <View>
                    {/* Ruler */}
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                            {Array.from(arr).map((item, i) => {
                                return (
                                    <View
                                        key={i}
                                        style={{
                                            backgroundColor: i % step !== 0 ? stepColor : normalColor,
                                            height: i % step !== 0 ? stepHeight : normalHeight,
                                            width: segmentWidth,
                                            marginRight: segmentSpacing,
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E7E7E7', width: rulerWidth - 2 * spacerWidth}} />
                    <View style={{flexDirection: 'row', marginLeft: px(-5), marginTop: px(11)}}>
                        {data.map((i) => {
                            return i % step == 0 ? (
                                <Text
                                    key={i + 'on'}
                                    style={{
                                        width: snapSegment * step,
                                        fontSize: px(18),
                                        color: '#D0D0D0',
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {i}
                                    {unit}
                                </Text>
                            ) : null;
                        })}
                    </View>
                </View>
                <View
                    style={{
                        width: spacerWidth,
                    }}
                />
            </View>
        );
    };
    return (
        <View style={{width, height}}>
            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={100}
                {..._props}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {x: scrollX},
                            },
                        },
                    ],
                    {useNativeDriver: true}
                )}
                onMomentumScrollEnd={() => onChangeValue && onChangeValue(content)}>
                {renderRuler()}
            </Animated.ScrollView>
            <View
                style={{
                    ...styles.indicator_con,
                    left: (width - px(100)) / 2,
                }}
                pointerEvents="none">
                <View style={styles.indicator}>
                    {/* Number */}
                    <TextInput
                        ref={textInputRef}
                        style={{
                            fontSize: numberSize,
                            fontFamily: Font.numFontFamily,
                            color: Colors.btnColor,
                            textAlign: 'center',
                        }}
                        defaultValue={defaultValue?.toString() || minimum.toString()}
                    />
                    {/* Unit */}
                    <Text style={{...styles.unit, fontSize: unitSize}}>{unit}</Text>
                </View>
                {/* Indicator */}
                <View
                    style={{
                        height: px(42),
                        backgroundColor: Colors.btnColor,
                        width: segmentWidth,
                    }}
                />
            </View>
        </View>
    );
};

export default Ruler;

const styles = StyleSheet.create({
    indicator_con: {
        width: px(100),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: px(20),
    },
    indicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderBottomColor: '#BDC2CC',
        borderBottomWidth: 0.5,
        width: '100%',
    },
    unit: {
        marginBottom: px(6),
        marginLeft: px(2),
        fontFamily: Font.numFontFamily,
        color: Colors.btnColor,
    },
});
