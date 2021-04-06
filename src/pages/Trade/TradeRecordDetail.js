/*
 * @Date: 2021-02-02 12:27:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-06 10:31:08
 * @Description:交易记录详情
 */
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {px, isIphoneX, tagColor, getTradeColor} from '../../utils/appUtil';
import {Style, Colors, Font} from '../../common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Modal, BankCardModal} from '../../components/Modal';
import http from '../../services';
import Icon from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HTML from '../../components/RenderHtml';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';
// 交易类型 type.val      3: 购买（红色） 4:赎回（绿色）6:调仓（蓝色） 7:分红（红色）
// 交易状态 status.val    -1 交易失败（红色）1:确认中（橙色）6:交易成功(绿色) 7:撤单中(橙色) 9:已撤单（灰色）
const TradeRecordDetail = (props) => {
    const {txn_id, type, sub_type} = props.route?.params;
    const [heightArr, setHeightArr] = useState([]);
    const [showMore, setShowMore] = useState([]);
    const [data, setData] = useState();
    const bankCardRef = useRef();
    const passwordModal = useRef();
    const cardLayout = (index, e) => {
        const arr = [...heightArr];
        arr[index] = e.nativeEvent.layout.height;
        setHeightArr(arr);
    };
    const getData = useCallback(() => {
        http.get('/order/detail/20210101', {
            txn_id,
            type,
            sub_type,
        }).then((res) => {
            setData(res.result);
            props.navigation.setOptions({
                headerRight: () => {
                    return res.result?.button?.text ? (
                        <TouchableOpacity onPress={handleCancel}>
                            <Text style={styles.header_right}>{res.result?.button?.text}</Text>
                        </TouchableOpacity>
                    ) : null;
                },
            });
            let expand = res.result.part2.map((item) => {
                return item.expanded;
            });
            setShowMore(expand);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, txn_id, type, sub_type]);
    useEffect(() => {
        getData();
    }, [getData, props.navigation]);
    // 撤单
    const cancleTxn = (password) => {
        let toast = Toast.showLoading('正在撤单...');
        http.post('/trade/order/cancel/20210101', {
            password,
            txn_id,
        }).then((res) => {
            Toast.hide(toast);
            if (res.code == '000000') {
                Toast.show('撤单成功！');
                getData();
            } else {
                Toast.show(res.message);
            }
        });
    };
    const handleCancel = () => {
        Modal.show({
            title: '确认撤单',
            content: data?.button?.popup?.content,
            confirm: true,
            confirmCallBack: () => {
                passwordModal.current.show();
            },
        });
    };
    const handleMore = (index) => {
        let more = [...showMore];
        more[index] = !showMore[index];
        setShowMore(more);
    };
    const showBank = () => {
        bankCardRef.current.show();
    };
    return (
        <ScrollView style={styles.container}>
            <View style={[styles.header, Style.flexCenter]}>
                <PasswordModal
                    ref={passwordModal}
                    onDone={(password) => {
                        cancleTxn(password);
                    }}
                />
                <View style={[Style.flexRow, {marginBottom: px(16)}]}>
                    <View
                        style={[
                            Style.tag,
                            {backgroundColor: tagColor(data?.part1?.type?.val).bg_color, marginRight: px(9)},
                        ]}>
                        <Text style={{fontSize: px(11), color: tagColor(data?.part1?.type?.val).text_color}}>
                            {data?.part1?.type?.text}
                        </Text>
                    </View>
                    <Text style={{color: Colors.defaultColor, fontSize: px(16)}}>{data?.part1?.name}</Text>
                </View>
                {/* 调仓比例 */}
                {data?.part1?.percent ? (
                    <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                        <Text style={[styles.header_text, {marginRight: px(6)}]}>比例</Text>
                        <Text style={styles.bold_text}>{data?.part1?.percent}</Text>
                    </View>
                ) : null}
                {/* 金额展示 */}
                {data?.part1?.amount ? (
                    <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                        <Text style={styles.bold_text}>{data?.part1?.amount}</Text>
                        <Text style={[styles.header_text, {marginLeft: px(4)}]}>{data?.part1?.unit}</Text>
                    </View>
                ) : null}
                {data?.part1?.items?.map((_item, key) => (
                    <View style={Style.flexRow} key={key}>
                        <Text style={styles.header_text}>{_item.k}</Text>
                        <View>
                            {Array.isArray(_item?.v) ? (
                                <TouchableOpacity activeOpacity={1} onPress={showBank} style={Style.flexRow}>
                                    <Text style={[styles.header_text, {marginLeft: px(6), color: Colors.btnColor}]}>
                                        {_item?.v?.length}张银行卡
                                    </Text>
                                    <BankCardModal
                                        clickable={false}
                                        data={_item?.v || []}
                                        type="hidden"
                                        title="回款银行卡"
                                        ref={bankCardRef}
                                    />
                                    <FontAwesome
                                        name={'angle-right'}
                                        size={18}
                                        color={Colors.btnColor}
                                        style={{marginLeft: px(6)}}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <Text style={[styles.header_text, {marginLeft: px(6)}]}>{_item.v}</Text>
                            )}
                        </View>
                    </View>
                ))}
                {/* 交易状态 */}
                <View style={[Style.flexRow, {marginTop: px(16)}]}>
                    <AntDesign
                        name={data?.part1?.status?.val == 6 ? 'checkcircle' : 'clockcircle'}
                        color={getTradeColor(data?.part1?.status?.val)}
                        size={px(16)}
                        style={{marginRight: px(8)}}
                    />
                    <Text style={{color: getTradeColor(data?.part1?.status?.val), fontSize: px(14)}}>
                        {data?.part1?.status?.text}
                    </Text>
                </View>
            </View>
            {data?.part2?.length > 0 ? (
                <View style={{paddingHorizontal: px(14), marginBottom: isIphoneX() ? 34 : px(10)}}>
                    <Text style={[styles.card_title, {fontWeight: '700', marginBottom: px(16)}]}>购买进度明细</Text>
                    {data?.part2?.map((item, index) => (
                        <View
                            key={index}
                            style={{flexDirection: 'row', alignItems: 'flex-start'}}
                            onLayout={(e) => {
                                cardLayout(index, e);
                            }}>
                            <View>
                                <View style={styles.circle} />
                                <View
                                    style={[
                                        styles.line,
                                        {height: index == data?.part2?.length - 1 ? 0 : heightArr[index]},
                                    ]}
                                />
                            </View>
                            <View style={[styles.card]}>
                                <View style={[Style.flexBetween, {height: px(42)}]}>
                                    <View style={styles.trangle} />
                                    <HTML style={styles.name} html={item?.k} />
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[Style.flexRow, {height: '100%'}]}
                                        onPress={() => {
                                            handleMore(index);
                                        }}>
                                        <Text style={styles.date}>{item?.v}</Text>
                                        {item.children ? (
                                            <FontAwesome
                                                name={!showMore[index] ? 'angle-down' : 'angle-up'}
                                                size={18}
                                                style={{paddingLeft: px(11)}}
                                                color={Colors.lightGrayColor}
                                            />
                                        ) : null}
                                    </TouchableOpacity>
                                </View>

                                {item?.type == 'adjust_compare' && item?.children && showMore[index] ? (
                                    // 调仓
                                    <View style={[styles.buy_table, {borderTopWidth: item?.children?.head ? 0.5 : 0}]}>
                                        {item?.children?.head ? (
                                            <View style={[Style.flexBetween, {height: px(30)}]}>
                                                {item?.children?.head.map((text, key) => (
                                                    <Text
                                                        key={key}
                                                        style={[
                                                            styles.light_text,
                                                            {width: key == 0 ? px(163) : 'auto'},
                                                        ]}>
                                                        {text}
                                                    </Text>
                                                ))}
                                            </View>
                                        ) : null}

                                        {item?.children
                                            ? item?.children?.body.map((child, key) => (
                                                  <View key={key} style={[Style.flexBetween, styles.fund_item]}>
                                                      <Text numberOfLines={1} style={styles.fund_name}>
                                                          {child?.name}
                                                      </Text>
                                                      <Text style={styles.fund_amount}>{child?.src}</Text>
                                                      <View style={Style.flexRow}>
                                                          <Text
                                                              style={[
                                                                  styles.fund_amount,
                                                                  {
                                                                      color: child?.type
                                                                          ? child?.type == 'down'
                                                                              ? Colors.green
                                                                              : Colors.red
                                                                          : Colors.lightBlackColor,
                                                                  },
                                                              ]}>
                                                              {child?.dst}
                                                          </Text>
                                                          {child.type ? (
                                                              <Icon
                                                                  name={`arrow-long-${child?.type}`}
                                                                  color={
                                                                      child?.type == 'down' ? Colors.green : Colors.red
                                                                  }
                                                              />
                                                          ) : null}
                                                      </View>
                                                  </View>
                                              ))
                                            : null}
                                    </View>
                                ) : item?.children && showMore[index] ? (
                                    <View style={[styles.buy_table, {borderTopWidth: item?.children?.head ? 0.5 : 0}]}>
                                        {item?.children?.head && (
                                            <View style={[Style.flexBetween, {height: px(30)}]}>
                                                {item?.children?.head.map((text, key) => (
                                                    <Text key={key} style={styles.light_text}>
                                                        {text}
                                                    </Text>
                                                ))}
                                            </View>
                                        )}
                                        {item?.children?.body?.map((child, key) => (
                                            <View style={styles.fund_item} key={key}>
                                                <View style={[Style.flexBetween, {marginBottom: px(4)}]}>
                                                    <Text style={styles.fund_name}>{child?.k}</Text>
                                                    <Text style={styles.fund_amount}>{child?.v}</Text>
                                                </View>
                                                {child?.ds ? (
                                                    child?.ds?.map(
                                                        (_ds, _key) =>
                                                            _ds?.k ? (
                                                                <HTML
                                                                    html={_ds?.k}
                                                                    style={{fontSize: px(12), lineHeight: px(17)}}
                                                                />
                                                            ) : null
                                                        // <Text
                                                        //     key={_key}
                                                        //     style={[styles.light_text, {color: Colors.green}]}>
                                                        //     {_ds?.k}
                                                        // </Text>
                                                    )
                                                ) : child?.d ? (
                                                    child?.d ? (
                                                        <HTML
                                                            html={child?.d}
                                                            style={{fontSize: px(12), lineHeight: px(17)}}
                                                        />
                                                    ) : null
                                                ) : // <Text style={[styles.light_text, {color: Colors.green}]}>
                                                //     {child?.d}
                                                // </Text>
                                                null}
                                            </View>
                                        ))}
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    header: {
        marginTop: 1,
        backgroundColor: '#fff',
        paddingVertical: px(20),
        marginBottom: px(16),
    },
    header_right: {
        fontSize: px(14),
        width: px(48),
        color: Colors.defaultColor,
    },

    name: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: '700',
        lineHeight: px(20),
    },
    card_title: {
        fontSize: px(14),
        color: Colors.defaultColor,
    },
    line: {
        width: px(1),
        backgroundColor: '#E2E4EA',
        marginLeft: px(4),
        position: 'absolute',
        top: px(22),
    },
    circle: {
        width: px(8),
        height: px(8),
        borderRadius: px(4),
        backgroundColor: Colors.darkGrayColor,
        marginRight: px(17),
        position: 'relative',
        zIndex: 10,
        marginTop: px(18),
    },
    card: {
        borderRadius: 8,
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: px(12),
        marginBottom: px(12),
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    trangle: {
        borderWidth: px(7),
        borderRightColor: '#fff',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        position: 'absolute',
        left: px(-26),
    },
    buy_table: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    fund_item: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingVertical: px(8),
    },
    fund_name: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightBlackColor,
        width: px(163),
    },
    fund_amount: {
        fontSize: px(12),
        fontFamily: Font.numMedium,
        color: Colors.lightBlackColor,
    },
    header_text: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(22),
    },
    bold_text: {
        fontSize: px(32),
        fontFamily: Font.numFontFamily,
        color: Colors.defaultColor,
        lineHeight: px(37),
    },
});
export default TradeRecordDetail;
