import React, {useCallback, useState, useRef} from 'react';
import {View, StyleSheet, Text, RefreshControl} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/EvilIcons';
import {Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import PKCard from './PKCard';
import {getPKHomeData} from './services';
import Toast from '../../../../components/Toast';
import {useFocusEffect} from '@react-navigation/native';
import PKBtnTab from '../../components/PKBtnTab';
import BottomDesc from '../../../../components/BottomDesc';
import PKBall from '../../components/PKBall';
import PKCollectUserInterest from '../../components/PKCollectUserInterest';
import {useJump} from '~/components/hooks';
import PKWeightSet from '../Compare/PKWieghtSet';

const PKHome = () => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const jump = useJump();

    const PKBallRef = useRef(null);

    const getData = (refresh) => {
        refresh ? setRefreshing(true) : setLoading(true);
        getPKHomeData()
            .then((res) => {
                if (res.code === '000000') {
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
            getData();
        }, [])
    );

    const handlerChange = (item, idx, val) => {
        console.log(item);
    };

    return (
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#fff', '#F4F5F7']}
            style={[styles.container, {paddingTop: insets.top}]}>
            {/* search */}
            <View style={[styles.searchWrap]}>
                <TouchableOpacity style={[styles.searchBg, Style.flexCenter]}>
                    <View style={Style.flexRowCenter}>
                        <Icons name={'search'} color={'#545968'} size={px(18)} />
                        <Text style={styles.searchPlaceHolder}>搜基金代码/名称/经理/公司等</Text>
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
                    {[1, 2, 3, 4, 5].map((item, idx) => (
                        <View key={idx} style={{alignItems: 'center', width: '20%', marginTop: idx > 4 ? px(15) : 0}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    jump({path: 'PrivatePlacement'});
                                }}>
                                <FastImage
                                    source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/06/public.png'}}
                                    resizeMode="contain"
                                    style={styles.topMenuIcon}
                                />
                                <Text style={styles.topMenuText}>公募基金</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                {/* pkCard */}
                <PKCard />
                {/* 基金榜单 */}
                <View style={styles.listWrap}>
                    <Text style={styles.listTitle}>热门产品推荐</Text>
                    {/* tab */}
                    <PKBtnTab data={['追求收益', '省心定投', '金牛经理']} onChange={handlerChange} />
                    {/* list */}
                    {[1, 2, 3, 4].map((item, idx) => (
                        <TouchableOpacity
                            onPress={() => {
                                PKBallRef.current.add();
                            }}
                            key={idx}
                            style={{marginTop: idx > 0 ? px(12) : 0}}>
                            <Text style={{backgroundColor: '#fff'}}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* bottomDesc */}
                <BottomDesc />
            </ScrollView>
            <PKBall ref={PKBallRef} />
            {/* <PKCollectUserInterest /> */}
            <PKWeightSet />
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
});
export default PKHome;
