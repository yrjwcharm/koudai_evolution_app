/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 12:07:20
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import http from '~/services';
import {px} from '~/utils/appUtil';

const MenuList = ({navigation, route}) => {
    const [data, setData] = useState();

    useEffect(() => {
        http.get('/xxx', route.params).then((res) => {
            console.log(res);
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
                    {data.map((item, idx) => (
                        <View style={styles.menuItem} key={idx}>
                            <FastImage source={{uri: ''}} style={styles.menuItemIcon} />
                            <Text style={styles.menuItemText}>123</Text>
                        </View>
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
        paddingVertical: px(24),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    menuItem: {
        alignItems: 'center',
        maxWidth: '20%',
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
