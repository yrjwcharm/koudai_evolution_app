/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-01-29 17:11:34
 * @Description:交易记录
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, DeviceEventEmitter} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../../components/TabBar.js';
import ScrollTabbar from '~/components/ScrollTabbar.js';
import http from '../../services/index.js';
import EmptyTip from '../../components/EmptyTip';
import {Colors, Style, Font, Space} from '../../common/commonStyle.js';
import {px, tagColor} from '../../utils/appUtil.js';
import {useJump} from '../../components/hooks';
import Toast from '../../components/Toast/Toast.js';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {debounce} from 'lodash';

const TradeRecord = ({route, navigation}) => {
    const {adjust_name, fr = '', fund_code = '', poid = '', prod_code = '', tabActive: active = 0} = route.params || {};
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [tabActive, setActiveTab] = useState(active || 0);
    const offset = useRef('');
    const jump = useJump();
    const isMfb = fr == 'mfb';
    const scrollTab = useRef();
    const tradeType = useRef([0, -1, -2, -35, 6, 4, 7]);
    const mfbType = useRef([0, 1, 2]);
    const getData = useCallback(
        (_page, toast) => {
            let Page = _page || page;
            setLoading(true);
            http.get(isMfb ? 'wallet/records/20210101' : '/order/records/20210101', {
                type: isMfb ? mfbType.current[tabActive] : tradeType.current[tabActive],
                page: Page,
                poid,
                prod_code,
                fund_code,
                offset: offset.current,
            })
                .then((res) => {
                    setHasMore(res.result.has_more);
                    offset.current = res.result.next_offset;
                    setLoading(false);
                    if (toast) {
                        Toast.show('交易记录已更新', {duration: 500});
                    }
                    if (Page == 1) {
                        setData(res.result.list);
                    } else {
                        setData((prevData) => {
                            return prevData.concat(res?.result?.list);
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [page, tabActive]
    );
    useEffect(() => {
        if (fund_code) {
            tradeType.current = [0, -2, -35, 4, 7];
        }
    }, []);
    useEffect(() => {
        active !== 0 && scrollTab.current?.goToPage(active);
    }, [active]);
    useEffect(() => {
        getData();
    }, [getData]);
    useEffect(() => {
        http.get('/order/others/20210101', {fr: fr === 'mfb' ? 'wallet' : fr || '', fund_code, poid}).then((res) => {
            if (res.code === '000000') {
                res.result.adviser_fee &&
                    navigation.setOptions({
                        headerRight: () => (
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.topRightBtn, Style.flexCenter]}
                                    onPress={() => jump(res.result.adviser_fee.url)}>
                                    <Text style={styles.title}>{res.result.adviser_fee.text}</Text>
                                </TouchableOpacity>
                            </>
                        ),
                    });
            }
        });
    }, []);
    useEffect(() => {
        let listen = DeviceEventEmitter.addListener('cancleOrder', () => {
            setRefresh(true);
        });
        return () => {
            listen && listen.remove();
        };
    }, []);
    useFocusEffect(
        useCallback(() => {
            if (refresh) {
                offset.current = '';
                getData(1);
                setPage(1);
            }
        }, [refresh])
    );
    const onLoadMore = ({distanceFromEnd}) => {
        if (distanceFromEnd < 100) {
            return;
        }
        if (hasMore) {
            setPage((prev) => {
                return prev + 1;
            });
        }
    };
    const onRefresh = () => {
        offset.current = '';
        getData(1, 'toast');
        setPage(1);
        // setPage(1);
    };
    const changeTab = (obj) => {
        offset.current = '';
        setData([]);
        setHasMore(false);
        setActiveTab((_active) => {
            if (_active == obj.i && page == 1) getData(1);
            return obj.i;
        });
        setPage(1);
    };

    const tradeStuatusColor = (status) => {
        if (status < 0) {
            return Colors.red;
        } else if (status == 0 || status == 1) {
            return Colors.orange;
        } else if (status == 5 || status == 6) {
            return Colors.green;
        } else {
            return Colors.defaultColor;
        }
    };

    const handlerName = (val = '') => {
        if (val.length > 12) {
            val = val.slice(0, 10) + '...' + val.slice(-2);
        }
        return val;
    };

    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingVertical: px(6)}]}>
                {hasMore ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4)}}>正在加载...</Text>
                    </>
                ) : (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(16)}}>我们是有底线的...</Text>
                )}
            </View>
        );
    };
    const renderItem = ({item}) => {
        return (
            item && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.card}
                    key={item?.time}
                    onPress={() => {
                        setRefresh(false);
                        jump(item.url);
                    }}>
                    <View style={{paddingHorizontal: Space.padding}}>
                        <View style={Style.flexBetween}>
                            <View style={Style.flexRow}>
                                <View
                                    style={[
                                        Style.tag,
                                        {marginRight: px(6), backgroundColor: tagColor(item?.type?.val).bg_color},
                                    ]}>
                                    <Text style={{fontSize: px(11), color: tagColor(item?.type?.val).text_color}}>
                                        {item?.type?.text}
                                    </Text>
                                </View>
                                <Text style={styles.title}>{handlerName(item.name)}</Text>
                            </View>
                            <Text style={styles.date}>{item.time}</Text>
                        </View>
                        <View style={[Style.flexRow, {paddingVertical: px(13)}]}>
                            {item?.items.map((_item, _index, arr) => (
                                <View
                                    key={_index}
                                    style={{
                                        flex: 1,
                                        alignItems:
                                            _index === 0
                                                ? 'flex-start'
                                                : _index === arr.length - 1
                                                ? 'flex-end'
                                                : 'center',
                                    }}>
                                    <Text style={styles.light_text}>{_item.k}</Text>
                                    <Text
                                        style={[
                                            styles.num_text,
                                            {
                                                fontFamily: _index != item?.items.length - 1 ? Font.numMedium : null,
                                                color:
                                                    _index == item?.items.length - 1
                                                        ? tradeStuatusColor(_item.v.val)
                                                        : Colors.defaultColor,
                                            },
                                        ]}>
                                        {_index == item?.items.length - 1 ? (
                                            <Text>{_item.v.text}</Text>
                                        ) : (
                                            <Text>{_item.v}</Text>
                                        )}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {item.notice ? (
                            <View style={styles.notice}>
                                <Text style={styles.notice_text}>{item.notice}</Text>
                            </View>
                        ) : null}
                    </View>
                    {item.error_msg ? (
                        <View style={styles.errorMsgBox}>
                            <Text style={styles.errorMsg}>
                                {item.error_msg}&nbsp;
                                <Icon name={'angle-right'} size={px(14)} color={Colors.red} />
                            </Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            )
        );
    };

    const renderContent = () => {
        return (
            <FlatList
                data={data}
                ListEmptyComponent={!loading && <EmptyTip text={'暂无记录'} />}
                renderItem={renderItem}
                ListFooterComponent={!loading && data?.length > 0 && ListFooterComponent}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={debounce(onLoadMore, 500)}
                refreshing={loading}
                onRefresh={onRefresh}
            />
        );
    };

    return (
        <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
            {isMfb ? (
                <ScrollableTabView
                    onChangeTab={changeTab}
                    renderTabBar={() => <TabBar />}
                    ref={scrollTab}
                    initialPage={0}>
                    <View tabLabel="全部" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="转入" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="转出" style={styles.container}>
                        {renderContent()}
                    </View>
                </ScrollableTabView>
            ) : (
                <ScrollableTabView
                    onChangeTab={changeTab}
                    renderTabBar={() => <ScrollTabbar boxStyle={{backgroundColor: '#fff', paddingLeft: px(8)}} />}
                    initialPage={0}
                    ref={scrollTab}
                    onScroll={(a) => {
                        // console.log(a);
                    }}>
                    <View tabLabel="全部" style={styles.container}>
                        {renderContent()}
                    </View>
                    {!fund_code ? (
                        <View tabLabel="投顾服务" style={styles.container}>
                            {renderContent()}
                        </View>
                    ) : null}
                    <View tabLabel="升级" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="申购" style={styles.container}>
                        {renderContent()}
                    </View>
                    {!fund_code ? (
                        <View tabLabel={adjust_name || '调仓'} style={styles.container}>
                            {renderContent()}
                        </View>
                    ) : null}
                    <View tabLabel="赎回" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="分红" style={styles.container}>
                        {renderContent()}
                    </View>
                </ScrollableTabView>
            )}
        </View>
    );
};

export default TradeRecord;

const styles = StyleSheet.create({
    topRightBtn: {
        flex: 1,
        marginRight: Space.marginAlign,
    },
    container: {backgroundColor: Colors.bgColor, flex: 1, paddingBottom: px(10)},
    card: {
        backgroundColor: '#fff',
        marginTop: px(12),
        paddingTop: px(16),
        borderRadius: Space.borderRadius,
        marginHorizontal: px(16),
        overflow: 'hidden',
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightGrayColor,
        marginBottom: px(3),
    },
    num_text: {
        fontSize: px(13),
        lineHeight: px(16),
    },
    notice: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    notice_text: {
        fontSize: px(12),
        color: Colors.lightGrayColor,
        height: px(36),
        lineHeight: px(36),
    },
    errorMsgBox: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
    },
    errorMsg: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.red,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
});
