/*
 * @Date: 2021-11-07 10:27:15
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-07 11:53:10
 * @Description: 优化计划
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, Platform} from 'react-native';
import http from '../../services';
import Toast from '../../components/Toast';
import {px as text, px, formaNum} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';
import {Chart} from '../../components/Chart';
import {basicPieChart} from '../Portfolio/components/ChartOption';
import {FixedButton} from '../../components/Button';
import Loading from '../Portfolio/components/PageLoading';
import {Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';

const OptimizePlan = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [deltaHeight, setDeltaHeight] = useState(0);
    let passwordModalRef = useRef(null);
    useEffect(() => {
        http.get('/position/optimize_plan_view/20210101', {
            poid: route.params?.poid,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title});
                setData({
                    ...res.result,
                    chart: res.result.deploy_detail?.map((item) => ({
                        a: '1',
                        name: item.name,
                        percent: (item.ratio * 100).toFixed(2) * 1,
                        color: item.color,
                    })),
                });
            }
        });
    }, [navigation, route]);

    const passwordInput = useCallback(() => {
        passwordModalRef.current.show();
    }, [passwordModalRef]);

    const confirmOpt = useCallback(() => {
        if (data.notice) {
            Modal.show({
                confirm: true,
                content: data.notice,
                cancelText: '取消',
                confirmText: '确认',
                confirmCallBack: passwordInput,
            });
        } else {
            passwordInput();
        }
    }, [passwordInput, data.notice]);

    const submit = useCallback(
        (password) => {
            let toast = Toast.showLoading();
            http.post('/trade/adjust/do/20210101', {
                adjust_id: data.adjust_id,
                mode: data.mode,
                password,
                poid: route.params.poid,
            }).then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    navigation.navigate('TradeProcessing', {txn_id: res.result.txn_id});
                } else {
                    Toast.show(res.message);
                }
            });
        },
        [data.adjust_id, data.mode, navigation, route.params.poid]
    );

    return (
        <>
            {Object.keys(data).length > 0 ? (
                <View style={{...styles.container, paddingBottom: px(deltaHeight + 32)}}>
                    <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}}>
                        <View style={styles.topPart}>
                            {data?.chart?.length > 0 && (
                                <View style={{height: text(170)}}>
                                    <Chart
                                        initScript={basicPieChart(
                                            data?.chart,
                                            data?.chart?.map((item) => item.color),
                                            text(170)
                                        )}
                                        data={data?.chart}
                                    />
                                </View>
                            )}
                            <View
                                style={[
                                    Style.flexRow,
                                    {flexWrap: 'wrap', paddingLeft: Space.padding, marginBottom: text(8)},
                                ]}>
                                {data?.chart?.map?.((item, index) => {
                                    return (
                                        <View
                                            style={[Style.flexRow, {width: '50%', marginBottom: text(8)}]}
                                            key={item + index}>
                                            <View style={[styles.circle, {backgroundColor: item.color}]} />
                                            <Text style={styles.legendName}>{item.name}</Text>
                                            <Text style={styles.legendVal}>{item.percent}%</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={styles.detail}>
                            <View style={styles.detailHint}>
                                <Text style={styles.detailHintTitle}>{data.desc}</Text>
                                <Text style={styles.detailHintSubTitle}>{data.tip}</Text>
                            </View>
                            {data?.deploy_detail?.map?.((asset, index) => {
                                return (
                                    <View
                                        key={asset + index}
                                        style={{
                                            borderTopWidth: index === 0 ? 0 : Space.borderWidth,
                                            ...styles.asset_box,
                                        }}>
                                        <View style={[Style.flexBetween, {paddingVertical: Space.padding}]}>
                                            <View style={Style.flexRow}>
                                                <View style={[styles.circle, {backgroundColor: asset.color}]} />
                                                <Text style={styles.assetName}>
                                                    {asset.name} ¥{formaNum(asset.amount)}
                                                </Text>
                                            </View>
                                        </View>
                                        {asset.items?.map?.((fund, idx) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    key={fund + idx}
                                                    onPress={() =>
                                                        navigation.navigate('FundDetail', {
                                                            code: fund.code || fund.fund_code,
                                                        })
                                                    }
                                                    style={[Style.flexBetween, styles.fund_box]}>
                                                    <View>
                                                        <Text style={styles.fundName}>{fund.name}</Text>
                                                        <Text style={styles.fundCode}>{fund.code}</Text>
                                                    </View>
                                                    <Text style={styles.fundPercent}>¥{formaNum(fund.amount)}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <Loading />
            )}
            {Object.keys(data).length > 0 ? (
                <FixedButton title="确认优化" onPress={confirmOpt} heightChange={(height) => setDeltaHeight(height)} />
            ) : null}

            <PasswordModal ref={passwordModalRef} onDone={submit} />
        </>
    );
};
export default OptimizePlan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        paddingHorizontal: Space.marginAlign,
        paddingBottom: Space.marginVertical,
        backgroundColor: '#fff',
    },
    legendName: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
        width: text(86),
    },
    legendVal: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
        fontFamily: Font.numFontFamily,
    },
    introContainer: {
        marginTop: text(6),
        padding: text(12),
        paddingBottom: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    intro_content: {
        fontSize: text(13),
        lineHeight: text(19),
        color: Colors.descColor,
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(5),
        marginRight: text(8),
    },
    assetBox: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    ratioSty: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    divider: {
        marginVertical: text(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    detail: {
        backgroundColor: '#fff',
        marginTop: px(16),
    },
    detailHint: {
        padding: px(16),
        borderColor: Colors.borderColor,
        borderBottomWidth: Space.borderWidth,
    },
    detailHintTitle: {
        fontWeight: Platform.select({android: '700', ios: '500'}),
        fontSize: px(16),
        lineHeight: px(22),
    },
    detailHintSubTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightGrayColor,
        marginTop: px(3),
    },
    asset_box: {
        paddingHorizontal: Space.padding,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
    },
    assetName: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    updateSty: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    fund_box: {
        paddingVertical: px(12),
        paddingRight: px(2),
        paddingLeft: px(18),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    fundName: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    fundCode: {
        marginTop: px(4),
        fontSize: Font.textSm,
        lineHeight: px(12),
        color: Colors.lightGrayColor,
    },
    fundPercent: {
        fontSize: Font.textH3,
        lineHeight: px(15),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
});
