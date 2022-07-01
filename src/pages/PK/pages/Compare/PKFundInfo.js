import React, {forwardRef, useRef, useImperativeHandle, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const PKFundInfo = ({data, pkPinning, onScroll, _ref}) => {
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
                    <Text style={styles.labelText}>成立时间</Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>基金规模</Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>机构/个人</Text>
                    <Text style={styles.labelText}>持仓占比</Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>基金公司</Text>
                </View>
            </View>
        );
    };

    const genValues = (item, key) => {
        // item = data.find(itm=>item.aa === itm.aa)
        item = data[0];
        return (
            <View style={styles.valuesWrap} key={key}>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.funding_date || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item.asset_scale || '--'}</Text>
                </View>
                <View
                    style={{
                        height: px(42),
                        borderBottomColor: '#E9EAEF',
                        borderBottomWidth: 1,
                        justifyContent: 'center',
                        paddingHorizontal: px(8),
                    }}>
                    <PositionRate rate={item.holding_rate || '--'} />
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{item?.company_info?.name || '--'}</Text>
                </View>
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const obj = data?.[0].manager_info;
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 1};
        return (
            <View style={{width: px(40)}}>
                {new Array(Object.keys(obj).length).fill('').map((_, idx) => (
                    <View style={{height: px(42), ...border}} />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>基金经理信息</Text>
            </View>
            <View style={[styles.content]}>
                {/* labels */}
                {genLabels()}
                {/* 占位 */}
                {pkPinning ? genValues(pkPinning, -1) : null}
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
                        {data.filter((item) => item != pkPinning).map((item, idx) => genValues(item, idx))}
                    </View>
                    {/* 补位 */}
                    {data.length > 1 ? genSup() : null}
                </ScrollView>
            </View>
        </View>
    );
};

const _PKFundInfo = connect((state) => ({pkPinning: state.pkPinning}))(PKFundInfo);

export default forwardRef((props, ref) => <_PKFundInfo {...props} _ref={ref} />);

const PositionRate = ({rate}) => {
    return (
        <View style={styles.positionRate}>
            <Text style={styles.positionRateText}>{rate + '%'}</Text>
            <View style={styles.positionRateProcess}>
                <View style={[styles.positionRateLeft, {width: rate + '%'}]} />
                <View style={[styles.positionRateRight]} />
            </View>
            <Text style={styles.positionRateText}>{100 - rate + '%'}</Text>
        </View>
    );
};

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
        height: px(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
    },
    labelText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        textAlign: 'center',
    },
    valuesWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
    },
    valueWrap: {
        height: px(42),
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
    positionRate: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    positionRateText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121D3A',
        textAlign: 'center',
        fontFamily: Font.numFontFamily,
        // width: px(25),
    },
    positionRateProcess: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    positionRateLeft: {
        marginLeft: px(4),
        height: px(4),
        backgroundColor: '#E74949',
    },
    positionRateRight: {
        marginLeft: px(2),
        height: px(4),
        marginRight: px(4),
        backgroundColor: '#545968',
        flex: 1,
    },
});
