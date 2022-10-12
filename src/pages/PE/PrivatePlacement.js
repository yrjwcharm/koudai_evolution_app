import React, {useCallback, useState} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    DeviceEventEmitter,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import NavBar from '~/components/NavBar';
import ProductCards from '~/components/Portfolios/ProductCards';
import Toast from '~/components/Toast';
import http from '~/services';
import {px, isIphoneX} from '~/utils/appUtil';
import HTML from '~/components/RenderHtml';

const PrivatePlacement = () => {
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const init = () => {
        setLoading(true);
        http.get('/private_fund/index/20220608')
            .then((res) => {
                if (res.code === '000000') {
                    const {next_url} = res.result;
                    if (next_url) {
                        jump(next_url);
                    }
                    setData(res.result);
                } else {
                    Toast.show(res.message);
                }
            })
            .finally((_) => {
                StatusBar.setBarStyle('light-content');
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            const listener = DeviceEventEmitter.addListener('sign_password_refresh', init);
            return () => {
                listener?.remove?.();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            init();
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return loading ? (
        <View style={styles.loadingMask}>
            <ActivityIndicator />
        </View>
    ) : (
        <View style={styles.container}>
            <NavBar
                leftIcon="chevron-left"
                fontStyle={{color: '#fff'}}
                style={{backgroundColor: 'transparent', position: 'absolute', zIndex: 20}}
            />
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <ImageBackground source={{uri: data.background}} style={{height: px(268), width: '100%'}} />
                <View style={styles.cardWrap}>
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={['#FFF7EC', '#FFFFFF']}
                        style={{borderRadius: px(8), paddingTop: px(22)}}>
                        {/* <View style={styles.swiperHeader}>
                            <View style={styles.highStemp}>
                                <Text style={styles.highStempText}>{data.recommend?.rank_tag}</Text>
                            </View>
                        </View> */}
                        <Text style={styles.swiperTitle}>{data.recommend?.title}</Text>
                        <View style={styles.swiperMiddle}>
                            {data.recommend?.yield_info ? (
                                <View style={styles.swiperMiddleLeft}>
                                    <HTML style={styles.swiperMiddleRate} html={data.recommend?.yield_info.value} />
                                    <Text style={styles.swiperMiddleDesc}>{data.recommend?.yield_info.text}</Text>
                                </View>
                            ) : null}
                            <View style={styles.swiperMiddleRight}>
                                <Text style={styles.swiperMiddleName}>{data.recommend?.name}</Text>
                                <View style={styles.swiperMiddleTags}>
                                    {data.recommend?.tags?.[0] ? (
                                        <View style={[styles.swiperMiddleTag]}>
                                            <Text style={styles.swiperMiddleTagText}>{data.recommend.tags[0]}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                        <View style={styles.swiperFooter}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.swiperBtn}
                                onPress={() => {
                                    jump(data.recommend.url);
                                }}>
                                <Text style={styles.swiperBtnText}>开始预约 &gt; </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    {/* card list */}
                    <View style={styles.cardList}>
                        {data.fof_list?.map((item, idx) => (
                            <ProductCards key={idx} data={{type: 'private_card', data: item, url: item.url}} />
                        ))}
                    </View>
                </View>
                <View style={{height: px(30)}} />
            </ScrollView>
            {data.bottom ? (
                <View style={[styles.bottomWrap, {paddingBottom: px(isIphoneX() ? 34 : 8)}]}>
                    <View style={Style.flexRow}>
                        <FastImage source={{uri: data.bottom.icon}} style={{width: px(17), height: px(17)}} />
                        <Text style={styles.bottomDesc}>{data.bottom.text}</Text>
                        <Text style={styles.bottomTel}>{data.bottom.phone}</Text>
                    </View>
                    {data.bottom.button && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!data.bottom.button.avail}
                            style={styles.bottomBtn}
                            onPress={() => {
                                jump(data.bottom.button.url);
                            }}>
                            <Text style={styles.bottomBtnText}>{data.bottom.button.text}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : null}
        </View>
    );
};

export default PrivatePlacement;

const styles = StyleSheet.create({
    loadingMask: {
        flex: 1,
        marginTop: px(30),
        marginBottom: px(60),
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    cardWrap: {
        paddingHorizontal: px(16),
        marginTop: px(-86),
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
        textAlign: 'center',
    },
    swiperMiddleDesc: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
        marginTop: 3,
    },
    swiperMiddleLeft: {
        marginLeft: px(58),
    },
    swiperMiddleRight: {
        marginLeft: px(40),
        flex: 1,
    },
    swiperMiddleName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
    },
    swiperMiddleTags: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    swiperMiddleTag: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#AD9064',
        paddingHorizontal: px(2),
        paddingVertical: px(4),
        marginTop: px(6),
    },
    swiperMiddleTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#AD9064',
    },
    swiperFooter: {
        paddingBottom: px(16),
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
        backgroundColor: '#fff',
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
