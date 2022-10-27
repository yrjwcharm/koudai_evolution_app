/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-27 18:35:55
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecailSortContent.js
 * @Description: 创建专题-内容编辑-修改内容排序
 */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import NavBar from '~/components/NavBar';
import {Colors, Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Modal} from '~/components/Modal';

export default function SpecailSortContent({navigation, route}) {
    const {items = [], changeCallBack} = route.params || {};
    const [data, setData] = useState(items);
    console.log('setData:', setData);

    const [check, setCheck] = useState(0); // 0没有选中 1部分选中 2全选

    const handleBack = () => {
        changeCallBack([...data]);
        navigation.goBack();
    };
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
                    <TouchableOpacity style={styles.titleWrap} onPress={() => toggle(index)}>
                        <FastImage
                            source={
                                item.check
                                    ? require('~/assets/img/special/select-1.png')
                                    : require('~/assets/img/special/select.png')
                            }
                            style={{width: px(16), height: px(16)}}
                        />
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                    <FastImage
                        source={require('~/assets/img/special/menu-line.png')}
                        style={{width: px(24), height: px(24), marginLeft: px(20)}}
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
        data[index].check = !data[index].check;
        setData([...data]);
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
            content: '确认删除已勾选内容吗？',
            confirm: true,
            confirmText: '确认',
            confirmCallBack: async () => {
                setData(data.filter((item) => !item.check));
            },
        });
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar title={'调整列表'} leftIcon="chevron-left" leftPress={handleBack} />
            <View style={styles.content}>
                {renderHeader()}

                <View style={styles.listWrap}>
                    <DraggableFlatList
                        data={data}
                        ItemSeparatorComponent={itemSeparatorComponent}
                        onDragEnd={onDragEnd}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={renderItem}
                    />
                </View>
                <View style={{...Style.flexBetween, ...styles.footer}}>
                    <TouchableOpacity onPress={toggleAll} style={[Style.flexRow]}>
                        <AntDesign name={'checkcircle'} size={px(16)} color={check == 2 ? Colors.btnColor : '#ddd'} />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#fff',
        position: 'relative',
        height: deviceHeight,
        flex: 1,
    },
    content: {
        paddingTop: px(12),
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    header: {
        height: px(40),
        paddingLeft: px(40),
        paddingRight: px(12),
    },

    rowItem: {
        height: px(58),
        paddingLeft: px(16),
        paddingRight: px(28),
        width: '100%',
    },
    titleWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        marginLeft: px(9),
        fontSize: px(13),
        color: Colors.defaultColor,
    },
    listWrap: {
        flexGrow: 1,
    },
    footer: {
        position: 'absolute',
        bottom: px(0),
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        height: px(58),
        paddingHorizontal: px(16),
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
