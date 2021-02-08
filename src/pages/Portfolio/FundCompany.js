/*
 * @Date: 2021-01-30 11:30:36
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-07 17:39:11
 * @Description: 基金公司
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';

const FundCompany = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([]);

    const init = useCallback(
        (first) => {
            setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/fund/company/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '基金公司'});
                setList([...(res.result || [])]);
            });
        },
        [navigation, route]
    );
    // 下拉刷新
    const onRefresh = useCallback(() => {
        init();
    }, [init]);
    // 渲染列表项
    const renderItem = useCallback((item, index) => {
        return (
            <View
                key={index}
                style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                <Text style={[styles.itemText, {textAlign: 'left'}]}>{item.key}</Text>
                <Text style={[styles.itemText, {textAlign: 'right'}]}>{item.val}</Text>
            </View>
        );
    }, []);
    const jump = useCallback(
        ({url}) => {
            if (url) {
                if (url.type === 1) {
                    navigation.navigate({
                        name: url.path,
                        params: {...url.params, title: `旗下基金(${list[list.length - 1].val}支)`} || {},
                    });
                } else if (url.type === 2) {
                    Linking.canOpenURL(url.path)
                        .then((supported) => {
                            if (!supported) {
                                return Toast.show('您的设备不支持打开网址');
                            }
                            return Linking.openURL(url.path);
                        })
                        .catch((err) => Toast.show(err));
                } else if (url.type === 3) {
                    navigation.navigate({
                        name: 'OpenPdf',
                        params: {url: url.path},
                    });
                }
            }
        },
        [navigation, list]
    );

    useEffect(() => {
        init(true);
    }, [init]);
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {list.slice(0, list.length - 1).map((item, index) => {
                return renderItem(item, index);
            })}
            {list.length > 0 && (
                <TouchableOpacity
                    style={[styles.totalFunds, Style.flexBetween]}
                    onPress={() => jump(list[list.length - 1])}>
                    <Text style={styles.title}>{`${list[list.length - 1].key}（${list[list.length - 1].val}支）`}</Text>
                    <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: text(36),
        backgroundColor: Colors.bgColor,
        paddingLeft: text(12),
        paddingRight: text(14),
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    item: {
        height: text(45),
        backgroundColor: '#fff',
        paddingLeft: text(12),
        paddingRight: text(14),
    },
    itemText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    totalFunds: {
        marginHorizontal: Space.marginAlign,
        marginTop: text(24),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: text(50),
        shadowColor: '#E0E2E7',
        shadowOffset: {width: 0, height: text(2)},
        shadowOpacity: 1,
        shadowRadius: text(8),
        elevation: 10,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
});

export default FundCompany;
