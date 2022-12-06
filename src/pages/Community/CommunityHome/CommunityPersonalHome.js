// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:社区个人主页
// //  */
import {StyleSheet, Text, View, Animated, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '~/common/commonStyle';
import {getPersonalHomeData, getPersonaProductList} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
import {PublishContent, WaterfallFlowList} from '../CommunityIndex';
import Intro from './Intro';
import {ShareModal} from '../../../components/Modal';
import {ScrollTabView} from 'react-native-scroll-head-tab-view';

const CommunityPersonalHome = ({navigation, route, ...props}) => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(220); //头部大背景图
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {muid} = route?.params || {};
    const [data, setData] = useState();
    const [introHeight, setIntroHeight] = useState(0);
    const shareModal = useRef();
    const recommendList = useRef([]);

    const refresh = () => {
        recommendList.current[0]?.refresh?.();
    };
    const getData = async () => {
        let res = await getPersonalHomeData({muid});
        setData(res.result);
    };
    const getProductList = (params) => {
        return getPersonaProductList(params);
    };
    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        //当置顶变化时刷新
        const emitter = DeviceEventEmitter.addListener('articel_up_change', () => {
            refresh();
        });
        return () => {
            emitter?.remove?.();
        };
    }, []);
    const Header = () => {
        const animateOpacity = scrollY.interpolate({
            inputRange: [px(50), parallaxHeaderHeight - 100],
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
                        {data?.user_info?.name}
                    </Text>
                </Animated.View>
                {/* <TouchableOpacity
                    style={{width: px(40), position: 'absolute', right: px(16), top: inset.top}}
                    onPress={() => shareModal?.current?.show()}>
                    <Icon name="ellipsis1" size={px(30)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity> */}
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
                        style={{backgroundColor: Colors.bgColor}}
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
                            uri: data?.user_info?.bg_img || data?.user_info?.avatar,
                            style: {
                                height: parallaxHeaderHeight,
                                backgroundColor: 'rgba(18, 29, 58, 0.5)',
                            },
                        }}
                        renderScrollHeader={() => {
                            return (
                                <>
                                    <CommunityHomeHeader
                                        data={data?.user_info}
                                        item_type={10}
                                        item_id={muid}
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
                            <WaterfallFlowList
                                key={index}
                                ref={(flow) => (recommendList.current[index] = flow)}
                                tabLabel={name}
                                contentContainerStyle={{marginTop: px(12)}}
                                getData={getProductList}
                                params={{muid, type: type}}
                            />
                        ))}
                    </ScrollTabView>
                )}
            </View>
            {data?.share_info ? (
                <ShareModal
                    ref={shareModal}
                    otherList={data?.share_button}
                    shareContent={data?.share_info}
                    title={'更多'}
                />
            ) : null}
            <PublishContent community_id={0} muid={muid} />
        </>
    );
};

export default CommunityPersonalHome;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width: deviceWidth,
        zIndex: 20,
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
        textAlign: 'center',
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
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});
