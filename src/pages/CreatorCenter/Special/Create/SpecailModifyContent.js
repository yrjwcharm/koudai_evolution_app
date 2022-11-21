/*
 * @Date: 2022-10-11 13:03:31
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-21 16:44:21
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecailModifyContent.js
 * @Description: 创建专题-精选内容编辑
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Pressable, TouchableOpacity, TextInput, FlatList, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {deviceHeight, px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import {Colors, Font, Style} from '~/common/commonStyle';
import {getContentList, getStashContentList, saveStashContentList} from './services';
import {useFocusEffect} from '@react-navigation/native';
import LoadingTips from '~/components/LoadingTips';
import useSafeBottomHeight from '~/components/hooks/useSafeBottomHeight';
function Item({item, index}) {
    const {title, view_num, favor_num} = item;
    const source = item.author?.nickname || item.album_name || item.cate_name;
    const uri = item.cover;
    return (
        <View style={[styles.itemWrap, index === 0 ? styles.itemWrapFirst : {}]}>
            <View style={styles.item_ContentWrap}>
                <Text style={styles.item_title}>{title}</Text>
                <Text style={styles.item_desc}>{`${source || ''} ${view_num}阅读 ${favor_num}点赞`}</Text>
            </View>
            {uri ? <FastImage style={styles.item_image} resizeMode="cover" source={{uri}} /> : null}
            <View style={styles.line} />
        </View>
    );
}

// 列表最后的添加和排序按钮
function FooterItem({onAdd, onSort, cansort = false, data}) {
    const bottom = useSafeBottomHeight();
    return (
        <View style={[styles.footerWrap, {paddingBottom: bottom + 20}]}>
            <View style={styles.footer_ActionWrap}>
                {cansort ? (
                    <TouchableOpacity style={styles.footer_action} onPress={onSort}>
                        <FastImage style={styles.action_icon} source={{uri: data?.edit_buttons?.[0]?.icon}} />
                        <Text style={styles.action_title}>{data?.edit_buttons?.[0]?.name ?? '调整列表'}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.footer_action}>
                        <FastImage
                            style={styles.action_icon}
                            source={require('~/assets/img/special/list_sort_disabled.png')}
                        />
                        <Text style={styles.action_title_disable}>{data?.edit_buttons?.[0].name ?? '调整列表'}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.footer_action} onPress={onAdd}>
                    <FastImage style={styles.action_icon} source={{uri: data?.edit_buttons?.[1]?.icon}} />
                    <Text style={styles.action_title}>{data?.edit_buttons?.[1]?.name ?? '添加内容'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.footerWrap_tip}>{data?.tip ?? ''}</Text>
        </View>
    );
}

function SearchItem({item, onToggle, isAdded, index}) {
    return (
        <Pressable>
            <View style={[styles.searchItem, index === 0 ? styles.searchItem_first : {}]}>
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
                    style={isAdded ? styles.searchItem_btn_added : styles.searchItem_btn_unadd}
                    onPress={() => onToggle(!isAdded)}>
                    {isAdded ? (
                        <Text style={styles.searchItem_text_added}>已添加</Text>
                    ) : (
                        <Text style={styles.searchItem_text_unadd}>添加</Text>
                    )}
                </TouchableOpacity>
            </View>
        </Pressable>
    );
}

function ContentSearchModal(props) {
    const {selected = [], setSelected, subject_id, showToast} = props;

    const [searchList, setSearchList] = useState([]);

    const [refreshing, setRefreshing] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const bottom = useSafeBottomHeight();

    useEffect(() => {
        loadListData();
    }, [query, page, subject_id]);

    const loadListData = () => {
        if (page == 1) {
            setSearchList([]);
            setRefreshing(true);
        } else {
            setLoadingMore(true);
        }

        getContentList({subject_id, page, keyword: query})
            .then((res) => {
                if (res.code === '000000') {
                    let old = page === 1 ? [] : searchList;
                    let result = old.concat(res?.result?.articles ?? []);

                    setHasMore(res.result.has_more);
                    setSearchList(result);
                }
            })
            .finally((_) => {
                setLoadingMore(false);
                setRefreshing(false);
            });
    };

    const handleToggle = (item, add) => {
        if (add) {
            if (selected.length >= 20) {
                showToast('最多可添加20篇内容');
            } else {
                setSelected([...selected, item]);
            }
        } else {
            setSelected(selected.filter((it) => it.id !== item.id));
        }
    };
    const handleSearch = (text) => {
        setQuery(text);
        setHasMore(true);
        setPage(1);
        setSearchList([]);
    };

    const renderItem = ({item, index}) => {
        const isAdded = selected.findIndex((it) => it.id === item.id) !== -1;
        return (
            <SearchItem
                item={item}
                key={item.id}
                isAdded={isAdded}
                onToggle={(add) => handleToggle(item, add)}
                index={index}
            />
        );
    };

    const renderEmpty = useCallback(() => {
        if (refreshing) return null;
        return (
            <View style={[styles.searchEmpty, {height: 200}]}>
                <FastImage
                    style={styles.searchEmpty_image}
                    resizeMode={FastImage.resizeMode.contain}
                    source={require('../../../../assets/img/emptyTip/empty.png')}
                />
                <Text style={styles.searchEmpty_text}>暂无作品</Text>
            </View>
        );
    });

    const renderLoadingMore = () => {
        console.log('bottom:', bottom);
        if (loadingMore) {
            return (
                <View style={{...styles.searchFooterWrap, paddingBottom: bottom + 20}}>
                    <LoadingTips />
                </View>
            );
        }
        if (!hasMore) {
            return (
                <View style={{...styles.searchFooterWrap, paddingBottom: bottom + 20}}>
                    <Text style={{fontSize: Font.textSm, color: Colors.lightGrayColor}}>没有更多了</Text>
                </View>
            );
        }
        return <View style={{...styles.searchFooterWrap, paddingBottom: bottom + 20}} />;
    };

    return (
        <View style={[styles.searchModal, props.style]}>
            <View style={{paddingBottom: 12, paddingHorizontal: 16}}>
                <View style={[styles.searchWrap]}>
                    <FastImage
                        source={require('~/assets/img/special/pk-search.png')}
                        style={styles.searchWrap_searchIcon}
                    />
                    <TextInput
                        style={styles.searchWrap_input}
                        clearButtonMode="always"
                        onChangeText={handleSearch}
                        placeholder="搜索作品名称"
                    />
                </View>
            </View>
            <View style={{flex: 1}}>
                <FlatList
                    data={searchList}
                    refreshing={refreshing}
                    onRefresh={() => setPage(1)}
                    initialNumToRender={10}
                    extraData={{selected, loadingMore, hasMore}}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={() => {
                        if (hasMore) {
                            console.log('onEndReached');
                            setTimeout(() => {
                                setPage(page + 1);
                            }, 200);
                        }
                    }}
                    ListFooterComponent={renderLoadingMore}
                    ListEmptyComponent={renderEmpty}
                    onEndReachedThreshold={0.5}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.title + index}`}
                />
            </View>
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
    // 来源的场景 create 创建 edit 编辑（默认）
    const {scene} = route.params || {};
    const [data, setData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const subject_id = route?.params?.subject_id || 1024;
    console.log('subject_id:', subject_id);

    const [loading, setLoading] = useState(false);
    const jump = useJump();

    const bottomModal = useRef(null);

    const canGoBack = useRef(false);

    useFocusEffect(
        useCallback(() => {
            let listener = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                if (canGoBack.current) {
                    navigation.dispatch(e.data.action);
                    return;
                }
                handleBack();
            });
            return () => listener?.();
        }, [data])
    );

    useEffect(() => {
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
    }, [route.params]);

    const rightPress = () => {
        saveContent();
    };

    const saveContent = () => {
        saveStashContentList({
            subject_id,
            article_ids: data.map((it) => it.id).join(','),
        }).then((res) => {
            if (res.code === '000000') {
                canGoBack.current = true;
                navigation.goBack();
            } else {
                Toast.show(res.message);
            }
        });
    };

    const handleBack = () => {
        // 编辑场景，自动保存
        if (scene !== 'create') {
            canGoBack.current = true;
            saveContent();
            return;
        }

        Modal.show({
            content: '已编辑内容是否要保存草稿？下次可继续编辑。',
            cancelText: '不保存草稿',
            confirmText: '保存草稿',
            confirm: true,
            backCloseCallbackExecute: true,
            cancelCallBack: () => {
                canGoBack.current = true;
                navigation.goBack();
            },
            confirmCallBack: () => {
                saveContent();
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
            Toast.show(pageData.tip.replace('*', ''));
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
    const renderListHeader = () => {
        return <View style={styles.listHeader} />;
    };
    const showToast = (msg) => {
        bottomModal?.current?.toastShow(msg);
    };
    if (loading) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
                <NavBar title={'精选内容'} leftIcon="chevron-left" />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }

    if (!pageData) return null;

    const bottomModalConfig = Platform.select({
        ios: {
            keyboardAvoiding: false,
            height: deviceHeight - 200,
        },
        android: {
            keyboardAvoiding: true, // 配置在android 可能不生校
            height: deviceHeight - 400,
        },
    });

    return (
        <View style={styles.pageWrap}>
            <NavBar
                title={pageData?.title ?? '精选内容'}
                leftIcon="chevron-left"
                rightText={scene === 'create' ? '保存' : '完成'}
                rightPress={rightPress}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.contentWrap}>
                <FlatList
                    style={{flex: 1}}
                    data={data}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty()}
                    ListHeaderComponent={renderListHeader()}
                    ListHeaderComponentStyle={styles.listHeader}
                    ListFooterComponent={
                        <FooterItem
                            onAdd={handleAdd}
                            data={pageData || {}}
                            cansort={data?.length > 0}
                            onSort={handleSort}
                        />
                    }
                    keyExtractor={(item, index) => `${item.title + index}`}
                />
            </View>
            <BottomModal
                ref={bottomModal}
                style={{paddingBottom: 0}}
                title="添加内容"
                keyboardAvoiding={bottomModalConfig.keyboardAvoiding}
                showClose={true}
                confirmText="确定"
                children={
                    <ContentSearchModal
                        style={{height: bottomModalConfig.height}}
                        subject_id={subject_id}
                        showToast={showToast}
                        selected={data}
                        setSelected={setData}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    right_sty: {
        marginRight: px(14),
        color: '#121D3A',
    },
    pageWrap: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    contentWrap: {
        flex: 1,
        paddingLeft: px(16),
        paddingRight: px(16),
        backgroundColor: '#F5F6F8',
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
        backgroundColor: '#e9eaef',
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
        width: 100,
        height: 70,
        borderRadius: 6,
        marginLeft: 12,
        backgroundColor: 'lightgray',
    },
    listHeader: {
        height: px(16),
        width: '100%',
    },
    footerWrap: {
        width: '100%',
    },
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
        // height: deviceHeight - 500,
        minHeight: 300,
        paddingVertical: 16,
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
        paddingHorizontal: 16,
    },
    searchItem_first: {
        marginTop: 12,
    },
    searchItem_content: {
        flex: 1,
    },
    searchItem_title: {
        fontSize: px(13),
        lineHeight: px(17),
        fontWeight: 'bold',
        color: '#121D3A',
    },
    SearchItem_desc: {
        marginTop: px(4),
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
        width: 120,
        height: 64,
    },
    searchEmpty_text: {
        color: '#121D3A',
        fontSize: px(13),
    },
    searchFooterWrap: {
        width: '100%',
        ...Style.flexCenter,
        paddingTop: px(15),
    },
});
