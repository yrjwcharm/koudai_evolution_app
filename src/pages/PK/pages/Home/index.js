/* eslint-disable react-hooks/exhaustive-deps */
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
import {copilot, CopilotStep} from 'react-native-copilot';
import TooltipComponent from './TooltipComponent';

const handlerItemsLog = (items, data) => {
    items?.forEach?.((obj) => {
        obj.LogTool = () => {
            global.LogTool(obj.code ? 'pk_details' : 'pk_combinationdetails', '', obj.code || obj.plan_id);
        };
        if (obj.button)
            obj.button.LogTool = (notActive) => {
                notActive && global.LogTool(obj.code ? 'pk_ratio' : 'pk_focus', '', obj.code || obj.plan_id);
            };
    });
};

const PKHome = ({navigation, start, copilotEvents}) => {
    const insets = useSafeAreaInsets();
    const dimensions = useWindowDimensions();
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo);
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState(null);
    const [recommendIndex, setRecommendIndex] = useState(0);

    const isFirst = useRef(1);
    const listLayout = useRef({});
    const scrollViewRef = useRef();
    const isFocusedRef = useRef(isFocused);
    const showCopilot = useRef(false);

    const getData = (type) => {
        type === 0 && setRefreshing(true);
        type === 1 && setLoading(true);
        getPKHomeData()
            .then((res) => {
                if (res.code === '000000') {
                    listLayout.current.status = true;
                    setData(res.result);
                    res.result.sub_list.forEach((item) => {
                        handlerListLog(item, res.result);
                    });

                    if (userInfo.toJS().is_login && res.result?.is_guide_page === 1) {
                        showCopilot.current = true;
                    }

                    setTimeout(() => {
                        if (isFocusedRef.current && showCopilot.current) {
                            start?.(false, scrollViewRef.current);
                            showCopilot.current = false;
                        }
                    }, 10);
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
        isFocusedRef.current = isFocused;
        const unsubscribe = navigation.addListener('tabPress', () => {
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
            let code = cur.items[recommendIndex]?.map?.((item) => item.code)?.join?.();
            global.LogTool({event: 'rec_show', plateid: data.plateid, rec_json: data.rec_json}, null, code);
        }
    };

    const handlerListLog = (item, data) => {
        if (item.items)
            handlerItemsLog(
                item.items.reduce((memo, cur) => memo.concat(cur), []),
                data
            );
        if (item.tab_list) {
            item.tab_list.forEach((itm) => {
                handlerItemsLog(itm.items, data);
            });
        }
    };

    const HeaderRight = () => {
        return (
            <TouchableOpacity
                style={Style.flexRowCenter}
                activeOpacity={0.8}
                onPress={() => {
                    let len = data?.sub_list?.[0]?.items.length;
                    setRecommendIndex((val) => {
                        let newVal = val + 1;
                        if (newVal > len - 1) newVal = 0;

                        // 埋点
                        global.LogTool({event: 'chenge_click', plateid: data.plateid, rec_json: data.rec_json});

                        return newVal;
                    });
                }}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/exchange-dollar-fill.png'}}
                    style={{width: px(12), height: px(12), marginRight: px(3)}}
                />
                <Text style={{fontSize: px(12), lineHeight: px(17), color: '#545968'}}>换一换</Text>
            </TouchableOpacity>
        );
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
                        {/* pkCard */}
                        {data?.pk_list && (
                            <CopilotStep order={1} name="pkCard">
                                <PKCard data={data?.pk_list} />
                            </CopilotStep>
                        )}
                        <View style={{paddingHorizontal: Space.padding}}>
                            {data?.sub_list?.map?.((item, index) => {
                                return (
                                    <RenderPart
                                        data={
                                            index === 0
                                                ? {title: item.title, items: item.items?.[recommendIndex]}
                                                : item
                                        }
                                        key={item.title + index}
                                        HeaderRight={index === 0 ? HeaderRight : null}
                                        tabsStyle={{flex: 1}}
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
                <CopilotStep order={2} name="pkBall">
                    <PKBall copilotEvents={copilotEvents} />
                </CopilotStep>
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

const _PKHome = copilot({
    overlay: 'svg',
    animated: true,
    backdropColor: 'rgba(30,30,32,0.8)',
    tooltipComponent: TooltipComponent,
    stepNumberComponent: () => null,
    arrowColor: 'transparent',
    tooltipStyle: {
        backgroundColor: 'transparent',
        width: '100%',
    },
    contentPadding: 0,
})(PKHome);
export default withNetState(_PKHome);
