/*
 * @Date: 2022-06-21 14:36:43
 * @Author: dx
 * @Description: 基金首页
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Space} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {useJump} from '~/components/hooks';
import {AlbumCard, ProductList} from '~/components/Product';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, px} from '~/utils/appUtil';
import {getPageData} from './services';
import http from '~/services';
import LogView from '~/components/LogView';

/** @name 顶部菜单 */
const TopMenu = ({data = []}) => {
    const jump = useJump();
    return (
        <View style={styles.topMenuCon}>
            {data.map((item, index) => {
                const {icon, name, url} = item;
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={name + index}
                        onPress={() => {
                            global.LogTool({ctrl: index + 1, event: 'fund_clicktab'});
                            jump(url);
                        }}
                        style={styles.menuItemBox}>
                        <Image source={{uri: icon}} style={styles.menuIcon} />
                        <Text style={styles.menuItemText}>{name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const Index = ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const {nav, popular_subjects} = data;
    const [subjectLoading, setSubjectLoading] = useState(false); // 显示加载动画
    const [subjectData, setSubjectsData] = useState({});
    const [subjectList, setSubjectList] = useState([]);

    const pageRef = useRef(1);
    const subjectToBottomHeight = useRef(0);

    const subjectLoadingRef = useRef(false); // 为了流程控制

    const getData = (refresh) => {
        refresh === true && setRefreshing(true);
        getPageData()
            .then((res) => {
                if (res.code === '000000') {
                    const {search_btn, title = '基金'} = res.result;
                    navigation.setOptions({
                        headerRight: () =>
                            search_btn ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('search_click');
                                        jump(search_btn.url);
                                    }}
                                    style={{marginRight: Space.marginAlign}}>
                                    <Image
                                        source={{
                                            uri: search_btn.icon,
                                        }}
                                        style={{width: px(24), height: px(24)}}
                                    />
                                </TouchableOpacity>
                            ) : null,
                        title,
                    });
                    setData(res.result);
                    if (res.result?.popular_subjects) {
                        global.LogTool({
                            event: 'rec_show',
                            oid: res.result?.popular_subjects?.items?.[0]?.product_id,
                            plateid: res.result?.popular_subjects.plateid,
                            rec_json: res.result?.popular_subjects.rec_json,
                        });
                    }
                    // 获取专题
                    pageRef.current = 1;
                    getSubjects(res.result?.page_type);
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const getSubjects = (page_type) => {
        if (subjectLoadingRef.current) return;
        setSubjectLoading(true);
        subjectLoadingRef.current = true;
        http.get('/products/subject/list/20220901', {page_type, page: pageRef.current++}).then((res) => {
            if (res.code === '000000') {
                setSubjectLoading(false);
                setSubjectsData(res.result);
                let newList = res.result.items || [];
                setSubjectList((val) => (pageRef.current === 2 ? newList : val.concat(newList)));
                subjectLoadingRef.current = false;
                global.LogTool({
                    event: 'rec_show',
                    plateid: res.result.plateid,
                    rec_json: res.result.rec_json,
                });
            }
        });
    };

    const proScroll = useCallback(
        (e, cHeight, cScrollHeight) => {
            let resetHeight = cScrollHeight - cHeight;
            let y = e.nativeEvent.contentOffset.y;

            if (
                !subjectLoading &&
                subjectList?.[0] &&
                subjectData?.has_more &&
                resetHeight - y <= subjectToBottomHeight.current + 20
            ) {
                getSubjects(data.page_type);
            }
        },
        [subjectLoading, subjectList, subjectData, data]
    );

    useEffect(() => {
        getData();
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <LogView.Wrapper
                onScroll={proScroll}
                refreshControl={<RefreshControl onRefresh={() => getData(true)} refreshing={refreshing} />}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {nav ? (
                    <LinearGradient colors={['#fff', Colors.bgColor]} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                        <TopMenu data={nav} />
                    </LinearGradient>
                ) : null}
                {popular_subjects ? (
                    <View style={styles.swiperContainer}>
                        <View style={{backgroundColor: '#fff', borderRadius: Space.borderRadius}}>
                            <ProductList
                                data={popular_subjects.items}
                                type={popular_subjects?.type}
                                logParams={{
                                    event: 'rec_click',
                                    plateid: popular_subjects.plateid,
                                    rec_json: popular_subjects.rec_json,
                                }}
                                slideLogParams={{
                                    event: 'rec_slide',
                                    plateid: popular_subjects.plateid,
                                    rec_json: popular_subjects.rec_json,
                                }}
                            />
                        </View>
                    </View>
                ) : null}
                <View style={{backgroundColor: Colors.bgColor}}>
                    {subjectList?.map?.((subject, index, ar) => (
                        <View key={subject.id + index} style={{marginTop: px(12), paddingHorizontal: Space.padding}}>
                            <AlbumCard {...subject} />
                        </View>
                    ))}
                </View>
                {subjectLoading ? (
                    <View style={{paddingVertical: px(20)}}>
                        <ActivityIndicator color="#999" />
                    </View>
                ) : null}
                {/* {!subjectData?.has_more ? <Text style={{textAlign: 'center'}}>已经没有更多了</Text> : null} */}
                {/* subjectList以下的内容请写到这里，因为在计算其距底部的距离 */}
                <View
                    style={{backgroundColor: '#f5f6f8'}}
                    onLayout={(e) => {
                        subjectToBottomHeight.current = e.nativeEvent.layout.height;
                    }}>
                    <BottomDesc />
                </View>
            </LogView.Wrapper>
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topMenuCon: {
        paddingBottom: Space.padding,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: deviceWidth,
        overflow: 'hidden',
    },
    menuItemBox: {
        marginTop: Space.marginVertical,
        alignItems: 'center',
        width: '20%',
    },
    menuIcon: {
        width: px(26),
        height: px(26),
    },
    menuItemText: {
        marginTop: px(8),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    swiperContainer: {
        paddingHorizontal: Space.marginAlign,
    },
    dotStyle: {
        borderRadius: px(5),
        width: px(4),
        height: px(3),
        backgroundColor: 'rgba(18, 29, 58, 0.2)',
    },
    activeDotStyle: {
        width: px(12),
        backgroundColor: '#545968',
    },
    slider: {
        borderRadius: px(8),
        height: px(172),
        overflow: 'hidden',
        alignItems: 'center',
    },
    tagBox: {
        paddingHorizontal: px(8),
        borderBottomLeftRadius: px(4),
        justifyContent: 'center',
        height: px(22),
        backgroundColor: Colors.red,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    tagText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#fff',
    },
    underline: {
        width: px(64),
        height: px(8),
        backgroundColor: '#FFE9AD',
        position: 'absolute',
        right: px(56),
        bottom: px(1),
        left: px(56),
    },
    sliderTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    sliderBtn: {
        marginTop: Space.marginVertical,
        borderRadius: px(50),
        width: px(220),
        height: px(40),
        backgroundColor: '#E2BB7D',
    },
    profit: {
        fontSize: px(20),
        lineHeight: px(24),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    label: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    labelBox: {
        marginRight: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#AD9064',
        maxWidth: px(50),
    },
    labelText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#AD9064',
    },
    blocked: {
        marginTop: Space.marginVertical,
        marginHorizontal: -Space.marginAlign,
        width: deviceWidth,
        height: px(210),
    },
});

export default Index;
