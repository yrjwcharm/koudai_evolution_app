/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 19:00:56
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';
import {Colors, Font, Style} from '~/common/commonStyle';
import Mask from '~/components/Mask';
import {ProductList} from '~/components/Product';
import {px} from '~/utils/appUtil';
import {cloneDeep} from 'lodash';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from '~/components/Toast';
import AddCategoryModal from './AddCategoryModal';

const CategoryProductList = ({data, tabActive, onTabChange, originData, originDataChange, cateNumInfo}) => {
    const [modalData, setModalData] = useState([]);
    const [modalTabActive, setModalTabActive] = useState();
    const [cateLayout, setCateLayout] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCardHeight, setModalCardHeight] = useState(0);

    const scrollViewRef = useRef();
    const addCategoryModal = useRef();

    const modalCurTab = useMemo(() => {
        return modalData?.find?.((item) => item.id === modalTabActive);
    }, [modalData, modalTabActive]);

    const allHaveDesc = useMemo(() => {
        return originData?.length && originData?.every((item) => item.desc);
    }, [originData]);

    const renderModalCategoryItem = useCallback(
        ({item, index, drag, isActive}) => {
            const isCurrent = modalTabActive === item.id;
            // onLongPress={item.id !== -1 ? drag : null}
            return (
                <ScaleDecorator>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isActive}
                        onPress={() => {
                            setModalData((md) => {
                                if (item.id !== -1) {
                                    setModalTabActive(item.id);
                                    addCategoryModal.current.show();
                                    return md;
                                } else {
                                    // 是否到达添加上限
                                    if (md.length - 1 >= cateNumInfo.cate_max_num) {
                                        Toast.show('数量已达上限');
                                        return md;
                                    }
                                    // 验证前面的分类是否填写完毕
                                    let noneIndex = md.findIndex((obj) => !obj.name);
                                    if (noneIndex > -1) {
                                        Toast.show('请先编辑分类' + (noneIndex + 1));
                                        return md;
                                    }
                                    // 添加分类
                                    let name = '分类' + md.length;
                                    while (md.find((m) => m.name === name)) {
                                        name = name + '-1';
                                    }
                                    const addObj = {
                                        ...originData[0],
                                        name,
                                        desc: '',
                                        products: [],
                                        id: '$' + Date.now(),
                                    };
                                    return md.slice(0, -1).concat([addObj, md[md.length - 1]]);
                                }
                            });
                        }}
                        style={[
                            styles.groupTab,
                            {
                                marginLeft: index === 0 ? 0 : px(8),
                                backgroundColor: isCurrent ? '#DEE8FF' : Colors.bgColor,
                                opacity: isActive ? 0.5 : 1,
                            },
                        ]}>
                        <Text
                            style={[
                                styles.desc,
                                {
                                    color: isCurrent ? Colors.brandColor : Colors.defaultColor,
                                    fontWeight: isCurrent ? Font.weightMedium : '400',
                                },
                            ]}>
                            {item.name}
                        </Text>
                        {index >= cateNumInfo?.cate_min_num && item.id !== -1 && (
                            <Icon
                                color={Colors.descColor}
                                name={'close'}
                                size={14}
                                style={{marginLeft: px(3)}}
                                onPress={() => {
                                    setModalData((val) => {
                                        return val.filter((itm) => itm.id !== item.id);
                                    });
                                }}
                            />
                        )}
                    </TouchableOpacity>
                </ScaleDecorator>
            );
        },
        [cateNumInfo, modalTabActive, originData]
    );

    const addConfirm = useCallback(
        (obj) => {
            setModalData((val) => {
                let newVal = cloneDeep(val);
                let index = newVal.findIndex((item) => item.id === modalCurTab.id);
                if (index > -1) {
                    newVal[index].name = obj.name;
                    newVal[index].desc = obj.desc;
                }
                return newVal;
            });
            addCategoryModal.current.hide();
        },
        [modalCurTab]
    );

    return (
        <>
            {data?.groups?.length > 0 && (
                <View>
                    <View style={Style.flexBetween}>
                        <ScrollView
                            style={{flex: 1}}
                            horizontal={true}
                            ref={scrollViewRef}
                            showsHorizontalScrollIndicator={false}
                            onLayout={(e) => {
                                scrollViewRef?.current.measureInWindow((x, y, width, height) => {
                                    setCateLayout({y, height});
                                });
                            }}>
                            {originData.map?.((group, index) => {
                                const {name} = group;
                                const isCurrent = tabActive === index;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        disabled={isCurrent}
                                        key={name + index}
                                        onPress={() => onTabChange(index)}
                                        style={[
                                            styles.groupTab,
                                            {
                                                marginLeft: index === 0 ? 0 : px(8),
                                                backgroundColor: isCurrent ? '#DEE8FF' : Colors.bgColor,
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.desc,
                                                {
                                                    color: isCurrent ? Colors.brandColor : Colors.defaultColor,
                                                    fontWeight: isCurrent ? Font.weightMedium : '400',
                                                },
                                            ]}>
                                            {name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        {data?.group_edit_button ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setModalVisible(true);
                                    setModalData(
                                        cloneDeep([
                                            ...originData,
                                            {
                                                id: -1,
                                                name: '+分类',
                                            },
                                        ])
                                    );
                                }}
                                style={[styles.editBtn, {marginLeft: px(8)}]}>
                                <Text style={styles.editBtnText}>{data?.group_edit_button.name}</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    {allHaveDesc && (
                        <Text style={[styles.categoryDesc, {marginTop: px(12)}]}>{originData[tabActive].desc}</Text>
                    )}
                    <View style={{height: modalVisible ? modalCardHeight - px(12) - cateLayout.height : 0}} />
                    {data?.groups?.[tabActive]?.items?.length > 0 && (
                        <View
                            style={{
                                paddingTop: px(12),
                            }}>
                            <ProductList data={data?.groups[tabActive].items} type={data.style_type} />
                        </View>
                    )}
                </View>
            )}

            <Modal animationType="none" transparent={true} visible={modalVisible}>
                <Mask bgColor={'rgba(245,246,248,0.7)'} />
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalWrap}
                    onPress={() => {
                        // setModalVisible(false);
                        // setModalTabActive();
                    }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.cateEditingWrap, {marginTop: cateLayout.y - px(12)}]}
                        onLayout={(e) => {
                            setModalCardHeight(e.nativeEvent.layout.height);
                        }}>
                        <View style={Style.flexRow}>
                            <FastImage
                                source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/gth@3x.png'}}
                                style={{width: px(16), height: px(16)}}
                            />
                            <Text style={styles.cateEditingHint}>点击分类编辑名称</Text>
                        </View>
                        <View style={[Style.flexRow, {marginTop: px(12)}]}>
                            <View style={{flex: 1}}>
                                <DraggableFlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={modalData}
                                    extraData={modalTabActive}
                                    onDragEnd={({data: _data}) => {
                                        const d = _data.filter((item) => item.id !== -1);
                                        d.push(_data.find((item) => item.id === -1));
                                        setModalData(d);
                                    }}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderModalCategoryItem}
                                    renderPlaceholder={() => <View style={{flex: 1, backgroundColor: '#fff'}} />}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setModalTabActive();
                                    originDataChange(modalData.filter((item) => item.id !== -1));
                                    onTabChange(0);
                                    setModalVisible(false);
                                }}
                                style={[styles.editBtn, {marginLeft: px(8)}]}>
                                <Text style={styles.editBtnText}>完成</Text>
                            </TouchableOpacity>
                        </View>
                        {modalCurTab?.desc ? (
                            <Text style={[styles.categoryDesc, {marginTop: px(12)}]}>{modalCurTab?.desc}</Text>
                        ) : null}
                    </TouchableOpacity>
                </TouchableOpacity>
                <AddCategoryModal
                    data={modalCurTab || {}}
                    modalData={modalData}
                    confirmClick={addConfirm}
                    modalRef={addCategoryModal}
                />
            </Modal>
        </>
    );
};

export default CategoryProductList;

const styles = StyleSheet.create({
    container: {},
    groupTab: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    desc: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    modalWrap: {
        flex: 1,
    },
    editBtn: {
        borderWidth: 0.5,
        borderColor: '#0051cc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: px(7),
        borderRadius: px(10),
    },
    editBtnText: {
        fontSize: px(10),
        lineHeight: px(20),
        color: '#0051CC',
    },
    cateEditingWrap: {
        marginHorizontal: px(16),
        borderWidth: 1,
        borderRadius: px(6),
        borderColor: '#e74949',
        padding: px(12),
        backgroundColor: '#fff',
    },
    cateEditingHint: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9aa0b1',
        marginLeft: px(2),
    },
    categoryDesc: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#e74949',
    },
});
