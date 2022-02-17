/*
 * @Date: 2021-02-02 12:27:26
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-02-17 19:23:25
 * @Description:交易记录详情
 */
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {px, isIphoneX, tagColor, getTradeColor} from '../../utils/appUtil';
import {Style, Space, Colors, Font} from '../../common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Modal, BankCardModal} from '../../components/Modal';
import http from '../../services';
import Icon from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HTML from '../../components/RenderHtml';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
// 交易类型 type.val      3: 购买（红色） 4:赎回（绿色）6:调仓（蓝色） 7:分红（红色）
// 交易状态 status.val    -1 交易失败（红色）1:确认中（橙色）6:交易成功(绿色) 7:撤单中(橙色) 9:已撤单（灰色）
const TradeRecordDetail = (props) => {
    const jump = useJump();
    const {txn_id, type, sub_type} = props.route?.params;
    const [heightArr, setHeightArr] = useState([]);
    const [showMore, setShowMore] = useState([]);
    const [errorInfo, setErrorInfo] = useState(null);
    const [data, setData] = useState();
    const [hideMsg, setHideMsg] = useState(false);
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
            setErrorInfo(res.result?.part1?.err_info);
            setData(res.result);
            props.navigation.setOptions({
                headerRight: () => {
                    return res.result?.button?.text ? (
                        <TouchableOpacity
                            onPress={() => {
                                handleCancel(res.result?.button?.popup?.content);
                            }}>
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
                DeviceEventEmitter.emit('cancleOrder', '撤单成功');
            } else {
                Toast.show(res.message);
            }
        });
    };
    const handleCancel = (text) => {
        Modal.show({
            title: '确认撤单',
            content: text,
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
    const buyReplace = (password, info) => {
        http.post('/trade/batch/replace/do/20211101', {
            type: info?.type,
            sub_txn_ids: errorInfo?.sub_txn_ids,
            txn_id,
            password,
            batch_id: errorInfo?.batch_id,
        }).then((res) => {
            if (res.code === '000000') {
                setErrorInfo(null);
            }
            Toast.show(res.message);
        });
    };
    const handleClick = (info) => {
        let {title, content} = info;
        Modal.show({
            title,
            confirm: true,
            content,
            confirmCallBack: () => {
                passwordModal.current.show(info);
            },
        });
    };
    // 隐藏系统消息
    const hideSystemMsg = () => {
        global.LogTool('click', 'hideSystemMsg');
        setHideMsg(true);
    };
    const {notice} = data || {};
    return (
        <ScrollView bounces={false} style={styles.container}>
            {/* 小黄条 */}
            {!hideMsg && notice?.system ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        notice?.system?.log_id && global.LogTool(notice?.system?.log_id);
                        jump(notice?.system?.url);
                    }}>
                    <View
                        style={[
                            styles.systemMsgContainer,
                            Style.flexBetween,
                            {
                                paddingRight: notice?.system?.button ? px(16) : px(38),
                            },
                        ]}>
                        <Text style={styles.systemMsgText}>{notice?.system?.desc}</Text>

                        {notice?.system?.button ? (
                            <View style={styles.btn}>
                                <Text style={styles.btn_text}>{notice?.system?.button?.text}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.closeSystemMsg} activeOpacity={0.8} onPress={hideSystemMsg}>
                                <EvilIcons name={'close'} size={22} color={Colors.yellow} />
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            ) : null}
            <View style={[styles.header, Style.flexCenter]}>
                <PasswordModal
                    ref={passwordModal}
                    onDone={(password, info) => {
                        if (info) {
                            buyReplace(password, info);
                        } else {
                            cancleTxn(password);
                        }
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
                {data?.part1?.table ? (
                    <View style={[Style.flexRow, {width: '100%', paddingHorizontal: px(20)}]}>
                        {data.part1.table.map?.((item, index) => {
                            return (
                                <View key={item + index} style={[Style.flexCenter, {flex: 1}]}>
                                    {item.k ? <Text style={styles.header_text}>{item.k}</Text> : null}
                                    {item.v ? <Text style={styles.bold_text}>{item.v}</Text> : null}
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <>
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
                    </>
                )}
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
                {data?.part1?.tip ? (
                    <View style={styles.tip}>
                        <Text style={{color: '#545968', fontSize: px(12), lineHeight: px(17)}}>{data?.part1?.tip}</Text>
                    </View>
                ) : null}
                {errorInfo ? (
                    <View style={styles.tip_card}>
                        <Text style={{color: Colors.red, fontSize: px(12), lineHeight: px(17), marginBottom: px(8)}}>
                            {errorInfo?.content}
                        </Text>
                        <View style={Style.flexRow}>
                            {errorInfo?.button_list[0]?.avail == 1 ? (
                                <Button
                                    title={errorInfo?.button_list[0]?.text}
                                    style={styles.button}
                                    color={'#fff'}
                                    textStyle={{color: Colors.lightBlackColor}}
                                    onPress={() => {
                                        handleClick(errorInfo?.button_list[0]);
                                    }}
                                />
                            ) : null}
                            {errorInfo?.button_list[1]?.avail == 1 ? (
                                <Button
                                    title={errorInfo?.button_list[1]?.text}
                                    color={Colors.red}
                                    style={{
                                        flex: 1,
                                        backgroundColor: Colors.red,
                                        marginLeft: errorInfo?.button_list?.length > 1 ? px(20) : 0,
                                    }}
                                    onPress={() => {
                                        handleClick(errorInfo?.button_list[1]);
                                    }}
                                />
                            ) : null}
                        </View>
                    </View>
                ) : null}
            </View>
            {data?.part2?.length > 0 ? (
                <View style={{paddingHorizontal: px(14), marginBottom: isIphoneX() ? 34 : px(10)}}>
                    {data?.desc ? (
                        <Text style={[styles.card_title, {fontWeight: '700', marginBottom: px(16)}]}>{data?.desc}</Text>
                    ) : null}
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
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingTop: px(8),
        paddingBottom: px(12),
        paddingRight: px(38),
        paddingLeft: Space.marginAlign,
    },
    systemMsgText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.yellow,
        textAlign: 'justify',
    },
    closeSystemMsg: {
        position: 'absolute',
        right: px(12),
        top: px(10),
    },
    btn: {
        borderRadius: px(14),
        paddingVertical: px(5),
        paddingHorizontal: px(10),
        backgroundColor: '#FF7D41',
    },
    btn_text: {
        fontWeight: '600',
        color: '#fff',
        fontSize: px(12),
        lineHeight: px(17),
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
    tip: {
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        marginHorizontal: px(16),
        marginTop: px(24),
        padding: px(16),
    },
    button: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: Colors.lightBlackColor,
        borderWidth: 0.5,
    },
    tip_card: {
        backgroundColor: '#fae8e8',
        padding: px(16),
        margin: px(16),
        marginBottom: 0,
        borderRadius: px(6),
    },
});
export default TradeRecordDetail;
