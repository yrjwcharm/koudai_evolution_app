/*
 * @Date: 2021-02-25 15:37:01
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-01 15:51:27
 * @Description: 会员中心
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import HTML from '../../components/RenderHtml';

const levelColor = ['#E7EFFF', '#F0F2F5', '#F9F1E3', '#EBF0FF', '#F9F1E3'];
const barColor = ['#1C55C8', '#999', '#BA9965', '#7F8BB6', '#030303'];
const textColor = ['#fff', '#444', '#725232', '#404C73', '#FFEBCD'];
const iconColor = ['#fff', '#666', '#7A521A', '#50557C', '#FFEBCD'];

const MemberCenter = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const init = useCallback(() => {
        setRefreshing(false);
        console.log('refresh');
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: levelColor[route.params?.level || 0],
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
        });
    }, [navigation, route]);

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView
                style={{flex: 1, backgroundColor: Colors.bgColor}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={init} />}>
                <LinearGradient
                    style={{height: text(200), marginBottom: text(-196)}}
                    colors={[levelColor[route.params?.level || 0], '#fff']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                />
                <ImageBackground
                    source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/11/putong_mc_bg.png'}}
                    style={{marginHorizontal: Space.marginAlign, height: text(188)}}>
                    <View style={[Style.flexRow, styles.header]}>
                        <Image
                            source={{
                                uri:
                                    'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLqEoqxnicHyVXuYFxmmKmL4oPXFSQc0ru7Y5cCnCfSghpib8G9em4WvqIibyDsiaDyBP1icCfe0TZa8AA/132',
                            }}
                            style={styles.headImg}
                        />
                        <Text style={[styles.username, {color: textColor[route.params?.level || 0]}]}>{'盛先生'}</Text>
                    </View>
                    <View style={[styles.barContainer, {backgroundColor: barColor[route.params?.level || 0]}]}>
                        <View style={[styles.bar, {width: '60%'}]} />
                    </View>
                    <View style={[Style.flexRow, styles.trustScoreBox]}>
                        <Text
                            style={[
                                styles.trustScore,
                                {color: textColor[route.params?.level || 0], marginRight: text(6)},
                            ]}>
                            {'信任值 230,000 / 650,000'}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate({name: 'MemberSystem', params: {level: route.params?.level || 0}})
                            }>
                            <AntDesign name={'questioncircleo'} size={11} color={iconColor[route.params?.level || 0]} />
                        </TouchableOpacity>
                    </View>
                    <View style={[Style.flexRow, {paddingHorizontal: text(18)}]}>
                        <TouchableOpacity style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={[styles.itemVal, {color: '#fff', marginBottom: text(-8)}]}>{'200,000'}</Text>
                            <Text style={[styles.itemKey, {color: 'rgba(255, 255, 255, 0.85)'}]}>{'我的魔分'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={[styles.itemVal, {color: '#fff', marginBottom: text(-8)}]}>
                                {'3,450'}
                                <Text style={{fontSize: Font.textH1}}>{'元'}</Text>
                            </Text>
                            <Text style={[styles.itemKey, {color: 'rgba(255, 255, 255, 0.85)'}]}>{'我的红包'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={[styles.itemVal, {color: '#fff', marginBottom: text(-8)}]}>
                                {'2'}
                                <Text style={{fontSize: Font.textH1}}>{'张'}</Text>
                            </Text>
                            <Text style={[styles.itemKey, {color: 'rgba(255, 255, 255, 0.85)'}]}>{'我的卡券'}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <View style={[Style.flexBetween, styles.partTitleBox]}>
                    <Text style={styles.partTitle}>{'您的会员专属服务'}</Text>
                    <TouchableOpacity style={Style.flexRow}>
                        <Text style={[styles.partLink, {marginRight: text(2)}]}>{'会员详细规则'}</Text>
                        <Icon name={'angle-right'} size={16} color={'#266EFF'} />
                    </TouchableOpacity>
                </View>
                <View style={[Style.flexRow, styles.serviceBox]}>
                    {[
                        {
                            id: 1,
                            title: '生日特权',
                            status: 1,
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth2.png',
                            url: '/memberService?active=0',
                        },
                        {
                            id: 2,
                            title: '<span style="color:#B8C1D3">鲜花祝福</span>',
                            status: 0,
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower0.png',
                            url: '/memberService?active=1',
                        },
                        {
                            id: 4,
                            title: '<span style="color:#B8C1D3">保险咨询</span>',
                            status: 0,
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins0.png',
                            url: '/memberService?active=2',
                        },
                        {
                            id: 5,
                            title: '<span style="color:#B8C1D3">专属投顾</span>',
                            status: 0,
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult0.png',
                            url: '/memberService?active=3',
                        },
                        {
                            id: 6,
                            title: '<span style="color:#B8C1D3">口腔健康</span>',
                            status: 0,
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                            url: '/memberService?active=4',
                        },
                        {
                            id: 8,
                            title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                            status: 0,
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                            url: '/memberService?active=5',
                        },
                    ].map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[Style.flexCenter, {width: '25%', marginBottom: text(22)}]}
                                onPress={() => navigation.navigate({name: 'MemberService', params: {active: 0}})}>
                                <Image source={{uri: item.icon}} style={styles.itemImg} />
                                <HTML html={item.title} style={styles.smallTitle} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={[Style.flexBetween, styles.partTitleBox]}>
                    <Text style={styles.partTitle}>{'提升信任值'}</Text>
                    <TouchableOpacity style={Style.flexRow} onPress={() => navigation.navigate('GetRationalValue')}>
                        <Text style={[styles.partLink, {marginRight: text(2)}]}>{'如何提升'}</Text>
                        <Icon name={'angle-right'} size={16} color={'#266EFF'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.taskContainer}>
                    {[
                        {
                            id: 1111,
                            title: '买入15,002.00元智能组合，升级为白银会员',
                            desc: '最少获得16,502信任值',
                            button: {
                                title: '去购买',
                                url: '/newAccountDesc?accountid=1&id=7&show_color=111&fr=member',
                            },
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/pt-gm0.png',
                        },
                        {
                            id: 1112,
                            title: '买入2,000.00元智能组合，小试身手',
                            desc: '最少获得2200信任值',
                            button: {
                                title: '去购买',
                                url: '/newAccountDesc?accountid=1&id=7&show_color=111&fr=member',
                            },
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/pt-gm0.png',
                        },
                    ].map((item, index) => {
                        return (
                            <View
                                key={item.id}
                                style={[
                                    Style.flexRow,
                                    styles.taskItem,
                                    {borderTopWidth: index === 0 ? 0 : Space.borderWidth},
                                ]}>
                                <Image source={{uri: item.icon}} style={styles.taskIcon} />
                                <View style={{flex: 1}}>
                                    <Text style={[styles.taskTitle, {marginBottom: text(4)}]}>{item.title}</Text>
                                    <Text style={[styles.smallTitle, {color: Colors.lightGrayColor}]}>{item.desc}</Text>
                                </View>
                                <Button
                                    title={item.button.title}
                                    style={{...styles.taskBtn, backgroundColor: '#578EFE'}}
                                    color={'#578EFE'}
                                    textStyle={{...styles.smallTitle, color: '#fff', fontWeight: '500'}}
                                />
                            </View>
                        );
                    })}
                </View>
                <View style={[Style.flexBetween, styles.partTitleBox, {paddingTop: text(24)}]}>
                    <Text style={styles.partTitle}>{'会员任务'}</Text>
                </View>
                <View style={[styles.taskContainer, {marginBottom: 0}]}>
                    {[
                        {
                            title: '邀请好友得信任值',
                            desc: '每邀请成功一名好友最低可得1500信任值',
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/pt-yq0.png',
                            id: 2,
                            button: {
                                title: '去完成',
                                url: '/inviteRational',
                                type: '',
                            },
                        },
                        {
                            title: '邀请好友使用体验金，共享收益',
                            desc: '和好友同时获得体验金先进收益',
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/pt-yd0.png',
                            id: 3,
                            button: {
                                title: '去查看',
                                url: '/inviteExperienceGold',
                                type: '',
                            },
                        },
                    ].map((item, index) => {
                        return (
                            <View
                                key={item.id}
                                style={[
                                    Style.flexRow,
                                    styles.taskItem,
                                    {borderTopWidth: index === 0 ? 0 : Space.borderWidth},
                                ]}>
                                <Image source={{uri: item.icon}} style={styles.taskIcon} />
                                <View style={{flex: 1}}>
                                    <Text style={[styles.taskTitle, {marginBottom: text(4)}]}>{item.title}</Text>
                                    <Text style={[styles.smallTitle, {color: Colors.lightGrayColor}]}>{item.desc}</Text>
                                </View>
                                <Button
                                    title={item.button.title}
                                    style={{...styles.taskBtn, backgroundColor: '#578EFE'}}
                                    color={'#578EFE'}
                                    textStyle={{...styles.smallTitle, color: '#fff', fontWeight: '500'}}
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: text(20),
        paddingBottom: text(24),
        paddingLeft: text(20),
    },
    headImg: {
        width: text(42),
        height: text(42),
        borderWidth: text(1.5),
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: text(50),
        marginRight: text(10),
    },
    username: {
        fontSize: text(18),
        lineHeight: text(29),
        fontWeight: '500',
    },
    barContainer: {
        marginRight: text(14),
        marginLeft: text(20),
        borderRadius: text(2.5),
        overflow: 'hidden',
        height: text(2),
    },
    bar: {
        height: '100%',
        backgroundColor: '#fff',
    },
    trustScoreBox: {
        paddingTop: text(7),
        paddingBottom: text(13),
        paddingLeft: text(20),
    },
    trustScore: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    itemVal: {
        fontSize: text(18),
        lineHeight: text(29),
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    itemKey: {
        fontSize: Font.textH3,
        lineHeight: text(29),
    },
    partTitleBox: {
        paddingTop: text(20),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    partLink: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: '#266EFF',
    },
    serviceBox: {
        marginBottom: text(8),
        paddingTop: text(20),
        paddingHorizontal: Space.padding,
        paddingBottom: text(8),
        backgroundColor: '#fff',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    itemImg: {
        width: text(28),
        height: text(28),
        marginBottom: text(4),
    },
    smallTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    taskContainer: {
        paddingHorizontal: Space.padding,
        marginBottom: text(8),
        backgroundColor: '#fff',
    },
    taskItem: {
        paddingVertical: text(20),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    taskIcon: {
        width: text(34),
        height: text(34),
        marginRight: text(16),
    },
    taskTitle: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    taskBtn: {
        marginLeft: text(24),
        borderRadius: text(12.5),
        width: text(60),
        height: text(24),
    },
});

export default MemberCenter;
