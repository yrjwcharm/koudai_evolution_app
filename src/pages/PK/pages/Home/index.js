import React, {useCallback, useState, useRef} from 'react';
import {View, StyleSheet, Text, RefreshControl, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/EvilIcons';
import {Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import PKCard from './PKCard';
import {getPKHomeData, getFundRankData} from '../../services';
import Toast from '../../../../components/Toast';
import {useFocusEffect} from '@react-navigation/native';
import PKBtnTab from '../../components/PKBtnTab';
import BottomDesc from '../../../../components/BottomDesc';
import PKBall from '../../components/PKBall';
import PKCollectUserInterest from '../../components/PKCollectUserInterest';
import {useJump} from '~/components/hooks';
import PKWeightSet from '../Compare/PKWeightSet';
import ProductCards from '~/components/Portfolios/ProductCards';

const PKHome = () => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState(null);
    const [fundRankData, setFundRankData] = useState(null);
    const [fundRankLoading, setFundRankLoading] = useState(false);
    const [curFundTopTab, setCurFundTopTab] = useState('');

    const isFirst = useState(0);

    const getData = (refresh) => {
        refresh ? setRefreshing(true) : setLoading(true);
        getPKHomeData()
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    getFundRankList(res.result?.fund_top?.tabs?.[0]?.rank_type);
                } else {
                    Toast.show(res.message);
                }
            })
            .finally((_) => {
                setRefreshing(false);
                setLoading(false);
            });
    };

    const getFundRankList = (rank_type) => {
        setCurFundTopTab(rank_type);
        setFundRankLoading(true);
        getFundRankData({rank_type})
            .then((res) => {
                if (res.code === '000000') {
                    setFundRankData(res.result);
                } else {
                    Toast.show(res.message);
                }
            })
            .finally((_) => {
                setFundRankLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getData(isFirst.current++ !== 0);
        }, [])
    );

    const handlerFundTopTabChange = (item, idx, val) => {
        getFundRankList(val);
    };

    return loading ? (
        <View style={styles.loadingMask}>
            <ActivityIndicator size={'large'} />
        </View>
    ) : (
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#fff', '#F4F5F7']}
            style={[styles.container, {paddingTop: insets.top}]}>
            {/* search */}
            <View style={[styles.searchWrap]}>
                <TouchableOpacity
                    style={[styles.searchBg, Style.flexCenter]}
                    onPress={() => {
                        jump(data?.search_button?.url);
                    }}>
                    <View style={Style.flexRowCenter}>
                        <Icons name={'search'} color={'#545968'} size={px(18)} />
                        <Text style={styles.searchPlaceHolder}>{data?.search_box_content}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* scrollView */}
            <ScrollView
                style={{flex: 1}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData(true)} />}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{right: 1}}>
                {/* topmenu */}
                <View style={styles.topMenu}>
                    {data?.tabs?.map((item, idx) => (
                        <View key={idx} style={{alignItems: 'center', width: '20%', marginTop: idx > 4 ? px(15) : 0}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    jump(item.url);
                                }}>
                                <FastImage source={{uri: item.icon}} resizeMode="contain" style={styles.topMenuIcon} />
                                <Text style={styles.topMenuText}>{item.text}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                {/* pkCard */}
                <PKCard data={data?.pk_list} />
                <View style={styles.listWrap}>
                    {data?.hot_recommend && (
                        <>
                            <Text style={styles.listTitle}>热门产品推荐</Text>
                            {data?.hot_recommend?.map((item, idx) => {
                                return (
                                    <ProductCards
                                        key={idx}
                                        data={{type: 'recommend_card', item}}
                                        style={{borderRadius: px(8), marginTop: 0, marginBottom: px(12)}}
                                    />
                                );
                            })}
                        </>
                    )}
                    {data?.fund_top && (
                        <>
                            <Text style={styles.listTitle}>基金榜单</Text>
                            {/* tab */}
                            <PKBtnTab
                                data={data?.fund_top?.tabs}
                                onChange={handlerFundTopTabChange}
                                defaultActive={0}
                                labelKey="title"
                                valueKey="rank_type"
                            />
                            {/* list */}
                            {fundRankLoading ? (
                                <>
                                    <ActivityIndicator size={'large'} style={{marginTop: px(20)}} />
                                </>
                            ) : (
                                <>
                                    {fundRankData?.list?.map?.((item, idx) => {
                                        return <ProductCards key={idx + item.code + curFundTopTab} data={item} />;
                                    })}
                                </>
                            )}
                        </>
                    )}
                </View>
                {/* bottomDesc */}
                <BottomDesc />
            </ScrollView>
            <PKBall />
            {/* <PKCollectUserInterest /> */}
            {/* <PKWeightSet /> */}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
export default PKHome;
