/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-16 16:55:33
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {useJump} from '~/components/hooks';
import LogView from '~/components/LogView';
import {AlbumCard, ProductList} from '~/components/Product';
import http from '~/services';
import {px} from '~/utils/appUtil';
// import ConfirmPurpose from './ConfirmPurpose';

const PortfolioIndex = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [subjectLoading, setSubjectLoading] = useState(false); // 显示加载动画
    const [subjectData, setSubjectsData] = useState({});
    const [subjectList, setSubjectList] = useState([]);

    const pageRef = useRef(1);
    const subjectToBottomHeight = useRef(0);

    const subjectLoadingRef = useRef(false); // 为了流程控制

    const init = (refresh) => {
        refresh === true && setRefreshing(true);
        http.get('/products/portfolio/index/20220901', route?.params?.params)
            .then((res) => {
                if (res.code === '000000') {
                    const {title, search_btn} = res.result;
                    navigation.setOptions({
                        title: title || '组合',
                        headerRight: search_btn
                            ? () => (
                                  <TouchableOpacity
                                      style={[Style.flexRowCenter, {marginRight: Space.marginAlign}]}
                                      activeOpacity={0.8}
                                      onPress={() => {
                                          jump(search_btn.url);
                                      }}>
                                      <FastImage
                                          source={{
                                              uri: search_btn.icon,
                                          }}
                                          style={{width: px(24), height: px(24)}}
                                      />
                                  </TouchableOpacity>
                              )
                            : null,
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

    useEffect(() => {
        init();
    }, []);

    const genTopMenu = () => {
        return (
            <View style={styles.topMenu}>
                {data?.nav.map((item, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topMenuItem]}
                        key={idx}
                        onPress={() => {
                            jump(item.url);
                            global.LogTool({event: 'assort', ctrl: item.name});
                        }}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <FastImage
                                source={{
                                    uri: item.icon,
                                }}
                                style={styles.topMenuItemIcon}
                            />
                        </View>
                        <Text style={styles.topMenuItemText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
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

    return data ? (
        <View style={styles.container}>
            <LogView.Wrapper
                style={{flex: 1}}
                scrollIndicatorInsets={{right: 1}}
                onScroll={proScroll}
                refreshControl={<RefreshControl onRefresh={() => init(true)} refreshing={refreshing} />}>
                <LinearGradient colors={['#fff', Colors.bgColor]} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                    {data?.nav ? genTopMenu() : null}
                    {data?.popular_subjects ? (
                        <View style={styles.recommendCon}>
                            <ProductList
                                data={data?.popular_subjects.items}
                                type={data?.popular_subjects.type}
                                logParams={{
                                    event: 'rec_click',
                                    plateid: data?.popular_subjects.plateid,
                                    rec_json: data?.popular_subjects.rec_json,
                                }}
                                slideLogParams={{
                                    event: 'rec_slide',
                                    plateid: data?.popular_subjects.plateid,
                                    rec_json: data?.popular_subjects.rec_json,
                                }}
                            />
                        </View>
                    ) : null}
                </LinearGradient>
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
            {/* <ConfirmPurpose /> */}
        </View>
    ) : null;
};

export default PortfolioIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topMenu: {
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    topMenuItem: {
        width: px(68),
        marginTop: px(16),
    },
    topMenuItemIcon: {
        width: px(26),
        height: px(26),
    },
    topMenuItemText: {
        fontSize: px(11),
        color: '#121d3a',
        lineHeight: px(15),
        marginTop: px(8),
        textAlign: 'center',
    },
    recommendCon: {
        marginTop: px(12),
        marginHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
});
