/*
 * @Date: 2023-01-09 14:51:44
 * @Description:
 */
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getSignalInfo} from './service';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {px} from '~/utils/appUtil';
import {Colors, Style, Font} from '~/common/commonStyle';

import Tab from '../components/Tab';
import SignalCard from '../components/SignalCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
import SortHeader from '../components/SortHeader';
const SignalManage = (props) => {
    const [data, setData] = useState({});
    const [current, setCurrent] = useState(0);
    const routeParams = props.route?.params;
    const scrollTab = useRef();
    const jump = useJump();
    const {top_info, tab_list, product_headers, product_list = [], stop_info} = data;
    const getData = async (params) => {
        let res = await getSignalInfo({...routeParams, ...params});
        props.navigation.setOptions({title: res.result.title});
        setData(res.result);
    };
    const handleSort = (_data) => {
        global.LogTool('order', _data.sort_key);
        if (_data.sort_key) {
            getData({
                sort_key: _data?.sort_key,
                sort_type: _data?.sort_type == 'asc' ? '' : _data?.sort_type == 'desc' ? 'asc' : 'desc',
            });
        }
    };
    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    return (
        <ScrollView style={styles.con}>
            {/* 组合顶部 */}
            <View style={[styles.card, {paddingTop: 0}]}>
                {routeParams?.poid && (
                    <View style={{paddingBottom: px(10), paddingTop: px(16), ...Style.borderBottom}}>
                        <Text style={{fontSize: px(14), fontWeight: '700', marginBottom: px(6)}}>{top_info?.name}</Text>
                        {!!top_info?.code && (
                            <Text style={{fontSize: px(11), color: Colors.lightBlackColor}}>{top_info?.code}</Text>
                        )}
                    </View>
                )}
                <View style={[Style.flexBetween, {paddingTop: px(12)}]}>
                    {top_info?.indicators?.map((item, index) => {
                        return (
                            <View key={index} style={Style.flexCenter}>
                                <Text style={{fontFamily: Font.numMedium, fontSize: px(16), marginBottom: px(4)}}>
                                    {item.value}
                                </Text>
                                <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>{item.text}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
            {tab_list?.length > 0 && (
                <Tab
                    tabs={tab_list}
                    current={current}
                    style={{marginTop: px(16)}}
                    onPress={(i) => {
                        scrollTab.current.goToPage(i);
                    }}
                />
            )}
            <SortHeader data={product_headers} onSort={(head) => handleSort(head)} style={{marginTop: px(12)}} />
            {product_list?.length > 0 && (
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={({i}) => {
                        getData({type: tab_list[i]?.type});
                        setCurrent(i);
                    }}
                    renderTabBar={false}
                    ref={scrollTab}
                    style={{flex: 1}}>
                    {tab_list?.map(() => (
                        <View>
                            {product_list?.map((_data, index) => (
                                <SignalCard data={_data} key={index} />
                            ))}
                        </View>
                    ))}
                </ScrollableTabView>
            )}
            {stop_info ? (
                <TouchableOpacity
                    style={[Style.flexCenter, {marginTop: px(20), flexDirection: 'row', marginBottom: px(50)}]}
                    activeOpacity={0.8}
                    onPress={() => jump(stop_info?.url)}>
                    <Text style={{color: Colors.lightBlackColor}}>{stop_info?.text}</Text>
                    <Icon name="right" color={Colors.lightBlackColor} />
                </TouchableOpacity>
            ) : null}
        </ScrollView>
    );
};

export default SignalManage;

const styles = StyleSheet.create({
    con: {
        padding: px(16),
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    card: {paddingVertical: px(16), paddingHorizontal: px(20), backgroundColor: '#fff', borderRadius: px(6)},
});
