/*
 * @Date: 2022-11-28 14:43:36
 * @Description:
 */
import {StyleSheet, Text, View, Animated, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import React, {forwardRef, useImperativeHandle, useEffect, useRef, useState} from 'react';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Space} from '~/common/commonStyle';
import {getCommunityHomeData, getCommunityProductList, removeProduct, addProduct} from './service';
import CommunityHomeHeader from '../components/CommunityHomeHeader';
import Intro from './Intro';
import {PublishContent} from '../CommunityIndex';
import {CommunityCard} from '../components/CommunityCard';
import ProductCards from '../../../components/Portfolios/ProductCards';
import {Modal, ShareModal} from '../../../components/Modal';
import EmptyTip from '../../../components/EmptyTip';
import {Button} from '../../../components/Button';
import {ChooseModal} from '../CommunityVodCreate';
import {ScrollTabView, FlatList, ScrollView} from 'react-native-scroll-head-tab-view';
import {useFocusEffect} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {useJump} from '~/components/hooks';

const CommunityHomeList = forwardRef(({getData = () => {}, params, children, ...rest}, ref) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const waterfallFlow = useRef();
    const waterfallWrapper = useRef();
    const [resource_private_tip, setTip] = useState('');
    const [loading, setLoading] = useState(true);
    const init = () => {
        getData({...params, page})
            .then((res) => {
                if (res.code === '000000') {
                    const _data = res.result;
                    setHasMore(!(_data?.length < params.page_size));
                    setData((prev) => (page === 1 ? _data : prev.concat(_data)));
                }
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };
    const onDelete = ({type, item_id}) => {
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
        return <Text style={{lineHeight: 100, fontSize: 50}}>1312312</Text>;
        // return data?.length > 0 && !refreshing ? (
        //     <Text style={[styles.desc, {paddingVertical: Space.padding, textAlign: 'center'}]}>
        //         {hasMore ? '正在加载...' : '我们是有底线的...'}
        //     </Text>
        // ) : null;
    };
    const refresh = () => {
        page > 1 ? setPage(1) : init();
    };
    useImperativeHandle(ref, () => ({refresh}));
    useEffect(() => {
        init();
    }, [page]);
    return data?.length > 0 ? (
        <FlatList
            keyExtractor={(item) => item.id}
            style={{flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)}}
            data={data}
            renderFooter={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            renderItem={renderItem}
            {...rest}
        />
    ) : loading ? (
        <ActivityIndicator color={'#ddd'} />
    ) : (
        {children}
    );
});

export default CommunityHomeList;

const styles = StyleSheet.create({});
