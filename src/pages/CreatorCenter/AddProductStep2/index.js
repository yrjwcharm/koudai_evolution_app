/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-12 14:19:09
 */
import React, {useCallback, useRef, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import {ProductList} from '~/components/Product';
import RenderHtml from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';
import CategoryProductList from './CategoryProductList';
import {getData, goSave, getListData} from './services';
import {cloneDeep} from 'lodash';
import Toast from '~/components/Toast';

const AddProductStep2 = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();
    const [listData, setListData] = useState({});
    const [tabActive, setTabActive] = useState(0);
    const handlerSelectToListRef = useRef();
    const handlerEditProductRef = useRef();
    const handlerSortProductRef = useRef();
    const handlerTopButtonRef = useRef();
    const skipBackListener = useRef();

    const style_data = useMemo(() => listData?.style_data, [listData]);
    const listLength = useMemo(() => {
        return (
            (data?.data?.category_mode === 1
                ? style_data?.items?.length
                : style_data?.groups?.[tabActive]?.items?.length) || 0
        );
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
                getList(params);
                // 设置标题栏
                navigation.setOptions({
                    title: res.result.title || '添加产品',
                    headerRight: function () {
                        return res.result?.top_button ? (
                            <Text
                                suppressHighlighting={true}
                                style={styles.topBtnText}
                                onPress={() => {
                                    handlerTopButtonRef.current();
                                }}>
                                {res.result?.top_button?.text}
                            </Text>
                        ) : null;
                    },
                });
            }
        });
    }, []);

    const getList = (params) => {
        const loading = Toast.showLoading();
        getListData(params)
            .then((result) => {
                if (result.code === '000000') {
                    setListData(result.result);
                }
            })
            .finally((_) => {
                Toast.hide(loading);
            });
    };

    const handlerSelectToList = useCallback(
        (option = []) => {
            if (!data) return;
            if (data?.data?.category_mode === 2) {
                setData((val) => {
                    // 更新原始map中的当前产品
                    let newVal = cloneDeep(val);
                    newVal.data.categories[tabActive].products = option;
                    //不再自己循环找出对应项修改 通过接口更新
                    getList({
                        ...route.params,
                        categories: JSON.stringify(newVal.data.categories || []),
                    });
                    return newVal;
                });
            } else {
                setData((val) => {
                    // 更新原始map的当前的产品
                    let newVal = cloneDeep(val);
                    newVal.data.products = option || [];

                    //不再自己循环找出对应项修改 通过接口更新
                    getList({
                        ...route.params,
                        products: JSON.stringify(newVal.data.products || []),
                    });
                    return newVal;
                });
            }
        },
        [data, tabActive]
    );

    const handlerEditProduct = useCallback(
        (option) => {
            if (data?.data?.category_mode === 2) {
                setData((val) => {
                    // 更新原始map的当前产品
                    let newVal = cloneDeep(val);
                    let products = newVal.data.categories?.[tabActive]?.products || [];
                    let obj = products.find((item) => item.product_id === option.product_id);
                    // 如果style_id被更改了，则更新当前分类所有style_id
                    if (obj.style_id !== option.style_id) {
                        products.forEach((prd) => {
                            prd.style_id = option.style_id;
                        });
                    }
                    for (let key in option) {
                        obj[key] = option[key];
                    }
                    //不再自己循环找出对应项修改 通过接口更新
                    getList({
                        ...route.params,
                        categories: JSON.stringify(newVal.data.categories || []),
                    });
                    return newVal;
                });
            } else {
                setData((val) => {
                    // 更新原始map的当前的产品
                    let newVal = cloneDeep(val);
                    let obj = newVal.data.products.find((item) => item.product_id === option.product_id);
                    // 如果style_id被更改了，则更新当前列表所有style_id
                    if (obj.style_id !== option.style_id) {
                        newVal.data.products.forEach((prd) => {
                            prd.style_id = option.style_id;
                        });
                    }
                    for (let key in option) {
                        obj[key] = option[key];
                    }
                    //不再自己循环找出对应项修改 通过接口更新
                    getList({
                        ...route.params,
                        products: JSON.stringify(newVal.data.products || []),
                    });
                    return newVal;
                });
            }
        },
        [data, tabActive]
    );

    const handlerSortProduct = useCallback(
        (option) => {
            if (!data) return;
            if (data?.data?.category_mode === 1) {
                setListData((val) => {
                    let newVal = {...val};
                    newVal.style_data.items = option;
                    return {...newVal};
                });
                setData((val) => {
                    // 更新原始map的当前的产品
                    let newVal = cloneDeep(val);
                    newVal.data.products = option.map((opt) =>
                        newVal.data.products.find((item) => item.product_id === opt.product_id)
                    );
                    return newVal;
                });
            } else {
                setListData((val) => {
                    let newVal = {...val};
                    newVal.style_data.groups[tabActive].items = option;
                    return {...newVal};
                });
                setData((val) => {
                    // 更新原始map的当前产品
                    let newVal = cloneDeep(val);
                    newVal.data.categories[tabActive].products = option.map((opt) =>
                        newVal.data.categories[tabActive].products.find((item) => item.product_id === opt.product_id)
                    );
                    return newVal;
                });
            }
        },
        [data, tabActive]
    );

    useEffect(() => {
        DeviceEventEmitter.addListener('selectToList', (option) => {
            setTimeout(() => {
                handlerSelectToListRef.current(option);
            }, 500);
        });
        DeviceEventEmitter.addListener('editProduct', (option) => {
            setTimeout(() => {
                handlerEditProductRef.current(option);
            }, 500);
        });
        DeviceEventEmitter.addListener('sortProduct', (option) => {
            setTimeout(() => {
                handlerSortProductRef.current(option);
            }, 500);
        });
        // 监听返回
        let lister = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            if (skipBackListener.current) {
                navigation.dispatch(e.data.action);
                return;
            }
            Modal.show({
                content: '已编辑内容是否要保存草稿？下次可继续编辑',
                confirm: true,
                confirmText: '保存草稿',
                cancelText: '不保存草稿',
                confirmCallBack: () => {
                    handlerTopButtonRef.current(() => {
                        navigation.dispatch(e.data.action);
                    });
                },
                cancelCallBack: () => {
                    navigation.dispatch(e.data.action);
                },
            });
        });
        return () => {
            DeviceEventEmitter.removeAllListeners('selectToList');
            DeviceEventEmitter.removeAllListeners('editProduct');
            DeviceEventEmitter.removeAllListeners('sortProduct');
            lister?.();
        };
    }, []);

    useEffect(() => {
        handlerSelectToListRef.current = handlerSelectToList;
        handlerEditProductRef.current = handlerEditProduct;
        handlerSortProductRef.current = handlerSortProduct;
        handlerTopButtonRef.current = handlerTopButton;
    }, [handlerSelectToList, handlerEditProduct, handlerSortProduct, handlerTopButton]);

    const handlerTopButton = useCallback(
        (afterCallback) => {
            let hasEmpty = false;
            if (data?.data?.category_mode === 2) {
                hasEmpty = data.data.categories.find((item) => !item.products?.length);
            } else {
                hasEmpty = !data.data.products?.length;
            }
            if (hasEmpty) {
                Modal.show({
                    content: '尚有分类未添加产品，请调整后再提交',
                    confirmText: '我知道了',
                });
            } else {
                const d = data.data;
                let params = {...d};
                if (d?.category_mode === 1) {
                    params.products = JSON.stringify(d.products || []);
                } else {
                    params.categories = JSON.stringify(d.categories || []);
                }
                let loading = Toast.showLoading();
                goSave(params)
                    .then((res) => {
                        if (res.code === '000000') {
                            Toast.show('保存成功');

                            setTimeout(() => {
                                if (afterCallback) {
                                    afterCallback();
                                } else {
                                    skipBackListener.current = true;
                                    jump(data.top_button.url);
                                }
                            }, 1000);
                        }
                    })
                    .finally((_) => {
                        Toast.hide(loading);
                    });
            }
        },
        [route, jump, data]
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
                let obj = listData.style_data.groups.find((itm) => item.id === itm.id);
                return obj || {};
            });
            let listData2 = {...listData};
            listData2.style_data.groups = _groups;
            setListData(listData2);
        },
        [data, listData]
    );

    const handlerSort = () => {
        jump({
            path: 'SortProduct',
            params: {
                data: data?.data?.category_mode === 1 ? style_data?.items : style_data?.groups?.[tabActive]?.items,
            },
        });
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
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
                        disabled={!listLength}
                        style={styles.bottomBtn}
                        onPress={handlerSort}>
                        <FastImage
                            style={{width: px(16), height: px(16)}}
                            source={{
                                uri: `https://static.licaimofang.com/wp-content/uploads/2022/10/edit-sort${
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
                        onPress={() => {
                            const selections =
                                (data?.data?.category_mode === 1
                                    ? data?.data.products
                                    : data?.data?.categories[tabActive]?.products) || [];
                            jump({
                                path: 'SelectProduct',
                                params: {
                                    max_products_num: cateNumInfo.max_products_num,
                                    product_type: selections?.[0]?.product_type || 0, // 0 皆可 1 基金 2 组合
                                    selections,
                                },
                            });
                        }}>
                        <FastImage
                            style={{width: px(16), height: px(16)}}
                            source={{
                                uri: `https://static.licaimofang.com/wp-content/uploads/2022/10/add-prd${
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
            <View style={{height: 38}} />
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
        alignItems: 'center',
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
