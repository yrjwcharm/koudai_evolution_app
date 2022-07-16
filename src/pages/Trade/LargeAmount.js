/*
 * @Description:大额转账汇款
 * @Autor: xjh
 * @Date: 2021-01-22 14:28:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-15 10:11:45
 */
import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {px as text, isIphoneX} from '~/utils/appUtil';
import Html from '~/components/RenderHtml';
import Http from '~/services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '~/components/Button';
import Toast from '~/components/Toast/';
import Clipboard from '@react-native-community/clipboard';
import Notice from '~/components/Notice';
import {Modal} from '~/components/Modal';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect} from '@react-navigation/native';
const btnHeight = isIphoneX() ? text(90) : text(66);

const tips = (phone) => [
    '1.请使用上述指定的汇款银行卡的网上银行、手机银行或银行柜台，用转账汇款功能向魔方监管户中汇款；',
    '2. 转账后预计5分钟内即可点击页面下方按钮，确认资金到账情况，汇款到账后将自动存入魔方宝；',
    `3. 如您已汇款，但迟迟查询不到余额，可拨打客服电话：<span style="color: ${Colors.red}">${phone}</span>`,
    '4. 民生银行是理财魔方的资金监管银行，您的汇款资金安全有保障。',
];

const LargeAmount = (props) => {
    const [data, setData] = useState({});
    const init = () => {
        Http.get('/trade/large_transfer/info/20210101').then((res) => {
            setData(res.result);
            props.navigation.setOptions({
                headerRight: () => {
                    return (
                        <TouchableOpacity onPress={rightPress} activeOpacity={0.8}>
                            <Text style={styles.right_sty}>{'使用说明'}</Text>
                        </TouchableOpacity>
                    );
                },
            });
        });
    };
    const jumpPage = (url) => {
        if (!url) {
            return;
        }
        props.navigation.navigate(url);
    };
    const btnClick = () => {
        Http.get('/trade/large_transfer/query/20210101').then((res) => {
            Modal.show({
                title: res.result?.title,
                content: res.result.content,
                confirmCallBack: () => jumpTo(res.result.status),
            });
        });
    };
    const jumpTo = (status) => {
        if (status === 1) {
            //查询到信息 返回上一页
            props.navigation.goBack();
        }
    };
    const copy = (_text) => {
        Clipboard.setString(_text);
        Toast.show('复制成功！');
    };
    const rightPress = () => {
        props.navigation.navigate('LargeAmountIntro');
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    return (
        <View style={{backgroundColor: Colors.bgColor}}>
            {Object.keys(data).length > 0 && (
                <ScrollView
                    style={
                        (Style.containerPadding,
                        {padding: 0, marginBottom: btnHeight, borderTopWidth: 0.5, borderColor: Colors.borderColor})
                    }>
                    <Notice content={{content: data?.processing}} isClose={true} />
                    <View style={[{padding: Space.padding}, styles.card_sty]}>
                        <Text style={styles.title_sty}>大额极速购-使用流程</Text>
                        <View style={styles.process_wrap}>
                            <Image
                                source={require('~/assets/img/common/largeAmount.png')}
                                resizeMode="contain"
                                style={styles.image_sty}
                            />
                        </View>
                        <View style={styles.process_list}>
                            <Html
                                html={
                                    "1.使用指定银行卡<br/><font style='color:#E74949'>向<font style='font-weight:bold'>魔方监管户</font>汇款</font>"
                                }
                                style={{lineHeight: text(18)}}
                            />
                            <Html
                                html={'<span style="textAlign:center">2.汇款金额存入<br/>魔方宝</span>'}
                                style={{lineHeight: text(18)}}
                            />
                        </View>
                    </View>
                    <View style={[{padding: Space.padding}, styles.card_sty, {paddingBottom: 0}]}>
                        <Text style={[styles.title_sty, {marginBottom: text(16)}]}>
                            可用银行卡列表<Text style={styles.desc_sty}> (仅支持已绑定银行卡汇款)</Text>
                        </Text>

                        <>
                            {data?.pay_methods?.map((_item, _index) => {
                                return (
                                    <TouchableOpacity
                                        style={[Style.flexRow, styles.list_sty]}
                                        key={_index + '_item'}
                                        onPress={() => jumpPage(_item.url)}
                                        activeOpacity={0.8}>
                                        <View style={[Style.flexRow, {flex: 1}]}>
                                            <Image
                                                source={{uri: _item.bank_icon}}
                                                style={{width: text(28), height: text(28), marginRight: text(10)}}
                                            />
                                            <Text>
                                                {_item.bank_name}({_item.bank_no})
                                            </Text>
                                        </View>
                                        {!!_item.url && <AntDesign name={'right'} color={'#999999'} size={12} />}
                                    </TouchableOpacity>
                                );
                            })}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.bankCard,
                                    {
                                        borderTopColor: Colors.borderColor,
                                        borderTopWidth: 0.5,
                                    },
                                ]}
                                onPress={() =>
                                    props.navigation.navigate({name: 'AddBankCard', params: {action: 'add'}})
                                }>
                                <Image
                                    style={[styles.bank_icon, {width: text(36), marginLeft: text(-5)}]}
                                    source={require('~/assets/img/common/mfbIcon.png')}
                                />
                                <View style={{flex: 1}}>
                                    <Text style={styles.text}>使用新卡汇款</Text>
                                </View>
                                <Entypo name={'chevron-thin-right'} size={12} color={'#000'} />
                            </TouchableOpacity>
                        </>
                    </View>
                    <View style={[{padding: Space.padding}, styles.card_sty, {paddingBottom: 0}]}>
                        <Text style={[styles.title_sty, {paddingBottom: text(16)}]}>
                            魔方监管户信息<Text style={styles.desc_sty}>（民生银行监管）</Text>
                        </Text>
                        <View>
                            <View style={[Style.flexRow, styles.item_wrap_sty]}>
                                <View style={styles.item_sty}>
                                    <Text style={styles.item_top_sty}>账户信息</Text>
                                    <Text style={styles.item_bottom_sty}>{data?.mf_account_info?.bank_name}</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{borderRadius: text(4), overflow: 'hidden'}}
                                    onPress={() => copy(data?.mf_account_info?.bank_name)}>
                                    <Text style={styles.copy_sty}>复制</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[Style.flexRow, styles.item_wrap_sty]}>
                                <View style={styles.item_sty}>
                                    <Text style={styles.item_top_sty}>银行卡账号</Text>
                                    <Text style={styles.item_bottom_sty}>{data?.mf_account_info?.bank_no}</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{borderRadius: text(4), overflow: 'hidden'}}
                                    onPress={() => copy(data?.mf_account_info?.bank_no)}>
                                    <Text style={styles.copy_sty}>复制</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[Style.flexRow, styles.item_wrap_sty]}>
                                <View style={styles.item_sty}>
                                    <Text style={styles.item_top_sty}>开户行</Text>
                                    <Text style={styles.item_bottom_sty}>{data?.mf_account_info?.bank_addr}</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{borderRadius: text(4), overflow: 'hidden'}}
                                    onPress={() => copy(data?.mf_account_info?.bank_addr)}>
                                    <Text style={styles.copy_sty}>复制</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.tip_sty}>
                        <Text style={{color: Colors.descColor}}>提示信息：</Text>
                        {tips(data.phone)?.map((_i, _d) => {
                            return (
                                <View style={{marginTop: text(10)}} key={_i + _d}>
                                    <Html html={_i} style={{lineHeight: text(18), color: Colors.descColor}} />
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            )}
            {Object.keys(data).length > 0 && <FixedButton title={data.button.text} onPress={btnClick} />}
        </View>
    );
};

const styles = StyleSheet.create({
    image_sty: {
        width: text(242),
        height: text(36),
    },
    process_list: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: text(15),
        paddingTop: text(16),
    },
    title_sty: {
        color: '#292D39',
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    process_wrap: {
        paddingTop: text(24),
        // paddingHorizontal: text(5),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card_sty: {
        backgroundColor: '#fff',
        marginBottom: text(12),
    },
    desc_sty: {
        color: Colors.red,
        fontSize: Font.textH3,
        fontWeight: '400',
        paddingTop: text(8),
        paddingBottom: text(13),
    },
    list_sty: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingVertical: text(12),
    },
    item_sty: {
        flexDirection: 'column',
        flex: 1,
        paddingVertical: text(12),
    },
    item_top_sty: {
        color: '#545968',
        fontSize: text(14),
    },
    item_bottom_sty: {
        color: '#121D3A',
        fontSize: text(14),
        paddingTop: text(6),
        fontWeight: 'bold',
    },
    copy_sty: {
        backgroundColor: '#0051CC',
        color: '#fff',
        fontSize: text(12),
        paddingHorizontal: text(8),
        paddingVertical: text(8),
    },
    item_wrap_sty: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    tip_sty: {
        paddingTop: text(6),
        padding: Space.padding,
    },
    right_sty: {
        paddingHorizontal: text(7),
        paddingVertical: text(5),
        borderColor: Colors.defaultColor,
        borderWidth: 0.5,
        borderRadius: text(5),
        marginRight: text(16),
    },
    bankCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        height: text(62),
        justifyContent: 'space-between',

        // overflow: 'hidden'
    },
    bank_icon: {
        width: text(32),
        height: text(32),
        marginRight: 14,
        resizeMode: 'contain',
    },
    content_sty: {
        marginTop: text(16),
        lineHeight: text(18),
        marginBottom: text(20),
        color: '#545968',
        fontSize: text(12),
    },
});
export default LargeAmount;
