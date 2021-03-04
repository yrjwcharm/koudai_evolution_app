/*
 * @Author: xjh
 * @Date: 2021-03-02 12:12:27
 * @Description:一键转投智能组合
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-03 11:39:42
 */
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';
import Icon from 'react-native-vector-icons/AntDesign';
import Mask from '../../components/Mask';

export default function TransferAccount({navigation}) {
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);
    const [mask, setMask] = useState(false);
    const passwordModal = useRef(null);
    const toggle = () => {
        setShow(!show);
    };
    useEffect(() => {
        Http.get('trade/price/transfer/20210101').then((res) => {
            setData(res.result);
        });
    }, [navigation]);
    const passwordInput = () => {
        passwordModal.current.show();
        setMask(true);
    };
    const submit = () => {};
    return (
        <>
            {Object.keys(data).length > 0 && (
                <ScrollView>
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
                            <Text style={{height: text(0.5), backgroundColor: '#DDDDDD', flex: 1}}></Text>
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
                                {data.fund_compare.fund_list.map((_item, _index) => {
                                    return (
                                        <View key={_index + '_item'}>
                                            <View style={[Style.flexRow]}>
                                                <View style={[Style.flexRow, {flex: 1, alignItems: 'baseline'}]}>
                                                    <View style={[styles.circle]}></View>
                                                    <Text style={{color: _item.color, fontSize: text(12)}}>
                                                        {_item.title}
                                                    </Text>
                                                </View>
                                                <Text style={styles.content_head_title}>
                                                    {data.fund_compare.header.ratio_src}
                                                </Text>
                                                <Text style={styles.content_head_title}>
                                                    {data.fund_compare.header.ratio_dst}
                                                </Text>
                                            </View>

                                            {_item.funds.map((_i, _d) => {
                                                const _color =
                                                    _i.compare == 'gt'
                                                        ? Colors.red
                                                        : _i.compare == 'lt'
                                                        ? Colors.green
                                                        : '#4E556C';
                                                return (
                                                    <View style={Style.flexRow} key={_i + _d}>
                                                        <Text
                                                            style={[
                                                                styles.content_item_text,
                                                                {flex: 1, textAlign: 'left'},
                                                            ]}>
                                                            {_i?.name}
                                                        </Text>
                                                        <Text style={styles.content_item_text}>{_i?.ratio_src}</Text>
                                                        <View
                                                            style={[
                                                                Style.flexRow,
                                                                {
                                                                    width: text(90),
                                                                    justifyContent: 'flex-end',
                                                                    paddingTop: text(15),
                                                                },
                                                            ]}>
                                                            <Text
                                                                style={{
                                                                    fontSize: Font.textH3,

                                                                    color: _color,
                                                                }}>
                                                                {_i?.ratio_dst}
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
                </ScrollView>
            )}
            <PasswordModal
                ref={passwordModal}
                onDone={submit}
                onClose={() => {
                    setMask(false);
                }}
            />
            {mask && <Mask />}
            {Object.keys(data).length > 0 && <FixedButton title={data.button.text} onPress={passwordInput} />}
        </>
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
