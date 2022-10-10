/*
 * @Date: 2022-06-24 10:48:10
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-10 18:04:46
 * @Description:基金编辑
 */
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import {Colors, Style} from '~/common/commonStyle';
import {isIphoneX, px} from '~/utils/appUtil';
import Entypo from 'react-native-vector-icons/Entypo';
import {changeSort, getList, handleCancle} from './services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from '~/components/Toast';
import {Modal} from '~/components/Modal';
import FastImage from 'react-native-fast-image';

export default function EditSortFund({navigation, route}) {
    const [result, setResult] = useState({});
    const [data, setData] = useState([]);
    const [check, setCheck] = useState(0); // 0没有选中 1部分选中 2全选
    const getData = async () => {
        let res = await getList(route?.params);
        navigation.setOptions({title: res.result.title});
        setResult(res.result);
        setData(res.result?.list);
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                                uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/${
                                    item.check ? 'check' : 'uncheck'
                                }.png`,
                            }}
                            style={{width: px(16), height: px(16)}}
                        />
                        <View style={{marginLeft: px(8)}}>
                            <Text style={styles.title}>{item.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                                {item.code_icon ? (
                                    <FastImage
                                        source={{uri: item.code_icon}}
                                        style={{width: px(8), height: px(8), marginTop: 1, marginRight: px(4)}}
                                    />
                                ) : null}
                                <Text
                                    style={[styles.title_desc, item.code_icon ? {color: '#545968'} : {}]}
                                    numberOfLines={1}>
                                    {item.code}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <FastImage
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/menu-line.png'}}
                        style={{width: px(24), height: px(24)}}
                    />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };
    const renderHeader = () => {
        return (
            <View style={[Style.flexBetween, styles.header]}>
                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>{result.tr_name}</Text>
                <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>拖动排序</Text>
            </View>
        );
    };
    const itemSeparatorComponent = () => {
        return <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />;
    };
    const onDragEnd = ({data, from, to}) => {
        setData(data);
        const params = {
            current_id: data[to].id,
            after_id: data[to == 0 ? 0 : to - 1].id,
            item_type: data[to].item_type,
        };
        changeSort(params);
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
            content: '将会从关注区删除已选',
            confirm: true,
            confirmText: '确认删除',
            confirmCallBack: async () => {
                const params = {
                    item_id: data
                        .filter((item) => item.check)
                        .map((t) => t.item_id)
                        .join(','),
                    item_type: route?.params?.item_type,
                };
                let res = await handleCancle(params);
                if (res.code === '000000') getData();
                Toast.show(res.message);
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
                    keyExtractor={(item, index) => item.code + index}
                    renderItem={renderItem}
                />
            </View>
            <View style={{...Style.flexBetween, ...styles.footer}}>
                <TouchableOpacity onPress={toggleAll} style={[Style.flexRow]}>
                    <AntDesign name={'checkcircle'} size={px(16)} color={check == 2 ? Colors.btnColor : '#ddd'} />
                    <Text style={{fontSize: px(13), marginLeft: px(8)}}>全选</Text>
                </TouchableOpacity>
                {result?.button ? (
                    <TouchableOpacity
                        style={[styles.btn, {opacity: check == 0 ? 0.3 : 1}]}
                        onPress={handleAllDelete}
                        disabled={check == 0}>
                        <Text style={styles.btn_text}>{result?.button.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    ) : null;
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
