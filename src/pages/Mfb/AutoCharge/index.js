/*
 * @Date: 2022-07-21 15:19:00
 * @Description: 自动充值
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import ScrollTabbar from '~/components/ScrollTabbar';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {getPageData} from './services';

export default ({navigation, route}) => {
    const jump = useJump();
    const {active = 0} = route.params || {};
    const [data, setData] = useState({});
    const {type_list} = data;
    const [loading, setLoading] = useState(true);
    const scrollTab = useRef();

    const init = () => {
        getPageData()
            .then((res) => {
                if (res.code === '000000') {
                    const {title} = res.result;
                    navigation.setOptions({title: title || '自动充值'});
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        if (!loading) {
            active !== 0 && Platform.OS === 'android' && scrollTab.current?.goToPage(active);
        }
    }, [active, loading]);

    return (
        <View style={styles.container}>
            {loading ? (
                <Loading />
            ) : (
                <ScrollableTabView
                    initialPage={active}
                    renderTabBar={() => <ScrollTabbar boxStyle={styles.tabSty} />}
                    ref={scrollTab}
                    style={{flex: 1}}>
                    {type_list?.map((type, i) => {
                        const {header, items, text} = type;
                        return (
                            <ScrollView
                                bounces={false}
                                key={text + i}
                                scrollIndicatorInsets={{right: 1}}
                                style={{flex: 1}}
                                tabLabel={text}>
                                {items?.length > 0 ? (
                                    <View style={styles.card}>
                                        <View style={[Style.flexRow, styles.header]}>
                                            {header?.map((h, idx, arr) => {
                                                return (
                                                    <Text
                                                        key={h + idx}
                                                        style={[
                                                            styles.headerText,
                                                            {
                                                                flex:
                                                                    idx === 0 ? 1 : idx === arr.length - 1 ? 0.3 : 0.7,
                                                                textAlign: idx === 0 ? 'left' : 'center',
                                                            },
                                                        ]}>
                                                        {h}
                                                    </Text>
                                                );
                                            })}
                                        </View>
                                        {items.map((row, idx, arr) => {
                                            const {amount, button, name, url} = row;
                                            const disabled = button?.avail === 0;
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={url ? 0.8 : 1}
                                                    key={name + idx}
                                                    onPress={() => jump(url)}>
                                                    <View style={[Style.flexRow, styles.row]}>
                                                        <Text style={styles.name}>{name}</Text>
                                                        <Text style={styles.amount}>{amount}</Text>
                                                        {button?.text ? (
                                                            <TouchableOpacity
                                                                activeOpacity={0.8}
                                                                disabled={disabled}
                                                                onPress={() => jump(button.url)}
                                                                style={[
                                                                    styles.btn,
                                                                    disabled ? {backgroundColor: '#E9EAEF'} : {},
                                                                ]}>
                                                                <Text
                                                                    style={[
                                                                        styles.btnText,
                                                                        disabled ? {color: '#BDC2CC'} : {},
                                                                    ]}>
                                                                    {button.text}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                    {idx < arr.length - 1 && (
                                                        <View style={styles.divider}>
                                                            <View style={[styles.circle, styles.leftCircle]} />
                                                            <View style={[styles.circle, styles.rightCircle]} />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                ) : (
                                    <Empty />
                                )}
                            </ScrollView>
                        );
                    })}
                </ScrollableTabView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tabSty: {
        backgroundColor: '#fff',
        paddingLeft: px(8),
    },
    card: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        marginBottom: isIphoneX() ? 34 : Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    header: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        height: px(40),
    },
    headerText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    row: {
        height: px(64),
    },
    divider: {
        height: Space.borderWidth,
        backgroundColor: Colors.borderColor,
        position: 'relative',
    },
    circle: {
        position: 'absolute',
        top: px(-5),
        width: px(10),
        height: px(10),
        backgroundColor: Colors.bgColor,
        borderRadius: px(20),
    },
    leftCircle: {
        left: -px(22),
    },
    rightCircle: {
        right: -px(22),
    },
    name: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
        flex: 1,
    },
    amount: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        textAlign: 'right',
        flex: 0.5,
    },
    btn: {
        marginLeft: Space.marginAlign,
        paddingVertical: px(5),
        paddingHorizontal: px(14),
        borderRadius: px(20),
        backgroundColor: Colors.brandColor,
    },
    btnText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
    },
});
