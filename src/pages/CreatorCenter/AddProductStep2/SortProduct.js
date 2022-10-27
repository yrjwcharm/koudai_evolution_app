/*
 * @Date: 2022-06-24 10:48:10
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-27 18:32:40
 * @Description:基金编辑
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import {Colors, Style} from '~/common/commonStyle';
import {isIphoneX, px} from '~/utils/appUtil';
import {Modal} from '~/components/Modal';
import FastImage from 'react-native-fast-image';
import {cloneDeep} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';

const SortProduct = ({navigation, route}) => {
    const [data, setData] = useState(cloneDeep(route.params.data));
    const [check, setCheck] = useState(0); // 0没有选中 1部分选中 2全选
    useEffect(() => {
        if (data?.length <= 0) return;
        let tmp = data?.filter((item) => item.check) || [];
        if (tmp.length > 0 && data.length == tmp.length) {
            setCheck(2);
        } else if (tmp.length > 0) {
            setCheck(1);
        } else {
            setCheck(0);
        }
    }, [data]);

    useFocusEffect(
        useCallback(() => {
            let lister = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                DeviceEventEmitter.emit(
                    'sortProduct',
                    data.map((obj) => delete obj.check && obj)
                );
                navigation.dispatch(e.data.action);
            });
            return () => lister?.();
        }, [data])
    );

    const renderItem = ({item, drag, isActive, index}) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onPressIn={drag}
                    activeOpacity={0.6}
                    disabled={isActive}
                    style={[styles.rowItem, Style.flexBetween, {backgroundColor: isActive ? '#ddd' : '#fff'}]}>
                    <TouchableOpacity style={Style.flexRow} onPress={() => toggle(index)}>
                        <FastImage
                            source={{
                                uri: `https://static.licaimofang.com/wp-content/uploads/2022/10/${
                                    item.check ? 'check' : 'uncheck'
                                }.png`,
                            }}
                            style={{width: px(16), height: px(16)}}
                        />
                        <View style={{marginLeft: px(8)}}>
                            <Text style={styles.title}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                    <FastImage
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/menu-line.png'}}
                        style={{width: px(24), height: px(24)}}
                    />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };
    const renderHeader = () => {
        return (
            <View style={[Style.flexBetween, styles.header]}>
                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>内容标题</Text>
                <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>拖动排序</Text>
            </View>
        );
    };
    const itemSeparatorComponent = () => {
        return <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />;
    };
    const onDragEnd = ({data, from, to}) => {
        setData(data);
    };
    const toggle = (index) => {
        setData((prev) => {
            let _data = [...prev];

            if (_data[index].check) {
                _data[index].check = false;
            } else {
                _data[index].check = true;
            }
            return _data;
        });
    };
    const toggleAll = () => {
        setData((prev) => {
            let _data = [...prev];
            let res = _data.map((item) => {
                return {
                    ...item,
                    check: check == 0 || check == 1 ? true : false,
                };
            });
            return res;
        });
    };
    const handleAllDelete = () => {
        Modal.show({
            title: '温馨提示',
            content: '确认删除已勾选产品吗？',
            confirm: true,
            confirmText: '确认',
            confirmCallBack: async () => {
                setData(data.filter((item) => !item.check));
            },
        });
    };
    return data ? (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            {renderHeader()}
            <View style={{flex: 1}}>
                <DraggableFlatList
                    data={data}
                    ItemSeparatorComponent={itemSeparatorComponent}
                    onDragEnd={onDragEnd}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={renderItem}
                />
            </View>
            <View style={{...Style.flexBetween, ...styles.footer}}>
                <TouchableOpacity onPress={toggleAll} style={[Style.flexRow]}>
                    <FastImage
                        source={{
                            uri: `https://static.licaimofang.com/wp-content/uploads/2022/10/${
                                check == 2 ? 'check' : 'uncheck'
                            }.png`,
                        }}
                        style={{width: px(16), height: px(16)}}
                    />
                    <Text style={{fontSize: px(13), marginLeft: px(8)}}>全选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, {opacity: check == 0 ? 0.3 : 1}]}
                    onPress={handleAllDelete}
                    disabled={check == 0}>
                    <Text style={styles.btn_text}>删除内容</Text>
                </TouchableOpacity>
            </View>
        </View>
    ) : null;
};
export default SortProduct;

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
    },
    title_desc: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
        width: px(282),
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
