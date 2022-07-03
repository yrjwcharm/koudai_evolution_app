import React, {forwardRef, useRef, useImperativeHandle, useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const PKManagerInfo = ({data, pkPinning, onScroll, _ref}) => {
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
                    <Text style={styles.labelText}>基金经理</Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>从业时间</Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>本基金任期</Text>
                </View>
                <View style={styles.labelWrap}>
                    <Text style={styles.labelText}>任期回报</Text>
                </View>
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 1};
        return (
            <View style={{width: px(40)}}>
                {new Array(4).fill('').map((_, idx) => (
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
                {pkPinning ? <ValuePart item={data.find((itm) => itm.code === pkPinning)} key={-1} /> : null}
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
                        {data
                            .filter((item) => item.code !== pkPinning)
                            .map((item, idx) => (
                                <ValuePart item={item} key={idx} />
                            ))}
                    </View>
                    {/* 补位 */}
                    {data.length > 1 ? genSup() : null}
                </ScrollView>
            </View>
        </View>
    );
};

const _PKManagerInfo = connect((state) => ({pkPinning: state.pkPinning}))(PKManagerInfo);

export default forwardRef((props, ref) => <_PKManagerInfo {...props} _ref={ref} />);

const ValuePart = ({item}) => {
    const [active, setActive] = useState(0);
    const obj = useMemo(() => {
        return item?.manager_list?.[active] || {};
    }, [active, item]);
    return (
        <View style={styles.valuesWrap}>
            <View style={styles.valueWrap}>
                <Text style={styles.valueText}>{obj?.name}</Text>
            </View>
            <View style={styles.valueWrap}>
                <Text style={styles.valueText}>{obj?.work_date || '--'}</Text>
            </View>
            <View style={styles.valueWrap}>
                <Text style={styles.valueText}>{obj?.fund_date || '--'}</Text>
            </View>
            <View style={styles.valueWrap}>
                <Text style={[styles.valueText, {color: '#E74949'}]}>{obj?.yield || '--'}</Text>
            </View>
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
        color: '#121D3A',
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
});
