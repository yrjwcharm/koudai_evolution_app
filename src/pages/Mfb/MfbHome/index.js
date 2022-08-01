/*
 * @Date: 2022-07-18 15:04:08
 * @Description: 魔方宝首页
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Feather from 'react-native-vector-icons/Feather';
import tip from '~/assets/img/tip.png';
import mfbArrow from '~/assets/personal/mfbArrow.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import NumText from '~/components/NumText';
import HTML from '~/components/RenderHtml';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px, tagColor} from '~/utils/appUtil';
import {getPageData} from './services';

const renderBtns = ({buttons, jump, style = {}}) => {
    return buttons?.map((btn, i, arr) => {
        const {avail, text, url} = btn;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={avail === 0}
                key={text + i}
                onPress={() => jump(url)}
                style={[
                    Style.flexCenter,
                    styles.button,
                    style,
                    i === 0
                        ? {
                              borderColor: avail === 0 ? '#ddd' : Colors.descColor,
                              marginRight: px(12),
                          }
                        : {},
                    i === arr.length - 1 ? {backgroundColor: avail === 0 ? '#ddd' : Colors.brandColor} : {},
                ]}>
                <Text
                    style={[
                        styles.buttonText,
                        i === 0 ? {color: avail === 0 ? '#ddd' : Colors.descColor} : {},
                        i === arr.length - 1 ? {color: '#fff'} : {},
                    ]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    });
};

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
    const {charge_prompt, close_card, empty_button, empty_tip, open_card, open_items, title, title_tip} = data;
    const {
        amount_text,
        buttons,
        desc,
        icon,
        items,
        pay_amount_text,
        pay_date,
        pay_date_text,
        pay_percent,
        title: subTitle,
    } = charge_prompt || open_items || {};
    const [barLength, setBarLength] = useState(0);
    const amountBox = useRef();

    /** @name 弹窗展示提示 */
    const showTips = (tips) => {
        const {content, img, title: modalTitle} = tips;
        Modal.show(
            {
                children: (
                    <View style={{padding: Space.padding}}>
                        {img ? <Image source={{uri: img}} style={{width: '100%', height: px(140)}} /> : null}
                        {content?.map((item, index) => {
                            const {key: _key, val} = item;
                            return (
                                <View key={val + index} style={{marginTop: index === 0 ? 0 : Space.marginVertical}}>
                                    {_key ? <HTML html={`${_key}:`} style={styles.title} /> : null}
                                    {val ? (
                                        <View style={{marginTop: px(4)}}>
                                            <HTML html={val} style={styles.tipsVal} />
                                        </View>
                                    ) : null}
                                </View>
                            );
                        })}
                    </View>
                ),
                title: modalTitle,
            },
            'slide'
        );
    };

    return (
        <View style={{paddingTop: Space.padding}}>
            <View style={Style.flexRow}>
                <Text style={[styles.bigTitle, {marginRight: px(4)}]}>{title}</Text>
                {title_tip ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => showTips(title_tip)}>
                        <Image source={tip} style={styles.aboutAutoCharge} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={styles.autoChargeBox}>
                {/* 自动充值提醒 */}
                {charge_prompt ? (
                    <View style={{paddingTop: Space.padding, paddingBottom: px(20)}}>
                        <View style={Style.flexRow}>
                            <Image source={{uri: icon}} style={styles.subTitleIcon} />
                            <HTML html={subTitle} style={styles.subTitle} />
                        </View>
                        <Text style={[styles.desc, {marginTop: px(6)}]}>{desc}</Text>
                        <View style={{marginTop: px(12)}}>
                            <View style={Style.flexRow}>
                                <View
                                    onLayout={({
                                        nativeEvent: {
                                            layout: {width},
                                        },
                                    }) => {
                                        const left = (barLength * pay_percent) / 100 - width / 2;
                                        amountBox.current?.setNativeProps({
                                            style: [styles.amountBox, {marginLeft: left < -px(4) ? -px(4) : left}],
                                        });
                                    }}
                                    ref={amountBox}
                                    style={styles.amountBox}>
                                    <Text style={styles.amountText}>{amount_text}</Text>
                                </View>
                            </View>
                            <Image
                                source={mfbArrow}
                                style={[styles.mfbArrow, {marginLeft: (barLength * pay_percent) / 100 - px(3)}]}
                            />
                            <View
                                onLayout={({
                                    nativeEvent: {
                                        layout: {width},
                                    },
                                }) => setBarLength(width)}
                                style={styles.percentBar}>
                                <View style={[styles.activeBar, {width: `${pay_percent}%`}]} />
                            </View>
                            <View style={[Style.flexBetween, {marginTop: px(6)}]}>
                                <Text style={styles.smallText}>
                                    {pay_date_text}
                                    <Text style={{color: Colors.defaultColor}}>{pay_date}</Text>
                                </Text>
                                <Text style={[styles.smallText, {color: Colors.defaultColor}]}>{pay_amount_text}</Text>
                            </View>
                        </View>
                        {buttons?.length > 0 && (
                            <View style={[Style.flexRow, {marginTop: Space.marginVertical}]}>
                                {renderBtns({buttons, jump})}
                            </View>
                        )}
                    </View>
                ) : null}
                {/* 未开启计划 */}
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
                {/* 计划列表 */}
                {open_items ? (
                    <View>
                        <View style={{paddingVertical: Space.padding}}>
                            <View style={Style.flexRow}>
                                <Image source={{uri: icon}} style={styles.subTitleIcon} />
                                <Text style={styles.subTitle}>{subTitle}</Text>
                            </View>
                            <Text style={[styles.desc, {marginTop: px(4)}]}>{desc}</Text>
                        </View>
                        {items?.map((item, index) => {
                            const {button, name} = item;
                            const disabled = button?.avail === 0;
                            return (
                                <View
                                    key={name + index}
                                    style={[Style.flexBetween, styles.toolItem, {marginTop: index === 0 ? -px(4) : 0}]}>
                                    <Text style={styles.subTitle}>{name}</Text>
                                    {button?.text ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={disabled}
                                            onPress={() => jump(button.url)}
                                            style={[styles.openToolBtn, disabled ? {backgroundColor: '#E9EAEF'} : {}]}>
                                            <Text style={[styles.desc, {color: disabled ? '#BDC2CC' : '#fff'}]}>
                                                {button.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            );
                        })}
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

const TradeRecords = ({data = {}}) => {
    const jump = useJump();
    const {title, types} = data;
    const pageRef = useRef(0);
    const [currentTab, setCurrentTab] = useState(0);

    /** @name 交易记录tag颜色 */
    const tradeStuatusColor = (status) => {
        if (status < 0) {
            return Colors.red;
        } else if (status == 0 || status == 1) {
            return Colors.orange;
        } else if (status == 5 || status == 6) {
            return Colors.green;
        } else {
            return Colors.defaultColor;
        }
    };

    /** @name 名称过长省略处理 */
    const handlerName = (val = '') => {
        if (val.length > 9) {
            val = val.slice(0, 5) + '...' + val.slice(-4);
        }
        return val;
    };

    return (
        <View style={{paddingTop: px(32)}}>
            <Text style={styles.bigTitle}>{title}</Text>
            <ScrollableTabView
                initialPage={0}
                onChangeTab={({i}) => {
                    pageRef.current = i;
                    setCurrentTab(i);
                }}
                prerenderingSiblingsNumber={Infinity}
                renderTabBar={() => <CapsuleTabbar boxStyle={styles.tabsContainer} />}
                style={{flex: 1}}>
                {types.map((tab) => {
                    const {has_more, key, val} = tab;
                    const {list} = types[currentTab];
                    return (
                        <View key={key} tabLabel={val}>
                            {list?.length > 0 ? (
                                list.map((item, index) => {
                                    const {error_msg, items, name, notice, time, type, url} = item;
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={!url}
                                            key={time + index}
                                            onPress={() => jump(url)}
                                            style={styles.card}>
                                            <View style={{paddingHorizontal: Space.padding}}>
                                                <View style={Style.flexBetween}>
                                                    <View style={Style.flexRow}>
                                                        <View
                                                            style={[
                                                                Style.tag,
                                                                {
                                                                    marginRight: px(8),
                                                                    backgroundColor: tagColor(type?.val).bg_color,
                                                                },
                                                            ]}>
                                                            <Text
                                                                style={{
                                                                    fontSize: px(11),
                                                                    color: tagColor(type?.val).text_color,
                                                                }}>
                                                                {type?.text}
                                                            </Text>
                                                        </View>
                                                        <Text style={styles.title}>{handlerName(name)}</Text>
                                                    </View>
                                                    <Text style={styles.date}>{time}</Text>
                                                </View>
                                                <View style={[Style.flexRow, {paddingVertical: px(13)}]}>
                                                    {items.map((_item, _index, arr) => (
                                                        <View
                                                            key={_index}
                                                            style={{
                                                                flex: 1,
                                                                alignItems:
                                                                    _index === 0
                                                                        ? 'flex-start'
                                                                        : _index === arr.length - 1
                                                                        ? 'flex-end'
                                                                        : 'center',
                                                            }}>
                                                            <Text style={styles.light_text}>{_item.k}</Text>
                                                            <Text
                                                                style={[
                                                                    styles.num_text,
                                                                    {
                                                                        fontFamily:
                                                                            _index !== arr.length - 1
                                                                                ? Font.numMedium
                                                                                : null,
                                                                        color:
                                                                            _index === arr.length - 1
                                                                                ? tradeStuatusColor(_item.v.val)
                                                                                : Colors.defaultColor,
                                                                    },
                                                                ]}>
                                                                {_item.v?.text || _item.v}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                                {notice ? (
                                                    <View style={styles.notice}>
                                                        <Text style={styles.notice_text}>{notice}</Text>
                                                    </View>
                                                ) : null}
                                            </View>
                                            {error_msg ? (
                                                <View style={styles.errorMsgBox}>
                                                    <Text style={styles.errorMsg}>
                                                        {error_msg}&nbsp;
                                                        <Feather name={'chevron-right'} size={16} color={Colors.red} />
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Empty text={'暂无数据'} />
                            )}
                            {has_more === 1 ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        jump({
                                            path: 'TradeRecord',
                                            params: {fr: 'mfb', tabActive: pageRef.current},
                                            type: 1,
                                        })
                                    }
                                    style={[Style.flexRowCenter, {paddingVertical: Space.padding}]}>
                                    <Text style={[styles.desc, {color: Colors.brandColor}]}>{'查看更多'}</Text>
                                    <Feather name={'chevron-right'} size={16} color={Colors.brandColor} />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    );
                })}
            </ScrollableTabView>
        </View>
    );
};

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {auto_charge, buttons, holding, intro, records} = data;
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
                <>
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
                            {records ? <TradeRecords data={records} /> : null}
                        </View>
                        <BottomDesc />
                    </ScrollView>
                    {buttons?.length > 0 && (
                        <View style={[Style.flexRow, styles.btnContainer]}>
                            {renderBtns({buttons, jump, style: {borderRadius: Space.borderRadius}})}
                        </View>
                    )}
                </>
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
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
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
    subTitleIcon: {
        marginRight: px(4),
        width: px(18),
        height: px(18),
    },
    toolItem: {
        paddingVertical: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    openToolBtn: {
        paddingVertical: px(5),
        paddingHorizontal: px(14),
        borderRadius: px(20),
        backgroundColor: Colors.brandColor,
    },
    tipsVal: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    amountBox: {
        paddingVertical: px(3),
        paddingHorizontal: px(6),
        borderRadius: px(4),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    amountText: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.brandColor,
        fontWeight: Font.weightMedium,
    },
    mfbArrow: {
        marginTop: -px(1),
        width: px(8),
        height: px(10),
    },
    percentBar: {
        borderRadius: px(1),
        height: px(6),
        position: 'relative',
        backgroundColor: '#D6D8E1',
        overflow: 'hidden',
    },
    activeBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: '#1E5AE7',
    },
    tabsContainer: {
        marginTop: px(8),
        width: deviceWidth,
    },
    card: {
        marginTop: px(12),
        paddingTop: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    date: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    light_text: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
        marginBottom: px(3),
    },
    num_text: {
        fontSize: px(13),
        lineHeight: px(16),
    },
    notice: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    notice_text: {
        fontSize: Font.textH3,
        lineHeight: px(36),
        color: Colors.lightGrayColor,
        height: px(36),
    },
    errorMsgBox: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
    },
    errorMsg: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.red,
    },
    btnContainer: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
    },
    button: {
        borderRadius: px(4),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
        flex: 1,
        height: px(40),
    },
    buttonText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
    },
});
