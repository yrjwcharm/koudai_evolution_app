/*
 * @Author: xjh
 * @Date: 2021-01-25 11:20:31
 * @Description:银行持仓
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-06 15:13:27
 */
import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/NavBar';
import {BottomModal} from '../../components/Modal';
import Notice from '../../components/Notice';
import FitImage from 'react-native-fit-image';
import Question from '../../components/Question';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
const btnHeight = isIphoneX() ? text(90) : text(66);
export default function BankAssets(props) {
    const [data, setData] = useState({});
    const bottomModal = React.useRef(null);
    const jump = useJump();
    const rightPress = (url) => {
        props.navigation.navigate(url.path, url.params);
    };
    useFocusEffect(
        useCallback(() => {
            Http.get('/bank/asset/detail/20210101', {
                ...props.route.params,
            }).then((res) => {
                setData(res.result);
            });
        }, [])
    );

    const reasonShow = () => {
        bottomModal.current.show();
    };

    return (
        <>
            {Object.keys(data).length > 0 && (
                <View>
                    <Header
                        title={data.title}
                        leftIcon="chevron-left"
                        rightText={data.trade_record?.text}
                        rightPress={() => rightPress(data.trade_record.url)}
                        rightTextStyle={styles.right_sty}
                        fontStyle={{color: '#000'}}
                        titleStyle={{marginLeft: text(16)}}
                        style={{backgroundColor: '#fff'}}
                    />
                    {data?.processing ? <Notice content={data?.processing} isClose={true} /> : null}
                    {Object.keys(data).length > 0 && (
                        <ScrollView style={{marginBottom: btnHeight}}>
                            <View style={[styles.card_sty, Style.flexCenter]}>
                                <View style={Style.flexRowCenter}>
                                    <Text style={Style.descSty}>{data.asset.amount.k}</Text>
                                    <TouchableOpacity onPress={reasonShow} activeOpacity={1}>
                                        <AntDesign
                                            name={'questioncircleo'}
                                            color={'#666666'}
                                            size={13}
                                            style={{marginLeft: text(5)}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.amount_sty}>{data.asset.amount.v}</Text>
                                <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.top_text_sty}>{data.asset.principal.k}</Text>
                                        <Text style={styles.bottom_num_sty}>{data.asset.principal.v}</Text>
                                    </View>
                                    <View style={{flex: 1, textAlign: 'center'}}>
                                        <Text style={styles.top_text_sty}>{data.asset.profit.k}</Text>
                                        <Text style={styles.bottom_num_sty}>{data.asset.profit.v}</Text>
                                    </View>
                                    <View style={{flex: 1, textAlign: 'center'}}>
                                        <Text style={styles.top_text_sty}>{data.asset.profit_acc.k}</Text>
                                        <Text style={styles.bottom_num_sty}>{data.asset.profit_acc.v}</Text>
                                    </View>
                                </View>
                                {data?.button && (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        disabled={data?.button?.avail == 0}
                                        style={{
                                            backgroundColor: data?.button?.avail == 0 ? '#DDDDDD' : '#0051CC',
                                            borderRadius: text(25),
                                            marginTop: text(20),
                                        }}
                                        onPress={() => jump(data?.button?.url)}>
                                        <Text style={styles.btn_text_sty}>{data?.button?.text}</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[
                                        Style.flexRow,
                                        styles.account_wrap_sty,
                                        {borderBottomWidth: 0, marginTop: text(20)},
                                    ]}
                                    onPress={() => jump(data?.elec_account?.url)}>
                                    <Text style={styles.account_sty}>
                                        {data.elec_account.title}
                                        {data?.elec_account?.balance ? (
                                            <Text>({data?.elec_account?.balance})</Text>
                                        ) : null}
                                    </Text>
                                    <AntDesign name={'right'} color={'#4E556C'} size={12} />
                                </TouchableOpacity>
                            </View>
                            {/* 取出 */}
                            {data?.shares?.length > 0 &&
                                data?.shares?.map((_s, _index) => {
                                    return (
                                        <View style={styles.card_out_sty} key={_index}>
                                            <View style={{flex: 1}}>
                                                {_s.title ? <Html html={_s.title} /> : null}
                                                <View
                                                    style={{
                                                        marginTop: text(10),
                                                        flexDirection: 'row',
                                                    }}>
                                                    {_s.data.map((_d, index) => {
                                                        return (
                                                            <View key={index} style={{flex: 1}}>
                                                                <Text
                                                                    style={[styles.top_text_sty, {textAlign: 'left'}]}>
                                                                    {_d.k}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.bottom_num_sty,
                                                                        {textAlign: 'left'},
                                                                    ]}>
                                                                    {_d.v}
                                                                </Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                            {_s.button?.text ? (
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    disabled={_s.button.avail == 0}
                                                    style={[
                                                        styles.outBtn,
                                                        {
                                                            backgroundColor:
                                                                _s.button.avail == 0 ? '#DDDDDD' : '#0051CC',
                                                        },
                                                    ]}
                                                    onPress={() => jump(_s.button.url)}>
                                                    <Text style={[{fontSize: text(12), color: '#fff'}]}>
                                                        {_s.button.text}
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                    );
                                })}

                            {data?.interest && (
                                <View style={[styles.content_sty, {marginTop: text(16)}]}>
                                    <Text style={styles.title_sty}>{data.interest.title}</Text>
                                    <Text>{data.interest.desc}</Text>
                                    {data?.interest?.images.map((_img, _index) => {
                                        return (
                                            <View key={_index}>
                                                <Text style={[styles.title_sty, {marginTop: text(12)}]}>{_img.k}</Text>
                                                <FitImage
                                                    source={{
                                                        uri: _img.v,
                                                    }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            <View style={[styles.content_sty, {marginVertical: text(12)}]}>
                                <Text style={styles.title_sty}>{data.faq.title}</Text>
                                <Question data={data.faq.rows} />
                            </View>
                            <View
                                style={{paddingHorizontal: text(16), backgroundColor: '#fff', marginBottom: text(20)}}>
                                {data?.contact?.map((_c, _d) => {
                                    return (
                                        <View
                                            style={[
                                                Style.flexRow,
                                                styles.list_sty,
                                                {
                                                    borderBottomWidth: _d < data.contact.length - 1 ? 0.5 : 0,
                                                    borderColor: Colors.borderColor,
                                                },
                                            ]}
                                            key={_d + '_c'}>
                                            <Text style={{flex: 1}}>{_c.key}</Text>
                                            <Text>{_c.val}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    )}
                    <BottomModal ref={bottomModal} title="提示">
                        <View style={{padding: text(16)}}>
                            <Html
                                html={
                                    '总金额：<br>账户总金额 = 当前本金+当前支取收益， 总金额=所有账户总金额之和<br><br>日收益：<br>账户D日收益 = D日日末总金额 - D日购买本金  + D日赎回本金之和 + D日赎回利息之和 -  (D减1日日末总金额)<br>其中日末总金额=日末本金+计息后日末当前支取收益<br>D日收益 = 各账户D日收益之和<br><br>累计收益：<br>账户累计收益 = 该账户历次支取收益之和 + 当前支取收益<br>累计收益 = 各个账户累计收益之和 （含已经清仓的账户）'
                                }
                            />
                        </View>
                    </BottomModal>
                </View>
            )}
        </>
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
        // marginBottom: text(12),
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
        fontSize: text(13),
    },
    account_sty: {
        color: '#333333',
        flex: 1,
    },
    account_wrap_sty: {
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        padding: text(15),
    },
    title_sty: {
        fontSize: text(15),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        paddingBottom: text(14),
    },
    content_sty: {
        padding: text(16),
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    list_sty: {
        paddingVertical: text(16),
    },
    card_out_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        flexDirection: 'row',
        margin: text(16),
        marginBottom: 0,
        borderRadius: text(10),
    },
    outBtn: {
        borderRadius: text(25),
        paddingHorizontal: text(16),
        justifyContent: 'center',
        height: text(28),
        alignSelf: 'center',
    },
});
