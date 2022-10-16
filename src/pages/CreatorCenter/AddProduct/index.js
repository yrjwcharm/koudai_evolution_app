/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-14 18:10:01
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Style} from '~/common/commonStyle';
import FollowTable from './FollowTable';
import {isIphoneX, px} from '~/utils/appUtil';
import {getData, getList} from './services';
import ScrollableTabBar from './ScrollableTabBar';
import DetailModal from './DetailModal';
import {useSelector} from 'react-redux';

const page_size = 10;
const allNum = 100;
const AddProduct = ({route}) => {
    const {selections} = useSelector((state) => state.selectProduct);
    const [data, setData] = useState();
    const [list, setList] = useState([]);
    const [scrollLoading, setScrollLoading] = useState(false);
    const [scrollContentHeight, setScrollContentHeight] = useState(0);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [sortOption, setSortOption] = useState(0);
    const [page, setPage] = useState(1);
    const [bottomHeight, setBottomHeight] = useState(0);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const allScroll = useMemo(() => {
        return scrollContentHeight - scrollViewHeight;
    }, [scrollContentHeight, scrollViewHeight]);

    const isEnd = useMemo(() => {
        return list?.length && allNum - list.length;
    }, [list]);

    useEffect(() => {
        getData().then((res) => {
            console.log(res);
        });
    }, []);

    const getListData = () => {
        setScrollLoading(true);
        getList({
            page,
            page_size,
            // type:tabs[index]
            // ...{sortOption},
        }).finally((_) => {
            setScrollLoading(false);
        });
    };

    const onChangeOptionalTab = () => {
        setPage(1);
        getListData();
    };

    const onScroll = (y, idx) => {
        let restHeight = allScroll - y;
        if (!scrollLoading && restHeight && restHeight <= 50 && !isEnd) {
            setPage((_page) => _page++);
            setTimeout(() => {
                getListData();
            });
        }
    };

    const handleSort = useCallback((option) => {
        setSortOption(option);
        setTimeout(() => {
            getListData();
        });
    }, []);

    const onDetailModalClose = useCallback(() => {
        setDetailModalVisible(false);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.searchWrap}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.searchInput]}
                    onPress={() => {
                        // jump();
                    }}>
                    <FastImage
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/pk-search.png'}}
                        style={{width: px(18), height: px(18), marginLeft: px(2), marginRight: px(4)}}
                    />
                    <Text style={styles.searchPlaceHolder}>{'可通过搜索基金简称/代码/组合名称添加产品'}</Text>
                </TouchableOpacity>
                <View style={styles.selectHint}>
                    <FastImage
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/gth@3x.png'}}
                        style={styles.hintIcon}
                    />
                    <Text style={styles.hintText}>同一个分类下基金或组合只能有一种样式</Text>
                </View>
            </View>
            <View style={styles.selectCardWrap}>
                <ScrollableTabView
                    locked={true}
                    style={{flex: 1}}
                    renderTabBar={() => <ScrollableTabBar />}
                    initialPage={0}
                    onChangeTab={onChangeOptionalTab}>
                    {['自选', '已购'].map((item, idx) => (
                        <ScrollView
                            scrollIndicatorInsets={{right: 1}}
                            key={idx}
                            tabLabel={item}
                            style={{flex: 1}}
                            scrollEventThrottle={6}
                            onScroll={(e) => {
                                onScroll(e.nativeEvent.contentOffset.y, idx);
                            }}
                            onLayout={(e) => {
                                setScrollViewHeight(e.nativeEvent.layout.height);
                            }}
                            onContentSizeChange={(w, h) => {
                                setScrollContentHeight(h);
                            }}>
                            {/* <FollowTable
                                data={list}
                                handleSort={handleSort}
                            /> */}
                            {scrollLoading && <ActivityIndicator />}
                        </ScrollView>
                    ))}
                </ScrollableTabView>
            </View>
            <View
                style={styles.bottomWrap}
                onLayout={(e) => {
                    setBottomHeight(e.nativeEvent.layout.height);
                }}>
                <View style={Style.flexRow}>
                    <Text style={styles.normalText}>
                        最多添加{route.params.maxNum}个，已选
                        {selections.length ? '' : '0'}
                    </Text>
                    {selections.length > 0 ? <Text style={styles.blueText}>{selections.length}</Text> : null}
                    <Text style={styles.normalText}>个</Text>
                    {selections.length > 0 ? <Text style={styles.normalText}>，</Text> : null}
                    {selections.length > 0 ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={Style.flexRow}
                            onPress={() => {
                                setDetailModalVisible((val) => !val);
                            }}>
                            <Text style={styles.blueText}>查看明细</Text>
                            <Icon
                                color={'#0051CC'}
                                name={!detailModalVisible ? 'angle-up' : 'angle-down'}
                                size={px(14)}
                                style={{marginLeft: px(3)}}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!selections.length}
                    style={[styles.bottomBtn, {opacity: selections.length ? 1 : 0.3}]}>
                    <Text style={styles.bottomBtnText}>确定</Text>
                </TouchableOpacity>
            </View>
            {detailModalVisible ? <DetailModal bottom={bottomHeight} onClose={onDetailModalClose} /> : null}
        </View>
    );
};

export default AddProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrap: {
        padding: px(16),
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: px(146),
        paddingHorizontal: px(9),
        paddingVertical: px(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchPlaceHolder: {
        fontSize: px(12),
        color: '#545968',
        lineHeight: px(17),
    },
    selectHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(14),
    },
    hintIcon: {
        width: px(16),
        height: px(16),
        marginRight: px(2),
    },
    hintText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
    selectCardWrap: {
        flex: 1,
    },
    bottomWrap: {
        paddingVertical: px(12),
        paddingHorizontal: px(16),
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    normalText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121D3A',
    },
    blueText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
    bottomBtn: {
        borderRadius: px(6),
        backgroundColor: '#0051CC',
        paddingVertical: px(8),
        width: px(88),
    },
    bottomBtnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
        textAlign: 'center',
    },
});
