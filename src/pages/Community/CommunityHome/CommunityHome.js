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
const CommunityHome = ({navigation, route}) => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(130);
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {community_id = 1} = route?.params || {};
    const [data, setData] = useState();
    const [product, setProduct] = useState();
    const currentTab = useRef();
    const shareModal = useRef();
    const chooseModal = useRef();
    const getData = async () => {
        let res = await getCommunityHomeData({community_id});
        currentTab.current = res.result?.tabs[0]?.type;
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
                    item_type={11}
                    item_id={community_id}
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
                            onChangeTab={({i}) => {
                                currentTab.current = data?.tabs[i].type;
                                getProductList({community_id, type: data?.tabs[i].type});
                            }}>
                            {data?.tabs?.map((tab, index) =>
                                tab.type == 1 ? (
                                    <View key={index} style={{flex: 1, paddingHorizontal: px(16)}} tabLabel={tab?.name}>
                                        {product?.length ? (
                                            product?.map((_data) => (
                                                <CommunityFollowCard key={_data.id} {..._data} onDelete={onDelete} />
                                            ))
                                        ) : (
                                            <EmptyTip
                                                desc="请点击按钮进行添加"
                                                text="暂无相关作品"
                                                imageStyle={{marginBottom: px(-30)}}>
                                                <Button
                                                    onPress={() => chooseModal?.current?.show('article', product)}
                                                    title="添加作品"
                                                    style={{width: px(180), borderRadius: px(100), marginTop: px(10)}}
                                                />
                                            </EmptyTip>
                                        )}
                                    </View>
                                ) : (
                                    <View key={index} style={{flex: 1, paddingHorizontal: px(16)}} tabLabel={tab?.name}>
                                        {product?.length ? (
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
                                                    style={{width: px(180), borderRadius: px(100), marginTop: px(10)}}
                                                />
                                            </EmptyTip>
                                        )}
                                    </View>
                                )
                            )}
                        </ScrollableTabView>
                    </LinearGradient>
                ) : null}
            </Animated.ScrollView>

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
