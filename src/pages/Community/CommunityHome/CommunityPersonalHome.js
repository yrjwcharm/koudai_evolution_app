// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:
// //  */
import {StyleSheet, Text, View, Animated, ImageBackground, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '~/common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import {getPersonalHomeData, getPersonaProductList} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
const CommunityPersonalHome = ({navigation, route}) => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(130);
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {to_uid = 1000000002} = route?.params || {};
    const [data, setData] = useState();
    const [product, setProduct] = useState();
    const getData = async () => {
        let res = await getPersonalHomeData({to_uid});
        setData(res.result);
    };
    const getProductList = async () => {
        let res = await getPersonaProductList();
        setProduct(res.result);
    };
    useEffect(() => {
        getData();
        getProductList();
    }, []);
    const Header = () => {
        return (
            <Animated.View
                style={[
                    styles.header,
                    Style.flexBetween,
                    {
                        height: headerHeight,
                        paddingTop: inset.top,
                        backgroundColor: scrollY.interpolate({
                            inputRange: [px(50), px(130)],
                            outputRange: ['rgba(0,0,0,0)', '#fff'],
                            extrapolate: 'clamp',
                        }),
                    },
                ]}>
                <TouchableOpacity style={{width: px(40)}} onPress={() => navigation.goBack()}>
                    <Icon name="left" size={px(18)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity>
                {parallTitle && (
                    <Text style={[styles.vName, {color: Colors.defaultColor, marginBottom: 0}]}>马老师</Text>
                )}
                <TouchableOpacity style={{width: px(40), alignItems: 'flex-end'}}>
                    <Icon name="ellipsis1" size={px(30)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity>
            </Animated.View>
        );
    };
    return (
        <>
            <Header />
            <Animated.ScrollView
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                        },
                    ],
                    {
                        useNativeDriver: false,
                        listener: (e) => {
                            let y = e.nativeEvent.contentOffset.y;
                            if (y - parallaxHeaderHeight > -px(50)) {
                                setParallTitle(true);
                            } else {
                                setParallTitle(false);
                            }
                        },
                    }
                )}>
                <CommunityHomeHeader
                    data={data?.community_info}
                    style={{
                        width: deviceWidth,
                        paddingTop: headerHeight + px(20),
                    }}
                />
                <LinearGradient
                    start={{x: 0, y: 0.25}}
                    end={{x: 0.8, y: 0.8}}
                    colors={['#fff', Colors.bgColor]}
                    style={styles.listCon}>
                    <View style={{paddingHorizontal: px(16)}}>
                        <Text>{data?.intro}</Text>
                    </View>

                    <ScrollableTabView renderTabBar={() => <ScrollTabbar container="View" />}>
                        <View style={{height: px(500)}} tabLabel="哈哈" pointerEvents="none" />
                        <View style={{height: px(1500)}} tabLabel="哈哈11" />
                    </ScrollableTabView>
                </LinearGradient>
            </Animated.ScrollView>
        </>
    );
};

export default CommunityPersonalHome;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width: deviceWidth,
        zIndex: 20,
        paddingHorizontal: px(16),
    },
    headerAvatar: {
        width: px(66),
        height: px(66),
        marginRight: px(12),
        borderRadius: px(33),
        borderWidth: px(2),
        borderColor: '#fff',
    },
    vName: {
        fontSize: px(18),
        lineHeight: px(25),
        marginBottom: px(6),
        color: '#fff',
        fontWeight: '700',
    },
    attentionBtn: {
        paddingVertical: px(6),
        paddingHorizontal: px(14),
        borderRadius: px(103),
        backgroundColor: '#FFFFFF',
    },
    listCon: {
        borderTopLeftRadius: px(20),
        borderTopRightRadius: px(20),
        marginTop: px(-30),
        paddingTop: px(16),
    },
});
