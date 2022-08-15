import React, {forwardRef, useRef, useImperativeHandle, useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import {px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Font} from '~/common/commonStyle';

const handlerDefaultItemBest = (data) => {
    let obj = {};
    data?.forEach((item) => {
        let info = item.yield_info;
        if (!info) return;
        Object.keys(info).forEach((key) => {
            if (!obj[key]) obj[key] = {value: -Infinity, code: ''};
            if (info[key] === obj[key].value) {
                obj[key].code = '';
            }
            if (info[key] > obj[key].value) {
                obj[key].value = (info[key] * 100).toFixed(2);
                obj[key].code = item.code;
            }
        });
    });
    return obj;
};

const PKPriceRange = ({data, pkPinning, onScroll, _ref}) => {
    const [expand, setExpand] = useState(false);
    const [itemBest, setItemBest] = useState({});

    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);

    useImperativeHandle(_ref, () => ({
        scrollTo: (x) => {
            scrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    useEffect(() => {
        setItemBest(handlerDefaultItemBest(data));
    }, [data]);

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
        if (!item) return null;
        const handlerVal = (val) => {
            if (!val) return '--';
            return (val * 100).toFixed(2) + '%';
        };
        const handlerBg = (k) => {
            return {
                backgroundColor: itemBest?.[k]?.code === item.code ? '#FFF2F2' : '#fff',
            };
        };
        return (
            <View style={styles.valuesWrap} key={key}>
                <View style={[styles.valueWrap, handlerBg('week')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.week > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.week)}
                    </Text>
                </View>
                <View style={[styles.valueWrap, handlerBg('month')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.month > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.month)}
                    </Text>
                </View>
                <View style={[styles.valueWrap, handlerBg('three_month')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.three_month > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.three_month)}
                    </Text>
                </View>
                <View style={[styles.valueWrap, handlerBg('half_year')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.half_year > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.half_year)}
                    </Text>
                </View>
                <View style={[styles.valueWrap, handlerBg('year')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.year > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.year)}
                    </Text>
                </View>
                <View style={[styles.valueWrap, handlerBg('three_year')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.three_year > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.three_year)}
                    </Text>
                </View>
                <View style={[styles.valueWrap, handlerBg('founding')]}>
                    <Text style={[styles.valueText, {color: item.yield_info?.founding > 0 ? '#E74949' : '#4BA471'}]}>
                        {handlerVal(item.yield_info?.founding)}
                    </Text>
                </View>
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 0.5};
        return (
            <View style={{width: px(40)}}>
                {new Array(7).fill('').map((_, idx) => (
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
            <View
                style={[
                    styles.content,
                    expand ? {} : {height: px(Platform.OS === 'ios' ? 136 : 134), overflow: 'hidden'},
                ]}>
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
                    global.LogTool('PKContrast_ExpandAndCollapse', 2);
                    setExpand((val) => !val);
                }}>
                <Text style={styles.expandText}>{expand ? '收起' : '展开明细'}</Text>
                <Icon name={expand ? 'chevron-up' : 'chevron-down'} size={25} color="#0051CC" />
            </TouchableOpacity>
        </View>
    );
};

const _PKPriceRange = connect((state) => ({pkPinning: state.pkPinning[global.pkEntry]}))(PKPriceRange);

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
        borderBottomWidth: 0.5,
    },
    titleText: {
        fontSize: px(14),
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
        borderRightWidth: 0.5,
    },
    labelWrap: {
        height: px(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    valuesWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 0.5,
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
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueText: {
        fontSize: px(14),
        lineHeight: px(22),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    expandWrap: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px(38),
    },
    expandText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
});
