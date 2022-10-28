/*
 * @Description: 社区合集
 * @Autor: wxp
 * @Date: 2022-10-10 14:04:29
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {getData, getList} from './services';
import {useJump} from '~/components/hooks';

const CommunityCollection = ({route}) => {
    const jump = useJump();

    const [data, setData] = useState();
    const [listData, setListData] = useState();
    const [listLoading, setListLoading] = useState(true);
    const tabRef = useRef();

    useFocusEffect(
        useCallback(() => {
            getData().then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    let tab = route?.params?.tab || 0;
                    setTimeout(() => {
                        tabRef?.current?.goToPage(tab);
                    });
                }
            });
        }, [route?.params?.tab])
    );

    const getListData = (type) => {
        setListLoading(true);
        getList({type})
            .then((res) => {
                if (res.code === '000000') {
                    setListData(res.result);
                }
            })
            .finally((_) => {
                setListLoading(false);
            });
    };

    const onChangeTab = useCallback(
        ({i}) => {
            getListData(data?.header?.[i]?.type);
        },
        [data]
    );

    return (
        <View style={styles.container}>
            <ScrollableTabView
                renderTabBar={() => (
                    <ScrollableTabBar
                        style={{paddingHorizontal: px(34), backgroundColor: '#fff', paddingTop: px(10)}}
                    />
                )}
                onChangeTab={onChangeTab}>
                {['已发布', '审核未通过', '审核中'].map((item, idx) => (
                    <ScrollView tabLabel={item} key={idx} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        {listLoading ? (
                            <View style={{paddingVertical: px(20)}}>
                                <ActivityIndicator />
                            </View>
                        ) : listData?.items?.[0] ? (
                            <View style={styles.cardsWrap}>
                                {listData?.items?.[0].map((itm, index) => (
                                    <View style={styles.cardItem} key={index}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                jump(itm.url);
                                            }}
                                            style={styles.cardItemMain}>
                                            <FastImage
                                                style={styles.cardItemAvatar}
                                                source={{
                                                    uri: itm.ci_img,
                                                }}
                                            />
                                            <View style={styles.cardItemMainCenter}>
                                                <Text style={styles.cardItemMainTitle}>{itm?.ci_name}</Text>
                                                <Text style={styles.cardItemMainDesc} numberOfLines={2}>
                                                    {itm?.ci_intro}
                                                </Text>
                                            </View>
                                            <Icon
                                                color={Colors.descColor}
                                                name="angle-right"
                                                size={px(14)}
                                                style={{marginLeft: px(8)}}
                                            />
                                        </TouchableOpacity>
                                        {/* <View style={styles.cardItemBottom}>
                                            <FastImage
                                                source={{
                                                    uri:
                                                        'https://static.licaimofang.com/wp-content/uploads/2022/10/edit.png',
                                                }}
                                                style={styles.cardItemBottomIcon}
                                            />
                                            <Text style={styles.cardItemBottomText}>修改社区</Text>
                                        </View> */}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    margin: px(16),
                                    marginBottom: 0,
                                    borderRadius: px(6),
                                    paddingVertical: px(60),
                                    alignItems: 'center',
                                }}>
                                <FastImage
                                    style={{width: px(120), height: px(64)}}
                                    source={require('~/assets/img/emptyTip/empty.png')}
                                />
                                <Text
                                    style={{
                                        fontSize: px(13),
                                        lineHeight: px(18),
                                        color: '#121D3A',
                                        textAlign: 'center',
                                    }}>
                                    暂无内容
                                </Text>
                            </View>
                        )}
                        <View style={{height: 50}} />
                    </ScrollView>
                ))}
            </ScrollableTabView>
        </View>
    );
};

export default CommunityCollection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardsWrap: {
        padding: px(16),
    },
    cardItem: {
        paddingHorizontal: px(12),
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginBottom: px(12),
    },
    cardItemMain: {
        paddingVertical: px(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardItemAvatar: {
        width: px(54),
        height: px(54),
        borderRadius: px(54),
    },
    cardItemMainCenter: {
        marginLeft: px(12),
        flex: 1,
    },
    cardItemMainTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        fontWeight: 'bold',
    },
    cardItemMainDesc: {
        marginTop: px(4),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
    },
    cardItemBottom: {
        borderTopColor: '#E9EAEF',
        borderTopWidth: 0.5,
        paddingVertical: px(12),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardItemBottomText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051cc',
    },
    cardItemBottomIcon: {
        width: px(16),
        height: px(16),
        marginRight: px(4),
    },
});
