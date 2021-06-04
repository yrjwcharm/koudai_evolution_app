/*
 * @Date: 2021-05-18 16:06:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-02 16:52:48
 * @Description:收藏 历史
 */

import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useJump} from '../../components/hooks';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Entypo from 'react-native-vector-icons/Entypo';
import Tabbar from '../../components/TabBar';
import http from '../../services/index.js';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {px} from '../../utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../common/commonStyle';
import CommonView from './components/CommonView';

const VisionCollect = ({navigation}) => {
    const inset = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [likeList, setLikeList] = useState({});
    const [collectList, setCollectList] = useState({});
    const [viewList, setViewList] = useState({});
    const jump = useJump();
    useEffect(() => {
        getData();
    }, [getData]);
    const getData = useCallback(() => {
        setRefreshing(true);
        http.get('/vision/resource/list/20210524').then((res) => {
            setRefreshing(false);
            setLikeList(res.result);
        });
    }, []);

    return (
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 0.2}}
            colors={['#fff', '#F5F6F8']}
            style={{paddingTop: inset.top, flex: 1}}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={{position: 'absolute', left: px(16), top: inset.top + px(8), zIndex: 10}}
                onPress={() => {
                    navigation.goBack();
                }}>
                <Entypo name="chevron-thin-left" size={px(18)} />
            </TouchableOpacity>
            <ScrollableTabView
                renderTabBar={() => (
                    <Tabbar
                        style={{backgroundColor: 'transparent', marginHorizontal: px(100), borderBottomWidth: 0}}
                        hideUnderLine
                        btnColor={Colors.defaultColor}
                        activeFontSize={px(20)}
                    />
                )}>
                <CommonView tabLabel="收藏" scene="collect" type={'collect'} />
                <CommonView tabLabel="赞过" scene="collect" type={'favor'} />
                <CommonView tabLabel="历史" scene="collect" type={'history'} />
            </ScrollableTabView>
        </LinearGradient>
    );
};

export default VisionCollect;

const styles = StyleSheet.create({});
