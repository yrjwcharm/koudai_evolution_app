/*
 * @Date: 2022-07-18 15:04:08
 * @Description: 魔方宝首页
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Feather from 'react-native-vector-icons/Feather';
import tip from '~/assets/img/tip.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import {useJump} from '~/components/hooks';
import NumText from '~/components/NumText';
import HTML from '~/components/RenderHtml';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {getPageData} from './services';

const HoldingInfo = ({data = {}}) => {
    const {
        holding: {amount: holdingAmount, date: holdingDate, profit: holdingProfit, profit_acc: holdingProfitAcc} = {},
        intro = [],
    } = data;
    const [activeSections, setActiveSections] = useState([]);

    return (
        <View style={styles.holdingInfo}>
            <LinearGradient
                colors={['#ECF4FF', '#fff']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.holdingBg}
            />
            <View style={{paddingHorizontal: Space.padding}}>
                <View style={{paddingVertical: px(20)}}>
                    <View style={Style.flexBetween}>
                        <Text style={styles.desc}>{`总金额(元) ${holdingDate}`}</Text>
                        {holdingProfit ? (
                            <View style={Style.flexRow}>
                                <Text style={[styles.desc, {marginRight: px(8)}]}>{'日收益'}</Text>
                                <NumText style={styles.smNumber} text={holdingProfit} />
                            </View>
                        ) : null}
                    </View>
                    <View style={[Style.flexBetween, {marginTop: px(6)}]}>
                        <Text style={styles.bigNumber}>{holdingAmount}</Text>
                        {holdingProfitAcc ? (
                            <View style={Style.flexRow}>
                                <Text style={[styles.desc, {marginRight: px(8)}]}>{'累计收益'}</Text>
                                <NumText style={styles.smNumber} text={holdingProfitAcc} />
                            </View>
                        ) : null}
                    </View>
                </View>
                {intro?.length > 0 && (
                    <>
                        <View style={styles.divider} />
                        <Accordion
                            activeSections={activeSections}
                            expandMultiple
                            onChange={(indexes) => setActiveSections(indexes)}
                            renderContent={() => {
                                return (
                                    <>
                                        <View style={[styles.introContentBox, {marginTop: 0}]}>
                                            <HTML html={intro[0]?.content} style={styles.introContent} />
                                        </View>
                                        <View style={{paddingVertical: Space.padding}}>
                                            <Text style={[styles.desc, {color: Colors.defaultColor}]}>
                                                {intro[1]?.title}
                                            </Text>
                                            <View style={styles.introContentBox}>
                                                <HTML html={intro[1]?.content} style={styles.introContent} />
                                            </View>
                                        </View>
                                    </>
                                );
                            }}
                            renderHeader={(section, index, isActive) => {
                                return (
                                    <View style={[Style.flexBetween, {paddingVertical: px(12)}]}>
                                        <Text style={[styles.desc, {color: Colors.defaultColor}]}>
                                            {intro[0]?.title}
                                        </Text>
                                        <Feather
                                            color={Colors.descColor}
                                            name={isActive ? 'chevron-up' : 'chevron-down'}
                                            size={16}
                                        />
                                    </View>
                                );
                            }}
                            sections={[1]}
                            touchableComponent={TouchableOpacity}
                            touchableProps={{activeOpacity: 1}}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

const AutoCharge = ({data = {}}) => {
    const jump = useJump();
    const {close_card, empty_button, empty_tip, open_card, title} = data;
    return (
        <View style={{paddingTop: Space.padding}}>
            <View style={Style.flexRow}>
                <Text style={[styles.bigTitle, {marginRight: px(4)}]}>{title}</Text>
                <TouchableOpacity activeOpacity={0.8}>
                    <Image source={tip} style={styles.aboutAutoCharge} />
                </TouchableOpacity>
            </View>
            <View style={styles.autoChargeBox}>
                {empty_tip ? (
                    <View style={[Style.flexRowCenter, {paddingVertical: px(44)}]}>
                        <Text style={styles.bigTitle}>{empty_tip}</Text>
                        {empty_button?.text ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(empty_button.url)}
                                style={[Style.flexRow, {marginLeft: px(8)}]}>
                                <Text style={[styles.subTitle, {color: Colors.brandColor}]}>{empty_button.text}</Text>
                                <Feather color={Colors.brandColor} name="chevron-right" size={16} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}
            </View>
            <View style={Style.flexBetween}>
                {open_card?.text ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => jump(open_card.url)}
                        style={[Style.flexBetween, styles.autoChargeBox, styles.openCard]}>
                        <Text style={styles.subTitle}>{open_card.text}</Text>
                        <Feather color={Colors.descColor} name="chevron-right" size={16} />
                    </TouchableOpacity>
                ) : null}
                {close_card?.text ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => jump(close_card.url)}
                        style={[Style.flexBetween, styles.autoChargeBox, styles.openCard]}>
                        <Text style={styles.subTitle}>{close_card.text}</Text>
                        <Feather color={Colors.descColor} name="chevron-right" size={16} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {auto_charge, holding, intro} = data;
    const [refreshing, setRefreshing] = useState(false);

    const init = () => {
        getPageData({})
            .then((res) => {
                if (res.code === '000000') {
                    const {title, top_button} = res.result;
                    navigation.setOptions({
                        headerRight: () =>
                            top_button?.text ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => jump(top_button.url)}
                                    style={{marginRight: Space.marginAlign}}>
                                    <Text style={styles.topBtnText}>{top_button.text}</Text>
                                </TouchableOpacity>
                            ) : null,
                        title: title || '魔方宝',
                    });
                    setData(res.result);
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    useEffect(() => {
        navigation.setOptions({
            headerBackImage: () => {
                return (
                    <Feather
                        name="chevron-left"
                        color="#fff"
                        size={px(26)}
                        style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                    />
                );
            },
            headerStyle: {
                backgroundColor: '#1E5AE7',
                shadowOpacity: 0,
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
            headerTitleStyle: {
                color: '#fff',
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            init();
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return (
        <View style={styles.container}>
            {Object.keys(data).length > 0 ? (
                <ScrollView
                    refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}
                    scrollIndicatorInsets={{right: 1}}
                    style={{flex: 1}}>
                    <LinearGradient
                        colors={['#1E5AE7', Colors.bgColor]}
                        start={{x: 0, y: 0.33}}
                        end={{x: 0, y: 1}}
                        style={styles.topBg}
                    />
                    <View style={{paddingHorizontal: Space.padding}}>
                        {holding ? <HoldingInfo data={{holding, intro}} /> : null}
                        {auto_charge ? <AutoCharge data={auto_charge} /> : null}
                    </View>
                </ScrollView>
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
    topBtnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: '#fff',
    },
    topBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: px(135),
    },
    holdingInfo: {
        marginTop: px(8),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    holdingBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: px(30),
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    smNumber: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    normalNumber: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    bigNumber: {
        fontSize: px(26),
        lineHeight: px(36),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    divider: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    introContentBox: {
        marginTop: px(8),
        padding: px(12),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
    },
    introContent: {
        fontSize: Font.textH3,
        lineHeight: px(19),
        color: Colors.descColor,
    },
    aboutAutoCharge: {
        width: px(13),
        height: px(13),
    },
    autoChargeBox: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    openCard: {
        paddingVertical: Space.padding,
        paddingRight: px(12),
        width: px(166),
    },
});
