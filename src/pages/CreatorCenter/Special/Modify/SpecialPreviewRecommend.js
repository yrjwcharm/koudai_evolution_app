/*
 * @Date: 2022-10-14 17:56:43
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-27 18:04:37
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialPreviewRecommend.js
 * @Description: 修改专题 - 修改推广位 - 推广位预览
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavBar from '~/components/NavBar';
import {px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useJump} from '~/components/hooks';

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
            <View style={styles.productCardWrap}>
                <RecommendItemWrap tabs={filterTabs}>
                    {(filterdItems || []).map((item, index) => (
                        <RecommendProduct {...item} />
                    ))}
                </RecommendItemWrap>
            </View>
        );
    };
    return (
        <SafeAreaView edges={['bottom']} style={{flex: 1}}>
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
                    <View style={styles.imageCardWrap}>
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
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imageCardWrap: {
        // minHeight: px(400),
        flex: 1,
        paddingBottom: px(200),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productCardWrap: {
        paddingHorizontal: px(16),
        paddingTop: px(16),
        width: '100%',
    },
});
