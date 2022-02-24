import React, {useMemo, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {px} from '../../../utils/appUtil';

/**
 *
 * @param {object} options
 * @param {number} [options.splitNumber=50] // 默认总长度是100的话一个刻度间距是2
 * @param {array} options.ticks // 刻度标签
 * @param {array} options.value_area // 进度
 * @param {object} options.marks // 标记
 * @returns
 */
const HotRuler = ({splitNumber = 50, ticks = [], value_area = [], marks = {}}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const scaleArr = useMemo(() => {
        let index = 0;
        const arr = new Array(splitNumber + 1).fill('').map((_, idx) => {
            let tick = ticks[index] || [];
            if (idx / splitNumber === +tick[0]) {
                index++;
                return tick[1] || ' ';
            } else {
                return '';
            }
        });
        return arr;
    }, [splitNumber, ticks]);

    const [ticksText, setTicksText] = useState({});

    return (
        <View
            style={styles.container}
            onLayout={(e) => {
                setContainerWidth(e.nativeEvent.layout.width);
            }}>
            {/* 标记 */}
            <View style={[styles.mark, {right: (1 - marks.value) * containerWidth + px(-20)}]}>
                <View style={[styles.markCircle, {backgroundColor: marks.bg_color, borderColor: marks.theme}]}>
                    <Text
                        style={{fontWeight: '500', lineHeight: px(14), fontSize: px(12), color: marks.theme}}
                        numberOfLines={1}>
                        {marks.text}
                    </Text>
                </View>
                <View
                    style={[
                        styles.triangle,
                        {
                            borderTopColor: marks.theme,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.triangleInner,
                        {
                            borderTopColor: marks.bg_color,
                        },
                    ]}
                />
                <View style={[styles.verticalLine, {backgroundColor: marks.theme}]} />
            </View>
            {/* 进度 */}
            <View style={styles.process}>
                {value_area.map(([width, backgroundColor], idx) => {
                    return (
                        <View
                            key={idx}
                            style={[
                                styles.processItem,
                                {width: width * 100 + '%', backgroundColor, zIndex: value_area.length - idx + 1},
                            ]}
                        />
                    );
                })}
            </View>
            {/* 刻度 */}
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: px(2)}}>
                    {scaleArr.map((item, idx) => {
                        return (
                            <View
                                style={[
                                    styles.scaleItem,
                                    item && {
                                        height: px(8),
                                    },
                                ]}
                                key={item + idx}
                                onLayout={(e) => {
                                    let x = e.nativeEvent.layout.x;
                                    item &&
                                        setTicksText((val) => {
                                            return {...val, [x + '']: item};
                                        });
                                }}
                            />
                        );
                    })}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {Object.entries(ticksText).map(([x, text], idx) => (
                        <Text key={idx + text} style={[styles.scaleItemLabel, {position: 'absolute', left: +x}]}>
                            {text}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
};
export default HotRuler;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexGrow: 0,
    },
    process: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: px(6),
        backgroundColor: '#E9EAEF',
    },
    processItem: {
        height: px(6),
        position: 'absolute',
        left: 0,
        top: 0,
    },
    scaleWrapper: {},
    scaleItem: {
        width: px(1),
        height: px(4),
        backgroundColor: '#E2E4EA',
    },
    scaleItemLabel: {
        position: 'absolute',
        // right: 0,
        // bottom: 0,
        fontSize: px(10),
        fontWeight: '400',
        lineHeight: px(14),
        color: '#9AA1B2',
    },
    mark: {
        position: 'absolute',
        top: px(-32),
        zIndex: 1,
    },
    markCircle: {
        backgroundColor: '#FFF6F6',
        paddingVertical: px(3),
        paddingHorizontal: px(6),
        borderRadius: px(20),
        borderWidth: px(1),
    },
    triangle: {
        position: 'absolute',
        right: px(13),
        bottom: px(-11),
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: px(7),
        borderColor: 'transparent',
        zIndex: -1,
    },
    triangleInner: {
        position: 'absolute',
        right: px(13),
        bottom: px(-10),
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: px(7),
        borderColor: 'transparent',
        zIndex: 1,
    },
    verticalLine: {
        position: 'absolute',
        right: px(20),
        bottom: px(-14),
        width: px(1),
        height: px(9),
    },
});
