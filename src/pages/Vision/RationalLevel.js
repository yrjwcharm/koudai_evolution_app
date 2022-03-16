/*
 * @Date: 2022-03-11 14:51:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-03-16 15:28:20
 * @Description: 理性等级
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import NumberTicker from 'react-native-number-ticker';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {px} from '../../utils/appUtil';

export default ({navigation}) => {
    const [value, setVal] = useState('7,264');

    useEffect(() => {
        http.get('http://127.0.0.1:4523/mock/587315/rational/grade/detail/20220315').then((res) => {
            console.log(res);
        });
        navigation.setOptions({
            headerRight: (props) => (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexCenter, {marginRight: Space.marginAlign}]}
                        onPress={() => navigation.navigate('RationalRecord')}>
                        <Text style={{...styles.taskTitle, marginRight: 0, fontWeight: '400'}}>{'记录'}</Text>
                    </TouchableOpacity>
                </>
            ),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScrollView bounces={false} style={styles.container}>
            <View style={styles.topInfo}>
                <Text style={styles.infoText}>{'新手必须：为什么理性等级和您赚钱的能力密切相关？'}</Text>
            </View>
            <View style={{paddingHorizontal: Space.padding}}>
                <LinearGradient
                    colors={['#3E4166', '#14102A']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.levelCon}>
                    <Image source={require('../../assets/img/vision/levelBg.png')} style={styles.levelBg} />
                    <View style={[Style.flexRow, {marginTop: px(13)}]}>
                        <Image source={require('../../assets/img/vision/level.png')} style={styles.levelIcon} />
                        <Text style={styles.levelText}>{'理性等级'}</Text>
                        <Text style={styles.levelNum}>{'6'}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.levelTips}>{'升至7级，收益率可提升7.8%'}</Text>
                    </View>
                    <View style={styles.levelValCon}>
                        <NumberTicker duration={500} number={value} textSize={px(36)} textStyle={styles.levelVal} />
                        <View>
                            <Text style={{...styles.infoText, color: '#FFEBCB'}}>{'+300'}</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('RationalRecord')}>
                                <Text style={styles.linkText}>
                                    {'理性值'}
                                    <Icon color={'#FFEBCB'} name="right" size={10} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.barCon}>
                        <LinearGradient
                            colors={['#FFF4E3', '#FFFFFF']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[styles.activeBar, {width: '63%'}]}
                        />
                        <View style={[styles.lightCon, {width: '63%'}]}>
                            <Image source={require('../../assets/img/vision/light.png')} style={styles.light} />
                        </View>
                    </View>
                    <View style={[Style.flexBetween, {marginTop: px(4)}]}>
                        <Text style={{...styles.levelTips, opacity: 0.4}}>{'6,000'}</Text>
                        <Text style={{...styles.levelTips, opacity: 0.4}}>{'7级 9,000'}</Text>
                    </View>
                </LinearGradient>
                <View style={[styles.taskCon, {marginTop: px(20)}]}>
                    <Text style={styles.partTitle}>{'日常任务'}</Text>
                    <View style={[Style.flexBetween, styles.taskItem, {borderTopWidth: 0}]}>
                        <View>
                            <View style={Style.flexRow}>
                                <Text style={styles.taskTitle}>{'视野阅读10篇文章'}</Text>
                                <Text style={styles.earnNum}>
                                    <Text style={{fontFamily: Font.numFontFamily}}>{'+300 '}</Text>
                                    {'理性值'}
                                </Text>
                            </View>
                            <Text style={styles.taskTips}>{'10篇文章阅读完成即可获得理性值'}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.btnCon]}>
                            <Text style={{...styles.infoText, color: '#242341'}}>{'去完成'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[Style.flexBetween, styles.taskItem]}>
                        <View>
                            <View style={Style.flexRow}>
                                <Text style={styles.taskTitle}>{'视野阅读10篇文章'}</Text>
                                <Text style={styles.earnNum}>
                                    <Text style={{fontFamily: Font.numFontFamily}}>{'+300 '}</Text>
                                    {'理性值'}
                                </Text>
                            </View>
                            <View style={[Style.flexRow, {marginTop: px(7)}]}>
                                <View style={styles.taskBar}>
                                    <View style={[styles.taskActiveBar, {width: '20%'}]} />
                                </View>
                                <Text style={styles.taskProgress}>
                                    <Text style={{color: '#EB7121'}}>{2}</Text>/10
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.btnCon]}>
                            <Text style={{...styles.infoText, color: '#242341'}}>{'去完成'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[Style.flexBetween, styles.taskItem]}>
                        <View>
                            <View style={Style.flexRow}>
                                <Text style={styles.taskTitle}>{'观看1场直播'}</Text>
                                <Text style={styles.earnNum}>
                                    <Text style={{fontFamily: Font.numFontFamily}}>{'+3,000 '}</Text>
                                    {'理性值'}
                                </Text>
                            </View>
                            <Text style={styles.taskTips}>{'观看直播完成即可获得理性值'}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} style={[styles.btnCon, {backgroundColor: '#E9EAEF'}]}>
                            <Text style={{...styles.infoText, color: Colors.lightGrayColor}}>{'去完成'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topInfo: {
        paddingVertical: px(9),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    infoText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#EB7121',
    },
    levelCon: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        minHeight: px(140),
    },
    levelBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px(140),
        height: px(80),
    },
    levelIcon: {
        marginRight: px(5),
        width: px(16),
        height: px(16),
    },
    levelText: {
        fontSize: Font.textH1,
        lineHeight: px(16),
        color: '#FFECCF',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    levelNum: {
        marginLeft: px(2),
        fontSize: px(24),
        lineHeight: px(24),
        color: '#FFECCF',
        fontFamily: Font.numFontFamily,
    },
    divider: {
        marginHorizontal: px(8),
        backgroundColor: 'rgba(255, 224, 170, 0.2)',
        width: px(1),
        height: px(13),
    },
    levelTips: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FFECCF',
    },
    levelValCon: {
        marginTop: px(12),
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    levelVal: {
        fontSize: px(36),
        lineHeight: px(42),
        color: '#FFECCF',
        fontFamily: Font.numFontFamily,
    },
    linkText: {
        marginTop: px(11),
        marginBottom: px(5),
        marginLeft: px(4),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FFECCF',
    },
    barCon: {
        marginTop: px(2),
        borderRadius: px(3),
        width: '100%',
        height: px(3),
        backgroundColor: '#383547',
    },
    activeBar: {
        height: '100%',
        borderRadius: px(3),
    },
    lightCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: px(3),
        overflow: 'visible',
    },
    light: {
        position: 'absolute',
        top: px(-8),
        right: px(-8),
        width: px(19),
        height: px(19),
    },
    taskCon: {
        marginTop: px(12),
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    taskItem: {
        paddingVertical: Space.padding,
        borderColor: Colors.borderColor,
        borderTopWidth: Space.borderWidth,
    },
    taskTitle: {
        marginRight: px(4),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    earnNum: {
        fontSize: px(13),
        lineHeight: px(15),
        color: '#EB7121',
    },
    taskTips: {
        marginTop: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    btnCon: {
        paddingVertical: px(5),
        paddingHorizontal: px(12),
        borderRadius: px(14),
        backgroundColor: '#E8CF9D',
    },
    taskBar: {
        marginRight: Space.marginAlign,
        borderRadius: px(3),
        width: px(80),
        height: px(5),
        backgroundColor: Colors.bgColor,
    },
    taskActiveBar: {
        borderRadius: px(3),
        height: px(5),
        backgroundColor: '#E8CF9D',
    },
    taskProgress: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.lightGrayColor,
        fontFamily: Font.numFontFamily,
    },
});
