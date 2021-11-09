/*
 * @Date: 2021-11-04 15:53:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-08 19:11:17
 * @Description: 挑选基金
 */
import React, {useCallback, useState} from 'react';
import {StyleSheet, ScrollView, View, Text, Platform, TouchableOpacity} from 'react-native';
import http from '../../services';
import {px, px as text} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';
import Loading from './components/PageLoading';
import {cloneDeep, findLastIndex} from 'lodash';
import {useFocusEffect} from '@react-navigation/core';

const RatioColor = [
    '#E1645C',
    '#6694F3',
    '#F8A840',
    '#CC8FDD',
    '#5DC162',
    '#C7AC6B',
    '#62C4C7',
    '#E97FAD',
    '#C2E07F',
    '#B1B4C5',
    '#E78B61',
    '#8683C9',
    '#EBDD69',
];

export default ({navigation, route}) => {
    const [data, setData] = useState({});

    const onSubmit = async () => {
        const deploy_detail = cloneDeep(data.deploy_detail);
        deploy_detail?.forEach?.((asset, index) => {
            asset.items = asset?.items?.filter((item) => item.ratio != 0);
        });
        await http.post('/portfolio/update_fund/20211101', {
            upid: route.params?.upid,
            deploy_detail: JSON.stringify(deploy_detail),
        });
    };
    useFocusEffect(
        useCallback(() => {
            const {asset} = route.params;
            if (asset) {
                setData((prev) => {
                    const next = cloneDeep(prev);
                    const index = findLastIndex(next.deploy_detail, ['type', asset.type]);
                    next.deploy_detail[index] = asset;
                    return next;
                });
            } else {
                http.get('/portfolio/choose_fund/20211101', {upid: route.params?.upid}).then((res) => {
                    if (res.code === '000000') {
                        navigation.setOptions({title: res.result.title || '挑选基金'});
                        setData(res.result);
                    }
                });
            }
        }, [navigation, route])
    );

    return (
        <>
            {Object.keys(data).length > 0 ? (
                <ScrollView bounces={false} style={styles.container} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.topPart}>
                        <View style={[Style.flexRow, styles.percent_bar]}>
                            {data?.deploy_detail?.map?.((item, index) => (
                                <View
                                    key={item + index}
                                    style={[
                                        styles.barPart,
                                        {
                                            backgroundColor: item.color || RatioColor[index],
                                            width: `${(item.ratio * 100).toFixed(2)}%`,
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                        <Text style={styles.desc}>{data?.desc}</Text>
                    </View>
                    <View style={{marginTop: px(8)}}>
                        {data?.deploy_detail?.map?.((asset, index) => {
                            return (
                                <View
                                    key={asset + index}
                                    style={{borderTopWidth: index === 0 ? 0 : Space.borderWidth, ...styles.asset_box}}>
                                    <View style={[Style.flexBetween, {paddingVertical: Space.padding}]}>
                                        <View style={Style.flexRow}>
                                            <View
                                                style={[
                                                    styles.circle,
                                                    {backgroundColor: asset.color || RatioColor[index]},
                                                ]}
                                            />
                                            <Text style={styles.assetName}>
                                                {asset.name} {(asset.ratio * 100).toFixed(2)}%
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() =>
                                                navigation.navigate('FundAdjust', {
                                                    asset: {
                                                        ...asset,
                                                        desc: '基金比例默认为平均分配，不构成投资建议',
                                                    },
                                                    ref: 'ChooseFund',
                                                })
                                            }>
                                            <Text style={styles.updateSty}>调整比例</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {asset.items
                                        ?.filter?.((item) => item.ratio != 0)
                                        ?.map?.((fund, idx, arr) => {
                                            let percent = 0;
                                            arr.forEach((item, i) => {
                                                if (i !== arr.length - 1) {
                                                    percent += (item.percent * 1).toFixed(2) * 1;
                                                }
                                            });
                                            percent = (asset.ratio * 100 - percent).toFixed(2);
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
                                                    <Text style={styles.fundPercent}>
                                                        {idx !== arr.length - 1
                                                            ? (fund.percent * 1).toFixed(2)
                                                            : percent}
                                                        %
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                </View>
                            );
                        })}
                    </View>
                    <BottomDesc />
                </ScrollView>
            ) : (
                <Loading />
            )}
            {Object.keys(data).length > 0 && data.btns && <FixedBtn btns={data.btns} onPress={onSubmit} />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        padding: Space.padding,
        paddingTop: text(12),
        backgroundColor: '#fff',
    },
    percent_bar: {
        width: '100%',
        height: text(24),
    },
    barPart: {
        height: '100%',
    },
    desc: {
        marginTop: text(8),
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    asset_box: {
        paddingHorizontal: Space.padding,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(5),
        marginRight: text(8),
    },
    assetName: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    updateSty: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.brandColor,
    },
    fund_box: {
        paddingVertical: text(12),
        paddingRight: text(2),
        paddingLeft: text(18),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    fundName: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    fundCode: {
        marginTop: text(4),
        fontSize: Font.textSm,
        lineHeight: text(12),
        color: Colors.lightGrayColor,
        fontFamily: Font.numFontFamily,
    },
    fundPercent: {
        fontSize: Font.textH3,
        lineHeight: text(15),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
});
