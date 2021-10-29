/*
 * @Author: xjh
 * @Date: 2021-03-02 12:12:27
 * @Description:一键转投智能组合
 * @LastEditors: dx
 * @LastEditTime: 2021-10-08 16:13:36
 */
import React, {useCallback, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Font, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/';
import {Modal} from '../../components/Modal';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';
import Icon from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../components/BottomDesc';
import {useJump} from '../../components/hooks';
import {useSelector} from 'react-redux';
const btnHeight = isIphoneX() ? text(90) : text(66);
export default function TransferAccount({navigation, route}) {
    const jump = useJump();
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);
    const passwordModal = useRef(null);
    const userInfo = useSelector((state) => state.userInfo);
    const toggle = () => {
        setShow(!show);
    };
    useFocusEffect(
        useCallback(() => {
            const {anti_pop} = userInfo.toJS();
            if (anti_pop) {
                Modal.show({
                    title: anti_pop.title,
                    content: anti_pop.content,
                    confirm: true,
                    isTouchMaskToClose: false,
                    cancelCallBack: () => navigation.goBack(),
                    confirmCallBack: () => jump(anti_pop.confirm_action?.url),
                    cancelText: anti_pop.cancel_action?.text,
                    confirmText: anti_pop.confirm_action?.text,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userInfo])
    );
    useFocusEffect(
        useCallback(() => {
            Http.get('/trade/price/transfer/20210101', {
                poid: route.params.poid,
            }).then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    const passwordInput = () => {
        if (data.button.url) {
            jump(data.button.url);
        } else {
            passwordModal.current.show();
        }
    };

    const submit = (password) => {
        Http.post('/trade/adjust/do/20210101', {
            adjust_id: data.adjust_id,
            mode: data.mode,
            password: password,
            poid: route.params.poid,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.navigate('TradeProcessing', {txn_id: res.result.txn_id});
            } else {
                Toast.show(res.message);
            }
        });
    };
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: btnHeight}}>
                    <View style={styles.card_sty}>
                        <Text style={styles.title_sty}>{data.trans_info.from}</Text>
                        <View style={[Style.flexRow, {paddingVertical: text(12)}]}>
                            <Image
                                source={require('../../assets/img/transfer.png')}
                                style={{width: text(18), height: text(18)}}
                            />
                            <Text style={{color: '#9AA1B2', fontSize: text(12), marginHorizontal: text(5)}}>
                                {data.trans_info.trans}
                            </Text>
                            <Text style={{height: text(0.5), backgroundColor: '#DDDDDD', flex: 1}} />
                        </View>
                        <Text style={styles.title_sty}>{data.trans_info.to}</Text>
                    </View>
                    <View style={[styles.card_sty, {paddingBottom: text(10)}]}>
                        <Text style={{fontSize: Font.textH1}}>{data.buy_info.text}</Text>
                        <View style={[Style.flexRow, styles.num_wrap_sty]}>
                            <Text style={{fontSize: text(20), fontWeight: 'bold'}}>¥</Text>
                            <Text style={styles.num_sty}>{data.buy_info.amount}</Text>
                        </View>
                        <Html
                            style={{color: '#9095A5', fontSize: Font.textH3, paddingTop: text(10)}}
                            html={data.buy_info.fee_text}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.card_sty, {flexDirection: 'row'}]}
                        onPress={toggle}
                        activeOpacity={1}>
                        <Text style={{flex: 1}}>{data.buy_info.buy_text}</Text>
                        <AntDesign size={12} color={'#9095A5'} name={show ? 'up' : 'down'} />
                    </TouchableOpacity>
                    {show && (
                        <View
                            style={{
                                paddingBottom: text(15),
                                backgroundColor: '#fff',
                                paddingHorizontal: text(15),
                            }}>
                            <View style={{borderTopWidth: 0.5, borderColor: Colors.borderColor}}>
                                {data?.fund_compare?.fund_list?.map((_item, _index) => {
                                    return (
                                        <View key={_index + '_item'}>
                                            <View style={[Style.flexRow]}>
                                                <View style={[Style.flexRow, {flex: 1, alignItems: 'baseline'}]}>
                                                    <View style={[styles.circle, {backgroundColor: _item.color}]} />
                                                    <Text style={{color: _item.color, fontSize: text(12)}}>
                                                        {_item.title}
                                                    </Text>
                                                </View>
                                                <Text style={styles.content_head_title}>
                                                    {data.fund_compare.header.ratio_src}
                                                </Text>
                                                <Text style={[styles.content_head_title, {textAlign: 'right'}]}>
                                                    {data.fund_compare.header.ratio_dst}
                                                </Text>
                                            </View>

                                            {_item?.funds?.map((_i, _d) => {
                                                const _color =
                                                    _i.compare == 'gt'
                                                        ? Colors.red
                                                        : _i.compare == 'lt'
                                                        ? Colors.green
                                                        : '#4E556C';
                                                return (
                                                    <View style={[Style.flexRow, {paddingTop: text(10)}]} key={_i + _d}>
                                                        <Text
                                                            style={[
                                                                styles.content_item_text,
                                                                {flex: 1, textAlign: 'left'},
                                                            ]}>
                                                            {_i?.name}
                                                        </Text>
                                                        <Text style={styles.content_item_text}>
                                                            {Number(_i?.ratio_src * 100).toFixed(2)}%
                                                        </Text>
                                                        <View
                                                            style={[
                                                                Style.flexRow,
                                                                {
                                                                    width: text(90),
                                                                    justifyContent: 'flex-end',
                                                                },
                                                            ]}>
                                                            <Text
                                                                style={{
                                                                    fontSize: Font.textH3,

                                                                    color: _color,
                                                                }}>
                                                                {Number(_i?.ratio_dst * 100).toFixed(2)}%
                                                            </Text>
                                                            {_i.compare != 'et' && (
                                                                <Icon
                                                                    name={_i?.compare == 'gt' ? 'arrowup' : 'arrowdown'}
                                                                    color={_color}
                                                                />
                                                            )}
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                    <View style={{margin: text(16)}}>
                        {data.notice.map((_n, _i) => {
                            return (
                                <Html
                                    style={{color: '#9095A5', fontSize: text(12), lineHeight: text(18)}}
                                    key={_i + '_n'}
                                    html={_n}
                                />
                            );
                        })}
                    </View>
                    <BottomDesc />
                </ScrollView>
            )}
            <PasswordModal ref={passwordModal} onDone={submit} />
            {Object.keys(data).length > 0 && <FixedButton title={data.button.text} onPress={passwordInput} />}
        </View>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        marginTop: text(12),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    num_sty: {
        fontFamily: Font.numFontFamily,
        fontSize: text(35),
        marginLeft: text(5),
    },
    num_wrap_sty: {
        alignItems: 'baseline',
        marginTop: text(18),
        borderBottomWidth: 0.5,
        borderColor: '#DDDDDD',
        paddingBottom: text(10),
        marginBottom: text(10),
    },
    circle: {
        width: text(8),
        height: text(8),
        backgroundColor: '#E1645C',
        borderRadius: 50,
        marginRight: text(5),
        marginTop: text(15),
    },
    content_head_title: {
        color: Colors.lightGrayColor,
        fontSize: Font.textH3,
        minWidth: text(90),
        textAlign: 'center',
        paddingTop: text(15),
    },
    content_item_text: {
        color: Colors.descColor,
        fontSize: Font.textH3,
        minWidth: text(90),
        textAlign: 'center',
    },
});
