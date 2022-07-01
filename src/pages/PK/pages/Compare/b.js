import React, {forwardRef, useRef, useImperativeHandle, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {px} from '~/utils/appUtil';

const PKPriceRange = ({data, pkPinning, onScroll, _ref}) => {
    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);

    useImperativeHandle(_ref, () => ({
        scrollTo: (x) => {
            scrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    const genLabels = () => {};

    const genValues = () => {};

    const genSup = () => {};

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>业绩表现</Text>
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
});
