/*
 * @Date: 2022-10-09 14:35:24
 * @Description:社区主页
 */
import {StyleSheet, Text, View, Animated, TouchableOpacity, Image, DeviceEventEmitter} from 'react-native';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '~/common/commonStyle';
import {getCommunityHomeData, getCommunityProductList} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
import Intro from './Intro';
import {ShareModal} from '../../../components/Modal';
import {Button} from '../../../components/Button';
import {ScrollTabView} from 'react-native-scroll-head-tab-view';
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
    const shareModal = useRef();
    const [introHeight, setIntroHeight] = useState(0);
    const bottomModal = useRef();
    const recommendList = useRef([]);
    const refresh = () => {
        recommendList.current[0]?.refresh?.();
        recommendList.current[1]?.refresh?.();
    };
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
    useEffect(() => {
        //当删除时刷新
        const emitter = DeviceEventEmitter.addListener('community_product_change', () => {
            refresh();
        });
        return () => {
            emitter?.remove?.();
        };
    }, []);
    useFocusEffect(
        useCallback(() => {
            getHomeData();
        }, [])
    );

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
                        {data?.tabs?.map(({name, type}, index) => (
                            <CommunityHomeList
                                ref={(flow) => (recommendList.current[index] = flow)}
                                tabLabel={name}
                                key={index}
                                getData={getProData}
                                muid={muid}
                                show_add_btn={data?.show_add_btn}
                                history_id={history_id}
                                params={{community_id, type}}
                                emptyStyle={{marginTop: parallaxHeaderHeight + introHeight - px(30)}}
                            />
                        ))}
                    </ScrollTabView>
                )}
            </View>
            {data?.share_info ? (
                <ShareModal
                    ref={shareModal}
                    noShare={true}
                    shareContent={data?.share_info}
                    otherList={data?.share_button}
                    title={'更多'}
                />
            ) : null}

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
            {/* <CommunityFooter /> */}
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
});
