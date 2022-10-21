/*
 * @Date: 2022-10-11 13:03:31
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 22:22:52
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
import {useFocusEffect} from '@react-navigation/native';
import LoadingTips from '~/components/LoadingTips';

function Item({item, index}) {
    const {title, source, view_num, favor_num} = item;
    const uri = item.cover || item.media_cover;
    return (
        <View style={[styles.itemWrap, index === 0 ? styles.itemWrapFirst : {}]}>
            <View style={styles.item_ContentWrap}>
                <Text style={styles.item_title}>{title}</Text>
                <Text style={styles.item_desc}>{`${source || ''} ${view_num}阅读 ${favor_num}点赞`}</Text>
            </View>
            <FastImage style={styles.item_image} resizeMode="cover" source={{uri}} />
            <View style={styles.line} />
        </View>
    );
}

// 列表最后的添加和排序按钮
function FooterItem({onAdd, onSort, cansort = false, data}) {
    return (
        <View style={[styles.footerWrap]}>
            <View style={styles.footer_ActionWrap}>
                {cansort ? (
                    <TouchableOpacity style={styles.footer_action} onPress={onSort}>
                        <FastImage style={styles.action_icon} source={{uri: data?.edit_buttons[0]?.icon}} />
                        <Text style={styles.action_title}>{data?.edit_buttons[0]?.name ?? '调整列表'}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.footer_action}>
                        <FastImage
                            style={styles.action_icon}
                            source={require('~/assets/img/special/list_sort_disabled.png')}
                        />
                        <Text style={styles.action_title_disable}>{data?.edit_buttons[0]?.name ?? '调整列表'}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.footer_action} onPress={onAdd}>
                    <FastImage style={styles.action_icon} source={{uri: data?.edit_buttons[1]?.icon}} />
                    <Text style={styles.action_title}>{data?.edit_buttons[1]?.name ?? '添加内容'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.footerWrap_tip}>{data?.tip ?? ''}</Text>
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
                    }>{`${item.favor_num}点赞・${item.collect_num}收藏・${item.share_num}转发`}</Text>
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
    const {selected = [], setSelected, subject_id} = props;
    console.log('selected:', selected);
    const [searchList, setSearchList] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (page == 1) {
            setSearchList([]);
            setRefreshing(true);
        }
        getContentList({subject_id, page, keyword: query})
            .then((res) => {
                if (res.code === '000000') {
                    let old = page === 1 ? [] : searchList;
                    let result = old.concat(res.result.articles);
                    result = result.map((item) => {
                        item.isAdded = selected.findIndex((it) => it.id === item.id) !== -1;
                        return {...item};
                    });
                    setHasMore(res.result.has_more);
                    setSearchList(result);
                }
            })
            .finally((_) => {
                setRefreshing(false);
            });
    }, [query, page, subject_id]);

    useEffect(() => {
        let result = searchList.map((item) => {
            item.isAdded = selected.findIndex((it) => it.id === item.id) !== -1;
            return {...item};
        });
        setSearchList(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

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

    const renderEmpty = useCallback(() => {
        if (refreshing) return null;
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
    });

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
                onRefresh={() => setPage(1)}
                onEndReached={() => {
                    if (hasMore) {
                        console.log('onEndReached');
                        setPage(page + 1);
                    }
                }}
                ListEmptyComponent={renderEmpty}
                onEndReachedThreshold={0.5}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

/** 列表为空时填充 */
function EmptyLit(props) {
    return (
        <View style={styles.emptyTipWrap}>
            <FastImage
                style={styles.searchEmpty_image}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../../../../assets/img/emptyTip/empty.png')}
            />
            <Text style={styles.searchEmpty_text}>暂无内容</Text>
            <View style={styles.line} />
            {props.children}
        </View>
    );
}

/** 添加内容 */
export default function SpecailModifyContent({navigation, route}) {
    const [data, setData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const subject_id = route?.params?.subject_id || route?.params?.fix_id || 1022;

    const [loading, setLoading] = useState(false);
    const jump = useJump();

    const bottomModal = useRef(null);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getStashContentList({subject_id})
                .then((res) => {
                    if (res.code === '000000') {
                        setPageData(res.result);
                        setData(res.result.articles || []);
                    }
                })
                .finally((_) => {
                    setLoading(false);
                });
        }, [route.params])
    );
    const rightPress = () => {
        saveStashContentList({
            subject_id,
            article_ids: data.map((it) => it.id).join(','),
        }).then((res) => {
            if (res.code === '000000') {
                navigation.goBack();
            }
        });
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
                saveStashContentList({
                    subject_id,
                    article_ids: data.map((it) => it.id),
                }).then((res) => {
                    if (res.code === '000000') {
                        navigation.goBack();
                    }
                });
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
        if (data.length >= pageData.max_num) {
            Toast.show(pageData.tip);
            return;
        }
        bottomModal.current.show();
    };

    const renderItem = ({item, index}) => {
        return <Item item={item} index={index} />;
    };

    const renderEmpty = () => {
        return <EmptyLit />;
    };
    if (loading) {
        return (
            <SafeAreaView edges={['bottom']}>
                <NavBar title={'精选内容'} leftIcon="chevron-left" />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={pageData?.title ?? '精选内容'}
                leftIcon="chevron-left"
                rightText={pageData?.top_button?.text ?? '保存'}
                rightPress={rightPress}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.pageWrap}>
                <FlatList
                    style={{flex: 1}}
                    data={data}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty()}
                    ListFooterComponent={
                        <FooterItem
                            onAdd={handleAdd}
                            data={pageData || {}}
                            cansort={data.length > 0}
                            onSort={handleSort}
                        />
                    }
                    keyExtractor={(item) => item.id}
                />
            </View>
            <BottomModal
                ref={bottomModal}
                title="添加内容"
                showClose={true}
                confirmText="确定"
                children={<ContentSearchModal subject_id={subject_id} selected={data} setSelected={setData} />}
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
        // flex: 1,
        width: '100%',
        height: '100%',
        // backgroundColor: 'red',
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
        backgroundColor: 'lightgray',
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
        lineHeight: px(17),
        color: '#121D3A',
    },
    SearchItem_desc: {
        fontSize: px(12),
        lineHeight: px(15),
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
