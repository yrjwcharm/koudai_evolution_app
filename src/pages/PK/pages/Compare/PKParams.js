import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Switch, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import PKParamRate from '../../components/PKParamRate';
import PKParamsRateOfSum from '../../components/PKParamsRateOfSum';
import Icon from 'react-native-vector-icons/EvilIcons';
import {postPKWeightSwitch} from '../../services';
import PKWeightSet from './PKWeightSet';

const handlerDefaultExpandParts = (data) => {
    return (
        data?.[0]?.score_info?.reduce?.((memo, cur) => {
            if (cur.open_status) memo.push(cur.name);
            return memo;
        }, []) || []
    );
};

const handlerDefaultParamItemBest = (data) => {
    let obj = {};
    data?.forEach((item) => {
        // 总分
        if (!obj.ts) obj.ts = {value: 0, code: ''};
        if (item.total_score_info === obj.ts.value) {
            obj.ts.code = '';
        }
        if (item.total_score_info > obj.ts.value) {
            obj.ts.value = Math.round(item.total_score_info);
            obj.ts.code = item.code;
        }
        // 详细
        item.score_info?.forEach?.((itm) => {
            let key = itm.type;
            if (!obj[key]) obj[key] = {value: 0, code: ''};
            if (itm.score === obj[key].value) {
                obj[key].code = '';
            }
            if (itm.score > obj[key].value) {
                obj[key].value = Math.round(itm.score);
                obj[key].code = item.code;
            }
        });
    });
    return obj;
};

const PKParams = ({data, weightButton, pkPinning, onScroll, refresh, _ref}) => {
    const [expand, setExpand] = useState(false);
    const [expandParts, setExpandParts] = useState([]);
    const [scoreDiff, setScoreDiff] = useState({});
    const [paramItemBest, setParamItemBest] = useState({});

    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);
    const weightSet = useRef(null);

    const totalRowHeight = useMemo(() => {
        let height = 55;
        let obj = data.find((item) => item.tip);
        if (obj) height += 16;
        if (obj?.reason) height += 24;
        return height;
    }, [data]);

    useEffect(() => {
        setExpandParts(handlerDefaultExpandParts(data));
        setParamItemBest(handlerDefaultParamItemBest(data));
    }, [data]);

    useImperativeHandle(_ref, () => ({
        scrollTo: (x) => {
            scrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    const genLabels = () => {
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
                        onChange={(state, name) => {
                            global.LogTool('PKContrast_ComparisonItemSwitch', name);
                            let arr = [...expandParts];
                            if (state) {
                                arr.push(name);
                            } else {
                                arr = arr.filter((n) => n !== name);
                            }
                            setExpandParts(arr);
                            setScoreDiff((val) => {
                                return data.reduce((memo, cur) => {
                                    let oldScore = val[cur.code] || 0;
                                    let score = cur.score_info[idx].close_value;
                                    if (state) memo[cur.code] = oldScore + score;
                                    else memo[cur.code] = oldScore - score;
                                    return memo;
                                }, {});
                            });
                        }}
                    />
                ))}
            </View>
        );
    };

    const genValues = (item, key) => {
        if (!item) return null;
        let dScore = scoreDiff[item.code] || 0;

        const handlerScore = (a, b) => {
            return Math.round((a * 1000 + b * 1000) / 1000);
        };
        return (
            <View style={styles.valuesWrap} key={key + item.code}>
                {/* 总分 */}
                <View style={[styles.totalValue, {height: totalRowHeight}]}>
                    <View style={[styles.highStamp, {opacity: item.tip ? 1 : 0}]}>
                        <FastImage
                            source={{
                                uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                            }}
                            style={{width: px(10), height: px(10), marginRight: 2}}
                        />
                        <Text style={styles.highStampText}>{item.tip}</Text>
                    </View>
                    <PKParamsRateOfSum
                        style={{marginTop: px(16)}}
                        color={paramItemBest?.ts?.code === item.code ? '#E74949' : '#545968'}
                        value={handlerScore(item.total_score_info, dScore)}
                    />
                    <View style={[styles.tag, {opacity: item.reason ? 1 : 0}]}>
                        <Text style={styles.tagText}>{item.reason}</Text>
                    </View>
                </View>
                {item?.score_info?.map((itm, idx) => (
                    <ValuePart
                        key={idx + itm.name}
                        item={itm}
                        idx={idx}
                        best={paramItemBest?.[itm.type]?.code === item.code}
                        expand={expandParts.includes(itm.name) && expand}
                        expandParts={expandParts}
                    />
                ))}
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const obj = data?.[0];
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 1};
        return (
            <View style={{width: px(40)}}>
                <View style={{height: totalRowHeight, ...border}} />
                {obj?.score_info?.map((item, idx) => (
                    <View key={idx} style={[{backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
                        <>
                            <View key={-1} style={{height: px(55), width: px(40), ...border}} />
                            {expandParts.includes(item.name) &&
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
                <Text style={styles.title}>PK</Text>
                {weightButton ? (
                    <Text
                        style={styles.rightBtn}
                        onPress={() => {
                            global.LogTool('PKContrast_WeightSetting');
                            weightSet.current.show();
                        }}>
                        {weightButton.text}
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
                    global.LogTool('PKContrast_ExpandAndCollapse', 1);
                    setExpand((val) => !val);
                }}>
                <Text style={styles.expandText}>{expand ? '收起' : '展开明细'}</Text>
                <Icon name={expand ? 'chevron-up' : 'chevron-down'} size={25} color="#0051CC" />
            </TouchableOpacity>
            <PKWeightSet ref={weightSet} refresh={refresh} />
        </View>
    );
};

const _PKParams = connect((state) => ({pkPinning: state.pkPinning}))(PKParams);

export default forwardRef((props, ref) => <_PKParams {...props} _ref={ref} />);

const LabelPart = ({item, idx, expand, onChange}) => {
    const [value, setValue] = useState(!!item.open_status);
    const onValueChange = (val) => {
        setValue(val);
        onChange(val, item.name);
        postPKWeightSwitch({open_status: +val, type: item.type}).then((res) => {
            if (res.code === '000000') {
                // 由于更新权重，所以需要刷新优质推荐
                DeviceEventEmitter.emit('pkDetailBackHintRefresh');
            }
        });
    };
    return (
        <View key={idx} style={[styles.labelPart, {backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
            <View style={styles.labelWrap}>
                <Text style={[styles.labelText, {color: value ? '#545968' : '#9AA0B1'}]}>{item.name}</Text>
                <Switch
                    ios_backgroundColor={'#CCD0DB'}
                    thumbColor={'#fff'}
                    trackColor={{false: '#CCD0DB', true: '#0051CC'}}
                    value={value}
                    style={{
                        backgroundColor: 'red',
                        width: px(28),
                        height: px(18),
                        transform: [{scale: 0.6}],
                        left: px(-14) * 0.5,
                        top: px(-9) * 0.5 + 2,
                    }}
                    onValueChange={onValueChange}
                />
            </View>
            {value &&
                expand &&
                item.sub_items?.map?.((itm, index) => (
                    <View style={styles.labelWrap} key={index}>
                        <Text style={styles.labelText}>{itm.key} </Text>
                    </View>
                ))}
        </View>
    );
};

const ValuePart = ({item, idx, best, expand, expandParts}) => {
    const handlerValue = (val) => {
        let state = !!(val || val === 0);
        return state ? val : '--';
    };

    return (
        <View key={idx} style={[styles.valuePart, {backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
            <View style={styles.valueWrap}>
                <PKParamRate
                    color={best ? '#E74949' : '#545968'}
                    total={item.total_score}
                    value={expandParts.includes(item.name) ? item.score : null}
                    justifyContent="flex-end"
                />
            </View>
            {expand &&
                item.sub_items?.map?.((itm, index) => (
                    <View style={styles.valueWrap} key={index}>
                        <Text style={[styles.valueText, {color: best ? '#E74949' : '#545968'}]}>
                            {handlerValue(itm.value)}
                        </Text>
                    </View>
                ))}
        </View>
    );
};

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
        borderBottomWidth: 1,
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
        borderRightWidth: 1,
    },
    labelPart: {},
    labelWrap: {
        height: px(55),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
        paddingLeft: px(5),
        paddingRight: px(5),
    },
    labelText: {
        fontSize: px(12),
        lineHeight: px(17),
        textAlign: 'center',
    },
    valuesWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
    },
    valuePart: {},
    valueWrap: {
        height: px(55),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
        paddingHorizontal: px(8),
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: px(10),
    },
    valueText: {
        fontSize: px(14),
        lineHeight: px(22),
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
        flex: 1,
    },
    totalLabel: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
        padding: px(16),
        backgroundColor: '#fff',
    },
    totalLabelText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        textAlign: 'center',
    },
    totalValue: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
        paddingHorizontal: px(8),
        backgroundColor: '#fff',
    },
    highStamp: {
        position: 'absolute',
        backgroundColor: '#E74949',
        paddingHorizontal: px(4),
        paddingVertical: 2,
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
        paddingVertical: 3,
        backgroundColor: '#FFF2F2',
        borderRadius: 2,
        marginTop: 4,
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
        height: px(33),
    },
    expandText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
});
