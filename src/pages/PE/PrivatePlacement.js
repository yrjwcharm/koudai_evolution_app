import React from 'react';
import {View, StyleSheet, ScrollView, ImageBackground, Platform, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import {Font, Style} from '~/common/commonStyle';
import NavBar from '~/components/NavBar';
import {px, isIphoneX} from '~/utils/appUtil';

const PrivatePlacement = () => {
    return (
        <View style={styles.container}>
            <NavBar
                leftIcon="chevron-left"
                fontStyle={{color: '#fff'}}
                style={{backgroundColor: 'transparent', position: 'absolute', zIndex: 20}}
            />
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <ImageBackground
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/private-bg.png'}}
                    style={{height: px(268), width: '100%'}}
                />
                <View style={styles.cardWrap}>
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={['#FFF7EC', '#FFFFFF']}
                        style={{borderRadius: px(8)}}>
                        <Swiper
                            height={px(180)}
                            autoplay
                            loadMinimal={Platform.OS == 'ios' ? true : false}
                            removeClippedSubviews={false}
                            autoplayTimeout={4}
                            paginationStyle={{
                                bottom: px(8),
                            }}
                            dotStyle={{
                                opacity: 0.2,
                                width: px(4),
                                height: px(3),
                                borderRadius: px(5),
                                backgroundColor: '#121D3A',
                            }}
                            activeDotStyle={{
                                width: px(12),
                                height: px(3),
                                borderRadius: px(5),
                                backgroundColor: '#545968',
                            }}>
                            {[1, 2, 3].map((item, idx) => (
                                <View key={idx}>
                                    <View style={styles.swiperHeader}>
                                        <View style={styles.highStemp}>
                                            <Text style={styles.highStempText}>选中从优 </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.swiperTitle}> 100万可投资多个优质私募</Text>
                                    <View style={styles.swiperMiddle}>
                                        <View style={styles.swiperMiddleLeft}>
                                            <Text style={styles.swiperMiddleRate}>+38.67%</Text>
                                            <Text style={styles.swiperMiddleDesc}>近一年收益率</Text>
                                        </View>
                                        <View style={styles.swiperMiddleRight}>
                                            <Text style={styles.swiperMiddleName}> 魔方FOF2号</Text>
                                            <View style={styles.swiperMiddleTags}>
                                                {[1, 2, 3].map((item, idx) => (
                                                    <View
                                                        key={idx}
                                                        style={[
                                                            styles.swiperMiddleTag,
                                                            {marginLeft: idx > 0 ? px(8) : 0},
                                                        ]}>
                                                        <Text style={styles.swiperMiddleTagText}>新能源</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.swiperFooter}>
                                        <TouchableOpacity activeOpacity={0.8} style={styles.swiperBtn}>
                                            <Text style={styles.swiperBtnText}>开始预约 &gt; </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </Swiper>
                    </LinearGradient>
                    {/* card list */}
                    <View style={styles.cardList}>
                        {[1, 2, 3, 4, 5].map((item, idx) => (
                            <View style={[styles.listItem]} key={idx}>
                                <Text>123</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.bottomWrap, {paddingBottom: px(isIphoneX() ? 34 : 8)}]}>
                <View style={Style.flexRow}>
                    <FastImage
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/consult_icon.png'}}
                        style={{width: px(17), height: px(17)}}
                    />
                    <Text style={styles.bottomDesc}>联系投顾管家</Text>
                    <Text style={styles.bottomTel}>400 080 8208</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>点击拨打</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PrivatePlacement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardWrap: {
        paddingHorizontal: px(16),
    },
    swiperHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    highStemp: {
        backgroundColor: '#E74949',
        paddingHorizontal: px(8),
        paddingVertical: px(3),
        borderTopRightRadius: px(8),
        borderBottomLeftRadius: px(8),
    },
    highStempText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#FFFFFF',
    },
    swiperTitle: {
        textAlign: 'center',
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3A',
    },
    swiperMiddle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: px(8),
        marginTop: px(12),
    },
    swiperMiddleRate: {
        fontSize: px(20),
        lineHeight: px(24),
        color: '#E74949',
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
    },
    swiperMiddleDesc: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
        marginTop: 3,
    },
    swiperMiddleRight: {
        marginLeft: px(40),
    },
    swiperMiddleName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
    },
    swiperMiddleTags: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(5),
    },
    swiperMiddleTag: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#AD9064',
        paddingHorizontal: px(2),
        paddingVertical: px(4),
    },
    swiperMiddleTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#AD9064',
    },
    swiperFooter: {
        paddingVertical: px(8),
    },
    swiperBtn: {
        alignSelf: 'center',
        borderRadius: px(50),
        backgroundColor: '#E2BB7d',
        paddingVertical: px(10),
        width: px(220),
    },
    swiperBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
        textAlign: 'center',
    },
    bottomWrap: {
        paddingHorizontal: px(20),
        paddingVertical: px(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomDesc: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
        marginLeft: px(8),
    },
    bottomTel: {
        fontSize: px(20),
        lineHeight: px(28),
        color: '#AD9064',
        fontFamily: Font.numFontFamily,
        marginLeft: px(8),
    },
    bottomBtn: {
        paddingHorizontal: px(14),
        paddingVertical: px(8),
        backgroundColor: '#E2BB7D',
        borderRadius: px(6),
    },
    bottomBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
    },
    listItem: {
        marginTop: px(12),
    },
});
