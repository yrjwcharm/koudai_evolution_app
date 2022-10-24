/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-24 18:27:25
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyRecommend.js
 * @Description: 修改专题 - 选择推广位样式
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useJump} from '~/components/hooks';
import Radio from '~/components/Radio.js';

import {getRecommendInfo, getRecommendProductInfo} from './services';
import pickerUploadImg from '~/utils/pickerUploadImg';
import LoadingTips from '~/components/LoadingTips';
import {Modal} from '~/components/Modal';
import {useFocusEffect} from '@react-navigation/native';

function RecommendCell(props) {
    const {type, curType, onSelect, title, children} = props;
    return (
        <View style={styles.cellWrap}>
            <TouchableOpacity
                style={[styles.cellWrap_header, type === 1 ? {marginTop: 12} : {}]}
                onPress={() => onSelect(type)}>
                <Radio checked={curType === type} />
                <Text style={styles.cellWrap_title}>{title}</Text>
            </TouchableOpacity>
            {children}
        </View>
    );
}

const example = {
    title: '<span style="color:#E74949">年度重磅！</span>再管基近3年<span style="color:#E74949">涨超203%</span>',
    desc: '股债平衡组合',
    tags: ['某某首只新发', '在管基近1年同类3%', '策略稀缺'],
};

export default function SpecialModifyRecommend({route, navigation}) {
    const jump = useJump();
    const subject_id = route?.params?.subject_id || 1043;
    console.log('SpecialModifyRecommend:', route?.params);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [index, setIndex] = useState(0);
    const items = useRef([]);
    const oldIndex = useRef(0);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getRecommendInfo({subject_id})
                .then((res) => {
                    if (res.code === '000000') {
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
                            product_id: it?.id,
                            product_type: it?.type,
                            product_name: it?.val,
                        };
                        its.push(item);
                    });
                    items.current = its;
                }
            });
        }, [])
    );

    const rightPress = () => {
        const isChanged = oldIndex.current !== index;
        if (index === 0) return;
        if (index === 1) {
            handlePickAlumn();
        } else {
            jump({
                path: 'SpecialModifyProductInfo',
                params: {
                    ...(route?.params ?? {}),
                    type: 2,
                    items: isChanged ? [] : items,
                },
            });
        }
    };
    const handleBack = () => {
        navigation.goBack();
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
                        navigation.goBack(-2);
                    },
                },
            });
        });
    };

    const handleSelect = (type) => {
        const isChanged = oldIndex.current !== type;
        if (isChanged) {
            Modal.show({
                content: '更换样式后，需要重新编辑推广信息，确定更换么？',
                cancelText: '不更换',
                confirmText: '确认更换',
                confirm: true,
                backCloseCallbackExecute: true,
                cancelCallBack: () => {
                    // setIndex(oldIndex.current)
                },
                confirmCallBack: () => {
                    setIndex(type);
                },
            });
        } else {
            setIndex(type);
        }
    };

    if (loading || !data) {
        return (
            <SafeAreaView edges={['bottom']}>
                <NavBar title={'推广位样式设置'} leftIcon="chevron-left" leftPress={handleBack} />
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
                    type={data.rec_subject.rec_type}
                    onSelect={handleSelect}>
                    <FastImage source={{uri: data.rec_subject.bg_img}} style={styles.cardImg} />
                </RecommendCell>
                <RecommendCell
                    title="选择推广专题中的产品"
                    curType={index}
                    type={data.rec_product.rec_type}
                    onSelect={handleSelect}>
                    <FastImage source={{uri: data.rec_product.bg_img}} style={styles.cardImg} />
                </RecommendCell>
                <Text style={styles.tip}>{data.tip}</Text>
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
        marginTop: px(16),
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
