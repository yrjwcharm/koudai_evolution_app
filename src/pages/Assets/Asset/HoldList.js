/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';

import NoAccountRender from './NoAccountRender';
import StickyHeader from '~/components/Sticky';
import {SmButton} from '~/components/Button';
import {getAlertColor} from './util';
import {useJump} from '~/components/hooks';
import ProductCards from '~/components/Portfolios/ProductCards';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Modal} from '~/components/Modal';
import {closeRecommend} from './service';
const yellow = '#FF7D41';
const HoldList = ({products, stickyHeaderY, scrollY, reload}) => {
    const [layout, setLayout] = useState({});
    const onLayout = (key, e) => {
        e.persist();
        setLayout((prev) => {
            let tmp = {...prev};
            tmp[key] = {};
            tmp[key].top = e.nativeEvent?.layout?.y;
            tmp[key].height = e.nativeEvent?.layout?.height;
            return tmp;
        });
    };
    // 推荐关闭
    const closeRecommendCard = (data) => {
        Modal.show({
            title: data?.title,
            content: data?.content,
            confirm: true,
            confirmText: '感兴趣',
            cancelText: '不感兴趣',
            cancelCallBack: async () => {
                let res = await closeRecommend(data?.params);
                if (res.code == '000000') {
                    reload();
                }
            },
        });
    };
    return (
        <>
            <View style={{position: 'relative'}}>
                {products?.map((account, key) => {
                    // px(38)--大标题高度 px(201)推荐卡片高度
                    let _top =
                        (layout[key]?.top || 0) + stickyHeaderY + px(38) + (account?.recommend_card ? px(213) : 0);
                    return (
                        <View key={key} style={{marginBottom: px(16)}} onLayout={(e) => onLayout(key, e)}>
                            <ListTitle title={account.title} desc={account?.desc} />
                            {/* 推荐 */}
                            {account?.recommend_card ? (
                                <View style={styles.recommend_card_con}>
                                    <Image
                                        source={{uri: account?.recommend_card?.title_icon}}
                                        style={{width: px(64), height: px(18), marginBottom: px(6)}}
                                    />
                                    <TouchableOpacity
                                        style={styles.recommend_card_close}
                                        onPress={() => closeRecommendCard(account?.recommend_card?.close)}>
                                        <AntDesign name={'close'} color={Colors.lightGrayColor} size={px(14)} />
                                    </TouchableOpacity>
                                    <Text style={{fontSize: px(12), lineHeight: px(17)}} numberOfLines={2}>
                                        {account?.recommend_card?.desc}
                                    </Text>
                                    {account?.recommend_card?.card && (
                                        <ProductCards data={account?.recommend_card?.card} />
                                    )}
                                </View>
                            ) : null}
                            <View style={styles.card_con}>
                                {/* header */}
                                {account?.items?.length ? (
                                    <StickyHeader
                                        stickyHeaderY={_top} // 把头部高度传入
                                        itemHeight={layout[key]?.height - px(67) - px(213)} //px(67)是大标题和table_header的高度
                                        stickyScrollY={scrollY}>
                                        <View style={[Style.flexBetween, styles.table_header]}>
                                            <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                                            <Text style={styles.light_text}>日收益</Text>
                                            <Text style={styles.light_text}>累计收益</Text>
                                        </View>
                                        <View style={styles.line} />
                                    </StickyHeader>
                                ) : (
                                    <>
                                        <View style={[Style.flexBetween, styles.table_header]}>
                                            <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                                            <Text style={styles.light_text}>日收益</Text>
                                            <Text style={styles.light_text}>累计收益</Text>
                                        </View>
                                        <View style={styles.line} />
                                    </>
                                )}

                                {/* 升级的卡片 */}
                                {account?.upgrade_list?.length
                                    ? account?.upgrade_list?.map((upgrade, _index) => (
                                          <View
                                              style={{
                                                  borderWidth: px(1.5),
                                                  borderColor: yellow,
                                                  borderRadius: px(6),
                                              }}>
                                              {upgrade?.items?.map((product = {}, index, arr) => {
                                                  // 卡片是否只有一个或者是最后一个
                                                  const flag = index + 1 == arr.length || index == arr.length - 1;
                                                  return (
                                                      <CardItem upgrade={true} data={product} flag={flag} key={index} />
                                                  );
                                              })}
                                              {/* 升级按钮 */}
                                              <RenderUpgradeBtn upgrade={upgrade} />
                                          </View>
                                      ))
                                    : null}
                                {/* 列表卡片 */}
                                {account?.items?.length ? (
                                    account?.items?.map((product = {}, index, arr) => {
                                        // 卡片是否只有一个或者是最后一个
                                        const flag = index + 1 == arr.length || index == arr.length - 1;
                                        return <CardItem data={product} flag={flag} key={index} />;
                                    })
                                ) : account.title == '魔方宝' ? (
                                    <CardItem data={account} flag={true} />
                                ) : (
                                    <NoAccountRender
                                        empty_button={account?.empty_button}
                                        empty_desc={account?.empty_desc}
                                    />
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </>
    );
};
const ListTitle = ({title, desc}) => {
    return (
        <View style={[Style.flexRow, {marginBottom: px(10), position: 'relative', zIndex: -10}]}>
            <View style={styles.title_tag} />
            <View style={Style.flexRow}>
                <Text style={styles.bold_text}>
                    {title} {''} {''}
                </Text>
                <Text style={{fontSize: px(16)}}>
                    | {''} {''}
                </Text>
                <Text style={{marginBottom: px(-4), ...styles.light_text}}>{desc}</Text>
            </View>
        </View>
    );
};
const CardItem = ({data = {}, flag, upgrade}) => {
    const jump = useJump();
    const {name, type_name, profit, amount, profit_acc, alert, tag_icon, url} = data;
    return (
        <>
            <TouchableOpacity style={[styles.card]} activeOpacity={0.9} onPress={() => jump(url)}>
                {tag_icon && <Image source={{uri: tag_icon}} style={styles.signal_image} />}
                {name && (
                    <View style={[Style.flexRow, {marginBottom: px(16)}]}>
                        <View style={styles.tag}>
                            <Text style={styles.tag_text}>{type_name}</Text>
                        </View>
                        <Text numberOfLines={1}>{name}</Text>
                    </View>
                )}
                <View style={[Style.flexBetween]}>
                    <Text style={[styles.amount_text, {width: px(120)}]}>{amount}</Text>
                    <Text style={[styles.amount_text, {minWidth: px(30)}]}>{profit}</Text>
                    <Text style={[styles.amount_text, {minWidth: px(30)}]}>{profit_acc}</Text>
                </View>
                {alert && <RenderAlert alert={alert} />}
            </TouchableOpacity>
            {/* 画卡片分割的半圆 */}
            {!flag && (
                <View style={[styles.line_circle]}>
                    <View
                        style={{
                            ...styles.leftCircle,
                            left: -px(5),
                            backgroundColor: upgrade ? yellow : Colors.bgColor,
                            borderLeftColor: Colors.bgColor,
                            borderLeftWidth: px(2),
                        }}
                    />
                    {upgrade && <View style={styles.upgrade_circle} />}
                    <View style={{...styles.line, flex: 1}} />
                    <View
                        style={{
                            ...styles.leftCircle,
                            right: -px(5),
                            backgroundColor: upgrade ? yellow : Colors.bgColor,
                            borderRightColor: Colors.bgColor,
                            borderRightWidth: px(2),
                        }}
                    />
                    {upgrade && <View style={[styles.upgrade_circle, {left: undefined, right: px(-6)}]} />}
                </View>
            )}
        </>
    );
};

// 信号
const RenderAlert = ({alert}) => {
    const jump = useJump();
    const {bgColor, buttonColor} = getAlertColor(alert.alert_style);
    return (
        <View style={[Style.flexBetween, styles.singal_card, {backgroundColor: bgColor, marginTop: px(8), top: px(4)}]}>
            <Text style={{flex: 1, fontSize: px(12), color: Colors.defaultColor}} numberOfLines={1}>
                {alert?.alert_content}
            </Text>
            <SmButton
                title={alert?.alert_button?.text}
                style={{borderColor: buttonColor}}
                titleStyle={{color: buttonColor}}
                onPress={() => jump(alert?.alert_button?.url)}
            />
        </View>
    );
};
//升级按钮
const RenderUpgradeBtn = ({upgrade}) => {
    const jump = useJump();
    return (
        <View
            style={{
                ...Style.flexRow,
                ...styles.upgrade_btn_con,
            }}>
            <Image
                source={require('~/assets/img/index/upgrade.gif')}
                style={{width: px(33), height: px(33), marginRight: px(12)}}
            />
            <View style={{flex: 1}}>
                <Text
                    style={{
                        fontSize: px(12),
                        color: '#fff',
                        marginBottom: px(4),
                    }}
                    numberOfLines={1}>
                    {upgrade?.desc}
                </Text>
                <Text style={{fontSize: px(12), color: '#fff'}} numberOfLines={1}>
                    {upgrade?.profit_desc}
                </Text>
            </View>
            <Image source={require('~/assets/img/index/upgradeBg.png')} style={{width: px(40), height: px(40)}} />
            <SmButton title={'查看'} style={{backgroundColor: '#fff', borderWidth: 0}} titleStyle={{color: yellow}} />
        </View>
    );
};
export default HoldList;

const styles = StyleSheet.create({
    bold_text: {fontSize: px(18), lineHeight: px(25), color: Colors.defaultColor, fontWeight: '700'},
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },
    table_header: {
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
        backgroundColor: '#fff',
        height: px(40),
        paddingHorizontal: px(16),
        position: 'relative',
        zIndex: 100,
    },
    recommend_card_con: {
        height: px(201),
        paddingTop: px(12),
        marginHorizontal: px(16),
        borderColor: Colors.btnColor,
        borderWidth: 0.5,
        borderTopWidth: 2,
        paddingHorizontal: px(12),
        borderRadius: px(6),
        marginBottom: px(12),
        backgroundColor: '#F1F6FF',
    },
    recommend_card_close: {
        position: 'absolute',
        right: px(0),
        top: px(0),
        width: px(30),
        height: px(30),
        ...Style.flexRowCenter,
    },
    card_con: {
        marginHorizontal: px(16),
        backgroundColor: '#fff',
        borderBottomEndRadius: px(6),
        borderBottomLeftRadius: px(6),
        borderRadius: px(6),
    },
    card: {
        paddingHorizontal: px(16),
        paddingVertical: px(20),
    },
    fund_name: {
        color: Colors.defaultColor,
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: '700',
        flex: 1,
    },
    tag: {
        borderColor: '#BDC2CC',
        borderWidth: 0.5,
        borderRadius: px(2),
        paddingHorizontal: px(4),
        marginRight: px(6),
        paddingVertical: px(2),
    },
    tag_text: {
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.lightBlackColor,
    },
    amount_text: {
        fontSize: px(14),
        lineHeight: px(19),
        fontFamily: Font.numFontFamily,
    },
    line: {
        backgroundColor: '#E9EAEF',
        height: 0.5,
        marginHorizontal: px(16),
    },
    leftCircle: {
        width: px(10),
        height: px(10),
        backgroundColor: Colors.bgColor,
        borderRadius: px(10),
        position: 'absolute',
    },
    line_circle: {
        ...Style.flexBetween,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    singal_card: {
        height: px(38),
        borderRadius: px(4),
        paddingHorizontal: px(8),
    },
    signal_image: {
        position: 'absolute',
        right: 0,
        height: px(24),
        width: px(34),
        top: px(14),
    },
    upgrade_circle: {
        position: 'absolute',
        width: px(9),
        height: px(8),
        left: -px(6),
        borderRadius: px(6),
        backgroundColor: Colors.bgColor,
    },
    upgrade_btn_con: {height: px(52), backgroundColor: '#FF7D41', paddingHorizontal: px(12)},
});
