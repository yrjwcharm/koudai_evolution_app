/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 12:42:43
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyRecommend.js
 * @Description: 修改专题 - 选择推广位样式
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import NavBar from '~/components/NavBar';
import {isIphoneX, px, requestAuth} from '~/utils/appUtil';
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
import {getRecommendInfo, saveRecommendInfo, uploadImage} from './services';

import LoadingTips from '~/components/LoadingTips';

function RecommendCell(props) {
    const {index, curIndex, onSelect, title, children} = props;
    return (
        <View style={styles.cellWrap}>
            <TouchableOpacity
                style={[styles.cellWrap_header, index === 0 ? {marginTop: 12} : {}]}
                onPress={() => onSelect(index)}>
                <Radio checked={curIndex === index} />
                <Text style={styles.cellWrap_title}>{title}</Text>
            </TouchableOpacity>
            {children}
        </View>
    );
}

const blockCal = () => {
    Modal.show({
        title: '权限申请',
        content: '权限没打开,请前往手机的“设置”选项中,允许该权限',
        confirm: true,
        confirmText: '前往',
        confirmCallBack: () => {
            openSettings().catch(() => console.warn('cannot open settings'));
        },
    });
};

const example = {
    title: '<span style="color:#E74949">年度重磅！</span>再管基近3年<span style="color:#E74949">涨超203%</span>',
    desc: '股债平衡组合',
    tags: ['某某首只新发', '在管基近1年同类3%', '策略稀缺'],
};

export default function SpecialModifyRecommend({route, navigation}) {
    const jump = useJump();
    const {subject_id} = route?.params ?? {};
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setLoading(true);
        getRecommendInfo({subject_id})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    setIndex(res.result.selected);
                }
            })
            .finally((_) => {
                setLoading(false);
            });
    }, []);

    const rightPress = () => {
        if (index === 0) return;
        if (index === 1) {
            handlePickAlumn();
        } else {
            jump({
                path: 'SpecialModifyProductInfo',
                params: {
                    subject_id,
                    items: data.rec_product.items || [],
                },
            });
        }
    };
    const handleBack = () => {
        navigation.goBack();
        // Modal.show({
        //     content: '已编辑内容是否要保存草稿？下次可继续编辑。',
        //     cancelText: '不保存草稿',
        //     confirmText: '保存草稿',
        //     confirm: true,
        //     backCloseCallbackExecute: true,
        //     cancelCallBack: () => {
        //         navigation.goBack();
        //     },
        //     confirmCallBack: () => {
        //         saveRecommendInfo({
        //             subject_id: subject_id || 0,
        //             name: title,
        //             bg_img: bgSource,
        //             desc: desc,
        //             tags,
        //         }).then((_) => {
        //             navigation.goBack();
        //         });
        //     },
        // });
    };

    const openPicker = () => {
        setTimeout(() => {
            ImagePicker.openPicker({
                width: px(1125),
                height: px(600),
                cropping: true,
                cropperChooseText: '选择',
                cropperCancelText: '取消',
                loadingLabelText: '加载中',
                mediaType: 'photo',
            })
                .then((image) => {
                    uploadImage({
                        fileName: image.filename,
                        type: image.mime,
                        uri: image.path,
                    }).then((res) => {
                        if (res.code === '000000') {
                            jump({
                                path: 'SpecialPreviewRecommend',
                                params: {
                                    type: 1,
                                    uri: res.result.url,
                                    subject_id,
                                    onSave: () => {
                                        navigation.goBack(-2);
                                    },
                                },
                            });
                        }
                    });
                })
                .catch((err) => {
                    console.warn(err);
                });
        }, 200);
    };
    const handlePickAlumn = () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, openPicker, blockCal);
            } else {
                requestAuth(PERMISSIONS.IOS.PHOTO_LIBRARY, openPicker, blockCal);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleSelect = (type) => {
        // TODO: tip
        setIndex(type);
    };

    if (loading && !data) {
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
                    type={data.rec_subject.rec_type}
                    curIndex={index}
                    onSelect={handleSelect}>
                    <RecommendItemWrap tabs={['推广位一', '推广位二']}>
                        <RecommendImage />
                        <RecommendImage />
                    </RecommendItemWrap>
                </RecommendCell>
                <RecommendCell title="选择推广专题中的产品" type={data.rec_product.rec_type} onSelect={handleSelect}>
                    <RecommendItemWrap tabs={['推广位一', '推广位二']}>
                        <RecommendProduct {...example} />
                        <RecommendProduct {...example} />
                    </RecommendItemWrap>
                </RecommendCell>
                <Text style={styles.tip}>*实际推广位内容将参考用户来源、用户特征等指标综合推荐</Text>
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
    tip: {
        marginTop: px(15),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
});
