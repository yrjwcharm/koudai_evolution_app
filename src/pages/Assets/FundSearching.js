/*
 * @Date: 2021-01-28 14:23:24
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-13 10:52:20
 * @Description: 基金查询
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import EmptyTip from '../../components/EmptyTip';

const FundSearching = ({route}) => {
    const [data, setData] = useState({});
    // 打开查询网址
    const openSite = useCallback((site) => {
        global.LogTool('click', 'openSite', site);
        Linking.canOpenURL(site)
            .then((supported) => {
                if (!supported) {
                    return Toast.show('您的设备不支持打开网址');
                }
                return Linking.openURL(site);
            })
            .catch((err) => Alert(err));
    }, []);
    useEffect(() => {
        http.get('/portfolio/funds/searching/20210101', {
            ...route.params,
        }).then((res) => {
            setData(res.result);
        });
    }, [route]);
    return (
        <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.container}>
            {data?.list && data.list.length > 0 ? (
                <>
                    <Text style={[styles.desc, {paddingVertical: Space.padding}]}>
                        {'在理财魔方购买的所有基金都可以在基金官网查询哦，您购买的基金查询方式如下'}
                    </Text>
                    {data.list.map((item, index) => {
                        return (
                            <View style={styles.cardContainer} key={index}>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.title}>{item.name}</Text>
                                </View>
                                <View style={[Style.flexRow, styles.contentItem]}>
                                    <Text style={styles.contentKey}>{'查询网址'}</Text>
                                    <Text style={[styles.desc, styles.site]} onPress={() => openSite(item.site)}>
                                        {item.site}
                                    </Text>
                                </View>
                                <View style={[Style.flexRow, styles.contentItem]}>
                                    <Text style={styles.contentKey}>{'查询流程'}</Text>
                                    <Text style={styles.procedure}>{item.process}</Text>
                                </View>
                            </View>
                        );
                    })}
                </>
            ) : (
                <EmptyTip style={{paddingVertical: text(40)}} text={'暂无数据'} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.padding,
    },
    desc: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
    },
    cardContainer: {
        paddingHorizontal: Space.padding,
        marginBottom: text(12),
        borderRadius: text(4),
        backgroundColor: '#fff',
    },
    cardTitle: {
        paddingVertical: text(12),
        marginBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    contentItem: {
        marginBottom: text(12),
        alignItems: 'flex-start',
    },
    contentKey: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
        marginRight: text(4),
    },
    site: {
        color: Colors.brandColor,
    },
    procedure: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.descColor,
        flex: 1,
        transform: [{translateY: text(-2)}],
        textAlign: 'justify',
    },
});

export default FundSearching;
