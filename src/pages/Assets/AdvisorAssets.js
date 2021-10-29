/*
 * @Date: 2021-09-24 16:25:09
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-27 17:43:32
 * @Description: 投顾组合总资产页
 */
import React, {useCallback, useRef, useState} from 'react';
import {
    Animated,
    LayoutAnimation,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {px, isIphoneX, formaNum} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {useJump} from '../../components/hooks';
import storage from '../../utils/storage';
import NumText from '../../components/NumText';

const AdvisorAssets = () => {
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const [showEye, setShowEye] = useState('true');
    const [notice, setNotice] = useState({});
    const [hideMsg, setHideMsg] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const init = (refresh) => {
        refresh === 'refresh' && setHideMsg(false);
        http.get('/asset/holding/adviser/20210923')
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
        http.get('/asset/notice/20210101').then((res) => {
            if (res.code === '000000') {
                setNotice(res.result);
            }
        });
    };

    const renderLoading = () => {
        return (
            <View
                style={{
                    paddingTop: Space.padding,
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <Image
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/personal/loading.png')}
                    resizeMode={Image.resizeMode.contain}
                />
            </View>
        );
    };

    // 隐藏系统消息
    const hideSystemMsg = () => {
        global.LogTool('click', 'hideSystemMsg');
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start((a) => {
            if (a.finished) {
                setHideMsg(true);
                LayoutAnimation.linear();
            }
        });
    };

    const toggleEye = () => {
        setShowEye((show) => {
            storage.save('advisorAssets', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            storage.get('advisorAssets').then((res) => {
                setShowEye(res ? res : 'true');
            });
            setTimeout(() => {
                StatusBar.setBarStyle('light-content');
            }, 0);
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );

    return loading ? (
        renderLoading()
    ) : (
        <View style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {/* 系统通知 */}
                {!hideMsg && notice?.system ? (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                            notice?.system?.log_id && global.LogTool(notice?.system?.log_id);
                            jump(notice?.system?.url);
                        }}>
                        <Animated.View
                            style={[
                                styles.systemMsgContainer,
                                Style.flexBetween,
                                {opacity: fadeAnim, paddingRight: notice?.system?.button ? px(16) : px(38)},
                            ]}>
                            <Text style={styles.systemMsgText}>{notice?.system?.desc}</Text>
                            {notice?.system?.button ? (
                                <View style={styles.btn}>
                                    <Text style={styles.btn_text}>{notice?.system?.button?.text}</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.closeSystemMsg}
                                    activeOpacity={0.8}
                                    onPress={hideSystemMsg}>
                                    <EvilIcons name={'close'} size={22} color={Colors.yellow} />
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                ) : null}
                <View style={styles.assetsCard}>
                    <View style={Style.flexBetween}>
                        <View>
                            <View style={[Style.flexRow, {marginBottom: Space.marginVertical}]}>
                                <Text style={[styles.profitText, {marginRight: px(4)}]}>
                                    总金额(元){data.summary?.profit_date}
                                </Text>
                                <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
                                    <Ionicons
                                        name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                        size={16}
                                        color={'rgba(255, 255, 255, 0.8)'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.profitNum, {fontSize: px(24), lineHeight: px(29)}]}>
                                {showEye === 'true' ? data.summary?.amount : '***'}
                            </Text>
                        </View>
                        <View>
                            <View
                                style={[
                                    Style.flexRow,
                                    {marginBottom: Space.marginVertical, justifyContent: 'flex-end'},
                                ]}>
                                <Text style={styles.profitText}>日收益</Text>
                                <Text style={styles.profitNum}>
                                    {showEye === 'true' ? data.summary?.profit : '***'}
                                </Text>
                            </View>
                            <View style={[Style.flexRow, {justifyContent: 'flex-end'}]}>
                                <Text style={styles.profitText}>累计收益</Text>
                                <Text style={styles.profitNum}>
                                    {showEye === 'true' ? data.summary?.profit_acc : '***'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{padding: Space.padding, paddingBottom: isIphoneX() ? 34 + px(20) : px(20)}}>
                    {data.portfolios?.map?.((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={item + index}
                                onPress={() => jump(item.url)}
                                style={[Style.flexRow, styles.portfolioCard, index === 0 ? {marginTop: 0} : {}]}>
                                <View style={{flexGrow: 1, flexShrink: 1}}>
                                    <Text style={styles.portfolioName}>{item.name}</Text>
                                    <View style={[Style.flexRow, {marginTop: px(8)}]}>
                                        <View style={{flex: 1}}>
                                            <Text style={styles.profitKey}>{'总金额'}</Text>
                                            <Text style={styles.profitVal}>
                                                {showEye === 'true' ? formaNum(item.amount) : '***'}
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={styles.profitKey}>{'累计收益'}</Text>
                                            {showEye === 'true' ? (
                                                <NumText style={styles.profitVal} text={formaNum(item.profit_acc)} />
                                            ) : (
                                                <Text style={styles.profitVal}>{'***'}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingTop: px(8),
        paddingBottom: px(12),
        paddingRight: px(38),
        paddingLeft: Space.padding,
    },
    systemMsgText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.yellow,
        textAlign: 'justify',
    },
    closeSystemMsg: {
        position: 'absolute',
        right: px(12),
        top: px(10),
    },
    btn: {
        borderRadius: px(14),
        paddingVertical: px(5),
        paddingHorizontal: px(10),
        backgroundColor: '#FF7D41',
    },
    btn_text: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    assetsCard: {
        paddingVertical: Space.padding,
        paddingHorizontal: px(20),
        paddingBottom: px(24),
        backgroundColor: Colors.brandColor,
    },
    profitText: {
        marginRight: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        opacity: 0.4,
    },
    profitNum: {
        fontSize: px(17),
        lineHeight: px(21),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    portfolioCard: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    portfolioName: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    profitKey: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.darkGrayColor,
    },
    profitVal: {
        marginTop: px(4),
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
});

export default AdvisorAssets;
