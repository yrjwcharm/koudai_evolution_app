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
import sortImg from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import Tab from '../components/Tab';
import SignalCard from '../components/SignalCard';
const SignalManage = (props) => {
    const [data, setData] = useState({});
    const [current, setCurrent] = useState(0);
    const routeParams = props.route?.params;
    const scrollTab = useRef();
    const {top_info, tab_list, product_headers, product_list = []} = data;
    const getData = async () => {
        let res = await getSignalInfo(routeParams);
        setData(res.result);
    };
    const handleSort = (_data) => {
        // global.LogTool('order', _data.sort_key);
        // if (_data.sort_key) {
        //     getHoldData({
        //         type,
        //         sort_key: _data?.sort_key,
        //         sort_type: _data?.sort_type == 'asc' ? '' : _data?.sort_type == 'desc' ? 'asc' : 'desc',
        //     });
        // }
    };
    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    return (
        <ScrollView style={styles.con}>
            <View style={[styles.card, Style.flexBetween, {marginBottom: px(16)}]}>
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
            <Tab
                tabs={tab_list}
                current={current}
                onPress={(i) => {
                    scrollTab.current.goToPage(i);
                }}
            />
            <View style={[styles.portCard, Style.flexRow]}>
                {product_headers?.map((head, index) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={index}
                        onPress={() => handleSort(head)}
                        style={{
                            flex: index == 0 ? 1.4 : 1,
                            ...Style.flexRow,
                            justifyContent: index == 0 ? 'flex-start' : 'flex-end',
                        }}>
                        <Text style={{color: Colors.lightGrayColor, fontSize: px(11)}}>{head.text}</Text>
                        {head?.sort_key && (
                            <Image
                                source={head?.sort_type == '' ? sortImg : head?.sort_type == 'asc' ? sortUp : sortDown}
                                style={styles.sortImg}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <ScrollableTabView
                initialPage={0}
                onChangeTab={({i}) => setCurrent(i)}
                renderTabBar={false}
                ref={scrollTab}
                style={{flex: 1}}>
                {product_list?.map((_data, index) => (
                    <SignalCard data={_data} key={index} />
                ))}
            </ScrollableTabView>
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
    sortImg: {
        width: px(6),
        height: px(10),
        marginLeft: px(1),
        marginBottom: px(-2),
    },
    portCard: {
        backgroundColor: '#fff',
        padding: px(12),
        borderRadius: px(6),
        marginVertical: px(12),
    },
});
