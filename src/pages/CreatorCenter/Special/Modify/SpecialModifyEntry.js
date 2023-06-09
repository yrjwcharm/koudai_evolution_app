/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-07 19:26:11
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyEntry.js
 * @Description: 修改专题的入口
 */
import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, SectionList, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import NavBar from '~/components/NavBar';
import {Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, isIphoneX, px} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {BottomModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import LoadingTips from '~/components/LoadingTips';
import {getModifyList, submitModify} from './services';
import {useFocusEffect} from '@react-navigation/native';
import Html from '~/components/RenderHtml';

export default function SpecialModifyEntry({navigation, route}) {
    console.log('SpecialModifyEntry:', route?.params);
    const fix_id = route?.params?.fix_id || 1040;
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitable, setSubmitable] = useState(false);
    const bottomModalRef = useRef(null);
    const jump = useJump();
    const insets = useSafeAreaInsets();
    const subject_idRef = useRef('');

    useFocusEffect(
        useCallback(() => {
            // setLoading(true);
            getModifyList({fix_id: fix_id})
                .then((res) => {
                    console.log('res:', res);
                    if (res.code === '000000') {
                        setData(res.result);
                        subject_idRef.current = res.result.subject_id;
                        if (res.result.edit_num > 0) {
                            setSubmitable(true);
                        }
                    }
                })
                .finally((_) => {
                    setLoading(false);
                });
        }, [fix_id])
    );

    const handleShowTip = () => {
        bottomModalRef.current?.show();
    };
    const handleSubmit = () => {
        submitModify({subject_id: subject_idRef.current}).then((res) => {
            if (res.code === '000000') {
                jump(res.result.url);
            } else {
                Toast.show(res.message);
            }
        });
    };

    const itemSeparatorComponent = () => {
        return (
            <View style={{width: '100%', paddingHorizontal: px(16)}}>
                <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />
            </View>
        );
    };
    const renderSectionHeader = () => {
        return <View style={styles.sectionHeader} />;
    };
    const handleJump = (item) => {
        console.log('item url', item.url);
        jump({
            ...item.url,
            params: {
                ...item.url.params,
                fix_id: fix_id,
            },
        });
    };
    const renderItem = ({item, index, section}) => {
        return (
            <TouchableOpacity style={styles.cell} onPress={() => handleJump(item)}>
                <Text style={styles.cell_title}>{item.name}</Text>
                <View style={styles.cell_descWrap}>
                    <Html style={styles.cell_desc} html={item.status_desc} numberOfLines={1} />
                    <AntDesign name="right" color={'#545968'} size={12} />
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
                <NavBar title={'修改专题'} leftIcon="chevron-left" />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }
    const sections = (data.line_group || []).map((group) => ({data: group.line_list}));

    return (
        <View style={styles.pageWrap}>
            <NavBar title={'修改专题'} leftIcon="chevron-left" />
            <View style={styles.content}>
                <View style={styles.listWrap}>
                    <SectionList
                        sections={sections}
                        initialNumToRender={20}
                        keyExtractor={(item) => item.name}
                        onEndReachedThreshold={0.2}
                        ItemSeparatorComponent={itemSeparatorComponent}
                        renderSectionHeader={renderSectionHeader}
                        renderItem={renderItem}
                        style={[styles.sectionList, {paddingBottom: 58 + insets.bottom}]}
                        stickySectionHeadersEnabled={false}
                    />
                </View>
                {data.line_group ? (
                    <View style={{...Style.flexBetween, ...styles.footer}}>
                        {data.apply_info?.title && (
                            <TouchableOpacity style={styles.btn} onPress={handleShowTip}>
                                <Text style={styles.btn_text}>审核提示</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.submitBtn, !submitable ? styles.submitBtn_disabled : {}]}
                            disabled={!submitable}
                            onPress={handleSubmit}>
                            <Text style={styles.submitBtn_title}>提交审核</Text>
                            <Text style={styles.submitBtn_desc}>已有{data.edit_num}处修改需审核</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
            <BottomModal title={data?.apply_info?.title ?? '审核提示'} ref={bottomModalRef}>
                <View style={{width: '100%', minHeight: px(100), padding: px(16)}}>
                    <Text style={{fontSize: px(13), color: '#545968'}}>{data?.apply_info?.reason}</Text>
                </View>
            </BottomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#fff',
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    cell: {
        width: '100%',
        height: px(48),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
    cell_title: {
        fontSize: px(13),
        color: '#121D3A',
    },
    cell_descWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        marginLeft: px(10),
    },
    cell_desc: {
        fontSize: px(12),
        color: '#4BA471',
        marginRight: px(8),
    },
    sectionHeader: {
        width: '100%',
        height: px(12),
        opacity: 0,
    },

    listWrap: {
        flexGrow: 1,
    },
    footer: {
        position: 'absolute',
        bottom: px(0),
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        // height: px(58),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: px(10),
        paddingBottom: isIphoneX() ? 34 : 20,
    },
    btn: {
        borderColor: '#545968',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: px(6),
        height: px(44),
        paddingHorizontal: px(20),
        marginRight: 12,
        ...Style.flexCenter,
    },
    btn_text: {
        color: '#545968',
        fontSize: px(15),
        lineHeight: px(18),
    },
    submitBtn: {
        flex: 1,

        backgroundColor: '#0051CC',
        borderRadius: px(6),
        height: px(44),
        paddingHorizontal: px(20),
        ...Style.flexCenter,
    },
    submitBtn_disabled: {
        backgroundColor: '#CEDDF5',
    },
    submitBtn_title: {
        color: '#fff',
        fontSize: px(15),
    },
    submitBtn_desc: {
        color: '#fff',
        fontSize: px(15),
    },
});
