/*
 * @Date: 2022-11-28 14:43:36
 * @Description:社区主页列表
 */
import {StyleSheet, Text, ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Space} from '~/common/commonStyle';
import {addProduct, removeProduct} from './service';
import {CommunityCard} from '../components/CommunityCard';
import ProductCards from '../../../components/Portfolios/ProductCards';
import {Modal} from '../../../components/Modal';
import {FlatList} from 'react-native-scroll-head-tab-view';
import {PublishContent} from '../CommunityIndex';
import {ChooseModal} from '../CommunityVodCreate';
import EmptyTip from '~/components/EmptyTip';
import {Button} from '~/components/Button';

const CommunityHomeList = ({getData = () => {}, params, muid, history_id, show_add_btn, ...rest}) => {
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const chooseModal = useRef();
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
    const onDelete = (type, item_id) => {
        Modal.show({
            content: '您确定要删除吗?',
            confirm: true,
            confirmCallBack: async () => {
                let res = await removeProduct({community_id: params.community_id, type, item_id});
                if (res.code == '000000') {
                    setData((prev) => {
                        let tmp = [...prev];
                        let index = data.findIndex((item) => {
                            return item.id == item_id || item.code == item_id;
                        });
                        tmp.splice(index, 1);
                        return tmp;
                    });
                }
            },
        });
    };
    //添加
    const handleAddProduct = async (_data) => {
        if (_data?.length > 0) {
            const relation_list = _data?.map?.((item) => ({id: item.id, type: item.relation_type})) || [];
            const res = await addProduct({
                community_id: params.community_id,
                relation_list: JSON.stringify(relation_list),
            });
            if (res.code == '000000') {
                refresh();
            }
        }
    };
    const renderItem = ({item = {}}) => {
        return params.type == 1 ? (
            <CommunityCard data={item} onDelete={onDelete} />
        ) : (
            <ProductCards data={item} onDelete={onDelete} />
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

    const refresh = () => {
        page > 1 ? setPage(1) : init();
    };

    useEffect(() => {
        init();
    }, [page]);
    return (
        <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
            {data?.length > 0 ? (
                <FlatList
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
                handleClick={(type) => {
                    setTimeout(() => {
                        chooseModal?.current?.show(type, data);
                    }, 100);
                }}
            />
        </View>
    );
};

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
});
