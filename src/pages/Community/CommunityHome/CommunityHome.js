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
import {Colors} from '~/common/commonStyle';
import {getCommunityHomeData, getCommunityProductList, removeProduct, addProduct} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
import Intro from './Intro';
import {PublishContent} from '../CommunityIndex';
import {CommunityCard} from '../components/CommunityCard';
import ProductCards from '../../../components/Portfolios/ProductCards';
import {Modal, ShareModal} from '../../../components/Modal';
import EmptyTip from '../../../components/EmptyTip';
import {Button} from '../../../components/Button';
import {ChooseModal} from '../CommunityVodCreate';
import {ScrollTabView, FlatList, ScrollView} from 'react-native-scroll-head-tab-view';
import {useFocusEffect} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {useJump} from '~/components/hooks';
import CommunityHomeList from './CommunityHomeList';
const CommunityHome = ({navigation, route}) => {
    const jump = useJump();
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(220);
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {community_id = 1, history_id, muid = 0} = route?.params || {};
    const [data, setData] = useState();
    const [product, setProduct] = useState();
    const currentTab = useRef();
    const shareModal = useRef();
    const chooseModal = useRef();
    const [introHeight, setIntroHeight] = useState(0);
    const [loading, setLoading] = useState(true);
    const page = useRef(1);
    const loadMoreIng = useRef(false);
    const hasMore = useRef(true);
    const bottomModal = useRef();
    const ListRef = useRef();
    const page_size = 20;
    const getHomeData = async () => {
        let res = await getCommunityHomeData({community_id, history_id});
        setData(res.result);
        if (res.result?.bottom_pop) {
            setTimeout(() => {
                bottomModal?.current?.open();
            }, 200);
        }
    };
    const getProData = (params) => {
        return getCommunityProductList(params);
    };
    // console.log(page);
    // const getProductList = async (params) => {
    //     try {
    //         let res = await getCommunityProductList({...params, page_size});
    //         setLoading(false);
    //         loadMoreIng.current = false;
    //         if (params.page == 1) {
    //             setProduct(res.result);
    //         } else {
    //             setProduct((prev) => prev.concat(res.result));
    //         }
    //         if (res.result?.length < page_size) {
    //             hasMore.current = false;
    //         } else {
    //             hasMore.current = true;
    //         }
    //     } catch (error) {
    //         loadMoreIng.current = false;
    //     }
    // };
    useFocusEffect(
        useCallback(() => {
            getHomeData();
        }, [])
    );

    //添加
    const handleAddProduct = async (_data) => {
        if (_data?.length > 0) {
            let item_id = _data?.map((item) => item.id).join(',');
            let res = await addProduct({community_id, item_id, type: _data[0]?.relation_type});
            if (res.code == '000000') {
                ListRef.current?.refresh();
            }
        }
    };
    const onEndReached = () => {
        if (!hasMore.current) return;
        // const event = evt.nativeEvent;
        // // 如果拖拽值超过底部50，且当前的scrollview高度大于屏幕高度，则加载更多
        // const _num = event.contentSize.height - event.layoutMeasurement.height - event.contentOffset.y;
        // if (event.contentSize.height > event.layoutMeasurement.height && _num < 50) {
        // loadMoreIng.current = true;
        page.current = page.current + 1;
        getProData();
        //     console.log('上拉，加载更多评论');
        // }
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
    return data ? (
        <>
            <Header />
            <View style={{flex: 1}}>
                {data?.tabs?.length && (
                    <ScrollTabView
                        headerHeight={parallaxHeaderHeight + introHeight - px(30)}
                        insetValue={headerHeight}
                        style={{backgroundColor: '#fff', flex: 1}}
                        // onChangeTab={({i}) => {
                        //     getProductList({community_id, type: data?.tabs[i]?.type, page: 1});
                        //     currentTab.current = data?.tabs[i]?.type;
                        // }}
                        onContentScroll={(e) => {
                            scrollY.setValue(e.value);
                            if (e.value > 80) {
                                setParallTitle(true);
                            } else {
                                setParallTitle(false);
                            }
                        }}
                        renderTabBar={(_props) => (
                            <ScrollTabbar {..._props} container="View" boxStyle={{backgroundColor: Colors.bgColor}} />
                        )}
                        renderScrollHeaderBg={{
                            uri: data?.community_info?.bg_img || data?.community_info?.avatar,
                            style: {
                                height: parallaxHeaderHeight,
                                backgroundColor: 'rgba(18, 29, 58, 0.5)',
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
                        {data?.tabs?.map(
                            ({name, type}, index) => (
                                <CommunityHomeList
                                    tabLabel={name}
                                    key={index}
                                    getData={getProData}
                                    ref={ListRef}
                                    params={{community_id, type, page_size}}>
                                    {type == 1 ? (
                                        <EmptyTip
                                            desc={data?.show_add_btn ? '请点击按钮进行添加' : ''}
                                            text={'暂无相关作品'}
                                            imageStyle={{marginBottom: px(-30)}}>
                                            {data?.show_add_btn && (
                                                <Button
                                                    onPress={() => {
                                                        chooseModal?.current?.show('article', data);
                                                    }}
                                                    title="添加作品"
                                                    style={styles.addBtn}
                                                    textStyle={{fontSize: px(13)}}
                                                />
                                            )}
                                        </EmptyTip>
                                    ) : (
                                        <EmptyTip
                                            desc={data?.show_add_btn ? '请点击按钮进行添加' : ''}
                                            text={'暂无相关产品'}
                                            imageStyle={{marginBottom: px(-30)}}>
                                            {data?.show_add_btn && (
                                                <Button
                                                    onPress={() => {
                                                        chooseModal?.current?.show('all', data);
                                                    }}
                                                    title="添加产品"
                                                    style={styles.addBtn}
                                                    textStyle={{fontSize: px(13)}}
                                                />
                                            )}
                                        </EmptyTip>
                                    )}
                                </CommunityHomeList>
                                // <FlatList
                                //     keyExtractor={(item) => item.id}
                                //     style={{flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)}}
                                //     // _onScroll={onScoll}
                                //     tabLabel={tab?.name}
                                //     data={product}
                                //     onEndReached={onEndReached}
                                //     onEndReachedThreshold={0.5}
                                //     renderItem={({item}) => {
                                //         return tab.type == 1 ? (
                                //             <CommunityCard key={item.id} data={item} onDelete={onDelete} />
                                //         ) : (
                                //             <ProductCards key={item.id} data={item} onDelete={onDelete} />
                                //         );
                                //     }}>
                                //     {!loading ? (
                                //         product?.length ? (
                                //             product?.map((_data) => (
                                //                 <CommunityCard key={_data.id} data={_data} onDelete={onDelete} />
                                //             ))
                                //         ) : (
                                //             <EmptyTip
                                //                 desc={data?.show_add_btn ? '请点击按钮进行添加' : ''}
                                //                 text={'暂无相关作品'}
                                //                 imageStyle={{marginBottom: px(-30)}}>
                                //                 {data?.show_add_btn && (
                                //                     <Button
                                //                         onPress={() => {
                                //                             chooseModal?.current?.show('article', product);
                                //                         }}
                                //                         title="添加作品"
                                //                         style={styles.addBtn}
                                //                         textStyle={{fontSize: px(13)}}
                                //                     />
                                //                 )}
                                //             </EmptyTip>
                                //         )
                                //     ) : (
                                //         <ActivityIndicator />
                                //     )}
                                // </FlatList>
                            )

                            // <ScrollView
                            //     key={index}
                            //     style={{flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)}}
                            //     tabLabel={tab?.name}>
                            //     {!loading ? (
                            //         product?.length ? (
                            //             product?.map((_data) => (
                            //                 <ProductCards key={_data.id} data={_data} onDelete={onDelete} />
                            //             ))
                            //         ) : (
                            //             <EmptyTip
                            //                 desc={data?.show_add_btn ? '请点击按钮进行添加' : ''}
                            //                 text={'暂无相关产品'}
                            //                 imageStyle={{marginBottom: px(-30)}}>
                            //                 {data?.show_add_btn && (
                            //                     <Button
                            //                         onPress={() => {
                            //                             chooseModal?.current?.show('all', product);
                            //                         }}
                            //                         title="添加产品"
                            //                         style={styles.addBtn}
                            //                         textStyle={{fontSize: px(13)}}
                            //                     />
                            //                 )}
                            //             </EmptyTip>
                            //         )
                            //     ) : (
                            //         <ActivityIndicator />
                            //     )}
                            // </ScrollView>
                        )}
                    </ScrollTabView>
                )}
            </View>
            <ChooseModal ref={chooseModal} onDone={handleAddProduct} />
            {data?.share_info ? (
                <ShareModal
                    ref={shareModal}
                    noShare={true}
                    shareContent={data?.share_info}
                    otherList={data?.share_button}
                    title={'更多'}
                />
            ) : null}
            <PublishContent
                community_id={community_id}
                history_id={history_id}
                muid={muid}
                handleClick={(type) => {
                    setTimeout(() => {
                        chooseModal?.current?.show(type, product);
                    }, 100);
                }}
            />

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
    ) : null;
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
        backgroundColor: Colors.bgColor,
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
    addBtn: {
        width: px(180),
        height: px(36),
        borderRadius: px(100),
        marginTop: px(16),
    },
});
