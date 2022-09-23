/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2022-09-21 15:59:19
 * @Description:工具管理
 */
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {getList, toolSave} from './service';
import {Colors, Space, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import {DragSortableView} from 'react-native-drag-sort';
import Icon from 'react-native-vector-icons/AntDesign';
import produce from 'immer';
import NavBar from '~/components/NavBar';
import Toast from '~/components/Toast';
import {Modal} from '~/components/Modal';
const sortWidth = deviceWidth - px(48);
const childrenWidth = sortWidth / 5;
const ToolList = ({route}) => {
    const [data, setData] = useState({});
    const [scrollEnable, setScrollEnable] = useState(true);
    const [isEditState, setIsEditState] = useState(false);
    const initialToolIds = useRef();
    const {type = 50} = route.params || {};
    const getData = async () => {
        let res = await getList({type});
        initialToolIds.current = res.result?.my_tools?.tool_list?.map((item) => item.tool_id).join(',');
        setData(res.result);
    };
    useEffect(() => {
        getData();
    }, []);
    //点击右上角的按钮
    const handelEditable = (action) => {
        let saveToolIds = data?.my_tools?.tool_list?.map((item) => item.tool_id)?.join(',');
        if (isEditState && action != 'cancel') {
            //保存
            toolSave({type, tool_ids: saveToolIds});
        }
        if (action == 'cancel') {
            //我的工具是否有更新
            if (saveToolIds != initialToolIds.current) {
                Modal.show({
                    confirm: true,
                    content: '编辑的内容还未保存，是否要保存',
                    confirmText: '保存',
                    cancelText: '取消',
                    confirmCallBack: () => {
                        //保存
                        toolSave({type, tool_ids: saveToolIds});
                        setIsEditState(!isEditState);
                    },
                    cancelCallBack: () => {
                        setIsEditState(!isEditState);
                    },
                });
            } else {
                setIsEditState(!isEditState);
            }
        } else {
            setIsEditState(!isEditState);
        }
    };
    const onSelectedDragStart = () => {
        setScrollEnable(false);
    };
    const onSelectedDragEnd = () => {
        setScrollEnable(true);
    };
    const onSelectedClickItem = (_data, item, index) => {
        if (!isEditState) return;
        if (_data?.length < 2) {
            Toast.show('我的工具最少支持1个');
            return;
        }
        setData(
            produce((draft) => {
                // 找到所属模块->再找到item该该模块的位置
                draft.tool_modules
                    .find((tool) => tool.module_id == item.module_id)
                    .tool_list.find((tool) => item.tool_id == tool.tool_id).is_add = false;
                draft.my_tools.tool_list.splice(index, 1);
            })
        );
    };
    const onUnSelectedClickItem = (_data, item, index) => {
        if (item.is_add || !isEditState) return;
        if (data?.my_tools?.tool_list?.length >= 9) {
            Toast.show('我的工具最多支持9个，超出部分请先移除后再添加');
            return;
        }
        setData(
            produce((draft) => {
                draft.tool_modules.find((tool) => tool.module_id == item.module_id).tool_list[index].is_add = true;
                if (draft.my_tools.tool_list) {
                    draft.my_tools.tool_list.push(item);
                } else {
                    draft.my_tools.tool_list = [item];
                }
            })
        );
    };
    const renderSelectedItemView = (item) => {
        const {text, icon} = item;
        return (
            <View style={{alignItems: 'center', width: childrenWidth}}>
                {isEditState && (
                    <Icon name="minuscircle" color={'#888888'} size={px(14)} style={[styles.tag, Style.flexCenter]} />
                )}
                <Image source={{uri: icon}} style={styles.icon} />
                <Text style={{fontSize: px(11)}}>{text}</Text>
            </View>
        );
    };
    const renderUnSelectedItemView = (item) => {
        const {text, icon} = item;
        return (
            <View style={{alignItems: 'center', width: childrenWidth}}>
                {isEditState && !item?.is_add && (
                    <Icon name="pluscircle" color={'#E74949'} size={px(14)} style={[styles.tag, Style.flexCenter]} />
                )}
                <Image source={{uri: icon}} style={styles.icon} />
                <Text style={{fontSize: px(11)}}>{text}</Text>
            </View>
        );
    };

    return (
        <>
            <NavBar
                title="全部工具"
                renderLeft={
                    isEditState ? (
                        <View style={{width: px(40), marginLeft: px(16)}}>
                            <Text
                                style={{fontSize: px(14), lineHeight: px(20)}}
                                onPress={() => handelEditable('cancel')}>
                                取消
                            </Text>
                        </View>
                    ) : null
                }
                leftIcon={!isEditState && 'chevron-left'}
                renderRight={
                    <Text style={{fontSize: px(14), lineHeight: px(20), width: px(50)}} onPress={handelEditable}>
                        {isEditState ? '保存' : '管理'}
                    </Text>
                }
            />

            <ScrollView style={{backgroundColor: Colors.bgColor}} scrollEnabled={scrollEnable}>
                <View style={[styles.card, {marginTop: px(16)}]}>
                    <Text style={styles.title}>{data?.my_tools?.title}</Text>
                    {data?.my_tools?.tool_list ? (
                        <View style={{paddingHorizontal: px(8)}}>
                            <DragSortableView
                                dataSource={data?.my_tools?.tool_list}
                                parentWidth={sortWidth}
                                childrenWidth={childrenWidth}
                                childrenHeight={px(70)}
                                sortable={isEditState}
                                onDragStart={onSelectedDragStart}
                                onDragEnd={onSelectedDragEnd}
                                onDataChange={(_data) => {
                                    setData(
                                        produce((draft) => {
                                            draft.my_tools.tool_list = _data;
                                        })
                                    );
                                }}
                                onClickItem={onSelectedClickItem}
                                keyExtractor={(item, index) => item.tool_id} // FlatList作用一样，优化
                                renderItem={renderSelectedItemView}
                            />
                        </View>
                    ) : null}
                </View>
                {data?.tool_modules?.map((tool) => (
                    <View style={styles.card} key={tool.module_id}>
                        <Text style={styles.title}>{tool?.title}</Text>
                        {tool?.tool_list ? (
                            <View style={{paddingHorizontal: px(8)}}>
                                <DragSortableView
                                    dataSource={tool?.tool_list}
                                    parentWidth={sortWidth}
                                    childrenWidth={childrenWidth}
                                    childrenHeight={px(70)}
                                    sortable={false}
                                    onClickItem={onUnSelectedClickItem}
                                    keyExtractor={(item, index) => item.tool_id} // FlatList作用一样，优化
                                    renderItem={renderUnSelectedItemView}
                                />
                            </View>
                        ) : null}
                    </View>
                ))}
            </ScrollView>
        </>
    );
};

export default ToolList;

const styles = StyleSheet.create({
    card: {
        marginBottom: px(12),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    title: {
        marginVertical: px(16),
        fontSize: px(13),
        lineHeight: px(18),
        marginLeft: px(16),
    },
    icon: {
        width: px(26),
        height: px(26),
        marginBottom: px(8),
    },
    text: {
        fontSize: px(11),
        lineHeight: px(15),
    },
    tag: {position: 'absolute', right: px(0), top: px(0)},
});
