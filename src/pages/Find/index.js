/*
 * @Date: 2021-01-30 11:09:32
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-11 18:07:02
 * @Description:发现
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import * as MagicMove from 'react-native-magic-move';
import Header from '../../components/NavBar';
import BottomDesc from '../../components/BottomDesc';
import http from '../../services';
import {useJump} from '../../components/hooks';
import {Chart, chartOptions} from '../../components/Chart';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
const Index = (props) => {
    const inset = useRef(useSafeAreaInsets()).current;
    const [data, SetData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const jump = useJump();
    useEffect(() => {
        getData();
    }, []);
    // let scrollingRight = '';
    // let lastx = '';
    // const snapScroll = useRef(null);
    const getData = useCallback((type) => {
        type == 'refresh' && setRefreshing(true);
        http.get('/discovery/index/20210101')
            .then((res) => {
                setRefreshing(false);
                setLoading(false);
                SetData(res.result);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);
    const renderLoading = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    paddingTop: inset.top + px(8),
                }}>
                <FastImage
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/img/loading/findLoading.png')}
                    resizeMode="contain"
                />
            </View>
        );
    };
    return loading ? (
        renderLoading()
    ) : (
        <>
            <Header renderLeft={<Text style={styles.header_title}>今日推荐</Text>} />
            <ScrollView
                style={{backgroundColor: Colors.bgColor}}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData('refresh')} />}>
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
                                    jump(data?.recommend?.button?.url);
                                }}
                                style={[styles.recommend, styles.card]}>
                                <View style={[styles.header]}>
                                    <Text style={styles.img_desc}>{data?.recommend?.slogan[0]}</Text>
                                    <Text style={styles.img_title}>{data?.recommend?.slogan[1]}</Text>
                                </View>
                                <FastImage
                                    style={{
                                        height: px(320),
                                    }}
                                    source={{
                                        uri: data?.recommend?.background,
                                    }}
                                />
                                <View style={{padding: Space.cardPadding}}>
                                    <View style={Style.flexRow}>
                                        <Text style={[styles.card_title, {fontSize: px(16)}]}>
                                            {data?.recommend?.name}
                                        </Text>
                                        {data?.recommend?.labels && (
                                            <Text style={styles.card_title_dexc}>
                                                {data?.recommend?.labels.map((item, index) =>
                                                    index == 0 ? (
                                                        <Text key={index}>{item}</Text>
                                                    ) : (
                                                        <Text key={index}>｜{item}</Text>
                                                    )
                                                )}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                                        <Text
                                            style={[
                                                styles.radio,
                                                {fontSize: px(26), lineHeight: px(30), marginTop: px(6)},
                                            ]}>
                                            {data?.recommend?.yield?.ratio}
                                        </Text>

                                        <LinearGradient
                                            start={{x: 0, y: 0.25}}
                                            end={{x: 0, y: 0.8}}
                                            colors={['#FF9463', '#FF7D41']}
                                            style={styles.recommend_btn}>
                                            <Text style={styles.btn_text}>{data?.recommend?.button?.text}</Text>
                                        </LinearGradient>
                                    </View>
                                    <Text style={styles.light_text}>{data?.recommend?.yield?.title}</Text>
                                </View>
                            </TouchableOpacity>
                        </MagicMove.View>
                    </LinearGradient>

                    {/* 目标理财 */}
                    <View style={{paddingHorizontal: Space.padding}}>
                        <View style={{marginBottom: px(20)}}>
                            <Text style={styles.large_title}>{data?.part1?.group_name}</Text>
                            {data?.part1?.plans?.map((item, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        jump(item?.url);
                                    }}
                                    key={index}
                                    style={[styles.card, {borderRadius: 8}, Style.flexRow]}>
                                    <View style={{padding: Space.cardPadding, flex: 1}}>
                                        <View style={Style.flexRow}>
                                            <Text style={styles.card_title}>{item?.name}</Text>
                                            {item?.labels && (
                                                <Text style={styles.card_title_dexc}>
                                                    {item?.labels.map((_item, _index) =>
                                                        _index == 0 ? (
                                                            <Text key={_index}>{_item}</Text>
                                                        ) : (
                                                            <Text key={_index}>｜{_item}</Text>
                                                        )
                                                    )}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={[styles.radio, {marginTop: px(16)}]}>{item?.yield?.ratio}</Text>
                                        <Text style={styles.light_text}>{item?.yield?.title}</Text>
                                    </View>
                                    <Image
                                        style={{width: px(110), height: '100%'}}
                                        source={{
                                            uri: item?.background,
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* 专业理财 */}
                        <View style={{marginBottom: px(20)}}>
                            <Text style={styles.large_title}>{data?.part2?.group_name}</Text>

                            <ScrollView
                                loop={true}
                                showsPagination={false}
                                horizontal={true}
                                height={px(217)}
                                decelerationRate={0.99}
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
                                {data?.part2?.plans?.map((item, index) => (
                                    <View style={[styles.major_card, styles.card]} key={index}>
                                        <Text style={styles.card_title}>{item.name}</Text>
                                        {item?.labels && (
                                            <Text style={[styles.card_title_dexc, {marginTop: px(10)}]}>
                                                {item?.labels.map((_item, _index) =>
                                                    _index == 0 ? (
                                                        <Text key={_index}>{_item}</Text>
                                                    ) : (
                                                        <Text key={_index}>｜{_item}</Text>
                                                    )
                                                )}
                                            </Text>
                                        )}

                                        <Text style={[styles.radio, {marginTop: px(16)}]}>{item?.yield?.ratio}</Text>
                                        <Text style={styles.light_text}>{item?.yield?.title}</Text>
                                        {item?.yield?.chart && (
                                            <View style={{height: px(69), width: px(170), marginTop: px(14)}}>
                                                <Chart initScript={chartOptions.smChart(item?.yield?.chart)} />
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        {/* 增值服务 */}
                        <View style={{marginBottom: px(20)}}>
                            <Text style={styles.large_title}>{data?.part3?.group_name}</Text>
                            {data?.part3?.plans?.map((item, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        jump(item?.url);
                                    }}
                                    key={index}
                                    style={[styles.card, {borderRadius: 8, marginBottom: px(12)}, Style.flexRow]}>
                                    <View style={{padding: Space.cardPadding, flex: 1}}>
                                        <View style={Style.flexRow}>
                                            <Text style={styles.card_title}>{item?.name}</Text>
                                            {item?.labels && (
                                                <Text style={styles.card_title_dexc}>
                                                    {item?.labels.map((_item, _index) =>
                                                        _index == 0 ? (
                                                            <Text key={_index}>{_item}</Text>
                                                        ) : (
                                                            <Text key={_index}>｜{_item}</Text>
                                                        )
                                                    )}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={[styles.radio, {marginTop: px(16)}]}>{item?.yield?.ratio}</Text>
                                        <Text style={styles.light_text}>{item?.yield?.title}</Text>
                                    </View>
                                    <Image
                                        style={{width: px(110), height: '100%'}}
                                        source={{
                                            uri: item?.background,
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <BottomDesc />
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
        marginRight: px(10),
    },
    card_title_dexc: {
        fontSize: px(13),
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
