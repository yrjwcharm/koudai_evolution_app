import React, {forwardRef, useRef, useImperativeHandle, useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 0.5};
        return (
            <View style={{width: px(40)}}>
                {new Array(4).fill('').map((_, idx) => (
                    <View key={idx} style={{height: px(42), ...border}} />
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
                {pkPinning ? (
                    <ValuePart item={data.find((itm) => itm.code === pkPinning)} key={-1 + pkPinning} />
                ) : null}
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
                                <ValuePart item={item} key={idx + item.code} />
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

const ValuePart = React.memo(({item}) => {
    const manager_list = useMemo(() => {
        return item?.manager_list || [];
    }, [item]);
    const [active, setActive] = useState(manager_list?.[0]?.name);
    const [visible, setVisible] = useState(false);
    const obj = useMemo(() => {
        return manager_list?.find?.((itm) => itm.name === active) || {};
    }, [active, manager_list]);
    return (
        <>
            <View style={styles.valuesWrap}>
                {visible ? (
                    <View style={[styles.dialog]}>
                        {manager_list
                            .filter((itm) => itm.name !== active)
                            .map((itm, idx) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={idx}
                                    style={[styles.valueWrap, {backgroundColor: '#F5F6F8'}]}
                                    onPress={() => {
                                        setVisible(false);
                                        setActive(itm.name);
                                    }}>
                                    <Text style={styles.valueText}>{itm.name}</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                ) : null}
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.valueWrap}
                    onPress={() => {
                        manager_list.length > 1 && setVisible((val) => !val);
                    }}>
                    <Text style={styles.valueText}>{obj?.name}</Text>
                    {manager_list.length > 1 && (
                        <FontAwesome color={'#AD9064'} name={'angle-down'} size={16} style={{marginLeft: px(5)}} />
                    )}
                </TouchableOpacity>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{obj?.work_date || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text style={styles.valueText}>{obj?.fund_date || '--'}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text
                        style={[
                            styles.valueText,
                            {color: obj?.yield > 0 ? '#E74949' : obj?.yield === 0 ? '' : '#4BA471'},
                        ]}>
                        {obj?.yield || '--'}
                    </Text>
                </View>
            </View>
        </>
    );
});

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
        height: px(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
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
        borderRightWidth: 0.5,
    },
    valueWrap: {
        height: px(42),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    valueText: {
        fontSize: px(14),
        lineHeight: px(22),
        color: '#121D3A',
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    dialog: {
        width: px(120),
        position: 'absolute',
        top: px(35),
        zIndex: 2,
    },
});
