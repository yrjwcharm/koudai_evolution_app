/*
 * @Date: 2022-10-14 17:56:43
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-24 18:50:40
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialPreviewRecommend.js
 * @Description: 修改专题 - 修改推广位 - 推广位预览
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import NavBar from '~/components/NavBar';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {Style, Colors, Space} from '~/common/commonStyle';
import Input from '~/components/Input';
import {useJump} from '~/components/hooks';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import Radio from '~/components/Radio.js';
import {Children} from 'react/cjs/react.production.min';
import Html from '~/components/RenderHtml';
import {RecommendItemWrap, RecommendProduct, RecommendImage} from '../../components/SpecialRecommend.js';
import {saveRecommendInfo} from './services.js';
export default function SpecialPreviewRecommend(props) {
    const {type, uri, subject_id, fix_id, items} = props.route?.params ?? {};
    const jump = useJump();
    let tabs = [];
    if (type === 2) {
        const nums = ['一', '二', '三'];
        tabs = items.map((i, index) => `推广位${nums[index]}`);
    }

    const handleSaveBaseInfo = () => {
        const params = {sid: subject_id, save_status: 2, rec_type: type};
        if (type === 1) {
            params.s_img = uri;
        } else {
            params.products = JSON.stringify(
                items.map((it) => ({
                    product_id: it.product?.product_id || '',
                    product_type: it.product?.product_type || '',
                    name: it.product?.product_name || '',
                    desc: it.desc || '',
                    tags: it.tags || [],
                }))
            );
        }
        saveRecommendInfo(params).then((res) => {
            if (res.code === '000000') {
                jump({
                    path: 'SpecialModifyEntry',
                    params: {
                        subject_id,
                        fix_id,
                    },
                });
            }
        });
    };
    const handleBack = () => {
        props.navigation.goBack();
    };
    const renderRecommandCards = () => {
        let filterdItems = items.filter((it) => it.product && it.product.product_id && it.desc && it.tags?.length > 0);
        let filterTabs = tabs.slice(0, filterdItems.length);
        return (
            <View style={styles.cellWrap}>
                <RecommendItemWrap tabs={filterTabs}>
                    {(filterdItems || []).map((item, index) => (
                        <RecommendProduct {...item} />
                    ))}
                </RecommendItemWrap>
            </View>
        );
    };
    return (
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={'样式预览'}
                leftIcon="chevron-left"
                rightText={'保存'}
                rightPress={handleSaveBaseInfo}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.pageWrap}>
                {type === 1 ? (
                    <View style={styles.flexWrap}>
                        <RecommendImage uri={uri} />
                    </View>
                ) : (
                    renderRecommandCards()
                )}
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
        display: 'flex',
    },
    flexWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
    },
    cellWrap: {
        paddingLeft: px(16),
        paddingRight: px(16),
        marginTop: px(16),
    },
});
