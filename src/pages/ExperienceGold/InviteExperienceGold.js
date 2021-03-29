/*
 * @Date: 2021-03-11 10:03:53
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-29 16:03:23
 * @Description: 邀请好友得体验金
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text, deviceWidth} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {ShareModal} from '../../components/Modal';
import HTML from '../../components/RenderHtml';
import _ from 'lodash';

const InviteExperienceGold = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const shareModal = useRef(null);
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/freefund/invite/20210101').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '理财魔方体验金'});
                setData(res.result);
            }
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <ShareModal ref={shareModal} title={'理财魔方体验金'} shareContent={data?.share_info || {}} />
            <Image source={{uri: data?.top_bg}} style={styles.topBg} />
            <ImageBackground
                source={{uri: data?.bag_bg}}
                style={[{justifyContent: 'space-between', alignItems: 'center'}, styles.hongbao]}>
                <View>
                    {/* <Text style={[styles.hbInfo, {marginHorizontal: text(60), marginBottom: text(6)}]}>
                        赠送好友<Text style={styles.hbNum}>{'20,000'}</Text>
                        <Text style={{color: '#D83123', fontWeight: '500'}}>元</Text>
                        理财体验金，好友注册即可领取，你和好友可以同时获得体验金产生的理财收益哦
                    </Text> */}
                    <View style={[Style.flexRow, styles.profitBox]}>
                        <View style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={styles.profitText}>{data?.profit_info?.profit || '0.00'}</Text>
                            <Text style={[styles.stepText, {color: Colors.defaultColor}]}>{'累计收益(元)'}</Text>
                        </View>
                        <View style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={styles.profitText}>{data?.profit_info?.profit_acc || '0.00'}</Text>
                            <Text style={[styles.stepText, {color: Colors.defaultColor}]}>{'可提现收益(元)'}</Text>
                        </View>
                    </View>
                    {/* <View style={{alignItems: 'center'}}>
                        <Icon name={'caret-up'} color={'#FFE9C7'} size={30} />
                        <LinearGradient
                            colors={['#FFE9C7', '#FFE4B9']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[styles.hbTips, {marginTop: text(-8)}]}>
                            <Text style={styles.hbTipsText}>{'越多好友使用，你能获得的收益越多哦！'}</Text>
                        </LinearGradient>
                    </View> */}
                    <View style={{alignItems: 'center'}}>
                        <LinearGradient
                            colors={['#FFE9C7', '#FFE4B9']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[Style.flexCenter, styles.hbTips, {width: text(144)}]}>
                            <Text style={styles.hbTipsText}>{`剩余名额：${data?.profit_info?.left_num || 0}`}</Text>
                        </LinearGradient>
                    </View>
                </View>
                <LinearGradient
                    colors={['#FFE7C3', '#FCC162']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.btn}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexCenter, {height: '100%'}]}
                        onPress={() => {
                            global.LogTool('share');
                            shareModal.current.show();
                        }}>
                        <Text style={styles.btnText}>{'立即邀请'}</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ImageBackground>
            <ImageBackground
                source={require('../../assets/personal/title_bg.png')}
                style={[Style.flexCenter, styles.titleBg]}>
                <Text style={styles.partTitle}>{!data?.has_invite ? '参与步骤' : '邀请进度'}</Text>
            </ImageBackground>
            {data?.has_invite ? (
                <View style={[styles.partBox, styles.processBox]}>
                    {data?.invite_list?.map((item, index) => {
                        return (
                            <View key={item + index} style={{marginBottom: text(24)}}>
                                <View style={[Style.flexRow, {marginBottom: Space.marginVertical}]}>
                                    <Image source={{uri: item.avatar}} style={styles.avatar} />
                                    <Text style={[styles.name, {marginRight: text(8)}]}>{item.name}</Text>
                                    <Text style={styles.stepText}>{item.date}</Text>
                                </View>
                                <View style={[Style.flexBetween, {position: 'relative'}]}>
                                    <View style={styles.processBar}>
                                        <View
                                            style={[
                                                styles.activeBar,
                                                {
                                                    width:
                                                        _.findLastIndex(item?.progress || [], (p) => p.val === 1) * 25 +
                                                        '%',
                                                },
                                            ]}
                                        />
                                    </View>
                                    {item?.progress?.map((p, idx, arr) => {
                                        return (
                                            <View
                                                key={p + idx}
                                                style={{
                                                    alignItems:
                                                        idx === 0
                                                            ? 'flex-start'
                                                            : idx === arr.length - 1
                                                            ? 'flex-end'
                                                            : 'center',
                                                    position: 'relative',
                                                }}>
                                                <View
                                                    style={[
                                                        styles.dot,
                                                        {
                                                            borderWidth: p?.val ? text(4) : text(2),
                                                            backgroundColor: p?.val ? Colors.red : '#fff',
                                                        },
                                                    ]}
                                                />
                                                <Text style={styles.processText}>{p?.key}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </View>
            ) : null}
            {!data?.has_invite && (
                <View style={[styles.partBox, {marginBottom: Space.marginVertical, paddingBottom: Space.padding}]}>
                    <Image source={{uri: data?.join_step_image}} style={styles.stepImg} />
                    <View style={[Style.flexBetween, {alignItems: 'flex-start', paddingHorizontal: text(22)}]}>
                        {data?.join_step_text?.map((item, index) => {
                            return (
                                <Text key={item + index} style={styles.stepText}>
                                    {item}
                                </Text>
                            );
                        })}
                    </View>
                </View>
            )}
            <View style={[styles.partBox, styles.rulesBox]}>
                <Image source={require('../../assets/personal/rules.png')} style={styles.rules} />
                {data?.rule_list?.map((item, index) => {
                    return (
                        <Text
                            key={item + index}
                            style={[styles.stepText, {textAlign: 'justify', marginTop: index === 0 ? 0 : text(12)}]}>
                            {item}
                        </Text>
                    );
                })}
            </View>
            <View style={{marginBottom: insets.bottom, paddingHorizontal: text(20)}}>
                <HTML
                    html={
                        '*活动最终解释权归理财魔方所有\n\n\n公安备案号：31011502014670      基金销售资格证号：000000803\n客服电话：400-080-8208\n理财有风险，投资需谨慎，历史收益不代表未来收益'
                    }
                    style={styles.explain}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF3E3',
    },
    topBg: {
        marginBottom: text(-239),
        width: '100%',
        height: text(392),
    },
    hongbao: {
        paddingTop: text(32),
        width: '100%',
        height: text(350),
    },
    hbInfo: {
        fontSize: Font.textH2,
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontWeight: '300',
        textAlign: 'justify',
    },
    hbNum: {
        fontSize: text(20),
        color: '#D83123',
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    hbTips: {
        paddingVertical: text(8),
        paddingRight: text(7),
        paddingLeft: text(12),
        borderRadius: text(20),
    },
    hbTipsText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#A17328',
        fontFamily: Font.numRegular,
    },
    btn: {
        marginHorizontal: text(36),
        marginBottom: text(44),
        borderRadius: text(25),
        width: deviceWidth - text(72),
        height: text(50),
    },
    btnText: {
        fontSize: text(20),
        lineHeight: text(28),
        color: '#975709',
        fontWeight: '500',
    },
    titleBg: {
        marginHorizontal: text(110),
        marginBottom: text(-21),
        width: text(155),
        height: text(32),
        position: 'relative',
        zIndex: 1,
    },
    partTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: '#fff',
        fontWeight: '500',
    },
    partBox: {
        marginHorizontal: text(20),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    stepImg: {
        marginTop: text(40),
        marginRight: text(11),
        marginBottom: text(12),
        marginLeft: text(12),
        height: text(51),
    },
    stepText: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
        textAlign: 'center',
    },
    rulesBox: {
        marginBottom: text(12),
        paddingHorizontal: Space.padding,
        paddingBottom: Space.padding,
    },
    rules: {
        marginVertical: Space.marginVertical,
        marginLeft: text(72),
        width: text(160),
        height: text(24),
    },
    explain: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#E5C18E',
    },
    profitBox: {
        marginBottom: text(18),
        paddingTop: text(7),
        paddingHorizontal: text(45),
        width: '100%',
    },
    profitText: {
        fontSize: text(32),
        lineHeight: text(37),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
    },
    processBox: {
        marginBottom: Space.marginVertical,
        paddingTop: text(43),
        paddingHorizontal: text(20),
    },
    avatar: {
        marginRight: text(12),
        borderWidth: text(1),
        borderColor: '#F2D09B',
        borderRadius: text(28),
        width: text(28),
        height: text(28),
    },
    name: {
        fontSize: Font.textH1,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '600',
        maxWidth: text(176),
    },
    dot: {
        marginBottom: text(7),
        borderWidth: text(4),
        borderColor: Colors.red,
        borderRadius: text(8),
        width: text(8),
        height: text(8),
    },
    processText: {
        fontSize: Font.textSm,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
    processBar: {
        width: text(288),
        height: text(2),
        backgroundColor: 'rgba(231, 73, 73, 0.2)',
        position: 'absolute',
        top: text(3),
        left: text(3.5),
    },
    activeBar: {
        width: 0,
        height: '100%',
        backgroundColor: Colors.red,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export default InviteExperienceGold;
