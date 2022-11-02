/*
 * @Date: 2022-08-09 10:32:08
 * @Description: 基金交易规则
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import Html from '~/components/RenderHtml';
import TabBar from '~/components/TabBar';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, px} from '~/utils/appUtil';
import {getPageData} from './services';

const Index = ({navigation, route}) => {
    const {fund_code, type = 0} = route.params || {};
    const [data, setData] = useState({});
    const {type_list = []} = data;
    const scrollTab = useRef();

    useEffect(() => {
        getPageData({fund_code}).then((res) => {
            if (res.code === '000000') {
                const {title = '交易规则'} = res.result;
                navigation.setOptions({title});
                setData(res.result);
            }
        });
    }, []);

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            setTimeout(() => type !== 0 && scrollTab.current?.goToPage?.(scrollTab.current?.state?.currentPage));
        }
    }, [data]);

    return (
        <View style={styles.container}>
            {Object.keys(data).length > 0 ? (
                <ScrollableTabView
                    initialPage={type}
                    prerenderingSiblingsNumber={Infinity}
                    ref={scrollTab}
                    renderTabBar={() => <TabBar />}
                    style={{flex: 1}}>
                    {type_list?.map?.((item, index) => {
                        const {bottom_tip, fee_info, name, step_list} = item;
                        const {th, tips, title: feeTitle, tr_list} = fee_info;
                        return (
                            <ScrollView
                                bounces={false}
                                key={name + index}
                                tabLabel={name}
                                scrollIndicatorInsets={{right: 1}}
                                style={{flex: 1}}>
                                {step_list?.map?.((step, i) => {
                                    const {list, step_tip_list, title} = step;
                                    return (
                                        <View
                                            key={title + i}
                                            style={[styles.stepBox, {marginTop: i === 0 ? 0 : px(10)}]}>
                                            <Text style={styles.title}>{title}</Text>
                                            {list?.length > 0 && (
                                                <>
                                                    <Image
                                                        resizeMode={Image.resizeMode.contain}
                                                        source={require('~/assets/img/line.png')}
                                                        style={styles.line}
                                                    />
                                                    <View style={[Style.flexRow, {marginTop: px(12)}]}>
                                                        {list.map?.((itm, idx, _list) => {
                                                            const {desc, tip} = itm;
                                                            return (
                                                                <View
                                                                    key={desc + idx}
                                                                    style={{
                                                                        flex: 1,
                                                                        alignItems:
                                                                            idx === 0
                                                                                ? 'flex-start'
                                                                                : idx === _list.length - 1
                                                                                ? 'flex-end'
                                                                                : 'center',
                                                                    }}>
                                                                    <Text style={styles.desc}>{desc}</Text>
                                                                    <Text style={styles.tip}>{tip}</Text>
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                </>
                                            )}
                                            {step_tip_list?.length > 0 && (
                                                <>
                                                    <View style={styles.divider} />
                                                    {step_tip_list.map?.((notice, idx) => {
                                                        return (
                                                            <Text
                                                                key={notice + idx}
                                                                style={[
                                                                    styles.tradeNotice,
                                                                    {marginTop: idx === 0 ? 0 : Space.marginVertical},
                                                                ]}>
                                                                <Text style={styles.blueCircle}>•&nbsp;</Text>
                                                                {notice}
                                                            </Text>
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </View>
                                    );
                                })}
                                {fee_info ? (
                                    <View style={styles.feeBox}>
                                        <Text style={styles.title}>{feeTitle}</Text>
                                        {th?.length > 0 && (
                                            <View style={[Style.flexBetween, styles.th]}>
                                                <View style={styles.tableBg} />
                                                {th.map?.((h, i) => {
                                                    return (
                                                        <Text
                                                            key={h + i}
                                                            style={[styles.tableText, {color: Colors.lightGrayColor}]}>
                                                            {h}
                                                        </Text>
                                                    );
                                                })}
                                            </View>
                                        )}
                                        {tr_list?.map?.((tr, i, arr) => {
                                            return (
                                                <View key={`tr${i}`} style={[Style.flexRow, styles.tr]}>
                                                    {i % 2 === 1 && <View style={styles.tableBg} />}
                                                    {i === arr.length - 1 && i % 2 === 0 && (
                                                        <View style={styles.tableBorder} />
                                                    )}
                                                    {tr.map?.((r, idx, _tr) => {
                                                        return (
                                                            <View key={r + idx} style={{flex: idx === 0 ? 1.5 : 1}}>
                                                                {typeof r === 'string' ? (
                                                                    <View
                                                                        style={{
                                                                            alignItems:
                                                                                idx === 0
                                                                                    ? 'flex-start'
                                                                                    : idx === _tr.length - 1
                                                                                    ? 'flex-end'
                                                                                    : 'center',
                                                                        }}>
                                                                        <Html html={r} style={styles.tableText} />
                                                                    </View>
                                                                ) : (
                                                                    <View style={Style.flexRow}>
                                                                        <Text
                                                                            style={[
                                                                                styles.tableText,
                                                                                styles.originText,
                                                                                i === arr.length - 1
                                                                                    ? {textDecorationLine: 'none'}
                                                                                    : {},
                                                                            ]}>
                                                                            {r[0]}
                                                                        </Text>
                                                                        <View
                                                                            style={{
                                                                                alignItems: 'flex-end',
                                                                                flex: 1,
                                                                            }}>
                                                                            <Html
                                                                                html={r[1]}
                                                                                style={styles.tableText}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            );
                                        })}
                                        {tips ? (
                                            <View style={{marginTop: Space.marginVertical}}>
                                                <Html html={tips} style={styles.tradeNotice} />
                                            </View>
                                        ) : null}
                                    </View>
                                ) : null}
                                {bottom_tip ? <Text style={styles.bottomTip}>{bottom_tip}</Text> : null}
                                <BottomDesc />
                            </ScrollView>
                        );
                    })}
                </ScrollableTabView>
            ) : (
                <Loading />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    stepBox: {
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    line: {
        marginTop: Space.marginVertical,
        height: px(8),
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    tip: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.brandColor,
    },
    divider: {
        marginVertical: Space.marginVertical,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tradeNotice: {
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.lightGrayColor,
        textAlign: 'justify',
    },
    blueCircle: {
        fontSize: px(18),
        lineHeight: px(22),
        color: Colors.brandColor,
    },
    feeBox: {
        marginTop: px(10),
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    th: {
        marginTop: px(12),
        height: px(36),
    },
    tableText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    tableBg: {
        position: 'absolute',
        left: -Space.padding,
        width: deviceWidth,
        height: '100%',
        backgroundColor: Colors.bgColor,
    },
    tr: {
        height: px(44),
    },
    tableBorder: {
        position: 'absolute',
        bottom: 0,
        left: -Space.padding,
        width: deviceWidth,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    originText: {
        flex: 1.8,
        color: Colors.descColor,
        fontFamily: Font.numMedium,
        textAlign: 'right',
        textDecorationColor: Colors.defaultColor,
        textDecorationLine: 'line-through',
    },
    bottomTip: {
        paddingTop: px(12),
        paddingHorizontal: Space.padding,
        fontSize: Font.textH3,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
});

export default Index;
