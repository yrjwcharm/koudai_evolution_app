/*
 * @Date: 2021-02-02 16:20:54
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-20 18:19:02
 * @Description: 我的魔分
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import {BoxShadow} from 'react-native-shadow';
import {Button} from '../../components/Button';
import {BottomModal, Modal} from '../../components/Modal/';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth} from '../../utils/appUtil';
import http from '../../services';

const MyScore = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [click, setClick] = useState(true);
    const bottomModal = useRef();
    const shadow = useRef({
        color: '#3B629D',
        border: 8,
        radius: Space.borderRadius,
        opacity: 0.07,
        x: 0,
        y: 2,
        width: deviceWidth - 2 * Space.marginAlign,
        height: text(90),
        style: {
            marginVertical: text(20),
            marginHorizontal: Space.marginAlign,
        },
    });

    const init = useCallback(() => {
        http.get('/promotion/my_point/20210101').then((res) => {
            if (res.code === '000000') {
                StatusBar.setBarStyle('light-content');
                setData(res.result);
                setRefreshing(false);
            }
        });
    }, []);

    const onWithdraw = () => {
        global.LogTool('click', 'withdraw');
        if (click) {
            if (data?.points_info?.has_card) {
                http.post('/promotion/point/withdraw/20210101').then((res) => {
                    if (res.code === '000000') {
                        global.LogTool('withdraw', 'success');
                        Modal.show({
                            title: res.result.title,
                            content: res.result.content,
                            contentStyle: {
                                color: '#595B5F',
                                textAlign: 'justify',
                                fontSize: Font.textH2,
                                lineHeight: text(22),
                            },
                            confirmCallBack: () => {
                                setClick(true);
                                init();
                            },
                        });
                    }
                });
            } else {
                Modal.show({
                    title: '请绑定银行卡',
                    confirm: true,
                    confirmCallBack: () => navigation.navigate('AddBankCard', {action: 'add'}),
                    confirmText: '去绑定',
                    content: '您现在没有银行卡，请绑定新银行卡再进行魔分兑换。',
                });
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            init();
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [init])
    );
    useEffect(() => {
        navigation.setOptions({
            title: data.title || '我的魔分',
            headerBackImage: () => {
                return (
                    <Feather
                        name="chevron-left"
                        size={30}
                        color={'#fff'}
                        style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                    />
                );
            },
            headerRight: () => (
                <TouchableOpacity
                    style={styles.detailCon}
                    onPress={() => {
                        global.LogTool('click', 'scoreDetail');
                        navigation.navigate(data.top_button?.url || 'ScoreDetail');
                    }}>
                    <Text style={styles.detail}>{data.top_button?.text || '魔分明细'}</Text>
                </TouchableOpacity>
            ),
        });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={init} />}>
                {data?.notice ? (
                    <View style={[Style.flexRow, styles.noticeBox]}>
                        <Text style={styles.noticeText}>{data?.notice}</Text>
                    </View>
                ) : null}
                <View style={{width: '100%', height: text(167), backgroundColor: Colors.brandColor}} />
                <View style={styles.scoreNumContainer}>
                    <View style={styles.scoreNum}>
                        <Text style={styles.scoreNumText}>{data.points_info?.point || '****'}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                global.LogTool('click', 'showTips');
                                bottomModal?.current?.show();
                            }}>
                            <SimpleLineIcons name={'question'} size={16} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.tipText}>{data.points_info?.desc || '****'}</Text>
                </View>
                <BoxShadow setting={shadow.current}>
                    <View style={[Style.flexBetween, styles.exchangeContainer]}>
                        <View style={Style.flexRow}>
                            <Text style={styles.availableScore}>
                                ￥<Text style={styles.num}>{data.points_info?.amount}</Text>
                            </Text>
                            <Text style={[styles.smTips, {marginLeft: text(6), transform: [{translateY: text(4)}]}]}>
                                {'可提现'}
                            </Text>
                        </View>
                        <Button
                            disabled={!data.points_info?.can_withdraw}
                            onPress={onWithdraw}
                            title={'兑换'}
                            style={styles.btn}
                        />
                    </View>
                </BoxShadow>
                <Text style={[styles.moreTitle, {marginLeft: text(14)}]}>{data.more?.title}</Text>
                <BottomModal ref={bottomModal} title="魔分兑换申购费规则">
                    <View style={[{padding: text(16)}]}>
                        <Text style={styles.tipTitle}>兑换比例:</Text>
                        <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                            100魔分=1元人民币
                        </Text>

                        <Text style={styles.tipTitle}>兑换流程:</Text>
                        <Text style={{lineHeight: text(18), fontSize: text(13)}}>
                            ①在基金购买过程中所产生的申购费，其对应可兑换的金额会自动显示在兑换栏中
                        </Text>
                        <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                            ②点击“兑换”，即可直接兑换成功
                        </Text>
                        <Text style={styles.tipTitle}>返还方式:</Text>
                        <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                            兑换金额直接返还到理财魔方绑定银行卡中，若两张及以上，则返还到主卡中，预计48小时内到账
                        </Text>
                    </View>
                </BottomModal>
                {data.more?.list?.map((item, index) => {
                    return (
                        <BoxShadow
                            key={index}
                            setting={{
                                ...shadow.current,
                                styles: {marginVertical: text(12), marginHorizontal: Space.marginAlign},
                            }}>
                            <View style={[Style.flexBetween, styles.exchangeContainer]}>
                                <View>
                                    <Text style={[styles.largeTitle, {marginBottom: text(10)}]}>{item.title}</Text>
                                    <Text style={[styles.getScore, {lineHeight: text(21)}]}>
                                        <Text>{item.desc.key}</Text>
                                        <Text style={{fontSize: text(15), fontFamily: Font.numFontFamily}}>
                                            {item.desc.val}
                                        </Text>
                                    </Text>
                                </View>
                                <Button
                                    onPress={() => {
                                        global.LogTool('click', 'mission');
                                        navigation.navigate(item.button.jump_to, item.button.params || {});
                                    }}
                                    title={item.button.title}
                                    style={styles.btn}
                                />
                            </View>
                        </BoxShadow>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    detailCon: {
        height: text(40),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: text(14),
    },
    detail: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        borderWidth: 0.5,
        borderColor: Colors.brandColor,
    },
    noticeBox: {
        paddingHorizontal: Space.padding,
        paddingVertical: text(8),
        backgroundColor: '#FFF5E5',
    },
    noticeText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#EB7121',
    },
    scoreNumContainer: {
        marginTop: text(-152),
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreNum: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: text(8),
    },
    scoreNumText: {
        fontSize: text(30),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        marginRight: text(8),
    },
    tipText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#fff',
    },
    exchangeContainer: {
        flex: 1,
        paddingLeft: Space.padding,
        paddingRight: text(20),
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
        height: text(90),
        backgroundColor: '#fff',
    },
    availableScore: {
        fontSize: text(20),
        color: '#101A30',
        fontWeight: 'bold',
    },
    num: {
        fontSize: text(30),
        fontFamily: Font.numFontFamily,
        fontWeight: '400',
    },
    smTips: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
    btn: {
        width: text(76),
        height: text(38),
        borderRadius: text(10),
        fontSize: Font.textH2,
        fontWeight: '500',
    },
    moreTitle: {
        fontSize: text(18),
        lineHeight: text(25),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    largeTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    getScore: {
        fontSize: Font.textH2,
        color: '#EA514E',
        fontWeight: '600',
    },
    tipTitle: {fontWeight: 'bold', lineHeight: text(20), fontSize: text(14), marginBottom: text(4)},
});

export default MyScore;
