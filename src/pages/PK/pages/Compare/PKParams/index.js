import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/EvilIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import {postPKWeightSwitch} from '../../../services';
import PKWeightSet from '../PKWeightSet';
import {handlerDefaultReason, handlerDefaultTotalScoreMap, handlerDefaultParamItemBest} from './utils';
import {LabelPart, ValuePart} from './parts';

const PKParams = ({result, data, pkPinning, weightsState, setWeightsState, refresh, showModal, onScroll, _ref}) => {
    const [expand, setExpand] = useState(false);
    const [totalScoreMap, setTotalScoreMap] = useState({});
    const [paramItemBest, setParamItemBest] = useState({});

    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);
    const weightSet = useRef(null);

    const [reason, setReason] = useState('');

    const totalRowHeight = useMemo(() => {
        let height = 35;
        let obj = data.find((item) => item.tip);
        if (obj) height += 16;
        if (reason) height += 24;
        if (reason.length > 10) height += 14;
        if (reason.length > 20) height += 14;
        return px(height);
    }, [data, reason]);

    useEffect(() => {
        setReason(handlerDefaultReason(result?.pk_list || []));
    }, [result]);

    useEffect(() => {
        setTotalScoreMap(handlerDefaultTotalScoreMap(data));
        setParamItemBest(handlerDefaultParamItemBest(data));
    }, [data]);

    useImperativeHandle(_ref, () => ({
        scrollTo: (x) => {
            scrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    const genLabels = () => {
        const handlerExpandApi = (state, item, newWeightState) => {
            postPKWeightSwitch({
                open_status: +state,
                type: item.type,
                fund_code_list: Object.keys(totalScoreMap || {}).join(),
                ...newWeightState,
            }).then((res) => {
                if (res.code === '000000') {
                    // 更新理由
                    setReason(res.result?.reason);
                    // 更新总分
                    setTotalScoreMap(res.result?.score);
                    // 更新展示 总分中最高的分数
                    const ts = {value: 0, code: ''};
                    for (let code in res.result?.score) {
                        let total = res.result?.score[code];
                        if (total === ts.value) {
                            ts.code = '';
                        }
                        if (total > ts.value) {
                            ts.value = Math.round(total);
                            ts.code = code;
                        }
                    }
                    setParamItemBest((val) => {
                        let newVal = {...val};
                        newVal.ts = ts;
                        return newVal;
                    });
                }
            });
        };
        const obj = data?.[0];
        return (
            <View style={styles.labelsWrap}>
                {/* 总分 */}
                <View style={[styles.totalLabel, {height: totalRowHeight}]}>
                    <Text style={styles.totalLabelText}>总PK分</Text>
                </View>
                {obj?.score_info?.map((item, idx) => (
                    <LabelPart
                        item={item}
                        key={idx + item.name}
                        idx={idx}
                        expand={expand}
                        weightsState={weightsState}
                        onChange={(state, itm) => {
                            global.LogTool('PKContrast_ComparisonItemSwitch', itm.name);
                            // 更新权重分数
                            const newWeightState = {...weightsState, [itm.type]: state ? 100 : 0};
                            setWeightsState(newWeightState);
                            handlerExpandApi(state, item, newWeightState);
                        }}
                    />
                ))}
            </View>
        );
    };

    const genValues = (item, key) => {
        if (!item) return null;

        return (
            <View style={styles.valuesWrap} key={key + item.code}>
                {/* 总分 */}
                <View
                    style={[
                        styles.totalValue,
                        {height: totalRowHeight, justifyContent: item.tip ? 'flex-start' : 'center'},
                    ]}>
                    {!!item.tip && (
                        <View style={[styles.highStamp]}>
                            <FastImage
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                                }}
                                style={{width: px(10), height: px(10), marginRight: 2}}
                            />
                            <Text style={styles.highStampText}>{item.tip}</Text>
                        </View>
                    )}
                    <Text
                        style={{
                            marginTop: item.tip ? px(16) : 0,
                            color: paramItemBest?.ts?.code === item.code ? '#E74949' : '#545968',
                            fontSize: px(18),
                            lineHeight: px(25),
                            textAlign: 'center',
                        }}>
                        {totalScoreMap[item.code] || '--'}
                    </Text>
                    {!!(item.tip && reason) && (
                        <View style={[styles.tag]}>
                            <Text style={styles.tagText}>{reason}</Text>
                        </View>
                    )}
                </View>
                {item?.score_info?.map((itm, idx) => (
                    <ValuePart
                        key={idx + itm.name}
                        item={itm}
                        idx={idx}
                        best={paramItemBest?.[itm.type]?.code === item.code}
                        expand={expand}
                        weightsState={weightsState}
                    />
                ))}
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const obj = data?.[0];
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 0.5};
        return (
            <View style={{width: px(40)}}>
                <View style={{height: totalRowHeight, ...border}} />
                {obj?.score_info?.map((item, idx) => (
                    <View key={idx} style={[{backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
                        <>
                            <View key={-1} style={{height: px(55), width: px(40), ...border}} />
                            {weightsState[item.type] > 0 &&
                                expand &&
                                item.sub_items?.map((_, index) => (
                                    <View key={index} style={{height: px(55), width: px(40), ...border}} />
                                ))}
                        </>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                        showModal('PKParams');
                    }}>
                    <Text style={styles.title}>PK</Text>
                    {result?.pk_explain ? (
                        <FastImage
                            style={{width: px(14), height: px(14), marginLeft: 3}}
                            source={require('../../../../../assets/img/tip.png')}
                        />
                    ) : null}
                </TouchableOpacity>
                {result.weight_button ? (
                    <Text
                        style={styles.rightBtn}
                        onPress={() => {
                            global.LogTool('PKContrast_WeightSetting');
                            weightSet.current.show();
                        }}>
                        {result.weight_button.text}
                        <SimpleIcon
                            name="arrow-right"
                            size={9}
                            color="#0051cc"
                            style={{marginLeft: px(3), marginTop: px(2)}}
                        />
                    </Text>
                ) : null}
            </View>
            <View style={[styles.content]}>
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
                        onScroll?.(_.nativeEvent.contentOffset.x);
                        scrolling.current = true;
                    }}
                    onMomentumScrollEnd={(_) => {
                        onScroll?.(_.nativeEvent.contentOffset.x);
                        scrolling.current = false;
                    }}
                    onScrollBeginDrag={(_) => {
                        onScroll?.(_.nativeEvent.contentOffset.x);
                        scrolling.current = true;
                    }}
                    onScrollEndDrag={(_) => {
                        onScroll?.(_.nativeEvent.contentOffset.x);
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
                    global.LogTool('PKContrast_ExpandAndCollapse', 1);
                    setExpand((val) => !val);
                }}>
                <Text style={styles.expandText}>{expand ? '收起' : '展开明细'}</Text>
                <Icon name={expand ? 'chevron-up' : 'chevron-down'} size={25} color="#0051CC" />
            </TouchableOpacity>
            <PKWeightSet
                weightsState={weightsState}
                setWeightsState={setWeightsState}
                refresh={refresh}
                ref={weightSet}
            />
        </View>
    );
};

const _PKParams = connect((state) => ({pkPinning: state.pkPinning[global.pkEntry]}))(PKParams);

export default forwardRef((props, ref) => <_PKParams {...props} _ref={ref} />);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: px(8),
        paddingHorizontal: px(16),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    title: {
        fontSize: px(14),
        lineHeight: px(22),
        color: '#121D3a',
    },
    rightBtn: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051cc',
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
    valuesWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 0.5,
    },
    totalLabel: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    totalLabelText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        textAlign: 'center',
    },
    totalValue: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        paddingHorizontal: px(8),
        backgroundColor: '#fff',
    },
    highStamp: {
        position: 'absolute',
        backgroundColor: '#E74949',
        paddingHorizontal: px(4),
        paddingVertical: px(2),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomRightRadius: px(6),
    },
    highStampText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    tag: {
        paddingHorizontal: px(4),
        paddingVertical: px(3),
        backgroundColor: '#FFF2F2',
        borderRadius: 2,
        marginTop: px(4),
    },
    tagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#E74949',
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
