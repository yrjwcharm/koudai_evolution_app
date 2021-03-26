/*
 * @Author: xjh
 * @Date: 2021-02-23 17:29:21
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-26 19:06:51
 */
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking} from 'react-native';
import Notice from '../../components/Notice';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
const btnHeight = isIphoneX() ? text(90) : text(66);
export default function BankList({navigation, route}) {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/bank/asset/list/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    const jumpTo = (url) => {
        if (url.type == 2) {
            //尼克跳转外链
            Linking.openURL(url.path);
        } else {
            navigation.navigate(url.path, url.params);
        }
    };
    return (
        <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
            <Notice content={data.processing} />
            <ScrollView style={{padding: text(16), paddingBottom: btnHeight}}>
                {Object.keys(data).length > 0 &&
                    data.products.map((_pro, _index) => {
                        return (
                            <View
                                style={{
                                    marginBottom: text(16),
                                    backgroundColor: '#fff',
                                    borderRadius: text(10),
                                    overflow: 'hidden',
                                    paddingHorizontal: text(16),
                                }}
                                key={_index + '_pro'}>
                                {_pro.products.map((_p, _i) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[
                                                styles.card_sty,
                                                {borderBottomWidth: _i < _pro.products.length - 1 ? 0.5 : 0},
                                            ]}
                                            onPress={() => jumpTo(_p.url)}
                                            key={_i + '_p'}>
                                            <View style={{flex: 1}}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <Image
                                                        source={{
                                                            uri: _p.logo,
                                                        }}
                                                        resizeMode="contain"
                                                        style={{
                                                            height: text(16),
                                                            minWidth: '20%',
                                                        }}
                                                    />
                                                    <Text style={styles.title_sty}>| {_p.prod_name}</Text>
                                                </View>
                                                <View style={[Style.flexRow, {paddingTop: text(12)}]}>
                                                    <View style={{width: '50%'}}>
                                                        <Text style={styles.desc_sty}>总金额</Text>
                                                        <Text style={styles.num_sty}>{_p.amount}</Text>
                                                    </View>
                                                    <View style={{width: '50%'}}>
                                                        <Text style={styles.desc_sty}>累计收益</Text>
                                                        <Text style={styles.num_sty}>{_p.profit_acc}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <AntDesign name={'right'} size={12} color={Colors.descColor} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    })}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        paddingVertical: text(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.borderColor,
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: text(14),
        fontWeight: 'bold',
        marginLeft: text(5),
    },
    desc_sty: {
        color: '#999',
        fontSize: Font.textH3,
    },
    num_sty: {
        color: '#292D39',
        fontSize: text(14),
        fontFamily: Font.numFontFamily,
        paddingTop: text(6),
    },
});
