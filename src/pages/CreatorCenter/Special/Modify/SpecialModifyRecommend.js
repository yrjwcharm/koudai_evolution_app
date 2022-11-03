/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-03 18:49:17
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyRecommend.js
 * @Description: 修改专题 - 选择推广位样式
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useJump} from '~/components/hooks';

import {getRecommendInfo, getRecommendProductInfo, saveRecommendInfo} from './services';
import pickerUploadImg from '~/utils/pickerUploadImg';
import LoadingTips from '~/components/LoadingTips';
import {Modal} from '~/components/Modal';
import {useFocusEffect} from '@react-navigation/native';

function RecommendCell(props) {
    const {type, curType, onSelect, title, children} = props;
    return (
        <TouchableOpacity style={styles.cellWrap} onPress={() => onSelect(type)}>
            <View style={[styles.cellWrap_header]}>
                <FastImage
                    source={
                        curType === type
                            ? require('~/assets/img/special/select-1.png')
                            : require('~/assets/img/special/select.png')
                    }
                    style={{width: px(16), height: px(16)}}
                />
                <Text style={styles.cellWrap_title}>{title}</Text>
            </View>
            {children}
        </TouchableOpacity>
    );
}

export default function SpecialModifyRecommend({route, navigation}) {
    const jump = useJump();
    const subject_id = route?.params?.subject_id || 1024;
    console.log('SpecialModifyRecommend:', route?.params);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [index, setIndex] = useState(0);
    const items = useRef([]);
    const oldIndex = useRef(0);
    const tmpItems = useRef([]); // 修改之后的产品信息，可能不保存
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
        }, [])
    );
    useEffect(() => {
        setLoading(true);
        getRecommendInfo({subject_id})
            .then((res) => {
                if (res.code === '000000') {
                    setLoading(false);
                    setData(res.result);
                    setIndex(res.result.selected);
                    oldIndex.current = res.result.selected;
                }
            })
            .finally((_) => {
                setLoading(false);
            });

        getRecommendProductInfo({subject_id}).then((res) => {
            if (res.code === '000000') {
                const its = [];
                res.result.products.map((it) => {
                    let item = {};
                    item.desc = it.desc.val;
                    item.tags = (it.tags || []).map((t) => t.val);
                    item.product = {
                        product_id: it?.product?.id,
                        product_type: it?.product?.type,
                        product_name: it?.product?.val,
                    };
                    its.push(item);
                });
                items.current = its;
            }
        });
    }, []);

    const toNextBtn = (type, withOld) => {
        if (type === 0) return;
        if (type === 1) {
            handlePickAlumn();
        } else {
            jump({
                path: 'SpecialModifyProductInfo',
                params: {
                    onBack: (its) => {
                        tmpItems.current = its;
                    },
                    ...(route?.params ?? {subject_id}),
                    type: 2,
                    items: !withOld ? [] : items.current,
                },
            });
        }
    };

    const rightPress = () => {
        const isChanged = oldIndex.current !== index && oldIndex.current !== 0;

        if (isChanged) {
            Modal.show({
                content: '更换样式后，需要重新编辑推广信息，确定更换么？',
                cancelText: '不更换',
                confirmText: '确认更换',
                confirm: true,
                backCloseCallbackExecute: true,
                cancelCallBack: () => {
                    setIndex(oldIndex.current);
                    toNextBtn(oldIndex.current, true);
                },
                confirmCallBack: () => {
                    toNextBtn(index, false);
                },
            });
        } else {
            toNextBtn(index, true);
        }
    };
    const handleBack = () => {
        // 用户没有选择产品或者没有选择样式
        let info = tmpItems.current;
        if (!info || info.length === 0) {
            canGoBack.current = true;
            navigation.goBack();
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
                handleSaveRecommendInfo().then(() => {
                    canGoBack.current = true;
                    navigation.goBack();
                });
            },
        });
    };

    const handlePickAlumn = () => {
        pickerUploadImg(({url}) => {
            jump({
                path: 'SpecialPreviewRecommend',
                params: {
                    type: 1,
                    uri: url,
                    ...(route?.params ?? {}),
                    onSave: () => {
                        canGoBack.current = true;
                        navigation.goBack(-2);
                    },
                },
            });
        });
    };

    const handleSelect = (type) => {
        setIndex(type);
    };

    const handleSaveRecommendInfo = () => {
        const params = {sid: subject_id, save_status: 1, rec_type: 2};
        console.log('tmpItems.current:', tmpItems.current);

        params.products = JSON.stringify(
            tmpItems.current.map((it) => ({
                product_id: it.product?.product_id ?? '',
                product_type: it.product?.product_type ?? '',
                name: it.product?.product_name ?? '',
                desc: it.desc,
                tags: it.tags,
            }))
        );
        return saveRecommendInfo(params).then((res) => {
            if (res.code === '000000') {
                return Promise.resolve();
            }
            return Promise.reject();
        });
    };

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']}>
                <NavBar title={'推广位样式设置'} leftIcon="chevron-left" />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={'推广位样式设置'}
                leftIcon="chevron-left"
                rightText={'下一步'}
                rightPress={rightPress}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.pageWrap}>
                <RecommendCell
                    title="选择推广该专题"
                    curType={index}
                    type={data?.rec_subject?.rec_type}
                    onSelect={handleSelect}>
                    <FastImage source={{uri: data?.rec_subject?.bg_img}} style={styles.cardImg} />
                </RecommendCell>
                <RecommendCell
                    title="选择推广专题中的产品"
                    curType={index}
                    type={data?.rec_product?.rec_type}
                    onSelect={handleSelect}>
                    <FastImage source={{uri: data?.rec_product?.bg_img}} style={styles.cardImg} />
                </RecommendCell>
                <Text style={styles.tip}>{data?.tip}</Text>
            </View>
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
        minHeight: '100%',
    },
    cellWrap: {
        marginTop: 16,
    },

    cellWrap_header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: px(15),
    },
    cellWrap_title: {
        marginLeft: px(8),
        fontSize: px(13),
        color: '#121D3A',
    },
    cardImg: {
        width: '100%',
        height: px(200),
    },
    tip: {
        marginTop: px(15),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
});
