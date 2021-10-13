/*
 * @Date: 2021-09-22 17:59:58
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-10-13 11:00:20
 * @Description: 投顾组合超市
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {px, isIphoneX} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import Loading from './components/PageLoading';
import NumText from '../../components/NumText';

const AdvisorPortfolio = ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/adviser/strategy/20210923').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);

    return (
        <ScrollView style={styles.container} bounces={false}>
            <LinearGradient
                colors={['#FFF5E5', Colors.bgColor]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.topBg}
            />
            {Object.keys(data || {}).length > 0 ? (
                <>
                    <View style={styles.introContainer}>
                        <Image
                            source={{
                                uri: 'https://static.licaimofang.com/wp-content/uploads/2021/09/icon_investAdvisor.png',
                            }}
                            style={styles.introBg}
                        />
                        <View style={Style.flexRowCenter}>
                            <View style={{position: 'relative'}}>
                                <View style={styles.underline} />
                                <Text style={styles.introTitle}>{data.introduce?.title}</Text>
                            </View>
                        </View>
                        <View style={{marginTop: px(12), position: 'relative'}}>
                            <Image source={{uri: data.introduce?.img}} style={styles.tagImage} />
                            <HTML html={data.introduce?.content} style={styles.introContent} />
                        </View>
                    </View>
                    <View style={{paddingHorizontal: Space.padding, paddingBottom: isIphoneX() ? 34 + px(20) : px(20)}}>
                        {data.portfolios?.map?.((item, index) => {
                            return (
                                <View key={item + index}>
                                    <Text style={styles.advisorName}>{item.title}</Text>
                                    {item.items?.map?.((portfolio, idx) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                key={portfolio + idx}
                                                onPress={() => jump(portfolio.url)}
                                                style={styles.portfolioBox}>
                                                <View style={Style.flexRow}>
                                                    <Text style={styles.portfolioName}>{portfolio.name}</Text>
                                                    {portfolio.labels?.map?.((label, i) => {
                                                        return (
                                                            <View
                                                                key={label + i}
                                                                style={[
                                                                    styles.portfolioTagBox,
                                                                    {backgroundColor: label.bg_color || '#F1F6FF'},
                                                                ]}>
                                                                <Text
                                                                    style={[
                                                                        styles.portfolioTagText,
                                                                        {color: label.color || Colors.brandColor},
                                                                    ]}>
                                                                    {label.text}
                                                                </Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                                <View style={[Style.flexRow, {marginTop: px(16)}]}>
                                                    <View style={{flex: 1.3}}>
                                                        <NumText
                                                            style={styles.profitSty}
                                                            text={portfolio.yield?.ratio}
                                                        />
                                                        <Text style={styles.keySty}>{portfolio.yield?.title}</Text>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={styles.valSty}>{portfolio.holding?.duration}</Text>
                                                        <Text style={styles.keySty}>{portfolio.holding?.title}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </>
            ) : (
                <Loading />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topBg: {
        height: px(180),
    },
    introContainer: {
        marginTop: px(-162),
        marginHorizontal: Space.marginAlign,
        paddingVertical: px(20),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        position: 'relative',
    },
    introTitle: {
        fontSize: px(18),
        lineHeight: px(25),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    underline: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        height: px(10),
        backgroundColor: '#FFE7C0',
    },
    introContent: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.descColor,
    },
    introBg: {
        position: 'absolute',
        right: px(-6),
        bottom: 0,
        width: px(72),
        height: px(72),
    },
    tagContainer: {
        paddingHorizontal: px(3),
        borderRadius: px(2),
        height: px(18),
        backgroundColor: '#FF7D41',
        position: 'absolute',
    },
    tagImage: {
        width: px(54),
        height: px(18),
        position: 'absolute',
        zIndex: 10,
    },
    tagText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
    },
    advisorName: {
        fontSize: px(18),
        lineHeight: px(25),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
        marginTop: px(20),
    },
    portfolioBox: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    portfolioName: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    portfolioTagBox: {
        marginLeft: px(8),
        paddingVertical: px(1),
        paddingHorizontal: px(5),
        borderRadius: px(2),
        backgroundColor: '#FFF5E5',
    },
    portfolioTagText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FF7D41',
    },
    profitSty: {
        fontSize: px(22),
        lineHeight: px(26),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    keySty: {
        marginTop: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    valSty: {
        fontSize: px(18),
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
});

export default AdvisorPortfolio;
