/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';

import NoAccountRender from './NoAccountRender';
import StickyHeader from '~/components/Sticky';
import {SmButton} from '~/components/Button';
import {getAlertColor, getTagColor} from './util';
import {useJump} from '~/components/hooks';

const HoldList = ({products, stickyHeaderY, scrollY}) => {
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
    return (
        <>
            <View style={{position: 'relative'}}>
                {products?.map((account, key) => {
                    let _top = (layout[key]?.top || 0) + stickyHeaderY + px(38);
                    return (
                        <View key={key} style={{marginBottom: px(16)}} onLayout={(e) => onLayout(key, e)}>
                            <ListTitle title={account.title} desc={account?.desc} />
                            <View style={styles.card_con}>
                                {/* header */}
                                {account?.items?.length ? (
                                    <StickyHeader
                                        stickyHeaderY={_top} // 把头部高度传入
                                        top={_top}
                                        itemHeight={layout[key]?.height - px(67)} //px(67)是大标题和table_header的高度
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
                                    ? account?.upgrade_listaccount?.upgrade_list?.map((upgrade, _index) => (
                                          <View
                                              style={{
                                                  borderWidth: px(1.5),
                                                  borderColor: '#FF7D41',
                                                  borderRadius: px(6),
                                              }}>
                                              {upgrade?.items?.map((product = {}, index, arr) => {
                                                  // 卡片是否只有一个或者是最后一个
                                                  const flag = index + 1 == arr.length || index == arr.length - 1;
                                                  return <CardItem data={product} flag={flag} key={index} />;
                                              })}
                                              {/* 升级按钮 */}
                                              <View style={{height: px(52), ...Style.flexRow}}>
                                                  <View style={{flex: 1}}>
                                                      <Text>{upgrade?.desc}</Text>
                                                      <Text>{upgrade?.profit_desc}</Text>
                                                  </View>
                                                  <SmButton
                                                      title={'查看'}
                                                      style={{backgroundColor: '#fff'}}
                                                      titleStyle={{color: '#FF7D41'}}
                                                  />
                                              </View>
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
const ListTitle = ({title, desc, onLayout}) => {
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
const CardItem = ({data = {}, flag}) => {
    const {name, type_name, profit, amount, profit_acc, alert, tag} = data;
    return (
        <>
            <View style={[styles.card]}>
                {tag && <RenderTag tag={tag} />}
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
                    <Text style={styles.amount_text}>{profit}</Text>
                    <Text style={styles.amount_text}>{profit_acc}</Text>
                </View>
                {alert && <RenderAlert alert={alert} />}
            </View>
            {!flag && (
                <View style={[styles.line_circle]}>
                    <View
                        style={{
                            ...styles.leftCircle,
                            left: -px(5),
                            // borderRightColor: '#FF7D41',
                            // borderRightWidth: px(5),
                        }}
                    />
                    <View style={{...styles.line, flex: 1}} />
                    <View style={{...styles.leftCircle, right: -px(5)}} />
                </View>
            )}
        </>
    );
};
//买卖信号
const RenderTag = ({tag}) => {
    const bgColor = getTagColor(tag.tag_style);
    return (
        <View style={[styles.card_tag, Style.flexRowCenter, {backgroundColor: bgColor}]}>
            <Text style={{color: '#fff', fontSize: px(12), marginRight: px(4)}}>{tag.tag_content}</Text>
            <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                {new Array(3).fill(0).map((_, index, arr) => (
                    <View
                        key={index}
                        style={{
                            width: px(2),
                            backgroundColor: '#fff',
                            opacity: index == arr.length - 1 ? 0.4 : 1,
                            marginRight: index == arr.length - 1 ? 0 : px(2),
                            height: px(4) + index * 3,
                        }}
                    />
                ))}
            </View>
        </View>
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
    card_tag: {
        width: px(34),
        height: px(24),
        borderBottomLeftRadius: px(30),
        borderTopLeftRadius: px(30),
        position: 'absolute',
        right: 0,
        top: px(20),
    },
});
