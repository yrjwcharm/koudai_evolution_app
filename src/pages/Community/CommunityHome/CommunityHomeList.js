/*
 * @Date: 2022-11-28 14:43:36
 * @Description:社区主页列表
 */
import {StyleSheet, Text, ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Space} from '~/common/commonStyle';
import {addProduct} from './service';
import {CommunityCard} from '../components/CommunityCard';
import ProductCards from '../../../components/Portfolios/ProductCards';
import {FlatList} from 'react-native-scroll-head-tab-view';
import {PublishContent} from '../CommunityIndex';
import {ChooseModal} from '../CommunityVodCreate';
import EmptyTip from '~/components/EmptyTip';
import {Button} from '~/components/Button';

import {AlbumCard} from '~/components/Product';
import {ProductList} from '../../../components/Product';
const CommunityHomeList = forwardRef(({getData = () => {}, params, muid, history_id, show_add_btn, ...rest}, ref) => {
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const chooseModal = useRef();
    const flatlistRef = useRef();
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
    const refresh = () => {
        flatlistRef.current?.scrollToOffset?.({animated: false, offset: 0});
        setRefreshing(true);
        page > 1 ? setPage(1) : init();
    };
    //添加
    const handleAddProduct = async (_data) => {
        if (_data?.length > 0) {
            const relation_list = _data?.map?.((item) => ({id: item.id, type: item.relation_type})) || [];
            const res = await addProduct({
                community_id: params.community_id,
                relation_list: JSON.stringify(relation_list),
            });
            if (res.code === '000000') {
                refresh();
            }
        }
    };

    const renderItem = ({item = {}}) => {
        return params.type == 1 ? (
            <CommunityCard data={item} style={{flex: 1}} x />
        ) : item?.relation_type == 4 || item?.relation_type == 1 ? (
            <ProductList data={[item]} style={styles.card} />
        ) : (
            <AlbumCard {...item} style={{marginTop: px(12), flex: 1}} />
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

    useImperativeHandle(ref, () => ({refresh}));
    const renderEmpty = () => {
        return params.type == 1 ? (
            <EmptyTip
                desc={show_add_btn ? '请点击按钮进行添加' : ''}
                text={'暂无相关作品'}
                style={{marginTop: px(200)}}
                imageStyle={{marginBottom: px(-30)}}>
                {show_add_btn && (
                    <Button
                        onPress={() => {
                            chooseModal?.current?.show('article');
                        }}
                        title="添加作品"
                        style={styles.addBtn}
                        textStyle={{fontSize: px(13)}}
                    />
                )}
            </EmptyTip>
        ) : (
            <EmptyTip
                desc={show_add_btn ? '请点击按钮进行添加' : ''}
                text={'暂无相关产品'}
                style={{marginTop: px(200)}}
                imageStyle={{marginBottom: px(-30)}}>
                {show_add_btn && (
                    <Button
                        onPress={() => {
                            chooseModal?.current?.show('all');
                        }}
                        title="添加产品"
                        style={styles.addBtn}
                        textStyle={{fontSize: px(13)}}
                    />
                )}
            </EmptyTip>
        );
    };

    useEffect(() => {
        init();
    }, [page]);
    return (
        <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
            {data?.length > 0 ? (
                <FlatList
                    ref={flatlistRef}
                    keyExtractor={(item) => item.id.toString()}
                    style={{flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)}}
                    data={data}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    renderItem={renderItem}
                    {...rest}
                    ListFooterComponent={renderFooter}
                />
            ) : loading ? (
                <View style={{marginTop: px(300)}}>
                    <ActivityIndicator color={'#ddd'} />
                </View>
            ) : (
                renderEmpty()
            )}
            <ChooseModal ref={chooseModal} onDone={handleAddProduct} />
            <PublishContent
                community_id={params.community_id}
                history_id={history_id}
                muid={muid}
                type={params.type}
                handleClick={(type) => {
                    setTimeout(() => {
                        chooseModal?.current?.show(type, data);
                    }, 100);
                }}
            />
        </View>
    );
});

export default CommunityHomeList;

const styles = StyleSheet.create({
    addBtn: {
        width: px(180),
        height: px(36),
        borderRadius: px(100),
        marginTop: px(16),
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },

    card: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: px(12),
        padding: px(12),
        borderRadius: px(6),
    },
});
