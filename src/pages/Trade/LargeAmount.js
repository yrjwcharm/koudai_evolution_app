/*
 * @Description:大额转账汇款
 * @Autor: xjh
 * @Date: 2021-01-22 14:28:27
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-26 14:55:56
 */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import Toast from '../../components/Toast/';
import Clipboard from '@react-native-community/clipboard';
import Notice from '../../components/Notice';
import {Modal} from '../../components/Modal';
import {useJump} from '../../components/hooks/';
const btnHeight = isIphoneX() ? text(90) : text(66);

const tips = [
    {title: '1.请使用上述指定的汇款银行卡的网上银行、手机银行或银行柜台，用转账汇款功能向魔方监管户中汇款。'},
    {title: '2. 转账后预计5分钟内即可点击页面下方按钮，确认资金到账情况，汇款到账后将自动存入魔方宝。'},
    {title: '3. 如您已汇款，但迟迟查询不到余额，可拨打客服电话：', tel: '400-080-8208'},
    {title: '4. 民生银行是理财魔方的资金监管银行，您的汇款资金安全有保障。'},
];

const LargeAmount = (props) => {
    const [data, setData] = useState({});
    const jump = useJump();
    useEffect(() => {
        Http.get('/trade/large_transfer/info/20210101').then((res) => {
            setData(res.result);
            props.navigation.setOptions({
                headerRight: () => {
                    return (
                        <TouchableOpacity onPress={rightPress} activeOpacity={1}>
                            <Text style={styles.right_sty}>{'汇款说明'}</Text>
                        </TouchableOpacity>
                    );
                },
            });
        });
    }, [props.navigation]);
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
    const copy = (text) => {
        Clipboard.setString(text);
        Toast.show('复制成功！');
    };
    const rightPress = () => {
        props.navigation.navigate('LargeAmountIntro');
    };
    return (
        <View style={{backgroundColor: Colors.bgColor}}>
            {Object.keys(data).length > 0 && (
                <ScrollView style={(Style.containerPadding, {padding: 0, marginBottom: btnHeight})}>
                    <Notice content={data?.processing} isClose={true} />
                    {/* <Text style={styles.yellow_sty}>{data.processing}</Text> */}
                    <View style={[{padding: Space.padding}, styles.card_sty]}>
                        <Text style={styles.title_sty}>汇款流程</Text>
                        <View style={styles.process_wrap}>
                            <Image
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/largeAmount.png',
                                }}
                                style={styles.image_sty}
                            />
                        </View>
                        <View style={styles.process_list}>
                            <Html
                                html={"1.使用指定银行卡<br/>向<font style='color:#E74949'>魔方监管户</font>汇款"}
                                style={{lineHeight: text(18)}}
                            />
                            <Html
                                html={'<span style="textAlign:center">2.资金到账后存入<br/>魔方宝</span>'}
                                style={{lineHeight: text(18)}}
                            />
                        </View>
                    </View>
                    <View style={[{padding: Space.padding}, styles.card_sty, {paddingBottom: 0}]}>
                        <Text style={styles.title_sty}>支持银行卡</Text>
                        <Text style={styles.desc_sty}>仅支持以下银行卡的转账汇款，否则资金将原路返回</Text>
                        <>
                            {data?.pay_methods?.map((_item, _index) => {
                                return (
                                    <TouchableOpacity
                                        style={[Style.flexRow, styles.list_sty]}
                                        key={_index + '_item'}
                                        onPress={() => jumpPage(_item.url)}
                                        activeOpacity={1}>
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
                        </>
                    </View>
                    <View style={[{padding: Space.padding}, styles.card_sty, {paddingBottom: 0}]}>
                        <Text style={[styles.title_sty, {paddingBottom: text(15)}]}>
                            魔方监管户<Text style={{color: '#E74949', fontSize: 12}}>（民生银行全程监管）</Text>
                        </Text>
                        <View>
                            <View style={[Style.flexRow, styles.item_wrap_sty]}>
                                <View style={styles.item_sty}>
                                    <Text style={styles.item_top_sty}>账户信息</Text>
                                    <Text style={styles.item_bottom_sty}>{data?.mf_account_info?.bank_name}</Text>
                                </View>
                                <TouchableOpacity
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
                                    style={{borderRadius: text(4), overflow: 'hidden'}}
                                    onPress={() => copy(data?.mf_account_info?.bank_addr)}>
                                    <Text style={styles.copy_sty}>复制</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.tip_sty}>
                        <Text style={{marginBottom: text(10), color: '#545968'}}>提示信息：</Text>
                        {tips?.map((_i, _d) => {
                            return (
                                <View style={{marginBottom: text(10)}} key={_d + '_i'}>
                                    <Text key={_i + _d} style={{lineHeight: text(18), color: '#545968'}}>
                                        {_i.title}
                                    </Text>
                                    {_i.tel ? <Text style={{color: '#E74949'}}> {_i.tel}</Text> : null}
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
        width: text(239),
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
        color: '#545968',
        fontSize: Font.textH3,
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
});
export default LargeAmount;
