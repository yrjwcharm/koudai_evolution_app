/*
 * @Author: xjh
 * @Date: 2021-01-25 19:19:56
 * @Description:电子账户
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-17 20:58:43
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import Clipboard from '@react-native-community/clipboard';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
export default function ElectronicAccount(props) {
    const [data, setData] = useState({});
    const [num, setNum] = useState('');
    const jump = useJump();
    useEffect(() => {
        Http.get('/bank/elec_account/20210101', {
            ...props.route.params,
        }).then((res) => {
            setData(res.result);
            setNum(res.result.account.card);
        });
        setNum(num.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, '$1    '));
    }, []);
    const accountBtn = (url) => {
        props.navigation.navigate(url);
    };
    const copy = (text) => {
        Clipboard.setString(text);
        Toast.show('复制成功！');
    };
    return (
        <View style={Style.containerPadding}>
            {Object.keys(data).length > 0 && (
                <>
                    <FastImage
                        style={styles.bank_bg_sty}
                        source={{
                            uri: data?.account?.background,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View style={styles.fixed_sty}>
                        <View style={[Style.flexRow, styles.fixed_wrap]}>
                            <Text style={styles.fixed_title_sty}>{data?.account?.bank}</Text>
                            <TouchableOpacity onPress={() => copy(num)}>
                                <Text style={styles.copy_sty}>复制卡号</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.bank_no_sty}>{num}</Text>
                    </View>
                    <View style={[Style.flexRow, styles.account_wrap_sty]}>
                        <Text style={[styles.account_sty, {flex: 1}]}>电子账户余额</Text>
                        <View style={[Style.flexRow]}>
                            <Text style={[styles.account_sty, {textAlign: 'right', marginRight: text(5)}]}>
                                {data?.account?.balance}
                            </Text>
                            {/* <AntDesign name={'right'} color={'#4E556C'} size={12} /> */}
                        </View>
                    </View>
                    <View style={styles.card_wrap_sty}>
                        {data?.items.map((_item, _index) => {
                            return (
                                <TouchableOpacity
                                    style={[Style.flexRow]}
                                    onPress={accountBtn}
                                    key={_index + '_item'}
                                    onPress={() => jump(_item.url)}>
                                    <View
                                        style={[
                                            styles.list_wrap_sty,
                                            Style.flexRow,
                                            {borderBottomWidth: _index < data.items.length - 1 ? 0.5 : 0},
                                        ]}>
                                        <Text style={styles.list_title_sty}>{_item.title}</Text>
                                        <AntDesign name={'right'} color={'#4E556C'} size={12} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{marginTop: text(8)}}>
                        {data?.desc.map((_item, _index) => {
                            return (
                                <View style={{marginTop: text(12)}} key={_index + '_item'}>
                                    <Text style={styles.gray_title_sty}>{_item.key}</Text>
                                    <Html style={styles.gray_content_sty} html={_item.val} />
                                </View>
                            );
                        })}
                    </View>
                    <FixedButton
                        title={data?.button?.text}
                        disabled={data?.button?.avail == 0}
                        onPress={() => jump(data?.button?.url)}
                    />
                </>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    bank_bg_sty: {
        height: text(150),
    },
    fixed_sty: {
        position: 'relative',
    },
    fixed_title_sty: {
        fontSize: Font.textH1,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
    },
    fixed_wrap: {
        marginTop: text(-215),
        marginLeft: text(70),
    },
    copy_sty: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: text(6),
        paddingVertical: text(5),
        borderRadius: text(4),
        fontWeight: 'bold',
        marginRight: text(16),
    },
    bank_no_sty: {
        color: '#fff',
        fontFamily: Font.numFontFamily,
        marginTop: text(-60),
        fontSize: text(22),
        marginLeft: text(32),
    },
    account_wrap_sty: {
        padding: text(15),
        backgroundColor: '#fff',
        marginTop: text(12),
        borderRadius: text(10),
    },
    list_title_sty: {
        color: Colors.defaultFontColor,
        flex: 1,
    },
    account_sty: {
        color: Colors.defaultFontColor,
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        fontSize: text(16),
    },
    list_wrap_sty: {
        paddingVertical: text(20),
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
    card_wrap_sty: {
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
        marginTop: text(12),
        borderRadius: text(10),
    },
    gray_title_sty: {
        color: '#9095A5',
        marginBottom: text(5),
    },
    gray_content_sty: {
        color: '#9095A5',
        fontSize: text(12),
        lineHeight: text(16),
    },
});
