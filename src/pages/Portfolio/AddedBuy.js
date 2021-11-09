/*
 * @Date: 2021-01-20 10:25:41
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-11-08 13:39:39
 * @Description: 购买定投
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle.js';
import {px, onlyNumber, formaNum, debounce} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import FixedBtn from '../../components/Button/MFixedButton';
import http from '../../services';
import Toast from '../../components/Toast/Toast.js';
import BottomDesc from '../../components/BottomDesc';
import FastImage from 'react-native-fast-image';
import PageLoading from './components/PageLoading.js';
import {useFocusEffect} from '@react-navigation/native';

const AddedBuy = ({navigation, route}) => {
    const [pageLoading, setPageLoading] = useState(true);
    const [configLoading, setConfigLoading] = useState(true);

    const [data, setData] = useState({});

    const initConfigData = useMemo(() => {
        return {
            plan_id: null,
            notice: '',
            fund_list_dst: [],
            fund_list: [],
        };
    }, []);
    const [configData, setConfigData] = useState(initConfigData);

    const [amount, setAmount] = useState('');
    const [errTip, setErrTip] = useState('');
    const planId = useRef(''); // 单独维护planId fixBtn里不用这个

    useFocusEffect(
        useCallback(() => {
            if (showDetail) {
                getNewConfig(amount);
            }
        }, [getNewConfig, amount, showDetail])
    );

    const showDetail = useMemo(() => {
        return !errTip && amount;
    }, [errTip, amount]);

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        planId.current = '';
    }, [amount]);

    const init = useCallback(() => {
        setPageLoading(true);
        http.get('trade/repurchase/buy/info/20211101', {
            poid: route?.params?.poid,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({
                    title: res.result.title,
                });
                setData(res.result);
                setPageLoading(false);
            } else {
                Toast.show(res.message);
            }
        });
    }, [navigation, route.params.poid]);

    const getNewConfig = useCallback(
        debounce(
            (val) => {
                setConfigLoading(true);
                http.get('trade/repurchase/buy/plan/20211101', {
                    plan_id: planId.current,
                    poid: route?.params?.poid,
                    amount: val,
                }).then((res) => {
                    if (res.code === '000000') {
                        planId.current = res.result.plan_id;
                        setConfigData(res.result);
                    } else {
                        setConfigData(initConfigData);
                        Toast.show(res.message);
                    }
                    setConfigLoading(false);
                });
            },
            800,
            false
        ),
        []
    );

    const handlerMoneyChange = useCallback(
        (val) => {
            val = onlyNumber(val + '');
            setAmount(val);
            if (+val < data.buy_info.initial_amount) {
                setErrTip('起购金额为' + data.buy_info.initial_amount);
                setConfigData(initConfigData);
                return;
            } else if (+val >= 100000000) {
                setErrTip('金额需小于1亿');
                setConfigData(initConfigData);
                return;
            }
            setErrTip('');
            // 获得新的资产配比
            getNewConfig(val);
        },
        [data.buy_info, getNewConfig, initConfigData]
    );

    //清空输入框
    const clearInput = useCallback(() => {
        setAmount('');
        setErrTip('');
        setConfigData(initConfigData);
    }, [initConfigData]);

    const btnOption = useMemo(() => {
        let option = [];
        if (data.btns) {
            option = JSON.parse(JSON.stringify(data.btns));
            option[1].url.params.amount = amount;
            option[1].url.params.plan_id = configData.plan_id; // 如果取ref的planId不会更新
        }
        return option;
    }, [data.btns, amount, configData.plan_id]);

    const handleBuy = async () => {
        await http.get('/trade/sync/user/ratio/20211101', {
            plan_id: planId.current,
            poid: route?.params?.poid,
        });
    };

    return pageLoading ? (
        <PageLoading />
    ) : (
        <View style={{...styles.container}}>
            <ScrollView style={{color: Colors.bgColor, paddingBottom: FixedBtn.btnHeight + px(28)}}>
                <Text style={styles.title}>理财计划</Text>
                {/* 追加金额 */}
                <View style={styles.addedMoney}>
                    <Text style={styles.buyInfoTitle}>{data.buy_info.title}</Text>
                    <View style={styles.buyInput}>
                        <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={[styles.inputStyle, {fontFamily: `${amount}`.length > 0 ? Font.numMedium : null}]}
                            onBlur={(_) => {
                                if (amount && amount < data.buy_info.initial_amount) {
                                    handlerMoneyChange(data.buy_info.initial_amount);
                                } else if (amount && amount >= 100000000) {
                                    handlerMoneyChange(99999999.99);
                                }
                                // global.LogTool('buy_input');
                            }}
                            placeholder={data.buy_info.hidden_text}
                            placeholderTextColor={Colors.placeholderColor}
                            onChangeText={handlerMoneyChange}
                            value={`${amount}`}
                        />
                        {`${amount}`.length > 0 && (
                            <TouchableOpacity onPress={clearInput}>
                                <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {errTip ? (
                        <View style={styles.tip}>
                            <Text style={{color: Colors.red}}>{errTip}</Text>
                        </View>
                    ) : null}
                </View>
                {/* 配比 */}
                <View style={styles.matching}>
                    {/* 当前配比图 */}
                    <View>
                        <Text style={styles.matchRateText}>您当前大类资产配置比例</Text>
                        <View style={styles.matchRateChart}>
                            {data.fund_list_src.map((item, idx) => (
                                <View
                                    style={{
                                        backgroundColor: item.color,
                                        width: item.ratio?.toFixed(4) * 100 + '%',
                                        height: px(24),
                                    }}
                                    key={idx}
                                />
                            ))}
                        </View>
                    </View>
                    {/* 箭头 */}
                    {showDetail ? (
                        <View style={styles.downImg}>
                            <FastImage
                                source={require('../../assets/img/down.png')}
                                style={{width: px(28), height: px(28)}}
                            />
                        </View>
                    ) : null}
                    {/* 追加后配比图 */}
                    {showDetail ? (
                        configLoading ? (
                            <ActivityIndicator color="#999" size="small" />
                        ) : (
                            <View>
                                <Text style={styles.matchRateText}>追加购买后</Text>
                                <View style={styles.matchRateChart}>
                                    {configData.fund_list.map((item, idx) => (
                                        <View
                                            style={{
                                                backgroundColor: item.color,
                                                width: item.ratio?.toFixed(4) * 100 + '%',
                                                height: px(24),
                                            }}
                                            key={idx}
                                        />
                                    ))}
                                </View>
                            </View>
                        )
                    ) : null}
                </View>
                {/* hint */}
                {showDetail ? (
                    <View style={styles.hint}>
                        <Text style={styles.hintText}>{configData.notice}</Text>
                    </View>
                ) : null}

                {/* 详细资产 */}
                {showDetail ? (
                    configLoading ? (
                        <ActivityIndicator color="#999" size="small" />
                    ) : (
                        <View>
                            {configData?.fund_list_dst?.map?.((asset, index) => {
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
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() =>
                                                    navigation.navigate('FundAdjust', {
                                                        asset: {
                                                            ...asset,
                                                            desc: configData.notice,
                                                            poid: route?.params?.poid,
                                                            plan_id: planId.current,
                                                        },
                                                        ref: 'AddedBuy',
                                                    })
                                                }>
                                                <Text style={styles.updateSty}>修改</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {asset.items
                                            ?.filter?.((item) => item.amount != 0)
                                            ?.map?.((fund, idx) => {
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
                    )
                ) : null}

                {/*  */}
                <BottomDesc />
            </ScrollView>
            {/* 处理路由参数 */}
            <FixedBtn
                btns={btnOption}
                disabled={!showDetail || configLoading || !configData.plan_id}
                onPress={handleBuy}
            />
        </View>
    );
};
export default AddedBuy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingTop: 1,
    },
    title: {
        fontSize: px(13),
        paddingVertical: px(12),
        paddingBottom: px(10),
        color: Colors.lightBlackColor,
        paddingLeft: px(16),
    },
    buyInfoTitle: {
        fontSize: px(16),
        marginVertical: px(4),
    },
    addedMoney: {
        backgroundColor: '#fff',
        paddingTop: px(15),
        paddingHorizontal: px(15),
    },
    buyInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(20),
        paddingBottom: px(13),
    },
    inputStyle: {
        flex: 1,
        fontSize: px(35),
        marginLeft: px(14),
        letterSpacing: 2,
        padding: 0,
    },
    tip: {
        // height: px(33),
        paddingVertical: px(8),
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    matching: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
        padding: px(16),
    },
    downImg: {
        paddingTop: px(10),
        alignItems: 'center',
    },
    matchRateText: {
        fontSize: px(13),
        lineHeight: px(18),
    },
    matchRateChart: {
        marginTop: px(8),
        flexDirection: 'row',
        width: '100%',
    },
    hint: {
        // paddingBottom: px(8),
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
    },
    hintText: {
        lineHeight: px(18),
        fontSize: px(13),
        color: Colors.orange,
    },
    asset_box: {
        paddingHorizontal: Space.padding,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
    },
    circle: {
        width: px(10),
        height: px(10),
        borderRadius: px(5),
        marginRight: px(8),
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
