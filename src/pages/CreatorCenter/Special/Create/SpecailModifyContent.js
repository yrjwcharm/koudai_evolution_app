/*
 * @Date: 2022-10-11 13:03:31
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 14:12:16
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecailModifyContent.js
 * @Description: 精选内容
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';

import {getContentList, getStashContentList, saveStashContentList} from './services';

function Item({item, index}) {
    const {uri, title, source, fav_num, read_count} = item;
    return (
        <View style={[styles.itemWrap, index === 0 ? styles.itemWrapFirst : {}]}>
            <View style={styles.item_ContentWrap}>
                <Text style={styles.item_title}>{title}</Text>
                <Text style={styles.item_desc}>{`${source} ${fav_num}阅读 ${read_count}点赞`}</Text>
            </View>
            {uri && <FastImage style={styles.item_image} resizeMode="cover" source={{uri}} />}
            <View style={styles.line} />
        </View>
    );
}

// 列表最后的添加和排序按钮
function FooterItem({onAdd, onSort, selected = []}) {
    return (
        <View style={[styles.footerWrap]}>
            <View style={styles.footer_ActionWrap}>
                {selected.length >= 1 ? (
                    <TouchableOpacity style={styles.footer_action} onPress={onSort}>
                        <FastImage style={styles.action_icon} source={require('~/assets/img/special/list_sort.png')} />
                        <Text style={styles.action_title}>调整列表</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.footer_action}>
                        <FastImage
                            style={styles.action_icon}
                            source={require('~/assets/img/special/list_sort_disabled.png')}
                        />
                        <Text style={styles.action_title_disable}>调整列表</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.footer_action} onPress={onAdd}>
                    <FastImage style={styles.action_icon} source={require('~/assets/img/special/list_add.png')} />
                    <Text style={styles.action_title}>添加内容</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.footerWrap_tip}>*最多可添加20篇内容</Text>
        </View>
    );
}

function SearchItem({item, onToggle}) {
    return (
        <View style={styles.searchItem}>
            <View style={styles.searchItem_content}>
                <Text style={styles.searchItem_title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text
                    style={
                        styles.SearchItem_desc
                    }>{`${item.fav_num}点赞・${item.col_num}收藏・${item.tran_num}转发`}</Text>
            </View>

            <TouchableOpacity
                style={item.isAdded ? styles.searchItem_btn_added : styles.searchItem_btn_unadd}
                onPress={onToggle}>
                {item.isAdded ? (
                    <Text style={styles.searchItem_text_added}>已添加</Text>
                ) : (
                    <Text style={styles.searchItem_text_unadd}>添加</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

function ContentSearchModal(props) {
    const {selected = [], setSelected} = props;
    console.log('selected:', selected);
    const [searchList, setSearchList] = useState([
        {
            title: '低位抢筹，逆势蓄力，魔方低估值蓄势',
            uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-1.png',
            fav_num: '231',
            col_num: '101',
            tran_num: '23',
            isAdded: false,
            id: 0,
        },
        {
            title: '低位抢筹，逆势蓄力，魔方低估值蓄势 估值低位抢筹，逆势蓄力，魔方低估值蓄势估值',
            uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-2.png',
            fav_num: '231',
            col_num: '101',
            tran_num: '23',
            isAdded: false,
            id: 1,
        },
        {
            title: '韭菜大战华尔街？莫把炮灰当精英战华尔街？',
            uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-2.png',
            fav_num: '336',
            source: '理财魔方',
            read_count: '12,045',
            tran_num: '23',
            isAdded: false,
            id: 2,
        },
    ]);
    useEffect(() => {}, []);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState(false);
    // 当前用户名下总文章数
    const [total, setTotal] = useState(3);

    useEffect(() => {
        let result = searchList.map((item) => {
            item.isAdded = selected.findIndex((it) => it.id === item.id) !== -1;
            return {...item};
        });
        setSearchList(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    const searchContent = () => {};
    const handleToggle = (item, index) => {
        if (item.isAdded) {
            item.isAdded = false;
            setSelected(selected.filter((it) => it.id !== item.id));
        } else {
            item.isAdded = true;
            setSelected([...selected, item]);
        }
    };
    const handleSearch = (text) => {
        setQuery(text);
        // setpa
    };

    const renderItem = ({item, index}) => {
        return <SearchItem item={item} key={item.id} onToggle={() => handleToggle(item, index)} index={index} />;
    };

    if (total <= 0) {
        return (
            <View style={styles.searchEmpty}>
                <FastImage
                    style={styles.searchEmpty_image}
                    resizeMode={FastImage.resizeMode.contain}
                    source={require('../../../../assets/img/emptyTip/empty.png')}
                />
                <Text style={styles.searchEmpty_text}>暂无作品</Text>
            </View>
        );
    }

    return (
        <View style={styles.searchModal}>
            <View style={[styles.searchWrap]}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/pk-search.png'}}
                    style={styles.searchWrap_searchIcon}
                />
                <TextInput
                    style={styles.searchWrap_input}
                    clearButtonMode="always"
                    onChangeText={handleSearch}
                    placeholder="搜索作品名称"
                />
            </View>
            <FlatList
                data={searchList}
                refreshing={refreshing}
                onRefresh={searchContent}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

/** 列表为空时填充 */
function EmptyLit() {
    return (
        <View style={styles.emptyTipWrap}>
            <FastImage
                style={styles.searchEmpty_image}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../../../../assets/img/emptyTip/empty.png')}
            />
            <Text style={styles.searchEmpty_text}>暂无内容</Text>
            <View style={styles.line} />
        </View>
    );
}

/** 添加内容 */
export default function SpecailModifyContent({navigation, route}) {
    const [data, setData] = useState([]);
    const subject_id = route?.params?.subject_id || route?.params?.fix_id || 1021;

    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);

    const bottomModal = useRef(null);

    useEffect(() => {
        getStashContentList({subject_id}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);
    const rightPress = () => {
        // TODO: save stash
        navigation.goBack();
    };

    const loadTemplate = () => {
        // TODO: load stash
        // setData([]);
    };
    const handleBack = () => {
        Modal.show({
            title: '已编辑内容是否要保存草稿？下次可继续编辑。',
            cancelText: '不保存草稿',
            confirmText: '保存草稿',
            backCloseCallbackExecute: true,
            cancelCallBack: () => {
                navigation.goBack();
            },
            confirmCallBack: () => {
                // TODO: save stack

                navigation.goBack();
            },
        });
    };
    const handleSort = () => {
        jump({
            path: 'SpecailSortContent',
            params: {
                items: data,
                changeCallBack: (items) => {
                    setData(items);
                },
            },
        });
    };
    const handleAdd = () => {
        if (data.length >= 20) {
            Toast.show('最多可添加20篇内容');
            return;
        }
        bottomModal.current.show();
    };

    const renderItem = ({item, index}) => {
        return <Item item={item} index={index} />;
    };

    return (
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={'精选内容'}
                leftIcon="chevron-left"
                rightText={'保存'}
                rightPress={rightPress}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.pageWrap}>
                {data.length === 0 && <EmptyLit />}

                <FlatList
                    data={data}
                    refreshing={refreshing}
                    onRefresh={loadTemplate}
                    renderItem={renderItem}
                    ListFooterComponent={<FooterItem onAdd={handleAdd} selected={data} onSort={handleSort} />}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <BottomModal
                ref={bottomModal}
                title="添加内容"
                showClose={true}
                confirmText="确定"
                children={<ContentSearchModal selected={data} setSelected={setData} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    right_sty: {
        marginRight: px(14),
        color: '#121D3A',
    },
    pageWrap: {
        backgroundColor: '#F5F6F8',
        paddingLeft: px(16),
        paddingRight: px(16),
        paddingTop: px(12),
        // minHeight: '100%',
    },
    space1: {
        marginTop: px(12),
    },
    space2: {
        marginTop: px(20),
    },
    line: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#BDC2CC',
    },
    itemWrap: {
        height: 102,
        width: '100%',
        padding: 16,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    emptyTipWrap: {
        width: '100%',
        height: px(210),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
    },
    itemWrapFirst: {
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
    },
    item_ContentWrap: {
        flexShrink: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    item_title: {
        fontSize: px(14),
        color: '#121D3A',
    },
    item_desc: {
        fontSize: px(12),
        color: '#9AA1B2',
    },
    item_image: {
        flexShrink: 0,
        width: 110,
        height: 70,
        borderRadius: 4,
        marginLeft: 12,
    },
    footerWrap: {},
    footer_ActionWrap: {
        height: 41,
        width: '100%',
        borderBottomEndRadius: 6,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    footer_action: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    action_icon: {
        width: 16,
        height: 16,
    },
    action_title: {
        marginLeft: 4,
        fontSize: px(12),
        color: '#0051CC',
    },
    action_title_disable: {
        fontSize: px(12),
        color: '#BDC2CC',
    },
    footerWrap_tip: {
        marginTop: 12,
        fontSize: px(11),
        color: '#9AA0B1',
    },

    searchModal: {
        width: '100%',
        height: deviceHeight - 200,
        padding: 16,
    },
    searchWrap: {
        backgroundColor: '#E9EAEF',
        borderRadius: px(146),
        opacity: 0.9,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: px(28),
    },
    searchWrap_searchIcon: {
        width: px(18),
        height: px(18),
        marginLeft: px(9),
    },
    searchWrap_input: {
        marginLeft: px(4),
        flexGrow: 1,
        fontSize: px(12),
    },
    searchItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 24,
    },
    searchItem_content: {
        flexGrow: 1,
        flexShrink: 1,
    },
    searchItem_title: {
        fontSize: px(13),
        color: '#121D3A',
    },
    SearchItem_desc: {
        fontSize: px(12),
        color: '#9AA0B1',
    },
    searchItem_btn_added: {
        marginLeft: px(24),
        width: 64,
        height: 30,
        borderRadius: 50,
        backgroundColor: '#E9EAEF',
        flexShrink: 0,
    },
    searchItem_btn_unadd: {
        marginLeft: px(24),
        width: 64,
        height: 30,
        borderRadius: 50,
        backgroundColor: '#0051CC',
        flexShrink: 0,
    },
    searchItem_text_added: {
        fontSize: px(12),
        color: '#9AA0B1',
        lineHeight: 30,
        textAlign: 'center',
        width: '100%',
    },
    searchItem_text_unadd: {
        fontSize: px(12),
        color: '#fff',
        lineHeight: 30,
        textAlign: 'center',
        width: '100%',
    },

    searchEmpty: {
        width: '100%',
        height: deviceHeight - 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchEmpty_image: {
        // flex: 1,
        width: 258,
        height: 144,
    },
    searchEmpty_text: {
        color: '#121D3A',
        fontSize: px(13),
    },
});
