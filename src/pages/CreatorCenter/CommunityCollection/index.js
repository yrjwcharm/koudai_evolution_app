/*
 * @Description: 社区合集
 * @Autor: wxp
 * @Date: 2022-10-10 14:04:29
 */
import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {audit, getData, getList} from './services';
import {useJump} from '~/components/hooks';
import {InputModal, Modal} from '~/components/Modal';
import Toast from '~/components/Toast';

const CommunityCollection = ({route}) => {
    const jump = useJump();

    const [data, setData] = useState();
    const [listData, setListData] = useState();
    const [reason, setReason] = useState('');

    const tabRef = useRef();
    const refuseModal = useRef();
    const curRefuseId = useRef();

    useFocusEffect(
        useCallback(() => {
            getData().then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    let tab = route?.params?.tab || tabRef?.current?.state?.currentPage || 0;
                    setTimeout(() => {
                        tabRef?.current?.goToPage(tab);
                    });
                }
            });
        }, [route?.params?.tab])
    );

    const getListData = (type) => {
        getList({type, page: 1, page_size: 999999}).then((res) => {
            if (res.code === '000000') {
                setListData(res.result);
            }
        });
    };

    const onChangeTab = useCallback(
        ({i}) => {
            getListData(data?.list?.[i]?.type);
        },
        [data]
    );

    const adopt = (popup, id) => {
        Modal.show({
            content: popup.content,
            confirm: true,
            confirmText: '确认',
            confirmCallBack: () => {
                let loading = Toast.showLoading();
                audit({status: 1, id})
                    .then((res) => {
                        Toast.show(res.message);
                        if (res.code === '000000') {
                            tabRef?.current?.goToPage(tabRef?.current?.state.currentPage);
                        }
                    })
                    .finally((_) => {
                        Toast.hide(loading);
                    });
            },
        });
    };

    const refuse = (id) => {
        setReason('');
        curRefuseId.current = id;
        refuseModal.current.show();
    };

    const refuseConfirmClick = () => {
        refuseModal.current.hide();
        let loading = Toast.showLoading();
        audit({status: 3, id: curRefuseId.current, reason})
            .then((res) => {
                Toast.show(res.message);
                if (res.code === '000000') {
                    tabRef?.current?.goToPage(tabRef?.current?.state.currentPage);
                }
            })
            .finally((_) => {
                Toast.hide(loading);
            });
    };

    return data ? (
        <View style={styles.container}>
            <ScrollableTabView
                renderTabBar={() => (
                    <ScrollableTabBar
                        style={{paddingHorizontal: px(34), backgroundColor: '#fff', paddingTop: px(10)}}
                    />
                )}
                onChangeTab={onChangeTab}
                ref={tabRef}>
                {data?.list?.map((item, idx) => (
                    <ScrollView
                        tabLabel={item.key}
                        key={idx}
                        showsHorizontalScrollIndicator={false}
                        style={{flex: 1}}
                        keyboardShouldPersistTaps="handled">
                        {listData?.items?.[0] ? (
                            <View style={styles.cardsWrap}>
                                {listData?.items?.map((itm, index) => (
                                    <View style={styles.cardItem} key={index}>
                                        {false ? <View style={styles.mask} /> : null}
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                jump(itm.url);
                                            }}
                                            style={styles.cardItemMain}>
                                            <FastImage
                                                style={styles.cardItemAvatar}
                                                source={{
                                                    uri: itm.ci_img,
                                                }}
                                            />
                                            <View style={styles.cardItemMainCenter}>
                                                <Text style={styles.cardItemMainTitle}>{itm?.ci_name}</Text>
                                                <Text style={styles.cardItemMainDesc} numberOfLines={2}>
                                                    {itm?.ci_intro}
                                                </Text>
                                            </View>
                                            <Icon
                                                color={Colors.descColor}
                                                name="angle-right"
                                                size={px(14)}
                                                style={{marginLeft: px(8)}}
                                            />
                                        </TouchableOpacity>
                                        {/* <View style={styles.cardItemBottom}>
                                            <FastImage
                                                source={{
                                                    uri:
                                                        'https://static.licaimofang.com/wp-content/uploads/2022/10/edit.png',
                                                }}
                                                style={styles.cardItemBottomIcon}
                                            />
                                            <Text style={styles.cardItemBottomText}>修改社区</Text>
                                        </View> */}
                                        {itm?.btn ? (
                                            <View style={styles.mainCardBottom}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={styles.bottomBtn}
                                                    onPress={() => {
                                                        adopt(itm.btn[0].popup, itm.id);
                                                    }}>
                                                    <Text style={[styles.bottomBtnText, {color: '#0051CC'}]}>
                                                        {itm.btn[0].text}
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={styles.splitLine} />
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={styles.bottomBtn}
                                                    onPress={() => refuse(itm.id)}>
                                                    <Text
                                                        style={[
                                                            styles.bottomBtnText,
                                                            {
                                                                color: '#0051CC',
                                                            },
                                                        ]}>
                                                        {itm.btn[1].text}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : null}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    margin: px(16),
                                    marginBottom: 0,
                                    borderRadius: px(6),
                                    paddingVertical: px(60),
                                    alignItems: 'center',
                                }}>
                                <FastImage
                                    style={{width: px(120), height: px(64)}}
                                    source={require('~/assets/img/emptyTip/empty.png')}
                                />
                                <Text
                                    style={{
                                        fontSize: px(13),
                                        lineHeight: px(18),
                                        color: '#121D3A',
                                        textAlign: 'center',
                                    }}>
                                    暂无内容
                                </Text>
                            </View>
                        )}
                        <View style={{height: 50}} />
                        <InputModal ref={refuseModal} title="请输入审核不通过原因" confirmClick={refuseConfirmClick}>
                            <View style={{backgroundColor: '#fff'}}>
                                <TextInput
                                    value={reason}
                                    multiline={true}
                                    style={styles.input}
                                    maxLength={100}
                                    onChangeText={(val) => setReason(val)}
                                    textAlignVertical="top"
                                    placeholder="请输入未通过原因，最多100个字"
                                />
                            </View>
                        </InputModal>
                    </ScrollView>
                ))}
            </ScrollableTabView>
        </View>
    ) : null;
};

export default CommunityCollection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardsWrap: {
        padding: px(16),
    },
    cardItem: {
        paddingHorizontal: px(12),
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginBottom: px(12),
    },
    cardItemMain: {
        paddingVertical: px(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardItemAvatar: {
        width: px(54),
        height: px(54),
        borderRadius: px(54),
    },
    cardItemMainCenter: {
        marginLeft: px(12),
        flex: 1,
        height: '100%',
    },
    cardItemMainTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        fontWeight: 'bold',
    },
    cardItemMainDesc: {
        marginTop: px(4),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
    },
    cardItemBottom: {
        borderTopColor: '#E9EAEF',
        borderTopWidth: 0.5,
        paddingVertical: px(12),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardItemBottomText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051cc',
    },
    cardItemBottomIcon: {
        width: px(16),
        height: px(16),
        marginRight: px(4),
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px(343),
        height: '100%',
        backgroundColor: '#fff',
        zIndex: 2,
        opacity: 0.8,
    },
    mainCardBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#E9EAEF',
        borderTopWidth: 0.5,
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
        fontSize: px(13),
        lineHeight: px(17),
        marginLeft: px(4),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#545968',
    },
    auditHeader: {
        paddingVertical: px(16),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 0.5,
    },
    auditHeaderLeft: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1e2331',
    },
    auditHeaderRight: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#0051cc',
    },
    auditContent: {
        flex: 1,
    },
});
