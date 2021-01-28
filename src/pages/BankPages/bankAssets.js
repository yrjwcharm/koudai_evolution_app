/*
 * @Author: xjh
 * @Date: 2021-01-25 11:20:31
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-25 17:23:00
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
import {BottomModal} from '../../components/Modal';
import Notice from '../../components/Notice';
import FitImage from 'react-native-fit-image';
import Question from '../../components/Question';
export default function bankAssets(props) {
    const [data, setData] = useState({});
    const disable = true;
    const bottomModal = React.useRef(null);
    const [activeSections, setActiveSections] = useState([0]);
    const updateSections = (activeSections) => setActiveSections(activeSections);
    const rightPress = () => {
        props.navigation.navigate(data.part4.url);
    };
    const qs = {
        title: '常见问题',
        rows: [
            {
                k: '1.理财魔方为什么可以销售银行存款产品？',
                v:
                    '银行存款产品和服务是各家银行直接提供的，理财魔方作为信息展示平台，并提供存款产品开户、存入、取出的入口。用户存款存入和取出是直接在银行开通的银行电子账户中完成的。',
            },
            {
                k: '2.享存6个月是什么？',
                v:
                    '一、自动派息：到达派息期后，利息自动转入电子账户，本金自动续存到一下周期。最长存期5年，按到期利率（4.71%）计息，补足剩余利息。</br>二、快速到账。您在申请提前支取、解约时，资金快速到账。',
            },
            {
                k: '3.收益如何计算？何时到账？',
                v:
                    '在享存账户购买当日即开始计算收益，次日支取即会获得收益，当日支取无收益。到达派息期后，利息自动转入电子账户，本金自动续存到一下周期。最长存期5年，按到期利率（4.71%）计息，补足剩余利息。',
            },
            {
                k: '4.有资金需求时，如何支取？',
                v:
                    '在享存账户购买当日即开始计算收益，次日支取即会获得收益，当日支取无收益。到达派息期后，利息自动转入电子账户，本金自动续存到一下周期。最长存期5年，按到期利率（4.71%）计息，补足剩余利息。',
            },
            {
                k: '5.什么是存款保险？',
                v:
                    '存款保险又称存款保障，是指国家通过立法的形式，设立专门的存款保险基金，明确当个别金融机构经营出现问题时，依照规定对存款人进行及时偿付，保障存款人权益。',
            },
            {
                k: '6.存款保险保障范围是什么？',
                v:
                    '根据存款保险条例，存款保险覆盖所有吸收存款的银行业金融机构，包括在我国境内设立的商业银行、农村合作银行、农村信用合作社等。 被保险存款包括投保机构吸收的人民币存款和外币存款。但是，金融机构同业存款、投保机构的高级管理人员在本投保机构的存款以及存款保险基金管理机构规定不予保险的其他存款除外。',
            },
            {
                k: '7.存款保险偿付限额是多少？',
                v:
                    '根据存款保险条例，存款保险实行限额偿付，最高偿付限额为人民币50万元。同一存款人在同一家投保机构所有被保险存款账户的存款本金和利息合并计算的资金数额在最高偿付限额以内的，实行全额偿付；超出最高偿付限额的部分，依法从投保机构清算财产中受偿。',
            },
            {
                k: '8.存款人需要交纳保费吗？',
                v:
                    '不需要。存款保险作为国家金融安全网的一部分，其资金来源主要是金融机构按规定交纳的保费。收取保费的主要目的是为了加强对金融机构的市场约束，促使银行审慎经营和健康发展。',
            },
            {
                k: '9.什么情况下存款保险进行偿付？',
                v:
                    '根据存款保险条例，当出现下列情形时，存款人有权要求存款保险基金管理机构使用存款保险基金偿付被保险存款：存款保险基金管理机构担任投保机构的接管组织；存款保险基金管理机构实施被撤销投保机构的清算；人民法院裁定受理对投保机构的破产申请；经国务院批准的其他情形。为了保障偿付的及时性，充分保护存款人的权益，条例规定，存款保险基金管理机构应当在上述情形发生之日起7个工作日内足额偿付存款。',
            },
        ],
    };
    const content = [
        {
            type: 'text',
            text: '支取利息=支取金额X派息期内实际持有时间X活期利率/360',
            title: '计算规则',
        },
        {
            type: 'img',
            img: 'https://static.licaimofang.com/wp-content/uploads/2020/01/20200106124810xc.png',
            title: '产品对比',
        },
    ];
    useEffect(() => {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/wallet/holding/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    const reasonShow = () => {
        bottomModal.current.show();
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
                fontStyle={{color: '#000'}}
                style={{backgroundColor: '#fff'}}
            />
            <Notice content={'消息通知通知通知，内容内容内容'} isClose={true} />
            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: 120}}>
                    <View style={[styles.card_sty, Style.flexCenter]}>
                        <View style={Style.flexRowCenter}>
                            <Text style={Style.descSty}>总资产(元)</Text>
                            <TouchableOpacity onPress={reasonShow}>
                                <AntDesign
                                    name={'questioncircleo'}
                                    color={'#666666'}
                                    size={13}
                                    style={{marginLeft: text(5)}}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.amount_sty}>{data.part1.amount}</Text>
                        <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                            <View style={{flex: 1}}>
                                <Text style={styles.top_text_sty}>本金金额</Text>
                                <Text style={styles.bottom_num_sty}>{data.part1.profit}</Text>
                            </View>
                            <View style={{flex: 1, textAlign: 'center'}}>
                                <Text style={styles.top_text_sty}>昨日受益</Text>
                                <Text style={styles.bottom_num_sty}>{data.part1.profit_acc}</Text>
                            </View>
                            <View style={{flex: 1, textAlign: 'center'}}>
                                <Text style={styles.top_text_sty}>累计受益</Text>
                                <Text style={styles.bottom_num_sty}>{data.part1.profit_acc}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: disable ? '#DDDDDD' : '#0051CC',
                                borderRadius: text(25),
                                marginVertical: text(20),
                            }}>
                            <Text style={styles.btn_text_sty}>已售空</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Style.flexRow, styles.account_wrap_sty]} onPress={accountBtn}>
                            <Text style={styles.account_sty}>我的电子账户(123.334.22元)</Text>
                            <AntDesign name={'right'} color={'#4E556C'} size={12} />
                        </TouchableOpacity>
                    </View>
                    {content.map((_i, _d) => {
                        return (
                            <View style={styles.content_sty}>
                                <Text style={styles.title_sty}>{_i.title}</Text>
                                {_i.type == 'text' && <Text>{_i.text}</Text>}
                                {_i.type == 'img' && (
                                    <FitImage
                                        source={{
                                            uri: _i.img,
                                        }}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        );
                    })}
                    <View style={[styles.content_sty, {marginVertical: text(12)}]}>
                        <Text style={styles.title_sty}>{qs.title}</Text>
                        <Question data={qs.rows} />
                    </View>
                    <View>
                        <View style={[Style.flexRow, styles.list_sty]}>
                            <Text style={{flex: 1}}>魔方客服电话</Text>
                            <Text>400-080-8208</Text>
                        </View>
                    </View>
                </ScrollView>
            )}
            <BottomModal ref={bottomModal} confirmText={'确认'}>
                <Text>弹窗内容</Text>
            </BottomModal>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#fff',
    },
    card_sty: {
        backgroundColor: '#fff',
        paddingTop: text(25),
        marginBottom: text(12),
    },
    amount_sty: {
        color: '#333',
        fontSize: text(42),
        fontFamily: Font.numFontFamily,
        paddingTop: text(5),
    },
    top_text_sty: {
        fontSize: text(12),
        color: '#666666',
        textAlign: 'center',
    },
    bottom_num_sty: {
        color: '#333333',
        fontSize: text(14),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
        marginTop: text(8),
    },
    btn_text_sty: {
        color: '#fff',
        paddingVertical: text(6),
        paddingHorizontal: text(20),
    },
    account_sty: {
        color: '#333333',
        flex: 1,
    },
    account_wrap_sty: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        padding: text(15),
    },
    title_sty: {
        fontSize: text(15),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        paddingBottom: text(10),
    },
    content_sty: {
        padding: text(16),
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    list_sty: {
        backgroundColor: '#fff',
        padding: text(16),
    },
});
