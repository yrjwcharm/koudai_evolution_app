// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:社区主页
// //  */
import {StyleSheet, Text, View, Animated, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '~/common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import {getCommunityHomeData, getCommunityProductList, removeProduct, addProduct} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
import Intro from './Intro';
import {PublishContent} from '../CommunityIndex';
import {CommunityFollowCard} from '../components/CommunityCard';
import ProductCards from '../../../components/Portfolios/ProductCards';
import {ShareModal} from '../../../components/Modal';
import EmptyTip from '../../../components/EmptyTip';
import {Button} from '../../../components/Button';
import {ChooseModal} from '../CommunityVodCreate';
import {ScrollTabView, ScrollView} from 'react-native-scroll-head-tab-view';
import {useFocusEffect} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {useJump} from '~/components/hooks';
const CommunityHome = ({navigation, route}) => {
    const jump = useJump();
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(220);
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {community_id = 1} = route?.params || {};
    const [data, setData] = useState();
    const [product, setProduct] = useState();
    const currentTab = useRef();
    const shareModal = useRef();
    const chooseModal = useRef();
    const [introHeight, setIntroHeight] = useState(0);
    const [loading, setLoading] = useState(true);
    const bottomModal = useRef();
    const getData = async (type) => {
        let res = await getCommunityHomeData({community_id});
        if (res.result?.bottom_pop) {
            bottomModal?.current?.open();
        }
        getProductList({community_id, type: type || res.result?.tabs[0]?.type});
        if (!currentTab.current) {
            currentTab.current = type || res.result?.tabs[0]?.type;
        }
        setData(res.result);
    };
    const getProductList = async (params) => {
        let res = await getCommunityProductList(params);
        setLoading(false);
        setProduct(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getData(currentTab.current);
        }, [])
    );

    //移除产品
    const onDelete = async (type, item_id) => {
        let res = await removeProduct({type, community_id, item_id});
        if (res.code == '000000') {
            setProduct((prev) => {
                let tmp = [...prev];
                let index = product.findIndex((item) => {
                    return item.id == item_id || item.code == item_id;
                });
                tmp.splice(index, 1);
                return tmp;
            });
        }
    };
    //添加
    const handleAddProduct = async (_data) => {
        let res = await addProduct({community_id, item_id: _data.item_id, type: _data.relation_type});
        if (res.code == '000000') {
            getProductList({community_id, type: currentTab.current});
        }
    };
    const Header = () => {
        const animateOpacity = scrollY.interpolate({
            inputRange: [px(50), parallaxHeaderHeight - 50],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });
        const headerTitleStyle = {
            backgroundColor: '#fff',
            opacity: animateOpacity,
            flex: 1,
            paddingTop: inset.top,
            height: headerHeight,
            justifyContent: 'center',
        };
        return (
            <View style={[styles.header]}>
                <TouchableOpacity
                    style={{width: px(40), position: 'absolute', left: px(16), top: inset.top + px(8), zIndex: 10}}
                    onPress={() => navigation.goBack()}>
                    <Icon name="left" size={px(18)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity>
                <Animated.View style={headerTitleStyle}>
                    <Text style={[styles.vName, {color: Colors.defaultColor, marginBottom: 0}]}>
                        {data?.community_info?.name}
                    </Text>
                </Animated.View>
                <TouchableOpacity
                    style={{width: px(40), position: 'absolute', right: px(16), top: inset.top}}
                    onPress={() => shareModal?.current?.show()}>
                    <Icon name="ellipsis1" size={px(30)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <>
            <Header />
            <View style={{flex: 1}}>
                {data?.tabs?.length && (
                    <ScrollTabView
                        headerHeight={parallaxHeaderHeight + introHeight - px(30)}
                        insetValue={headerHeight}
                        style={{backgroundColor: '#fff', flex: 1}}
                        onChangeTab={({i}) => {
                            getProductList({community_id, type: data?.tabs[i]?.type});
                            currentTab.current = data?.tabs[i]?.type;
                        }}
                        onContentScroll={(e) => {
                            scrollY.setValue(e.value);
                            if (e.value > 80) {
                                setParallTitle(true);
                            } else {
                                setParallTitle(false);
                            }
                        }}
                        renderTabBar={(_props) => (
                            <ScrollTabbar {..._props} container="View" boxStyle={{backgroundColor: '#fff'}} />
                        )}
                        renderScrollHeaderBg={{
                            uri: data?.community_info?.bg_img || data?.community_info?.avatar,
                            style: {
                                height: parallaxHeaderHeight,
                            },
                        }}
                        renderScrollHeader={() => {
                            return (
                                <>
                                    <CommunityHomeHeader
                                        data={data?.community_info}
                                        item_type={11}
                                        item_id={community_id}
                                        style={{
                                            width: deviceWidth,
                                            paddingTop: headerHeight + px(20),
                                        }}
                                    />
                                    <View
                                        style={styles.listCon}
                                        onLayout={(e) => {
                                            setIntroHeight(e.nativeEvent.layout.height);
                                        }}>
                                        <Intro data={data?.intro_info} />
                                    </View>
                                </>
                            );
                        }}>
                        {data?.tabs?.map((tab, index) =>
                            tab.type == 1 ? (
                                <ScrollView
                                    key={index}
                                    style={{flex: 1, backgroundColor: Colors.bgColor}}
                                    tabLabel={tab?.name}>
                                    <LinearGradient
                                        style={{paddingHorizontal: px(16)}}
                                        colors={['#fff', Colors.bgColor]}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 0.3}}>
                                        {!loading ? (
                                            product?.length ? (
                                                product?.map((_data) => (
                                                    <CommunityFollowCard
                                                        key={_data.id}
                                                        {..._data}
                                                        onDelete={onDelete}
                                                    />
                                                ))
                                            ) : (
                                                <EmptyTip
                                                    desc="请点击按钮进行添加"
                                                    text="暂无相关作品"
                                                    imageStyle={{marginBottom: px(-30)}}>
                                                    <Button
                                                        onPress={() => chooseModal?.current?.show('article', product)}
                                                        title="添加作品"
                                                        style={{
                                                            width: px(180),
                                                            borderRadius: px(100),
                                                            marginTop: px(10),
                                                        }}
                                                    />
                                                </EmptyTip>
                                            )
                                        ) : (
                                            <ActivityIndicator />
                                        )}
                                    </LinearGradient>
                                </ScrollView>
                            ) : (
                                <ScrollView
                                    key={index}
                                    style={{flex: 1, backgroundColor: Colors.bgColor}}
                                    tabLabel={tab?.name}>
                                    <LinearGradient
                                        style={{paddingHorizontal: px(16)}}
                                        colors={['#fff', Colors.bgColor]}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 0.3}}>
                                        {!loading ? (
                                            product?.length ? (
                                                product?.map((_data) => (
                                                    <ProductCards key={_data.id} data={_data} onDelete={onDelete} />
                                                ))
                                            ) : (
                                                <EmptyTip
                                                    desc="请点击按钮进行添加"
                                                    text="暂无相关产品"
                                                    imageStyle={{marginBottom: px(-30)}}>
                                                    <Button
                                                        onPress={() => chooseModal?.current?.show('fund', product)}
                                                        title="添加产品"
                                                        style={{
                                                            width: px(180),
                                                            borderRadius: px(100),
                                                            marginTop: px(10),
                                                        }}
                                                    />
                                                </EmptyTip>
                                            )
                                        ) : (
                                            <ActivityIndicator />
                                        )}
                                    </LinearGradient>
                                </ScrollView>
                            )
                        )}
                    </ScrollTabView>
                )}
            </View>
            <ChooseModal ref={chooseModal} onDone={handleAddProduct} maxCount={1} />
            {data?.share_info ? (
                <ShareModal
                    ref={shareModal}
                    shareContent={data?.share_info}
                    otherList={data?.share_button}
                    title={'更多'}
                />
            ) : null}
            <PublishContent community_id={community_id} />

            <Modalize ref={bottomModal} modalHeight={px(280)}>
                <View style={{alignItems: 'center', marginTop: px(64), marginBottom: px(14)}}>
                    <Image
                        source={require('~/assets/img/community/edit.png')}
                        style={{width: px(48), height: px(48)}}
                    />
                </View>
                <Text style={styles.pop_text}>{data?.bottom_pop?.content}</Text>
                <Button
                    onPress={() => {
                        bottomModal.current.close();
                        jump(data?.bottom_pop?.button?.url);
                    }}
                    title={data?.bottom_pop?.button?.text}
                    style={{marginTop: px(24), marginHorizontal: px(30)}}
                />
            </Modalize>
        </>
    );
};

export default CommunityHome;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width: deviceWidth,
        zIndex: 20,
    },

    listCon: {
        borderTopLeftRadius: px(20),
        borderTopRightRadius: px(20),
        marginTop: px(-30),
        flex: 1,
        backgroundColor: '#fff',
    },
    vName: {
        fontSize: px(18),
        lineHeight: px(25),
        marginBottom: px(6),
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
    },
    pop_text: {
        color: Colors.lightBlackColor,
        fontSize: px(13),
        lineHeight: px(19),
        textAlign: 'center',
    },
});
