import React, {forwardRef, useRef, useImperativeHandle, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Font} from '~/common/commonStyle';

const PKPriceRange = ({data, pkPinning, onScroll, _ref}) => {
    const [expand, setExpand] = useState(false);

    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);

    useImperativeHandle(_ref, () => ({
        scrollTo: (x) => {
            scrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    const genLabels = () => {
        return (
            <View style={styles.labelsWrap}>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>近1周 </Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>近1月 </Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>近3月 </Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>近6月 </Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>近一年 </Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>近三年 </Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>成立以来 </Text>
                </View>
            </View>
        );
    };

    const genValues = (item, key) => {
        return (
            <View style={styles.valuesWrap} key={key}>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.week || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.month || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.three_month || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.half_year || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.year || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.three_year || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.founding || '--'}</Text>
                </View>
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const obj = data?.[0]?.yield_info || {};
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 1};
        return (
            <View style={{width: px(40)}}>
                {new Array(Object.keys(obj).length).fill('').map((_, idx) => (
                    <View key={idx} style={{height: px(45), ...border}} />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>涨跌幅</Text>
            </View>
            <View style={[styles.content, expand ? {} : {height: px(150), overflow: 'hidden'}]}>
                {/* labels */}
                {genLabels()}
                {/* 占位 */}
                {pkPinning
                    ? genValues(
                          data.find((itm) => itm.code === pkPinning),
                          -1
                      )
                    : null}
                <ScrollView
                    style={{flex: 1}}
                    bounces={false}
                    horizontal={true}
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onMomentumScrollBegin={(_) => {
                        scrolling.current = true;
                    }}
                    onMomentumScrollEnd={(_) => {
                        scrolling.current = false;
                    }}
                    onScrollBeginDrag={(_) => {
                        scrolling.current = true;
                    }}
                    onScrollEndDrag={(_) => {
                        scrolling.current = false;
                    }}
                    onScroll={(e) => {
                        scrolling.current && onScroll?.(e.nativeEvent.contentOffset.x);
                    }}>
                    {/* list */}
                    <View style={{flexDirection: 'row'}}>
                        {data.filter((item) => item.code !== pkPinning).map((item, idx) => genValues(item, idx))}
                    </View>
                    {/* 补位 */}
                    {data.length > 1 ? genSup() : null}
                </ScrollView>
            </View>
            {/* expand */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.expandWrap}
                onPress={() => {
                    setExpand((val) => !val);
                }}>
                <Text style={styles.expandText}>{expand ? '收起' : '展开明细'}</Text>
                <Icon name={expand ? 'chevron-up' : 'chevron-down'} size={25} color="#0051CC" />
            </TouchableOpacity>
        </View>
    );
};

const _PKPriceRange = connect((state) => ({pkPinning: state.pkPinning}))(PKPriceRange);

export default forwardRef((props, ref) => <_PKPriceRange {...props} _ref={ref} />);

const styles = StyleSheet.create({
    container: {
        marginTop: px(12),
        backgroundColor: '#fff',
    },
    title: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
    },
    titleText: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3A',
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    labelsWrap: {
        width: px(87),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
    },
    labelWrap: {
        height: px(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
    },
    valuesWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
    },
    labelText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        textAlign: 'center',
    },
    valueWrap: {
        height: px(45),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueText: {
        fontSize: px(14),
        lineHeight: px(22),
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    expandWrap: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px(33),
    },
    expandText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
});
