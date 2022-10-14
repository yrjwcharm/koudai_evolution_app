/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-13 14:58:03
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyEntry.js
 * @Description: 修改内容排序
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, SectionList, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import NavBar from '~/components/NavBar';
import {Colors, Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';

/** 列表每行的key */
const ListKeys = {
    BaseInfo: 'BaseInfo',
    ActiveInfo: 'ActiveInfo',
    ProductInfo: 'ProductInfo',
    ContentInfo: 'ContentInfo',
    CommentInfo: 'CommentInfo',
    CardInfo: 'CardInfo',
    SpreadInfo: 'SpreadInfo',
};

export default function SpecialModifyEntry({navigation, route}) {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const [submitable, setSubmitable] = useState(false);
    const jump = useJump();
    const [uid, setUid] = useState('0'); // 当前专题的uid
    const [list, setList] = useState([
        {
            title: '',
            data: [
                {
                    title: '修改专题基础信息',
                    key: ListKeys.BaseInfo,
                    path: 'SpecialModifyBaseInfo',
                    saved: true,
                },
                {
                    title: '修改活动图片、链接（选填）',
                    key: ListKeys.ActiveInfo,
                    path: 'SpecialModifyActiveInfo',
                },
            ],
        },
        {
            title: '',
            data: [
                {
                    title: '调整产品',
                    key: ListKeys.ProductInfo,
                },
                {
                    title: '编辑精选内容',
                    key: ListKeys.ContentInfo,
                    path: 'SpecailModifyContent',
                },
                {
                    title: '管理评论',
                    key: ListKeys.CommentInfo,
                    path: 'SpecailModifyComment',
                },
            ],
        },
        {
            title: '',
            data: [
                {
                    title: '设置专题卡片样式',
                    key: ListKeys.CardInfo,
                },
                {
                    title: '设置专题推广位',
                    key: ListKeys.SpreadInfo,
                },
            ],
        },
    ]);

    const handleBack = () => {
        navigation.goBack();
    };
    useEffect(() => {}, [data]);

    const onRefresh = () => {};
    const handleCellClick = (item) => {
        jump({
            path: item.path,
            params: {
                uid: uid,
            },
        });
    };

    const itemSeparatorComponent = () => {
        return <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />;
    };
    const renderSectionHeader = () => {
        return <View style={styles.sectionHeader} />;
    };
    const renderItem = ({item, index, section}) => {
        return (
            <TouchableOpacity style={styles.cell} onPress={() => handleCellClick(item)}>
                <Text style={styles.cell_title}>{item.title}</Text>
                <View style={styles.cell_descWrap}>
                    {item.saved && <Text style={styles.cell_desc}>已保存修改</Text>}
                    <AntDesign name="right" size={12} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar title={'修改专题'} leftIcon="chevron-left" leftPress={handleBack} />
            <View style={styles.content}>
                <View style={styles.listWrap}>
                    <SectionList
                        sections={list}
                        initialNumToRender={20}
                        keyExtractor={(item, index) => item + index}
                        onEndReachedThreshold={0.2}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        ItemSeparatorComponent={itemSeparatorComponent}
                        renderSectionHeader={renderSectionHeader}
                        renderItem={renderItem}
                        style={[styles.sectionList, {paddingBottom: insets.bottom}]}
                        stickySectionHeadersEnabled={false}
                    />
                </View>
                <View style={{...Style.flexBetween, ...styles.footer}}>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btn_text}>审核提示</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.submitBtn, !submitable ? styles.submitBtn_disabled : {}]}>
                        <Text style={styles.submitBtn_title}>提交审核</Text>
                        <Text style={styles.submitBtn_desc}>已有3处修改需审核</Text>
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
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    cell: {
        width: '100%',
        height: px(48),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
    cell_title: {
        fontSize: px(12),
        color: '#121D3A',
    },
    cell_descWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cell_desc: {
        fontSize: px(12),
        color: '#4BA471',
        marginRight: px(8),
    },
    sectionHeader: {
        width: '100%',
        height: px(12),
        opacity: 0,
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
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    btn: {
        borderColor: Colors.btnColor,
        borderWidth: 0.5,
        borderRadius: px(6),
        height: px(44),
        paddingHorizontal: px(20),
        ...Style.flexCenter,
    },
    btn_text: {
        color: '#545968',
        fontSize: px(15),
        lineHeight: px(18),
    },
    submitBtn: {
        flex: 1,
        marginLeft: px(12),
        backgroundColor: '#0051CC',
        borderRadius: px(6),
        height: px(44),
        paddingHorizontal: px(20),
        ...Style.flexCenter,
    },
    submitBtn_disabled: {
        backgroundColor: '#CEDDF5',
    },
    submitBtn_title: {
        color: '#fff',
    },
    submitBtn_desc: {
        color: '#fff',
    },
});
