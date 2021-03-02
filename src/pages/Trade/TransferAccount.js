/*
 * @Author: xjh
 * @Date: 2021-03-02 12:12:27
 * @Description:一键转投智能组合
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-02 16:16:34
 */
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import Clipboard from '@react-native-community/clipboard';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';

export default function TransferAccount() {
    const [show, setShow] = useState(false);
    const toggle = () => {
        setShow(!show);
    };
    return (
        <>
            <ScrollView>
                <View style={styles.card_sty}>
                    <Text style={styles.title_sty}>低估值智能定投</Text>
                    <View style={[Style.flexRow, {paddingVertical: text(12)}]}>
                        <Image
                            source={require('../../assets/img/transfer.png')}
                            style={{width: text(18), height: text(18)}}
                        />
                        <Text style={{color: '#9AA1B2', fontSize: text(12), marginHorizontal: text(5)}}>转化为</Text>
                        <Text style={{height: text(0.5), backgroundColor: '#DDDDDD', flex: 1}}></Text>
                    </View>
                    <Text style={styles.title_sty}>智能组合</Text>
                </View>
                <View style={[styles.card_sty, {paddingBottom: text(10)}]}>
                    <Text style={{fontSize: Font.textH1}}>预估转化金额</Text>
                    <View style={[Style.flexRow, styles.num_wrap_sty]}>
                        <Text style={{fontSize: text(20), fontWeight: 'bold'}}>¥</Text>
                        <Text style={styles.num_sty}>50,000.00</Text>
                    </View>
                    <Text style={{color: '#9095A5', fontSize: Font.textH3, paddingTop: text(10)}}>
                        估算费用:421.03元（节省231.38元）
                    </Text>
                </View>
                <TouchableOpacity style={[styles.card_sty, {flexDirection: 'row'}]} onPress={toggle} activeOpacity={1}>
                    <Text style={{flex: 1}}>转换后持仓详情</Text>
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
                            <View>
                                <View style={[Style.flexRow]}>
                                    <View style={[Style.flexRow, {flex: 1, alignItems: 'baseline'}]}>
                                        <View style={[styles.circle]}></View>
                                        <Text style={{color: '#9AA1B2', fontSize: text(12)}}>哈哈哈哈哈</Text>
                                    </View>
                                    <Text style={styles.content_head_title}>11111</Text>
                                    <Text style={styles.content_head_title}>1111</Text>
                                </View>

                                <View style={Style.flexRow}>
                                    <Text style={[styles.content_item_text, {flex: 1, textAlign: 'left'}]}>
                                        哈哈哈哈哈
                                    </Text>
                                    <Text style={styles.content_item_text}>1111</Text>
                                    <Text style={styles.content_item_text}>1111</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                <View style={{margin: text(16)}}>
                    <Html
                        html={
                            '1.预估转化金额根据上一个交易日净值估算预估转化金额根据上一个交易日净值估算预估转化金额根据上一个交易日净值估算'
                        }
                        style={{color: '#9095A5', fontSize: text(12), lineHeight: text(18)}}
                    />
                </View>
            </ScrollView>
            <FixedButton title="确认购买" />
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
        paddingTop: text(10),
    },
});
