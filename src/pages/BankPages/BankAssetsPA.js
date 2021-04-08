/*
 * @Author: xjh
 * @Date: 2021-01-25 11:26:41
 * @Description:银行持仓(平安)
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-08 11:06:27
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/NavBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import Chart from '../../components/Chart';
import {gradientArea} from '../../components/Chart/chartOptions';
import ChartData from './data.json';

export default function BankAssetsPA(props) {
    const [data, setData] = useState({});
    const rightPress = () => {
        props.navigation.navigate(data.part4.url);
    };

    useEffect(() => {
        Http.get('/wallet/holding/20210101').then((res) => {
            setData(res.result);
        });
        console.log(ChartData);
    }, []);
    const jumpPage = (url) => {
        props.navigation.navigate(url);
    };
    const accountBtn = (url) => {
        props.navigation.navigate(url);
    };
    return (
        <SafeAreaView edges={['bottom']}>
            <Header
                title={'会存A'}
                leftIcon="chevron-left"
                rightText={'交易记录'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
                fontStyle={{color: '#fff'}}
                style={{backgroundColor: '#0052CD'}}
            />
            {Object.keys(data).length > 0 && (
                <ScrollView>
                    <View style={styles.bg_sty} />
                    <View style={Style.containerPadding}>
                        <View style={[styles.card_sty, Style.flexCenter]}>
                            <Text style={Style.descSty}>总金额(元){data.part1.date}</Text>
                            <Text style={styles.amount_sty}>{data.part1.amount}</Text>
                            <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.top_text_sty}>日收益</Text>
                                    <Html style={styles.bottom_num_sty} html={data.part1.profit} />
                                </View>
                                <View style={{flex: 1, textAlign: 'center'}}>
                                    <Text style={styles.top_text_sty}>累计收益</Text>
                                    <Html style={styles.bottom_num_sty} html={data.part1.profit_acc} />
                                </View>
                                <View style={{flex: 1, textAlign: 'center'}}>
                                    <Text style={styles.top_text_sty}>累计收益</Text>
                                    <Html style={styles.bottom_num_sty} html={data.part1.profit_acc} />
                                </View>
                            </View>
                            <View style={styles.btn_wrap_sty}>
                                <Button
                                    title={data.btns[0].text}
                                    style={styles.btn_st_sty}
                                    textStyle={{color: '#333'}}
                                    disables={data.btns[0].avail}
                                    onPress={() => jumpPage(data.btns[0].url)}
                                />
                                <Button
                                    title={data.btns[0].text}
                                    style={{flex: 1}}
                                    onPress={() => jumpPage(data.btns[1].url)}
                                    disables={data.btns[1].avail}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={[Style.flexRow, styles.account_wrap_sty]} onPress={accountBtn}>
                            <Text style={styles.account_sty}>我的电子账户</Text>
                            <View style={[Style.flexRow, {minWidth: text(100)}]}>
                                <Text style={[styles.account_sty, {textAlign: 'right', marginRight: text(5)}]}>
                                    123.334.22
                                </Text>
                                <AntDesign name={'right'} color={'#4E556C'} size={12} />
                            </View>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.title_sty}>7日年化</Text>
                            <View style={{height: 350, backgroundColor: '#fff'}}>
                                <Chart initScript={gradientArea(ChartData)} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#fff',
    },
    bg_sty: {
        backgroundColor: '#0052CD',
        height: text(120),
        width: '100%',
    },
    card_sty: {
        backgroundColor: '#fff',
        paddingVertical: text(25),
        marginTop: text(-130),
        borderRadius: text(10),
        paddingHorizontal: text(16),
    },
    amount_sty: {
        color: '#1F2432',
        fontSize: text(36),
        fontFamily: Font.numFontFamily,
        paddingTop: text(5),
    },
    top_text_sty: {
        fontSize: text(12),
        color: '#9095A5',
        textAlign: 'center',
        marginBottom: text(8),
    },
    bottom_num_sty: {
        color: '#1F2432',
        fontSize: text(18),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    btn_wrap_sty: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        marginTop: text(30),
    },
    btn_st_sty: {
        flex: 1,
        marginRight: text(10),
        backgroundColor: '#fff',
        borderWidth: 0.5,
    },
    account_wrap_sty: {
        padding: text(15),
        backgroundColor: '#fff',
        marginTop: text(12),
        borderRadius: text(10),
    },
    account_sty: {
        color: Colors.defaultFontColor,
        flex: 1,
        // fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
    },
    title_sty: {
        fontSize: text(15),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        paddingBottom: text(10),
        marginTop: text(20),
    },
});
