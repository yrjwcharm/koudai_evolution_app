import React, {useState, useCallback, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import BottomDesc from '../../components/BottomDesc';
import LoginMask from '../../components/LoginMask';
import http from '../../services';
import {useJump} from '../../components/hooks';
import {Chart, chartOptions} from '../../components/Chart';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {useSelector} from 'react-redux';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import LazyImage from '../../components/LazyImage';
const Index = (props) => {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
    const isFocused = useIsFocused();
    const userInfo = useSelector((store) => store.userInfo);
    const inset = useSafeAreaInsets();
    const [data, SetData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const jump = useJump();
    useFocusEffect(
        useCallback(() => {
            // snapScroll?.current?.scrollTo({x: 0, y: 0, animated: false});
            hasNet && getData();
        }, [getData, hasNet])
    );
    useEffect(() => {
        const listener = NetInfo.addEventListener((state) => {
            setHasNet(state.isConnected);
        });
        return () => listener();
    }, []);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            if (isFocused) {
                snapScroll?.current?.scrollTo({x: 0, y: 0, animated: false});
                hasNet && getData('refresh');
                global.LogTool('tabDoubleClick', 'Find');
            }
        });
        return () => unsubscribe();
    }, [isFocused, props.navigation, getData, hasNet]);

    const snapScroll = useRef(null);
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
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);
    return hasNet ? (
        loading ? (
            renderLoading()
        ) : (
            <>
                {!userInfo.toJS().is_login && <LoginMask />}

                <View style={{backgroundColor: '#fff', paddingTop: inset.top}} />
                <ScrollView
                    style={{backgroundColor: Colors.bgColor}}
                    scrollEventThrottle={16}
                    ref={snapScroll}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData('refresh')} />}>
                    <View style={styles.container}>
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            colors={['#fff', '#F5F6F8']}
                            style={{paddingHorizontal: Space.padding}}>
                            <View style={{paddingBottom: px(15), paddingTop: px(9), backgroundColor: '#fff'}}>
                                <Text style={styles.header_title}>推荐</Text>
                            </View>
                            {/* 今日推荐 */}
                            <>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        global.LogTool('findRecProduct', data?.recommend?.plan_id);
                                        jump(data?.recommend?.button?.url);
                                    }}
                                    style={[styles.recommend, styles.card]}>
                                    <LazyImage
                                        style={{
                                            height: px(320),
                                        }}
                                        source={{
                                            uri: data?.recommend?.background,
                                        }}>
                                        <View style={[styles.header]}>
                                            <View style={Style.flexRow}>
                                                <FastImage
                                                    style={{height: px(24), width: px(24), marginTop: px(-6)}}
                                                    source={require('../../assets/img/logo.png')}
                                                />
                                                <Text style={styles.img_desc}>{data?.recommend?.slogan[0]}</Text>
                                            </View>
                                            <Text style={styles.img_title}>{data?.recommend?.slogan[1]}</Text>
                                        </View>
                                    </LazyImage>
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
                            </>
                        </LinearGradient>
                        {/* 专家策略 */}
                        {data?.polaris_info && (
                            <View style={{paddingHorizontal: px(16)}}>
                                <Text style={styles.large_title}>{data?.polaris_info?.title}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        jump(data?.polaris_info?.url);
                                    }}
                                    activeOpacity={0.8}
                                    style={{marginBottom: px(20)}}>
                                    <View style={[styles.V_card, Style.flexRow]}>
                                        <FastImage
                                            style={{
                                                width: px(40),
                                                height: px(40),
                                                marginRight: px(8),
                                                borderRadius: px(6),
                                            }}
                                            source={{uri: data?.polaris_info?.avatar}}
                                        />
                                        <View style={{flex: 1}}>
                                            <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                                                <Text style={[styles.secure_title, {marginRight: px(4)}]}>
                                                    {data?.polaris_info?.name}
                                                </Text>
                                                <FastImage
                                                    style={{width: px(17), height: px(17)}}
                                                    source={{uri: data?.polaris_info?.v_img}}
                                                />
                                            </View>
                                            <View style={Style.flexBetween}>
                                                <Text numberOfLines={1} style={styles.v_text}>
                                                    {data?.polaris_info?.detail}
                                                </Text>
                                                <View style={[Style.flexRow]}>
                                                    <Text style={[Style.more, {marginRight: px(2)}]}>详情</Text>
                                                    <FontAwesome
                                                        name={'angle-right'}
                                                        color={Colors.btnColor}
                                                        size={18}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* 专业理财 */}
                        <View style={{marginBottom: px(20), paddingHorizontal: px(16)}}>
                            <Text style={[styles.large_title]}>{data?.part2?.group_name}</Text>
                            {data?.part2?.plans?.map((item, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('findProduct', item.plan_id);
                                        jump(item?.url);
                                    }}
                                    key={index}
                                    style={[
                                        styles.card,
                                        {borderRadius: 8},
                                        Style.flexRow,
                                        {marginTop: index != 0 ? px(12) : 0},
                                    ]}>
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
                                            {item?.tags?.includes('new') ? (
                                                <FastImage
                                                    source={require('../../assets/img/article/voiceUpdate.png')}
                                                    style={{marginLeft: px(8), width: px(23), height: px(18)}}
                                                />
                                            ) : null}
                                        </View>
                                        <Text style={[styles.radio, {marginTop: px(16)}]}>{item?.yield?.ratio}</Text>
                                        <Text style={styles.light_text}>{item?.yield?.title}</Text>
                                    </View>
                                    {item?.yield?.chart && (
                                        <View
                                            style={{
                                                height: px(60),
                                                width: px(80),
                                                marginTop: px(14),
                                                marginRight: px(16),
                                            }}>
                                            <Chart initScript={chartOptions.smChart(item?.yield?.chart)} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* 目标理财 */}

                        <View style={{marginBottom: px(20), paddingHorizontal: px(16)}}>
                            <Text style={styles.large_title}>{data?.part1?.group_name}</Text>
                            {data?.part1?.plans?.map((item, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('findTargetProductStart', item.plan_id);
                                        jump(item?.url);
                                    }}
                                    key={index}
                                    style={[
                                        styles.card,
                                        {borderRadius: 8},
                                        Style.flexRow,
                                        {marginTop: index != 0 ? px(12) : 0},
                                    ]}>
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
                                            {item?.tags?.includes('new') ? (
                                                <FastImage
                                                    source={require('../../assets/img/article/voiceUpdate.png')}
                                                    style={{marginLeft: px(8), width: px(23), height: px(18)}}
                                                />
                                            ) : null}
                                        </View>
                                        <Text style={[styles.radio, {marginTop: px(16)}]}>{item?.yield?.ratio}</Text>
                                        <Text style={styles.light_text}>{item?.yield?.title}</Text>
                                    </View>
                                    <FastImage
                                        style={styles.img_icon}
                                        resizeMode={FastImage.resizeMode.contain}
                                        source={{
                                            uri: item?.background,
                                        }}
                                    />
                                    <View style={{position: 'absolute', right: px(16)}}>
                                        <FontAwesome name={'angle-right'} size={16} color={'#9095A5'} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* 增值服务 */}
                        <View style={{marginBottom: data?.polaris_info ? px(8) : 0, paddingHorizontal: px(16)}}>
                            <Text style={styles.large_title}>{data?.part3?.group_name}</Text>
                            {data?.part3?.plans?.map((item, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('findExtraProductStart', item.plan_id);
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
                                            {item?.tags?.includes('new') ? (
                                                <FastImage
                                                    source={require('../../assets/img/article/voiceUpdate.png')}
                                                    style={{marginLeft: px(8), width: px(23), height: px(18)}}
                                                />
                                            ) : null}
                                        </View>
                                        <Text style={styles.large_text}>{item?.desc}</Text>
                                        <Text style={styles.light_text}>{item?.slogan}</Text>
                                    </View>
                                    <FastImage
                                        style={[styles.img_icon, {width: px(78), height: px(70)}]}
                                        resizeMode={FastImage.resizeMode.contain}
                                        source={{
                                            uri: item?.background,
                                        }}
                                    />
                                    <View style={{position: 'absolute', right: px(16)}}>
                                        <FontAwesome name={'angle-right'} size={16} color={'#9095A5'} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <BottomDesc />
                </ScrollView>
            </>
        )
    ) : (
        <>
            <Empty
                img={require('../../assets/img/emptyTip/noNetwork.png')}
                text={'哎呀！网络出问题了'}
                desc={'网络不给力，请检查您的网络设置'}
                style={{paddingTop: inset.top + px(100), paddingBottom: px(60)}}
            />
            <Button title={'刷新一下'} style={{marginHorizontal: px(20)}} onPress={refreshNetWork} />
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
    },
    img_desc: {
        color: '#fff',
        fontSize: px(14),
        marginBottom: px(10),
    },
    img_icon: {
        width: px(84),
        height: px(80),
        alignSelf: 'flex-end',
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
        lineHeight: px(21),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginRight: px(10),
    },
    card_title_dexc: {
        fontSize: px(13),
        lineHeight: px(18),
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
        width: px(88),
        borderRadius: 20,
        alignItems: 'center',
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
        marginBottom: px(12),
    },
    major_card: {
        width: px(202),
        borderRadius: 8,
        padding: Space.cardPadding,
    },
    img_title: {
        color: '#fff',
        fontSize: px(26),
        fontWeight: '700',
        lineHeight: px(30),
    },
    header_title: {
        fontSize: px(22),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
    large_text: {
        marginTop: px(16),
        marginBottom: px(2),
        fontSize: px(18),
        color: Colors.red,
        lineHeight: px(25),
    },
    V_card: {
        paddingHorizontal: px(16),
        height: px(75),
        backgroundColor: '#fff',
        borderRadius: px(6),
    },
    v_text: {
        color: Colors.lightBlackColor,
        fontSize: px(12),
        flex: 1,
    },
    secure_title: {
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
});
export default Index;
