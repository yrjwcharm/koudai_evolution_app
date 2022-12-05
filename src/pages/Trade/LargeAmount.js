/*
 * @Description:大额转账汇款
 * @Autor: xjh
 * @Date: 2021-01-22 14:28:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-05 10:59:31
 */
import React, {useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TouchableNativeFeedback} from 'react-native';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {px as text, isIphoneX, px} from '~/utils/appUtil';
import Html from '~/components/RenderHtml';
import Http from '~/services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '~/components/Button';
import Toast from '~/components/Toast/';
import Clipboard from '@react-native-community/clipboard';
import {Modal} from '~/components/Modal';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import BottomDesc from '~/components/BottomDesc';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useJump} from '~/components/hooks';

const btnHeight = isIphoneX() ? text(90) : text(66);

const LargeAmount = (props) => {
    const inset = useSafeAreaInsets();
    const jump = useJump();

    const [data, setData] = useState(null);
    const [criticalState, setScrollCriticalState] = useState(false);
    const [button, setButton] = useState(null);

    const navBarRef = useRef();

    const init = () => {
        Http.get('/trade/large_transfer/info/20210101', props.route.params).then((res) => {
            setData(res.result);
            setButton(null);
            setButton(res.result.button);
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

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    const onScroll = (e) => {
        const y = e.nativeEvent.contentOffset.y;
        const criticalNum = 100;
        const interval = 1 / criticalNum;

        let opacity = 0;

        if (y > criticalNum) {
            opacity = 1;
        } else {
            opacity = interval * y;
        }

        if (opacity > 0.8) {
            !criticalState && setScrollCriticalState(true);
        } else {
            criticalState && setScrollCriticalState(false);
        }

        requestAnimationFrame(() => {
            navBarRef.current.setNativeProps({
                style: {backgroundColor: `rgba(255,255,255,${opacity})`},
            });
        });
    };

    return data ? (
        <View style={{backgroundColor: Colors.bgColor}}>
            <View style={[styles.navBar, {paddingTop: inset.top}]} ref={navBarRef}>
                <TouchableNativeFeedback
                    activeOpacity={0.8}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                    style={styles.btn}>
                    <Icon name={'chevron-left'} size={px(28)} color={Colors.navTitleColor} />
                </TouchableNativeFeedback>
                {/* {criticalState && <Text style={styles.navTitle}>大额极速购</Text>} */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: '#e74949',
                        paddingHorizontal: px(8),
                        paddingVertical: px(5),
                        borderRadius: px(125),
                    }}
                    onPress={btnClick}>
                    <Text style={{fontSize: px(13), lineHeight: px(18), color: '#fff'}}>到账查询</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                style={
                    (Style.containerPadding,
                    {padding: 0, marginBottom: btnHeight, borderTopWidth: 0.5, borderColor: Colors.borderColor})
                }
                scrollEventThrottle={16}
                onScroll={onScroll}>
                <FastImage
                    source={{
                        uri: data.large_amount_top_img,
                    }}
                    style={{width: '100%', height: px(379), marginBottom: px(12)}}
                />
                <View style={{paddingHorizontal: px(16)}}>
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
                                <Feather size={px(16)} name={'plus-circle'} color={Colors.btnColor} />
                                <Text
                                    style={{
                                        fontSize: px(14),
                                        lineHeight: px(20),
                                        color: '#0051CC',
                                        marginLeft: px(3),
                                    }}>
                                    新增银行卡
                                </Text>
                            </TouchableOpacity>
                        </>
                    </View>
                    <View style={[{padding: Space.padding}, styles.card_sty, {paddingBottom: 0}]}>
                        <Text style={[styles.title_sty, {paddingBottom: text(16)}]}>
                            监管账户<Text style={styles.desc_sty}>（民生银行监管）</Text>
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
                    <View style={[styles.item_wrap_sty, {marginBottom: px(12)}]}>
                        <Image source={{uri: data.account_refer_pic}} style={{width: px(343), height: px(361)}} />
                    </View>
                    <View style={styles.tip_sty}>
                        <Text style={{color: Colors.descColor, fontWeight: 'bold'}}>提示信息：</Text>
                        {data?.tips?.map((_i, _d) => {
                            return (
                                <View style={{marginTop: text(8)}} key={_i + _d}>
                                    <Html
                                        html={_i}
                                        style={{lineHeight: text(20), fontSize: px(12), color: Colors.descColor}}
                                    />
                                </View>
                            );
                        })}
                    </View>
                </View>
                <BottomDesc />
            </ScrollView>
            {button ? (
                <FixedButton
                    title={button.text}
                    agreement={data.agreement_bottom}
                    containerStyle={{paddingTop: px(4)}}
                    agreementStyle={{paddingBottom: px(8)}}
                    onPress={() => {
                        let url = button.url;
                        if (typeof url.params?.isLargeAmount === 'string') {
                            url.params.isLargeAmount = url.params.isLargeAmount == 'true' ? true : false;
                        }
                        jump(button.url);
                    }}
                />
            ) : null}
        </View>
    ) : null;
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
        borderRadius: px(6),
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
        paddingVertical: px(17),
        justifyContent: 'center',
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
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: px(12),
        paddingRight: px(16),
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1,
        paddingBottom: px(8),
    },
    navTitle: {
        position: 'absolute',
        left: px(17),
        bottom: px(3),
        width: '100%',
        textAlign: 'center',
        color: Colors.navTitleColor,
        fontWeight: 'bold',
        fontSize: px(17),
    },
    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
});
export default LargeAmount;
