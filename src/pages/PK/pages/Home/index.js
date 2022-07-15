import React, {useCallback, useState, useRef, useEffect} from 'react';
import {DeviceEventEmitter, View, StyleSheet, Text, RefreshControl, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Space, Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import PKCard from './PKCard';
import {getPKHomeData} from '../../services';
import Toast from '../../../../components/Toast';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import BottomDesc from '../../../../components/BottomDesc';
import PKBall from '../../components/PKBall';
import {useJump} from '~/components/hooks';
import RenderPart from '~/pages/PublicOfferingOfFund/pages/Index/RenderPart';
import Loading from '~/pages/Portfolio/components/PageLoading';
import LoginMask from '~/components/LoginMask';
import {useSelector} from 'react-redux';
import withNetState from '~/components/withNetState';

const handlerItemsLog = (items, data) => {
    items?.forEach?.((obj) => {
        obj.LogTool = () => {
            global.LogTool(obj.code ? 'pk_details' : 'pk_combinationdetails');
        };
        obj.button.LogTool = (notActive) => {
            notActive && global.LogTool(obj.code ? 'pk_ratio' : 'pk_focus', obj.code || obj.plan_id);
            notActive &&
                global.LogTool(
                    {
                        event: 'rec_click',
                        rec_json: data.rec_json,
                        plateid: data.plateid,
                    },
                    null,
                    items?.map?.((t) => t.code || t.plan_id)?.join?.()
                );
        };
    });
};

const PKHome = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const dimensions = useWindowDimensions();
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo);
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState(null);

    const isFirst = useRef(1);
    const listLayout = useRef({});
    const scrollViewRef = useRef();

    const getData = (type) => {
        type === 0 && setRefreshing(true);
        type === 1 && setLoading(true);
        getPKHomeData()
            .then((res) => {
                if (res.code === '000000') {
                    listLayout.current.status = true;
                    setData(res.result);
                } else {
                    Toast.show(res.message);
                }
            })
            .finally((_) => {
                setRefreshing(false);
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getData(isFirst.current++);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const listener = DeviceEventEmitter.addListener('attentionRefresh', getData);
            return () => {
                listener.remove();
            };
        }, [])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            if (isFocused) {
                getData(0);
                scrollViewRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                global.LogTool('tabDoubleClick', 'PKHome');
            }
        });
        return () => unsubscribe();
    }, [isFocused, navigation]);

    const handleScroll = (e) => {
        handlerShowLog(e.nativeEvent.contentOffset.y + dimensions.height);
    };

    const handlerShowLog = (y) => {
        if (listLayout.current.status && y > listLayout.current.start) {
            listLayout.current.status = false;
            let cur = data.sub_list[0];
            let code = cur.items?.map?.((item) => item.code)?.join?.();
            global.LogTool({event: 'rec_show', plateid: data.plateid, rec_json: data.rec_json}, null, code);
        }
    };

    const handlerListLog = (item) => {
        if (item.items) handlerItemsLog(item.items, data);
        if (item.tab_list) {
            item.tab_list.forEach((itm) => {
                handlerItemsLog(itm.items, data);
            });
        }
    };
    const handlerPress = () => {
        jump({path: 'UpgradeDetail'});
    };
    return loading ? (
        <Loading />
    ) : (
        <>
            <View style={[styles.container, {paddingTop: insets.top}]}>
                {/* search */}
                <View style={[styles.searchWrap]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.searchBg, Style.flexCenter]}
                        onPress={() => {
                            global.LogTool('PK_Search');
                            jump(data?.search_button?.url);
                        }}>
                        <View style={Style.flexRowCenter}>
                            <FastImage
                                source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/pk-search.png'}}
                                style={{width: px(18), height: px(18), marginRight: px(4)}}
                            />
                            <Text style={styles.searchPlaceHolder}>{data?.search_box_content}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* scrollView */}
                <ScrollView
                    style={{flex: 1}}
                    scrollEventThrottle={6}
                    onScroll={handleScroll}
                    ref={scrollViewRef}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData(0)} />}
                    showsVerticalScrollIndicator={false}
                    scrollIndicatorInsets={{right: 1}}>
                    {/* topmenu */}
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 0.2}}
                        colors={['#fff', '#F4F5F7']}
                        style={{flex: 1}}>
                        <View style={styles.topMenu}>
                            {data?.tabs?.map((item, idx) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('pk_clicktab', item.text);
                                        jump(item.url);
                                    }}
                                    key={idx}
                                    style={styles.menuItem}>
                                    <FastImage
                                        source={{uri: item.icon}}
                                        resizeMode="contain"
                                        style={styles.topMenuIcon}
                                    />
                                    <Text style={styles.topMenuText}>{item.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={{height: 50, textAlign: 'center'}} onPress={handlerPress}>
                            升级详情
                        </Text>
                        {/* pkCard */}
                        {data?.pk_list && <PKCard data={data?.pk_list} />}
                        <View style={{paddingHorizontal: Space.padding}} key={data?.sub_list}>
                            {data?.sub_list?.map?.((item, index) => {
                                handlerListLog(item);
                                return (
                                    <RenderPart
                                        data={item}
                                        key={item.title + index}
                                        onLayout={
                                            index === 0
                                                ? (layout) => {
                                                      const {y, height} = layout;
                                                      listLayout.current = {
                                                          start: y + height / 2,
                                                          status: true,
                                                      };
                                                      handlerShowLog(dimensions.height);
                                                  }
                                                : null
                                        }
                                    />
                                );
                            })}
                        </View>
                        {/* bottomDesc */}
                        <BottomDesc />
                    </LinearGradient>
                </ScrollView>
                <PKBall />
            </View>
            {!userInfo.toJS().is_login && <LoginMask />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchWrap: {
        paddingVertical: px(6),
        paddingHorizontal: px(21),
        // paddingBottom: px(19),
        alignSelf: 'center',
        width: '100%',
        backgroundColor: '#fff',
    },
    searchBg: {
        backgroundColor: '#F2F3F5',
        paddingVertical: px(8),
        borderRadius: px(146),
    },
    searchPlaceHolder: {
        fontSize: px(13),
        color: '#545968',
        lineHeight: px(18),
    },
    topMenu: {
        marginTop: px(15),
        paddingHorizontal: px(13),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    menuItem: {
        alignItems: 'center',
        minWidth: px(48),
        justifyContent: 'center',
    },
    topMenuIcon: {
        width: px(32),
        height: px(32),
        alignSelf: 'center',
    },
    topMenuText: {
        marginTop: px(4),
        fontSize: px(12),
        color: '#3d3d3d',
        lineHeight: px(18),
        textAlign: 'center',
    },
    listWrap: {
        marginTop: px(16),
        paddingHorizontal: px(16),
    },
    listTitle: {
        color: '#121D3A',
        fontSize: px(18),
        lineHeight: px(25),
        fontWeight: '600',
        marginBottom: px(12),
    },
    loadingMask: {
        width: '100%',
        paddingTop: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 1,
    },
});
export default withNetState(PKHome);
