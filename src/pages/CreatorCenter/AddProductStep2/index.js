/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-12 14:19:09
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import {ProductList} from '~/components/Product';
import RenderHtml from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';
import CategoryProductList from './CategoryProductList';
import {getData, getListData} from './services';
import {cloneDeep} from 'lodash';

const AddProductStep2 = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();
    const [listData, setListData] = useState({});
    const [tabActive, setTabActive] = useState(0);

    const style_data = useMemo(() => listData?.style_data, [listData]);
    const listLength = useMemo(() => {
        return data?.data?.category_mode === 1
            ? style_data?.items?.length
            : style_data?.groups?.[tabActive]?.items?.length;
    }, [data, style_data, tabActive]);

    const cateNumInfo = useMemo(() => {
        return data?.data?.category_mode === 1 ? data?.num_info?.no_cate : data?.num_info?.has_cate;
    }, [data]);

    useEffect(() => {
        getData(route.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                // 获得列表数据
                const d = res.result?.data;
                const params = {
                    ...route?.params,
                };
                if (d?.category_mode === 1) {
                    params.products = JSON.stringify(d.products || []);
                } else {
                    params.categories = JSON.stringify(d.categories || []);
                }
                getList(params, d?.category_mode, d.categories);
                // 设置标题栏
                navigation.setOptions({
                    title: res.result.title || '添加产品',
                    headerRight: function () {
                        return res.result?.top_button ? (
                            <Text
                                suppressHighlighting={true}
                                style={styles.topBtnText}
                                onPress={() => {
                                    handlerTopButton(res.result.top_button);
                                }}>
                                {res.result?.top_button?.text}
                            </Text>
                        ) : null;
                    },
                });
            }
        });
    }, [route, navigation, handlerTopButton]);

    const getList = (params, mode, categories) => {
        getListData(params).then((result) => {
            if (result.code === '000000') {
                if (mode === 2) {
                    // 添加分类id
                    result.result?.style_data?.groups?.forEach((g, index) => {
                        g.category_id = categories[index].id;
                        // g.items.forEach((item) => {
                        //     item.edit_button.handler = () => {
                        //         jump({
                        //             path: 'EditProduct',
                        //             params: {
                        //                 desc: item.reason,
                        //                 id: item.id,
                        //             },
                        //         });
                        //     };
                        // });
                    });
                }
                setListData(result.result);
            }
        });
    };

    useEffect(() => {
        DeviceEventEmitter.addListener('editProduct', (option) => {
            if (option.category_id) {
                setData((val) => {
                    // 更新原始map的当前产品
                    let newVal = cloneDeep(val);
                    let products = newVal.categories.find((item) => item.id === option.category_id);
                    let obj = products.find((item) => item.id === option.id);
                    for (let key in obj) {
                        obj[key] = option[key];
                    }
                    //不再自己循环找出对应项修改 通过接口更新
                    getList(
                        {
                            ...route.params,
                            categories: JSON.stringify(newVal.categories || []),
                        },
                        2,
                        newVal.categories
                    );
                    return newVal;
                });
            } else {
                setData((val) => {
                    // 更新原始map的当前产品
                    let newVal = cloneDeep(val);
                    let obj = newVal.products.find((item) => item.id === option.id);
                    for (let key in obj) {
                        obj[key] = option[key];
                    }
                    //不再自己循环找出对应项修改 通过接口更新
                    getList({
                        ...route.params,
                        products: JSON.stringify(newVal.products || []),
                    });
                    return newVal;
                });
            }
        });
    }, [route.params]);

    const handlerTopButton = useCallback(
        (button) => {
            if (false) {
                Modal.show({
                    content: '更换样式后不保留已添加的产品，确定更换吗？',
                    confirm: true,
                    confirmText: '不更换',
                    cancelText: '确定更换',
                    confirmCallBack: () => {
                        // setStyleCheck(initStyleCheckRef.current);
                        // jump(button.url);
                    },
                    cancelCallBack: () => {
                        // goSave({
                        //     subject_id: route.params?.subject_id,
                        //     style_type: styleCheckRef.current,
                        // }).then((res) => {
                        //     if (res.code === '000000') {
                        //         initStyleCheckRef.current = styleCheckRef.current;
                        //         jump(button.url);
                        //     }
                        // });
                    },
                });
            } else {
                jump(button.url);
            }
        },
        [route, jump]
    );

    const onTabChange = (idx) => {
        setTabActive(idx);
    };

    const originDataChange = useCallback(
        (categories) => {
            // 更新原始数据的分类顺序
            const data2 = {...data};
            data2.data.categories = categories;
            setData(data);

            // 更新原始数据的列表顺序
            const _groups = categories.map((item) => {
                let obj = listData.style_data.groups.find((itm) => item.id === itm.category_id);
                return obj || {};
            });
            let listData2 = {...listData};
            listData2.style_data.groups = _groups;
            setListData(listData2);
        },
        [data, listData]
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: px(12)}}>
                <RenderHtml html={data?.step_desc} />
            </View>
            <View style={styles.mainCard}>
                {data?.data?.category_mode === 1 ? (
                    listLength ? (
                        <View style={styles.listWrap}>
                            <ProductList data={style_data?.items} type={style_data?.style_type} />
                        </View>
                    ) : null
                ) : (
                    <View style={styles.listWrap}>
                        <CategoryProductList
                            data={style_data}
                            originData={data?.data?.categories}
                            tabActive={tabActive}
                            cateNumInfo={cateNumInfo}
                            onTabChange={onTabChange}
                            originDataChange={originDataChange}
                        />
                    </View>
                )}
                <View style={styles.mainCardBottom}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!!listLength}
                        style={styles.bottomBtn}
                        onPress={() => {}}>
                        <FastImage
                            style={{width: px(16), height: px(16)}}
                            source={{
                                uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/edit-sort${
                                    listLength ? '' : '-disable'
                                }.png`,
                            }}
                        />
                        <Text style={[styles.bottomBtnText, {color: listLength ? '#0051CC' : '#BDC2CC'}]}>
                            调整列表
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.splitLine} />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={listLength >= cateNumInfo?.max_products_num}
                        style={styles.bottomBtn}
                        onPress={() => {}}>
                        <FastImage
                            style={{width: px(16), height: px(16)}}
                            source={{
                                uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/add-prd${
                                    listLength < cateNumInfo?.max_products_num ? '' : '-disable'
                                }.png`,
                            }}
                        />
                        <Text
                            style={[
                                styles.bottomBtnText,
                                {color: listLength < cateNumInfo?.max_products_num ? '#0051CC' : '#BDC2CC'},
                            ]}>
                            添加产品
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {data?.num_info?.num_desc ? <Text style={styles.desc}>{data?.num_info?.num_desc}</Text> : null}
        </ScrollView>
    );
};

export default AddProductStep2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: px(16),
        backgroundColor: '#F5F6F8',
    },
    topBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
        marginRight: px(14),
    },
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(12),
    },
    listWrap: {
        paddingVertical: px(12),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    mainCardBottom: {
        flexDirection: 'row',
    },
    bottomBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: px(12),
        flex: 1,
    },
    splitLine: {
        height: px(17),
        width: 0.5,
        backgroundColor: '#E9EAEF',
    },
    bottomBtnText: {
        fontSize: px(12),
        lineHeight: px(17),
        marginLeft: px(4),
    },
    desc: {
        marginTop: px(12),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9aa0b1',
    },
});
