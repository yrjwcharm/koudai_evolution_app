/*
 * @Date: 2021-01-30 11:09:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-02 12:15:07
 * @Description:发现
 */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import * as MagicMove from 'react-native-magic-move';
import Header from '../../components/NavBar';
const Index = (props) => {
    const [data, SetData] = useState([]);
    useEffect(() => {
        SetData([{title: '养老计划'}, {title: '养老计划'}, {title: '养老计划'}]);
    }, [props.navigation]);
    // let scrollingRight = '';
    // let lastx = '';
    // const snapScroll = useRef(null);
    return (
        <>
            <Header renderLeft={<Text style={styles.header_title}>今日推荐</Text>} />
            <ScrollView style={{backgroundColor: Colors.bgColor}}>
                <View style={styles.container}>
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={['#fff', '#F5F6F8']}
                        style={{paddingHorizontal: Space.padding}}>
                        {/* 今日推荐 */}
                        <MagicMove.View id="logo" transition={MagicMove.Transition.morph}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    props.navigation.navigate('FindDetail');
                                }}
                                style={[styles.recommend, styles.card]}>
                                <View style={[styles.header]}>
                                    <Text style={styles.img_desc}>35+必备</Text>
                                    <Text style={styles.img_title}>美好生活提前储备</Text>
                                </View>
                                <FastImage
                                    style={{
                                        height: px(320),
                                    }}
                                    source={{
                                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片42.png',
                                    }}
                                />
                                <View style={{padding: Space.cardPadding}}>
                                    <View style={Style.flexRow}>
                                        <Text style={[styles.card_title, {fontSize: px(16)}]}>养老计划</Text>
                                        <Text style={styles.card_title_dexc}>35+必备 ｜ 美好生活提前储备</Text>
                                    </View>
                                    <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                                        <Text
                                            style={[
                                                styles.radio,
                                                {fontSize: px(26), lineHeight: px(30), marginTop: px(6)},
                                            ]}>
                                            132.87%~156.58%
                                        </Text>
                                        <TouchableOpacity>
                                            <LinearGradient
                                                start={{x: 0, y: 0.25}}
                                                end={{x: 0, y: 0.8}}
                                                colors={['#FF9463', '#FF7D41']}
                                                style={styles.recommend_btn}>
                                                <Text style={styles.btn_text}>去看看</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.light_text}>35+必备 ｜ 美好生活提前储备</Text>
                                </View>
                            </TouchableOpacity>
                        </MagicMove.View>
                    </LinearGradient>

                    {/* 目标理财 */}
                    <View style={{paddingHorizontal: Space.padding}}>
                        <View style={{marginBottom: px(20)}}>
                            <Text style={styles.large_title}>目标理财</Text>
                            <View style={[styles.card, {borderRadius: 8}, Style.flexRow]}>
                                <View style={{padding: Space.cardPadding, flex: 1}}>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.card_title}>养老计划</Text>
                                        <Text style={styles.card_title_dexc}> 美好生活提前储备</Text>
                                    </View>
                                    <Text style={[styles.radio, {marginTop: px(16)}]}>132.87%~156.58%</Text>
                                    <Text style={styles.light_text}>35+必备 ｜ 美好生活提前储备</Text>
                                </View>
                                <Image
                                    style={{width: px(120), height: '100%'}}
                                    source={{
                                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片33.png',
                                    }}
                                />
                            </View>
                        </View>
                        {/* 专业理财 */}
                        <View style={{marginBottom: px(20)}}>
                            <Text style={styles.large_title}>专业理财</Text>

                            <ScrollView
                                loop={true}
                                showsPagination={false}
                                horizontal={true}
                                height={200}
                                // decelerationRate={'fast'}
                                snapToInterval={px(214)}
                                // ref={snapScroll}
                                // onResponderRelease={() => {
                                //     var interval = px(202); // WIDTH OF 1 CHILD COMPONENT
                                //     var snapTo = scrollingRight ? Math.ceil(lastx / interval) : Math.floor(lastx / interval);
                                //     var scrollTo = snapTo * interval;
                                //     snapScroll?.current.scrollTo({x: scrollTo, y: 0, animated: true});
                                // }}
                                // scrollEventThrottle={32}
                                // onScroll={(event) => {
                                //     var nextx = event.nativeEvent.contentOffset.x;
                                //     scrollingRight = nextx > lastx;
                                //     lastx = nextx;
                                // }}
                                showsHorizontalScrollIndicator={false}>
                                <View style={[styles.major_card, styles.card]}>
                                    <Text style={styles.card_title}>养老计划</Text>
                                    <Text style={[styles.card_title_dexc, {marginTop: px(6)}]}>
                                        美好生活 | 稳健理性多赚钱
                                    </Text>
                                    <Text style={[styles.radio, {marginTop: px(16)}]}>6.87%~11.58%</Text>
                                    <Text style={styles.light_text}>预期年化收益率</Text>
                                </View>
                                <View style={[styles.major_card, styles.card]}>
                                    <Text style={styles.card_title}>养老计划</Text>
                                    <Text style={[styles.card_title_dexc, {marginTop: px(6)}]}>
                                        美好生活 | 稳健理性多赚钱
                                    </Text>
                                    <Text style={[styles.radio, {marginTop: px(16)}]}>6.87%~11.58%</Text>
                                    <Text style={styles.light_text}>预期年化收益率</Text>
                                </View>
                                <View style={[styles.major_card, styles.card]}>
                                    <Text style={styles.card_title}>养老计划</Text>
                                    <Text style={[styles.card_title_dexc, {marginTop: px(6)}]}>
                                        美好生活 | 稳健理性多赚钱
                                    </Text>
                                    <Text style={[styles.radio, {marginTop: px(16)}]}>6.87%~11.58%</Text>
                                    <Text style={styles.light_text}>预期年化收益率</Text>
                                </View>
                            </ScrollView>
                        </View>
                        {/* 增值服务 */}
                        <View style={{marginBottom: px(20)}}>
                            <Text style={styles.large_title}>增值服务</Text>
                            <View style={[styles.card, {borderRadius: 8, marginBottom: px(12)}, Style.flexRow]}>
                                <View style={{padding: Space.cardPadding, flex: 1}}>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.card_title}>养老计划</Text>
                                        <Text style={styles.card_title_dexc}> 美好生活提前储备</Text>
                                    </View>
                                    <Text style={[styles.radio, {marginTop: px(16)}]}>132.87%~156.58%</Text>
                                    <Text style={styles.light_text}>35+必备 ｜ 美好生活提前储备</Text>
                                </View>
                                <Image
                                    style={{width: px(120), height: '100%'}}
                                    source={{
                                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片33.png',
                                    }}
                                />
                            </View>
                            <View style={[styles.card, {borderRadius: 8}, Style.flexRow]}>
                                <View style={{padding: Space.cardPadding, flex: 1}}>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.card_title}>养老计划</Text>
                                        <Text style={styles.card_title_dexc}> 美好生活提前储备</Text>
                                    </View>
                                    <Text style={[styles.radio, {marginTop: px(16)}]}>132.87%~156.58%</Text>
                                    <Text style={styles.light_text}>35+必备 ｜ 美好生活提前储备</Text>
                                </View>
                                <Image
                                    style={{width: px(120), height: '100%'}}
                                    source={{
                                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片33.png',
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        paddingHorizontal: px(16),
        top: px(16),
        zIndex: 10,
    },
    img_desc: {
        color: '#fff',
        fontSize: px(14),
        marginBottom: px(10),
    },
    recommend: {
        borderRadius: 8,
        marginBottom: px(20),
    },
    card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    card_title: {
        fontSize: px(15),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginRight: px(12),
    },
    card_title_dexc: {
        fontSize: px(14),
        color: Colors.darkGrayColor,
    },
    radio: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        fontSize: px(22),
        lineHeight: px(26),
    },
    recommend_btn: {
        height: px(32),
        justifyContent: 'center',
        paddingHorizontal: px(22),
        borderRadius: 20,
    },
    btn_text: {
        fontSize: px(13),
        color: '#fff',
        fontWeight: '700',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginTop: px(4),
    },
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        color: Colors.defaultColor,
        marginBottom: px(16),
    },
    major_card: {
        width: px(202),
        borderRadius: 8,
        padding: Space.cardPadding,
        marginRight: px(12),
    },
    img_title: {
        color: '#fff',
        fontSize: px(26),
        fontWeight: '700',
        lineHeight: px(28),
    },
    header_title: {
        fontSize: px(22),
        fontWeight: '700',
        paddingLeft: px(16),
    },
});
export default Index;
