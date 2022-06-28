/*
 * @Date: 2022-06-24 10:48:10
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-28 18:56:53
 * @Description:基金编辑
 */
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import {Colors, Style} from '~/common/commonStyle';
import {isIphoneX, px} from '~/utils/appUtil';
import Entypo from 'react-native-vector-icons/Entypo';
import {Button} from '~/components/Button';
import {getFollowList} from '../Index/service';
const NUM_ITEMS = 5;
function getColor(i) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const initialData = [...Array(NUM_ITEMS)].map((d, index) => {
    return {
        key: `item-${index}`,
        label: String(index) + '',
    };
});

export default function EditSortFund() {
    const [data, setData] = useState(initialData);
    const getData = async () => {
        let res = await getFollowList();
        console.log(res);
    };
    useEffect(() => {
        getData();
    }, []);
    const renderItem = ({item, drag, isActive, index}) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[styles.rowItem, Style.flexBetween, {backgroundColor: isActive ? '#ddd' : '#fff'}]}>
                    <View>
                        <View>
                            <Text style={styles.title}>{'很多傻事'}</Text>
                            <Text style={styles.title_desc}>{'很多傻事' + index}</Text>
                        </View>
                    </View>
                    <Entypo name="menu" size={px(20)} color={Colors.lightBlackColor} />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };
    const renderHeader = () => {
        return (
            <View style={[Style.flexBetween, styles.header]}>
                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>基金名称</Text>
                <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>拖动排序</Text>
            </View>
        );
    };
    const itemSeparatorComponent = () => {
        return <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />;
    };
    const toggle = () => {};
    const handleAllDelete = () => {};
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            {renderHeader()}
            <View style={{flex: 1}}>
                <DraggableFlatList
                    data={data}
                    ItemSeparatorComponent={itemSeparatorComponent}
                    onDragEnd={({data}) => setData(data)}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                />
            </View>
            <View style={{...Style.flexBetween, ...styles.footer}}>
                <TouchableOpacity onPress={toggle}>
                    <Text style={{fontSize: px(13)}}>全选</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handleAllDelete}>
                    <Text style={styles.btn_text}>删除基金</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: px(40),
        paddingLeft: px(40),
        paddingRight: px(12),
    },
    rowItem: {
        height: px(58),
        paddingLeft: px(16),
        paddingRight: px(31),
        width: '100%',
    },
    title: {
        fontSize: px(13),
        color: Colors.defaultColor,
        marginBottom: px(4),
    },
    title_desc: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    footer: {
        backgroundColor: '#fff',
        height: px(58) + (isIphoneX() ? 34 : 20),
        paddingHorizontal: px(16),
        paddingBottom: isIphoneX() ? 34 : 20,
    },
    btn: {
        borderColor: Colors.btnColor,
        borderWidth: 1,
        borderRadius: px(6),
        paddingHorizontal: px(18),
        paddingVertical: px(9),
    },
    btn_text: {
        color: Colors.btnColor,
        fontSize: px(13),
        lineHeight: px(18),
    },
});
