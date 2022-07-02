import React, {forwardRef, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icons from 'react-native-vector-icons/EvilIcons';
import {connect} from 'react-redux';
import {px} from '~/utils/appUtil';
import * as pkProductsActions from '~/redux/actions/pk/pkProducts';
import * as pkPinningActions from '~/redux/actions/pk/pkPinning';

const Header = (props) => {
    const groupScrollViewRef = useRef(null);
    const [footerHeight, setFooterHeight] = useState(0);

    const scrolling = useRef(null);

    useImperativeHandle(props._ref, () => ({
        scrollTo: (x) => {
            groupScrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    const groupItem = (item, key) => {
        // item = data.find(itm=>item.aa === itm.aa)
        item = props.data?.[0];
        return (
            <View style={styles.groupItemWrap} key={key}>
                {/* header */}
                <View style={styles.groupItemHeader}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.pinningStamp, {backgroundColor: key === -1 ? '#F1F6FF' : '#F5F6F8'}]}
                        onPress={() => {
                            props.pinningProduct(item === props.pkPinning ? null : item);
                        }}>
                        <FastImage
                            source={{
                                uri:
                                    'http://static.licaimofang.com/wp-content/uploads/2022/06/' +
                                    (key === -1 ? 'pinning' : 'pin') +
                                    '.png',
                            }}
                            style={{width: px(12), height: px(12), marginRight: px(2)}}
                        />
                        <Text style={styles.highStampText}>{key === -1 ? '已钉住' : '钉在左侧'}</Text>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            props.delProduct(item);
                            props.pkPinning === item && props.pinningProduct(null);
                        }}>
                        <Icons style={{marginRight: 2, marginTop: 4}} name={'close'} color={'#9AA0B1'} size={px(18)} />
                    </TouchableWithoutFeedback>
                </View>
                {/* title */}
                <View style={styles.groupItemContent}>
                    <Text style={styles.groupItemTitle} numberOfLines={props.pageScroll ? 1 : 3}>
                        嘉实中证基建E
                        {key === 1 ? '嘉实中嘉实中证基建ETF嘉实中证基建ETF证基建ETF嘉实中证基建ETF' : ''}aaa
                    </Text>
                </View>
                {/* footer */}
                <View style={{height: footerHeight}} />
                <View
                    style={styles.groupItemFooter}
                    onLayout={(e) => {
                        setFooterHeight(e.nativeEvent.layout.height);
                    }}>
                    {props.pageScroll ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.btnWrap,
                                key === 1
                                    ? {backgroundColor: '#0051CC'}
                                    : {backgroundColor: '#fff', borderWidth: 1, borderColor: '#0051CC'},
                            ]}>
                            <Text style={[styles.btnText, {color: key === 1 ? '#fff' : '#0051CC'}]}>买入</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            {[1, 2].map((itm, idx) => (
                                <View style={[styles.groupItemTag, {marginLeft: idx > 0 ? px(4) : 0}]} key={idx}>
                                    <Text style={styles.groupItemTagText}>指数型</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </View>
        );
    };

    const addCompareItem = () => {
        if (props.data?.length > 5) return null;
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.addCompareItemWrap}>
                <Icons style={{marginRight: 2, marginTop: 4}} name={'plus'} color={'#0051CC'} size={px(18)} />
                <Text style={styles.addCompareItemText}>添加基金</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.compareGroup}>
                {/* label */}
                <View style={styles.groupLabel}>
                    <Text style={styles.groupLabelText}>基金</Text>
                </View>
                {/* 占位 */}
                {props.pkPinning ? groupItem(props.pkPinning, -1) : null}
                <ScrollView
                    style={{flex: 1}}
                    bounces={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={1}
                    ref={groupScrollViewRef}
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
                        scrolling.current && props.onScroll?.(e.nativeEvent.contentOffset.x);
                    }}>
                    {/* list */}
                    <View style={{flexDirection: 'row'}}>
                        {props.data.filter((item) => item != props.pkPinning).map((item, idx) => groupItem(item, idx))}
                    </View>
                    {/* 添加基金 */}
                    {props.data.length > 1 ? addCompareItem() : null}
                </ScrollView>
                {/* 添加基金 */}
                {props.data.length < 2 ? (
                    <View style={{borderLeftColor: '#E9EAEF', borderLeftWidth: 1}}>{addCompareItem()}</View>
                ) : null}
            </View>
        </View>
    );
};

const _Header = connect((state) => ({pkPinning: state.pkPinning}), {
    ...pkProductsActions,
    ...pkPinningActions,
})(Header);

export default forwardRef((props, ref) => <_Header {...props} _ref={ref} />);

const styles = StyleSheet.create({
    compareGroup: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderTopColor: '#E9EAEF',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
    },
    groupLabel: {
        width: px(87),
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
    },
    groupLabelText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        textAlign: 'center',
    },
    groupItemWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
        paddingBottom: px(16),
    },
    groupItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pinningStamp: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    groupItemContent: {
        marginTop: px(9),
        paddingHorizontal: px(8),
    },
    groupItemTitle: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
    },
    groupItemFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: px(8),
        position: 'absolute',
        bottom: px(8),
    },
    groupItemTag: {
        paddingHorizontal: px(4),
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#BDC2CC',
        height: px(19),
        justifyContent: 'center',
    },
    groupItemTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#545968',
        textAlign: 'center',
    },
    addCompareItemWrap: {
        width: px(40),
        height: px(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    addCompareItemText: {
        width: px(13),
        textAlign: 'center',
        fontSize: px(11),
        lineHeight: px(12),
        color: '#0051CC',
        marginTop: 3,
        right: 1,
    },
    btnWrap: {
        borderRadius: px(4),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: px(16),
        height: px(30),
    },
    btnText: {
        fontSize: px(13),
        lineHeight: px(18),
        textAlign: 'center',
    },
});