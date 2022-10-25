/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 11:56:53
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '~/common/commonStyle';
import http from '~/services';
import {deviceHeight, px} from '~/utils/appUtil';
import {genKey} from './utils';

const DetailModal = ({bottom, onClose, selections, handlerSelections}) => {
    const list = useRef(selections);
    const [data, setData] = useState();

    useEffect(() => {
        http.post('/subject/manage/products/names/20220901', {products: JSON.stringify(selections)}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);
    return (
        <View
            style={[
                styles.container,
                {position: 'absolute', bottom, height: deviceHeight, backgroundColor: 'rgba(30,31,32,0.7)'},
            ]}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{flex: 1}}
                onPress={() => {
                    onClose();
                }}
            />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>选择明细</Text>
                <Icon
                    color={Colors.descColor}
                    name={'close'}
                    size={18}
                    onPress={() => {
                        onClose();
                    }}
                />
            </View>
            <View>
                <View style={styles.content}>
                    {data ? (
                        list.current.map((item, idx) => (
                            <TouchableOpacity
                                style={[styles.item, {marginTop: idx > 0 ? px(27) : 0}]}
                                key={idx}
                                activeOpacity={0.8}
                                onPress={() => {
                                    let newVal = [...selections];

                                    let i = newVal.findIndex((v) => genKey(v) === genKey(item));

                                    i > -1 ? newVal.splice(i, 1) : newVal.push(item);

                                    handlerSelections(newVal);
                                }}>
                                <FastImage
                                    source={{
                                        uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/${
                                            selections.find((itm) => genKey(itm) === genKey(item)) ? 'check' : 'uncheck'
                                        }.png`,
                                    }}
                                    style={{width: px(16), height: px(16)}}
                                />
                                <Text style={styles.itemText} numberOfLines={1}>
                                    {data[idx].product_name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{paddingVertical: px(20)}}>
                            <ActivityIndicator />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default DetailModal;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: px(12),
        borderTopRightRadius: px(12),
        padding: px(16),
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.5,
    },
    headerTitle: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1e2331',
    },
    content: {
        backgroundColor: '#fff',
        paddingVertical: px(12),
        paddingHorizontal: px(16),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        marginLeft: px(8),
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        flex: 1,
    },
});
