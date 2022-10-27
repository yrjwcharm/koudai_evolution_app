/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-26 20:41:36
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyProductItem.js
 * @Description: 修改专题推荐-产品推荐信息-选择产品
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import NavBar from '~/components/NavBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getProductList} from './services';
import {Colors, Font, Style} from '~/common/commonStyle';
import LoadingTips from '~/components/LoadingTips';
import {useFocusEffect} from '@react-navigation/native';

function Item(props) {
    const {item, isSelected, onPress} = props;
    return (
        <TouchableOpacity onPress={onPress} style={styles.cell}>
            <AntDesign name="checkcircle" size={16} color={isSelected ? '#0051CC' : '#BDC2CC'} />
            <View style={styles.cellContent}>
                <Text style={styles.cell_title}>{item.product_name}</Text>
                <View style={styles.cell_descWrap}>
                    <Text style={styles.cell_ratio}>{item.yield_info.ratio}</Text>
                    <Text style={styles.cell_desc}>{item.yield_info.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function ItemSeparator() {
    return <View style={{width: '100%', height: px(24)}} />;
}

export default function SpecialModifyProductItem({navigation, route}) {
    const {callback, subject_id, selected} = route?.params ?? {}; // 返回的回调
    const [loading, setLoading] = useState(false);
    const [selectedId, setId] = useState(selected || 0);
    const [list, setList] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getProductList({sid: subject_id})
                .then((res) => {
                    if (res.code === '000000') {
                        setList(res.result.list || []);
                    }
                })
                .finally((_) => {
                    setLoading(false);
                });
        }, [subject_id])
    );

    const handleBack = () => {
        navigation.goBack();
    };
    const handleSure = () => {
        let item = list.find((it) => it.product_id === selectedId);
        if (callback) {
            callback(item);
        }
        navigation.goBack();
    };

    const renderItem = ({item, index}) => {
        console.log('renderItem:', item);
        return <Item item={item} isSelected={item.product_id === selectedId} onPress={() => setId(item.product_id)} />;
    };

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']}>
                <NavBar title={'选择推广产品'} leftIcon="chevron-left" leftPress={handleBack} />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar
                title={'选择推广产品'}
                leftIcon="chevron-left"
                leftPress={handleBack}
                rightText={'确定'}
                rightPress={handleSure}
            />
            <View style={styles.content}>
                <FlatList
                    data={list}
                    ItemSeparatorComponent={ItemSeparator}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#fff',
        position: 'relative',
        height: deviceHeight,
    },
    content: {
        flex: 1,
        paddingHorizontal: px(16),
        paddingTop: px(16),
    },

    cell: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    cellContent: {
        marginLeft: px(12),
        flex: 1,
    },
    cell_title: {
        color: '#121D3A',
        fontWeight: 'bold',
        fontSize: px(13),
        lineHeight: px(18),
    },
    cell_descWrap: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cell_ratio: {
        color: '#E74949',
        fontSize: px(14),
        fontFamily: Font.numFontFamily,
        lineHeight: px(16),
    },
    cell_desc: {
        color: '#9AA0B1',
        fontSize: px(12),
        lineHeight: px(17),
        marginLeft: 4,
    },
});
