/*
 * @Author: xjh
 * @Date: 2021-02-25 16:34:18
 * @Description:体验金购买
 * @LastEditors: dx
 * @LastEditTime: 2021-11-09 16:21:21
 */
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image, ScrollView} from 'react-native';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import Html from '../../components/RenderHtml';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {PasswordModal} from '../../components/Password';
import {useJump} from '../../components/hooks/';
import BottomDesc from '../../components/BottomDesc';

export default function Trade({navigation, route}) {
    const passwordModal = useRef(null);
    const [expand, setExpand] = useState(false);
    const [data, setData] = useState({});
    const [list, setList] = useState({});
    const jump = useJump();

    const toggle = () => {
        global.LogTool('click', 'expand');
        setExpand((prev) => !prev);
    };
    const passwordInput = () => {
        global.LogTool('click', 'buy');
        passwordModal.current.show();
    };

    useEffect(() => {
        http.get('/freefund/buy/20210101', {}).then((res) => {
            navigation.setOptions({title: res.result.title || ''});
            setData(res.result);
            http.get('trade/buy/plan/20210101', {
                poid: route.params?.poid,
                amount: res.result.buy_info.amount,
                pay_method: res.result.buy_info.pay_method,
            }).then((resp) => {
                setList(resp.result);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const submitData = (password) => {
        http.post('/freefund/do_buy/20210101', {
            amount: data.buy_info.amount,
            password,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.navigate(data?.button?.url?.path);
            }
        });
    };
    return (
        <View style={styles.container}>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{flex: 1}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[Style.flexRow, styles.yellow_wrap_sty]}
                        onPress={() => {
                            global.LogTool('click', 'processing_url');
                            jump(data?.tip_info?.processing_url, 'push');
                        }}>
                        <Html style={styles.yellow_sty} html={data?.tip_info?.processing} />
                    </TouchableOpacity>
                    <View style={styles.list_sty}>
                        <Image
                            source={require('../../assets/img/gold.png')}
                            style={{width: text(24), height: text(24)}}
                        />
                        <Text style={{marginLeft: text(5), color: Colors.defaultColor}}>
                            {data?.buy_info?.buy_title}
                        </Text>
                    </View>
                    <View style={[styles.fund_card_sty, {marginBottom: text(10)}]}>
                        <Text style={styles.title_sty}>{data?.buy_info?.buy_desc}</Text>
                        <View
                            style={[
                                Style.flexRow,
                                {paddingBottom: text(15), borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                            ]}>
                            <Text style={{fontSize: text(22)}}>¥</Text>
                            <Text style={styles.num_sty}>{data?.buy_info?.amount}</Text>
                        </View>
                        <Text style={[styles.desc_sty, {paddingBottom: 0}]}>{data?.buy_info?.rate_label[0]}</Text>
                        <Text style={styles.desc_sty}>{data?.buy_info?.rate_label[1]}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[
                            styles.fund_card_sty,
                            {paddingBottom: text(16), flexDirection: 'row', justifyContent: 'space-between'},
                        ]}
                        onPress={toggle}>
                        <Text style={{color: Colors.defaultColor, fontSize: Font.textH2, lineHeight: text(20)}}>
                            {'买入明细'}
                        </Text>
                        {expand ? (
                            <Icon
                                name={'up'}
                                size={text(14)}
                                color={Colors.lightGrayColor}
                                style={{marginTop: text(2.5)}}
                            />
                        ) : (
                            <Icon
                                name={'down'}
                                size={text(14)}
                                color={Colors.lightGrayColor}
                                style={{marginTop: text(2.5)}}
                            />
                        )}
                    </TouchableOpacity>
                    {expand &&
                        Object.keys(list).length > 0 &&
                        list?.body?.map((_item, _index, array) => {
                            return (
                                <View key={_index + '_item'}>
                                    {_index === 0 && <View style={styles.line} />}
                                    <View
                                        style={[
                                            styles.config_desc,
                                            {
                                                paddingBottom: _index === array.length - 1 ? Space.marginVertical : 0,
                                            },
                                        ]}>
                                        <View>
                                            <View style={[Style.flexBetween, {marginBottom: text(14)}]}>
                                                <View style={[Style.flexRow, {width: text(162)}]}>
                                                    <View style={[styles.circle, {backgroundColor: _item.color}]} />
                                                    <Text style={styles.config_title}>
                                                        {_item.title + ' '}(
                                                        <Text style={{fontFamily: Font.numRegular}}>
                                                            {(_item.percent * 100).toFixed(2) + '%'}
                                                        </Text>
                                                        )
                                                    </Text>
                                                </View>
                                                <>
                                                    <Text style={[styles.config_title, {width: text(60)}]}>
                                                        {list?.header?.percent}
                                                    </Text>
                                                    <Text style={styles.config_title}>{list?.header?.amount}</Text>
                                                </>
                                            </View>
                                            {_item?.funds.map((_b, _i, arr) => {
                                                return (
                                                    <View
                                                        style={[
                                                            Style.flexBetween,
                                                            {marginBottom: _i !== arr.length - 1 ? text(14) : 0},
                                                        ]}
                                                        key={_i + '_b'}>
                                                        <Text style={[styles.config_title_desc, {width: text(162)}]}>
                                                            {_b.name}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.config_title_desc,
                                                                {width: text(60), fontFamily: Font.numRegular},
                                                            ]}>
                                                            {(_b.percent * 100).toFixed(2) + '%'}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.config_title_desc,
                                                                {fontFamily: Font.numRegular},
                                                            ]}>
                                                            {_b.amount}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    <Text style={[styles.agreement, {paddingHorizontal: text(16), marginTop: text(20)}]}>
                        购买即代表您已知悉该基金组合的
                        <Text
                            onPress={() => {
                                navigation.navigate('TradeAgreements', {poid: route.params?.poid, type: 0});
                            }}
                            style={{color: Colors.btnColor}}>
                            基金组合协议
                        </Text>
                        和
                        <Text
                            style={{color: Colors.btnColor}}
                            onPress={() => {
                                navigation.navigate('TradeAgreements', {
                                    fund_codes: list?.codes,
                                    type: 0,
                                });
                            }}>
                            产品概要
                        </Text>
                        等内容
                    </Text>
                    <BottomDesc />
                </ScrollView>
            )}
            {data?.button && (
                <View style={{backgroundColor: '#fff'}}>
                    <Button
                        activeOpacity={1}
                        title={data?.button?.text}
                        color={'#D4AC6F'}
                        onPress={passwordInput}
                        style={{
                            marginHorizontal: text(16),
                            marginVertical: text(8),
                            backgroundColor: '#D4AC6F',
                            marginBottom: isIphoneX() ? 34 + text(8) : text(8),
                        }}
                    />
                </View>
            )}
            <PasswordModal ref={passwordModal} onDone={submitData} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    yellow_wrap_sty: {
        backgroundColor: '#FEF6E9',
        paddingHorizontal: Space.padding,
        paddingVertical: text(10),
    },
    yellow_sty: {
        color: '#A0793E',
        paddingVertical: text(5),
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
    list_sty: {
        paddingHorizontal: text(16),
        paddingVertical: text(10),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: text(10),
    },
    fund_card_sty: {
        paddingHorizontal: text(16),
        backgroundColor: '#fff',
        paddingTop: text(16),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
        marginBottom: text(15),
    },
    num_sty: {
        color: Colors.defaultColor,
        fontSize: text(30),
        fontFamily: Font.numFontFamily,
        marginLeft: text(10),
    },
    desc_sty: {
        color: Colors.lightGrayColor,
        fontSize: Font.textH3,
        paddingVertical: text(10),
    },
    config_desc: {
        padding: text(15),
        paddingBottom: text(0),
        backgroundColor: '#fff',
    },
    config_title: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
    config_title_desc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    line: {
        height: 0.5,
        marginHorizontal: text(15),
        backgroundColor: Colors.lineColor,
    },
    circle: {
        width: text(8),
        height: text(8),
        borderRadius: text(8),
        backgroundColor: 'red',
        marginRight: text(8),
    },
    agreement: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: text(17),
    },
});
