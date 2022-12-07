/*
 * @Date: 2022-11-28 14:43:36
 * @Description:社区主页列表
 */
import {StyleSheet, Text, ActivityIndicator, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Space} from '~/common/commonStyle';
import {proSort, removeProduct} from './service';
import {CommunityCard} from '../components/CommunityCard';
import {Modal} from '../../../components/Modal';
import EmptyTip from '~/components/EmptyTip';
import CommunityFooter from './CommunityFooter';
import {Style} from '../../../common/commonStyle';
import {AlbumCard} from '~/components/Product';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import {ProductList} from '../../../components/Product';
const CommunityProSortList = ({getData = () => {}, params}) => {
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [chooseDeleteData, setChooseDeleteData] = useState([]);
    const page_size = 20;
    const init = () => {
        getData({...params, page, page_size})
            .then((res) => {
                if (res.code === '000000') {
                    const _data = res.result;
                    setHasMore(!(_data?.length < page_size));
                    setData((prev) => (page === 1 ? _data : prev.concat(_data)));
                }
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };
    const onChooseClick = (type, item_id) => {
        let index = chooseDeleteData.indexOf(item_id);
        setChooseDeleteData((pre) => {
            let tmp = [...pre];
            if (index > -1) {
                tmp.splice(index, 1);
            } else {
                tmp.push(item_id);
            }
            return tmp;
        });
    };
    const onDelete = () => {
        Modal.show({
            content: '您确定要删除吗?',
            confirm: true,
            confirmCallBack: async () => {
                const item_ids = chooseDeleteData.join(',');
                let res = await removeProduct({community_id: params.community_id, item_ids});
                if (res.code == '000000') {
                    setTimeout(() => {
                        DeviceEventEmitter.emit('community_product_change');
                    }, 200);
                    setData((prev) => {
                        let tmp = [...prev];
                        chooseDeleteData.forEach((chooseItem) => {
                            let index = data.findIndex((item) => {
                                return item.item_id == chooseItem;
                            });
                            tmp.splice(index, 1);
                        });

                        return tmp;
                    });
                }
            },
        });
    };
    const sort = (_data) => {
        const item_ids = _data.map((item) => item.item_id).join(',');
        proSort({community_id: params.community_id, item_ids}).then((res) => {
            if (res.code === '000000') {
                setTimeout(() => {
                    DeviceEventEmitter.emit('community_product_change');
                }, 200);
            }
        });
    };
    const renderItem = ({item = {}, drag}) => {
        return (
            <View style={Style.flexRow}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.cardDelete}
                    onPress={() => {
                        onChooseClick(item?.relation_type, item.item_id);
                    }}>
                    <AntdIcon
                        name="checkcircle"
                        color={chooseDeleteData.indexOf(item.item_id) > -1 ? Colors.btnColor : '#ddd'}
                        size={px(16)}
                    />
                </TouchableOpacity>
                {params.type == 1 ? (
                    <CommunityCard data={item} style={{flex: 1}} drag={drag} />
                ) : item?.relation_type == 4 || item?.relation_type == 1 ? (
                    <ProductList data={[item]} drag={drag} style={styles.card} />
                ) : (
                    <AlbumCard {...item} style={{marginTop: px(12), flex: 1}} drag={drag} />
                )}
            </View>
        );
    };

    /** @name 上拉加载 */
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) return false;
        if (hasMore) setPage((p) => p + 1);
    };

    /** @name 渲染底部 */
    const renderFooter = () => {
        return data?.length > 0 && !refreshing ? (
            <Text style={[styles.desc, {paddingVertical: Space.padding, textAlign: 'center'}]}>
                {hasMore ? '正在加载...' : '我们是有底线的...'}
            </Text>
        ) : null;
    };
    const chooseAll = () => {
        if (chooseDeleteData.length == data.length) {
            setChooseDeleteData([]);
        } else {
            setChooseDeleteData(() => {
                return data.map((item) => item.item_id);
            });
        }
    };
    const renderEmpty = () => {
        return params.type == 1 ? (
            <EmptyTip text={'暂无相关作品'} style={{marginTop: px(200)}} imageStyle={{marginBottom: px(-30)}} />
        ) : (
            <EmptyTip text={'暂无相关产品'} style={{marginTop: px(200)}} imageStyle={{marginBottom: px(-30)}} />
        );
    };

    useEffect(() => {
        init();
    }, [page]);
    return (
        <View style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
                {data?.length > 0 ? (
                    <DraggableFlatList
                        keyExtractor={(item) => item.id.toString()}
                        style={{backgroundColor: Colors.bgColor, paddingHorizontal: px(16)}}
                        data={data}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                        renderItem={renderItem}
                        autoscrollSpeed={150}
                        onDragEnd={(_data) => {
                            setData(_data.data);
                            sort(_data.data);
                        }}
                        ListFooterComponent={renderFooter}
                    />
                ) : loading ? (
                    <View style={{marginTop: px(300)}}>
                        <ActivityIndicator color={'#ddd'} />
                    </View>
                ) : (
                    renderEmpty()
                )}
            </View>
            <CommunityFooter
                onDelete={onDelete}
                onChooseAll={chooseAll}
                isAllSelect={chooseDeleteData.length == data.length}
                btnActive={chooseDeleteData.length > 0}
            />
        </View>
    );
};

export default CommunityProSortList;

const styles = StyleSheet.create({
    cardDelete: {
        alignSelf: 'flex-start',
        paddingRight: px(6),
        marginTop: px(12),
        paddingTop: px(16),
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: px(12),
        padding: px(12),
        borderRadius: px(6),
    },
});
