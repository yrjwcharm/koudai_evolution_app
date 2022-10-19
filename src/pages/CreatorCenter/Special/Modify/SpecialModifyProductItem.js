/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-17 17:51:26
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyProductItem.js
 * @Description: 修改专题推荐-产品推荐信息-选择产品
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet,  Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {Colors, Font, Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
 
import {useJump} from '~/components/hooks';
 

function Item(props) {
    const {title, ratio, ratio_desc, isSelected, onPress} = props;
    return (
        <TouchableOpacity onPress={onPress} style={styles.cell}>
            <AntDesign name="checkcircle" size={16} color={isSelected ? '#0051CC' : '#BDC2CC'} />
            <View style={styles.cellContent}>
                <Text style={styles.cell_title}>{title}</Text>
                <View style={styles.cell_descWrap}>
                    <Text style={styles.cell_ratio}>{ratio}</Text>
                    <Text style={styles.cell_desc}>{ratio_desc}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function ItemSeparator() {
    return <View style={{width: '100%', height: px(24)}} />;
}

export default function SpecialModifyProductItem({navigation, route}) {
    const [data, setData] = useState([]);
    const callback = route?.params?.callback; // 返回的回调
    const [refreshing, setRefreshing] = useState(false);
    const [curIndex, setIndex] = useState(0);
    const [list, setList] = useState([
        {
            id: '1',
            title: '招商中证白酒指数C',
            ratio: '34.23%',
            ratio_desc: '近一年收益率',
        },
        {
            id: '2',
            title: '招商中证白酒指数C',
            ratio: '34.23%',
            ratio_desc: '近一年收益率',
        },
    ]);

    const jump = useJump();

    const handleBack = () => {
        navigation.goBack();
    };
    const handleSure = () => {
        let item = list[curIndex];
        if (callback) {
            callback(item);
        }
        navigation.goBack();
    };

    const onRefresh = () => {};

    const renderItem = ({item, index}) => {
        return <Item {...item} isSelected={index === curIndex} onPress={() => setIndex(index)} />;
    };

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
                    refreshing={refreshing}
                    onRefresh={onRefresh}
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
        fontSize: px(12),
        lineHeight: px(18),
    },
    cell_descWrap: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cell_ratio: {
        color: '#E74949',
        fontSize: px(14),
        lineHeight: px(16),
    },
    cell_desc: {
        color: '#9AA0B1',
        fontSize: px(12),
        lineHeight: px(17),
    },
});
