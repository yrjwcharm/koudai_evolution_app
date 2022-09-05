/*
 * @Date: 2022-08-31 10:36:01
 * @Description: 转换详情页
 */
import React, {useCallback, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {BottomModal} from '../../../components/Modal';
import HTML from '../../../components/RenderHtml';
import Toast from '../../../components/Toast';
import withPageLoading from '../../../components/withPageLoading';
import {formaNum, px} from '../../../utils/appUtil';
import {CalcResult, PortfolioTransfering} from './TradeTransfer';
import {getTransferDetail, transfetCalc} from './services';

const weightMedium = Platform.select({android: '700', ios: '500'});

const Processing = ({data = {}}) => {
    const {left_text, percent, percent_amount, right_text, tip_text, title, total_amount} = data;
    const [barWidth, setBarWidth] = useState(0);
    const [flagWidth, setFlagWidth] = useState(0);

    return (
        <>
            <Text style={styles.bigTitle}>{title}</Text>
            <View style={styles.scheduleBox}>
                <View style={Style.flexBetween}>
                    <Text style={styles.title}>{left_text}</Text>
                    <Text style={styles.title}>{right_text}</Text>
                </View>
                <View
                    onLayout={({
                        nativeEvent: {
                            layout: {width},
                        },
                    }) => setBarWidth(width)}
                    style={{paddingTop: px(12)}}>
                    <View
                        onLayout={({
                            nativeEvent: {
                                layout: {width},
                            },
                        }) => setFlagWidth(width)}
                        style={[
                            Style.flexRow,
                            styles.flagBox,
                            {
                                left: Math.min(
                                    Math.max((percent / 100) * barWidth - flagWidth / 2, 0),
                                    barWidth - flagWidth
                                ),
                            },
                        ]}>
                        <Text style={[styles.smText, {color: Colors.brandColor}]}>已转换</Text>
                        <Text style={styles.subNumText}>
                            <Text style={styles.smUnit}>￥</Text>
                            {formaNum(percent_amount)}
                        </Text>
                    </View>
                    <View style={[styles.flagPole, {left: `${percent}%`}]}>
                        <View style={styles.triangle} />
                        <View style={styles.triangleInner} />
                        <View style={styles.flagPoleLine} />
                    </View>
                    <View style={styles.outerBar}>
                        <View style={[styles.innerBar, {width: `${percent}%`}]} />
                    </View>
                    <View style={[Style.flexBetween, {marginTop: px(6)}]}>
                        <Text style={styles.numText}>
                            <Text style={styles.unit}>￥</Text>0
                        </Text>
                        <Text style={styles.numText}>
                            <Text style={styles.unit}>￥</Text>
                            {total_amount}
                        </Text>
                    </View>
                </View>
                {tip_text ? (
                    <View style={{marginTop: px(12)}}>
                        <HTML html={tip_text} style={styles.desc} />
                    </View>
                ) : null}
            </View>
        </>
    );
};

const RecordItem = ({data = {}}) => {
    const {bank_name, bank_no, items, trade_date} = data;

    return (
        <View style={styles.recordBox}>
            <View style={{padding: px(12)}}>
                <View style={Style.flexBetween}>
                    <Text style={styles.subTitle}>
                        <Text style={{fontWeight: weightMedium}}>{bank_name}</Text>
                        <Text style={[styles.desc, {color: Colors.defaultColor}]}>{bank_no}</Text>
                    </Text>
                    <Text style={styles.recordDate}>{trade_date}</Text>
                </View>
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    {items?.map?.((item, index, arr) => {
                        const {k, v} = item;
                        return (
                            <View
                                key={k + index}
                                style={{
                                    alignItems:
                                        index === 0 ? 'flex-start' : index === arr.length - 1 ? 'flex-end' : 'center',
                                }}>
                                <Text style={styles.smText}>{k}</Text>
                                <View style={{marginTop: px(4)}}>
                                    <HTML
                                        html={index === 0 ? formaNum(v) : `${v}`}
                                        style={isNaN(parseFloat(v)) ? styles.desc : styles.numText}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const Index = ({navigation, route, setLoading}) => {
    const [data, setData] = useState({});
    const {from, processing, record_list, record_title, to} = data;
    const [calcData, setCalcData] = useState();
    const bottomModal = useRef();

    /** @name 转换试算结果 */
    const onCalcResult = (params) => {
        if (calcData) {
            bottomModal.current?.show();
        } else {
            const calculating = Toast.showLoading('计算中...');
            transfetCalc(params)
                .then((res) => {
                    if (res.code === '000000') {
                        setCalcData(res.result);
                        bottomModal.current?.show();
                    }
                })
                .finally(() => {
                    Toast.hide(calculating);
                });
        }
    };

    useFocusEffect(
        useCallback(() => {
            getTransferDetail(route.params || {})
                .then((res) => {
                    if (res.code === '000000') {
                        setData(res.result);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const {right_top_btn: {params, text: btnText} = {}, title = '转换详情'} = data;
            navigation.setOptions({
                headerRight: () =>
                    btnText ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => onCalcResult(params)}>
                            <Text style={styles.subTitle}>{btnText}</Text>
                        </TouchableOpacity>
                    ) : null,
                headerRightContainerStyle: {
                    marginRight: Space.marginAlign,
                },
                title,
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [calcData, data])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <BottomModal ref={bottomModal} title="试算结果">
                {calcData ? (
                    <View style={{paddingHorizontal: Space.padding}}>
                        <CalcResult data={calcData} />
                    </View>
                ) : null}
            </BottomModal>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                {from && to ? <PortfolioTransfering data={{from, to}} /> : null}
                <View style={{paddingHorizontal: Space.padding}}>
                    {processing ? <Processing data={processing} /> : null}
                    {record_title ? (
                        <Text style={[styles.bigTitle, {marginTop: Space.marginVertical}]}>{record_title}</Text>
                    ) : null}
                    {record_list?.map?.((item, index) => {
                        return <RecordItem data={item} key={item.bank_name + index} />;
                    })}
                </View>
            </ScrollView>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    numText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    bigNumText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    subNumText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.brandColor,
        fontFamily: Font.numFontFamily,
    },
    unit: {
        fontSize: Font.textSm,
        lineHeight: px(16),
    },
    smUnit: {
        fontSize: px(10),
        lineHeight: px(14),
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: weightMedium,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    scheduleBox: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    flagBox: {
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(4),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
        alignSelf: 'flex-start',
    },
    flagPole: {
        marginLeft: -px(4),
        height: px(10),
        alignSelf: 'flex-start',
    },
    triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: px(4),
        borderColor: 'transparent',
        zIndex: -1,
        borderTopColor: Colors.brandColor,
        position: 'absolute',
        top: px(-1),
    },
    triangleInner: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: px(4),
        borderColor: 'transparent',
        zIndex: 1,
        borderTopColor: '#fff',
        position: 'absolute',
        top: px(-2),
    },
    flagPoleLine: {
        width: 1,
        height: px(8),
        backgroundColor: Colors.brandColor,
        top: px(2),
        left: px(3),
    },
    outerBar: {
        height: px(6),
        backgroundColor: '#D6D8E1',
    },
    innerBar: {
        height: '100%',
        backgroundColor: Colors.brandColor,
    },
    recordBox: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    recordDate: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
        fontFamily: Font.numRegular,
    },
});

export default withPageLoading(Index);
