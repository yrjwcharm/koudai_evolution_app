// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:社区个人主页
// //  */
import {StyleSheet, Text, View, Animated, TouchableOpacity, ScrollView, FlatList, Dimensions} from 'react-native';
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
import {PublishContent, WaterfallFlowList} from '../CommunityIndex';
import Intro from './Intro';
import {ShareModal} from '../../../components/Modal';
const deviceHeight = Dimensions.get('screen').height;
const CommunityPersonalHome = ({navigation, route, ...props}) => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(220); //头部大背景图
    const WaterfallFlowHeight = deviceHeight - headerHeight;
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {muid, community_id = 1} = route?.params || {};
    const [data, setData] = useState();
    const [scroll, setScroll] = useState(true);
    const currentTabIndex = useRef(0);
    const introHeight = useRef(0);
    const currentTabListHeight = useRef([]);
    const rootScrollViewRef = useRef();
    const waterFallRef = useRef();
    const shareModal = useRef();
    const getData = async () => {
        let res = await getPersonalHomeData({muid});
        setData(res.result);
    };
    const getProductList = async (params) => {
        return getPersonaProductList(params);
    };
    useEffect(() => {
        getData();
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
                    <Text style={[styles.vName, {color: Colors.defaultColor, marginBottom: 0}]}>
                        {data?.user_info?.name}
                    </Text>
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
                bounces={false}
                scrollEnabled={scroll}
                ref={rootScrollViewRef}
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
                            if (y > 80) {
                                setParallTitle(true);
                            } else {
                                setParallTitle(false);
                            }
                            if (
                                y - (parallaxHeaderHeight - headerHeight) - introHeight.current + px(14) >= -1 &&
                                currentTabListHeight.current[currentTabIndex.current] &&
                                currentTabListHeight.current[currentTabIndex.current] > WaterfallFlowHeight
                            ) {
                                setScroll(false);
                                waterFallRef.current?.scrollTo(10);
                                // rootScrollViewRef.current.setNativeProps({
                                //     contentInset: {
                                //         top: y - (parallaxHeaderHeight - headerHeight) - introHeight.current + px(14),
                                //         left: 0,
                                //         bottom: 0,
                                //         right: 0,
                                //     },
                                // });
                            }
                        },
                    }
                )}>
                <CommunityHomeHeader
                    data={data?.user_info}
                    item_type={10}
                    item_id={muid}
                    style={{
                        width: deviceWidth,
                        paddingTop: headerHeight + px(20),
                    }}
                />
                {data?.tabs ? (
                    <View style={styles.listCon}>
                        <Intro
                            data={data?.intro_info}
                            onLayout={(e) => {
                                introHeight.current = e.nativeEvent.layout.height;
                            }}
                        />
                        <ScrollableTabView
                            onChangeTab={({i}) => (currentTabIndex.current = i)}
                            renderTabBar={() => <ScrollTabbar container="View" />}
                            style={{height: WaterfallFlowHeight}}>
                            {data?.tabs?.map(({name, type}, index) => (
                                <LinearGradient
                                    start={{x: 0, y: 0.25}}
                                    end={{x: 0, y: 0.8}}
                                    colors={['#fff', Colors.bgColor]}
                                    key={name + type}
                                    style={{flex: 1}}
                                    tabLabel={name}>
                                    <WaterfallFlowList
                                        bounces={false}
                                        ref={waterFallRef}
                                        scrollEnabled={!scroll}
                                        onContentSizeChange={(width, height) => {
                                            currentTabListHeight.current[index] = height;
                                        }}
                                        onScroll={(e) => {
                                            // console.log('底部滚动距离：', e.nativeEvent.contentOffset.y);
                                            if (e.nativeEvent.contentOffset.y <= px(0)) {
                                                setScroll(true);
                                            }
                                            // console.log(waterFallRef.current.waterfallFlow);
                                            // waterFallRef.current.waterfallFlow.current.setNativeProps({
                                            //     contentOffset: {x: 0, y: e.nativeEvent.contentOffset.y},
                                            // });
                                            // // rootScrollViewRef.current.contentOffset.y = e.nativeEvent.contentOffset.y;
                                            // rootScrollViewRef.current.setNativeProps({
                                            //     contentOffset: {x: 0, y: e.nativeEvent.contentOffset.y},
                                            // });
                                        }}
                                        getData={getProductList}
                                        params={{muid, type: type}}
                                    />
                                </LinearGradient>
                            ))}
                        </ScrollableTabView>
                    </View>
                ) : null}
            </Animated.ScrollView>
            {data?.share_info ? (
                <ShareModal
                    ref={shareModal}
                    otherList={data?.share_button}
                    shareContent={data?.share_info}
                    title={'更多'}
                />
            ) : null}
            <PublishContent community_id={0} />
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
        flex: 1,
        backgroundColor: '#fff',
    },
});
