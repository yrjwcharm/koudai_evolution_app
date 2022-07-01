import React, {forwardRef, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {Font} from '~/common/commonStyle';
import http from '~/services';
import {px} from '~/utils/appUtil';
import PKParamRate from '../../components/PKParamRate';
import PKParamsRateOfSum from '../../components/PKParamsRateOfSum';
import Icon from 'react-native-vector-icons/EvilIcons';

const handlerTagHeight = (data) => {
    const max = data.reduce((memo, cur) => {
        const tagsLen = cur.tags.length;
        return tagsLen > memo ? tagsLen : memo;
    }, 0);
    return max * 24;
};

const PKParams = ({data, pkPinning, onScroll, _ref}) => {
    const [expand, setExpand] = useState(false);
    const [expandParts, setExpandParts] = useState([]);

    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);

    const totalRowHeight = useMemo(() => {
        let baseHeight = data.find((item) => item.tip) ? 70 : 55;
        return baseHeight + handlerTagHeight(data);
    }, [data]);

    const isHighStamp = useMemo(() => {
        let status = data.find((item) => item.tip);
        return status;
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
                        key={idx}
                        idx={idx}
                        expand={expand}
                        onChange={(state, name) => {
                            let arr = [...expandParts];
                            if (state) {
                                arr.push(name);
                            } else {
                                arr = arr.filter((n) => n !== name);
                            }
                            setExpandParts(arr);
                        }}
                    />
                ))}
            </View>
        );
    };

    const genValues = (item, key) => {
        // item = data.find(itm=>item.aa === itm.aa)
        item = data[0];
        return (
            <View style={styles.valuesWrap} key={key}>
                {/* 总分 */}
                <View style={[styles.totalValue, {height: totalRowHeight}]}>
                    {isHighStamp && (
                        <View style={[styles.highStamp, {opacity: true ? 1 : 0}]}>
                            <FastImage
                                source={{
                                    uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                                }}
                                style={{width: px(10), height: px(10), marginRight: 2}}
                            />
                            <Text style={styles.highStampText}>优123</Text>
                        </View>
                    )}
                    <PKParamsRateOfSum style={{marginTop: px(4)}} total={item.total_score} value={item.score} />
                    {item.tags?.map((item, idx) => (
                        <View style={styles.tag} key={idx}>
                            <Text style={styles.tagText}>123123</Text>
                        </View>
                    ))}
                </View>
                {item?.score_info?.map((itm, idx) => (
                    <ValuePart item={itm} key={idx} idx={idx} expand={expandParts.includes(itm.name) && expand} />
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
                <Text style={styles.rightBtn}>权重设置 &gt;</Text>
            </View>
            <View style={[styles.content, expand ? {} : {height: px(350), overflow: 'hidden'}]}>
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

const _PKParams = connect((state) => ({pkPinning: state.pkPinning}))(PKParams);

export default forwardRef((props, ref) => <_PKParams {...props} _ref={ref} />);

const LabelPart = ({item, idx, expand, onChange}) => {
    const [value, setValue] = useState(false);
    const onValueChange = (val) => {
        setValue(val);
        onChange(val, item.name);
        http.post('/pk/weight/switch/20220608', {open_status: +val, type: item.type}).then((res) => {
            console.log(res);
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

const ValuePart = ({item, idx, expand}) => {
    return (
        <View key={idx} style={[styles.valuePart, {backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
            <View style={styles.valueWrap}>
                <PKParamRate total={item.total_score} value={item.score} justifyContent="flex-end" />
            </View>
            {expand &&
                item.sub_items?.map?.((itm, index) => (
                    <View style={styles.valueWrap} key={index}>
                        <Text style={styles.valueText}>{itm.value}</Text>
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
        fontSize: px(16),
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
        color: '#E74949',
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
        paddingHorizontal: px(16),
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
