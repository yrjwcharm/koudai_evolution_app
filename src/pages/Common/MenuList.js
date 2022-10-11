/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 12:07:20
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import http from '~/services';
import {px} from '~/utils/appUtil';

const MenuList = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();

    useEffect(() => {
        http.get('/products/menus/all/20220901', route.params).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '更多分类'});
                setData(res.result);
            }
        });
    }, [route, navigation]);

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                <View style={styles.main}>
                    {data?.menus?.map((item, idx) => (
                        <TouchableOpacity
                            style={styles.menuItem}
                            key={idx}
                            activeOpacity={0.8}
                            onPress={() => {
                                global.LogTool({
                                    event: item.event_id,
                                });
                                jump(item.url);
                            }}>
                            <FastImage source={{uri: item.icon}} style={styles.menuItemIcon} />
                            <Text style={styles.menuItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default MenuList;

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff'},
    main: {
        paddingHorizontal: px(19),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    menuItem: {
        alignItems: 'center',
        width: '20%',
        marginTop: px(24),
    },
    menuItemIcon: {
        width: px(26),
        height: px(26),
    },
    menuItemText: {
        marginTop: px(8),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#121D3a',
    },
});
