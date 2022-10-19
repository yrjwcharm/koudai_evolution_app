// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:社区主页
// //  */
import {StyleSheet, Text, View, Animated, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '~/common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import {getCommunityHomeData, getCommunityProductList} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
import Intro from './Intro';
import {PublishContent} from '../CommunityIndex';
import {CommunityFollowCard} from '../components/CommunityCard';
import ProductList from '../../../components/Product/ProductList';
import ProductCards from '../../../components/Portfolios/ProductCards';
import {ShareModal} from '../../../components/Modal';
const CommunityHome = ({navigation, route}) => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(130);
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {community_id = 1} = route?.params || {};
    const [data, setData] = useState();
    const [product, setProduct] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    const shareModal = useRef();
    const getData = async () => {
        let res = await getCommunityHomeData({community_id});
        getProductList({community_id, type: res.result?.tabs[0]?.type || ''});
        setData(res.result);
    };
    const getProductList = async (params) => {
        let res = await getCommunityProductList(params);
        setProduct(res.result);
    };
    useEffect(() => {}, [currentTab]);
    useEffect(() => {
        getData();
    }, []);
    const onScroll = (e) => {
        let y = e.nativeEvent.contentOffset.y;
        if (y - parallaxHeaderHeight > -px(50)) {
            setParallTitle(true);
        } else {
            setParallTitle(false);
        }
    };
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
                <TouchableOpacity
                    style={{width: px(40), alignItems: 'flex-end'}}
                    onPress={() => shareModal?.current?.show()}>
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
                            onScroll(e);
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
                {data?.tabs ? (
                    <LinearGradient
                        start={{x: 0, y: 0.25}}
                        end={{x: 0.8, y: 0.8}}
                        colors={['#fff', Colors.bgColor]}
                        style={styles.listCon}>
                        <Intro data={data?.intro_info} />
                        <ScrollableTabView
                            renderTabBar={() => <ScrollTabbar container="View" />}
                            onChangeTab={({i}) => getProductList({community_id, type: data?.tabs[i].type})}>
                            {data?.tabs?.map((tab, index) =>
                                tab.type == 1 ? (
                                    <View key={index} style={{flex: 1, paddingHorizontal: px(16)}} tabLabel={tab?.name}>
                                        {product?.map((_data) => (
                                            <CommunityFollowCard key={_data.id} {..._data} />
                                        ))}
                                    </View>
                                ) : (
                                    <View key={index} style={{flex: 1, paddingHorizontal: px(16)}} tabLabel={tab?.name}>
                                        {product?.map((_data) => (
                                            <ProductCards key={_data.id} data={_data} />
                                        ))}
                                    </View>
                                )
                            )}
                        </ScrollableTabView>
                    </LinearGradient>
                ) : null}
            </Animated.ScrollView>
            <ShareModal ref={shareModal} shareContent={data?.share_info} title={data?.title} />
            <PublishContent community_id={community_id} />
        </>
    );
};

export default CommunityHome;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width: deviceWidth,
        zIndex: 20,
        paddingHorizontal: px(16),
    },

    listCon: {
        borderTopLeftRadius: px(20),
        borderTopRightRadius: px(20),
        marginTop: px(-30),
        paddingTop: px(16),
    },
    vName: {
        fontSize: px(18),
        lineHeight: px(25),
        marginBottom: px(6),
        color: '#fff',
        fontWeight: '700',
    },
});
