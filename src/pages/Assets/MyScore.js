/*
 * @Date: 2021-02-02 16:20:54
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-29 18:29:56
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
import Modal from '../../components/Modal/Modal';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth} from '../../utils/appUtil';
import http from '../../services';

const MyScore = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [click, setClick] = useState(true);
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
            headerStyle: {
                backgroundColor: Colors.brandColor,
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: text(18),
            },
        });
    }, [data, navigation]);

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={init} />}>
            <Image source={require('../../assets/personal/score-bg.png')} style={{width: '100%', height: text(167)}} />
            <View style={styles.scoreNumContainer}>
                <View style={styles.scoreNum}>
                    <Text style={styles.scoreNumText}>{data.points_info?.point || '****'}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            global.LogTool('click', 'showTips');
                            Modal.show({
                                title: '魔分兑换申购费规则',
                                content: data.points_info?.tip,
                                contentStyle: {
                                    color: '#595B5F',
                                    textAlign: 'justify',
                                    fontSize: Font.textH2,
                                    lineHeight: text(22),
                                },
                            });
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
});

export default MyScore;
