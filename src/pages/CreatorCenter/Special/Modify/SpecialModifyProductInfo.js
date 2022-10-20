/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 14:51:46
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyProductInfo.js
 * @Description: 修改专题推荐-产品推荐信息
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, SectionList, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import NavBar from '~/components/NavBar';
import {Colors, Font, Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import RenderHtml from '~/components/RenderHtml';
import RichTextInputModal from '../../components/RichTextInputModal.js';
import KeyboardSpace from '~/components/IM/app/chat/components/pop-view/KeyboardSpace/KeyboardSpace.js';
import {getRecommendProductInfo, saveRecommendInfo} from './services';
/** 列表每行的key */
const ListKeys = {
    Product: 'Product',
    Recommend: 'Recommend',
    Tag1: 'Tag1',
    Tag2: 'Tag2',
    Tag3: 'Tag3',
};

/** 选择输入组件 */
function SelectInput(props) {
    return (
        <View style={[styles.inputWrap, styles.selectInput]}>
            <View style={styles.inputWrap_start}>
                <Text style={styles.require}>*</Text>
                <Text style={styles.inputTitle}>{props.title}</Text>
            </View>
            <TouchableOpacity style={styles.inputWrap_end} onPress={props.onPress}>
                {props.value?.name && <RenderHtml style={styles.input_value} html={props.value.name} />}
                {!props.value.name && props.value.length > 0 && (
                    <RenderHtml style={styles.input_value} html={props.value} />
                )}
                <AntDesign name="right" size={12} />
            </TouchableOpacity>
        </View>
    );
}

/** 标签输入组件 */
function TagInput(props) {
    return (
        <View style={[styles.inputWrap, styles.tagInput]}>
            <View style={[styles.inputWrap_start, styles.tagInputWrap_header]}>
                <Text style={styles.require}>*</Text>
                <Text>{props.title}</Text>
            </View>
            <View style={styles.tagInputWrap_end}>
                <TextInput
                    style={styles.tagInput_input}
                    value={props.value}
                    maxLength={6}
                    onChangeText={props.onChangeText}
                    placeholder="请填写产品标签，最多6个字符"
                />
            </View>
        </View>
    );
}

const getProductTemplate = (item) => [
    {
        title: '选择推广产品',
        require: true,
        key: ListKeys.Product,
        value: {
            product_id: item?.product_id,
            product_type: item?.product_type,
            name: item?.name,
        },
        component: SelectInput,
    },
    {
        title: '产品推荐语',
        require: true,
        isHtml: true,
        key: ListKeys.Recommend,
        value: item?.desc ?? '',
        component: SelectInput,
    },
    {
        title: '标签1',
        require: true,
        key: ListKeys.Tag1,
        value: item?.tags[0] ?? '',
        component: TagInput,
    },
    {
        title: '标签2',
        require: true,
        key: ListKeys.Tag2,
        value: item?.tags[1] ?? '',
        component: TagInput,
    },
    {
        title: '标签3',
        require: true,
        key: ListKeys.Tag3,
        value: item?.tags[2] ?? '',
        component: TagInput,
    },
];

export default function SpecialModifyProductInfo({navigation, route}) {
    const {items, subject_id} = route.params;
    const insets = useSafeAreaInsets();
    const richTextModalRef = useRef(null);
    // 当前选择行的产品推荐语
    const jump = useJump();
    const [list, setList] = useState([
        {
            title: '推广产品1(必填)',
            isOpen: true,
            data: getProductTemplate(items[0]),
        },
        {
            title: '推广产品2(选填)',
            data: getProductTemplate(items[1]),
        },
        {
            title: '推广产品3(选填)',
            data: getProductTemplate(items[2]),
        },
    ]);

    const handleBack = () => {
        Modal.show({
            content: '已编辑内容是否要保存草稿？下次可继续编辑。',
            cancelText: '不保存草稿',
            confirmText: '保存草稿',
            confirm: true,
            backCloseCallbackExecute: true,
            cancelCallBack: () => {
                navigation.goBack();
            },
            confirmCallBack: () => {
                handleSaveBaseInfo().then(() => {
                    navigation.goBack(-2);
                });
            },
        });
    };

    const handleSaveBaseInfo = () => {
        const params = {sid: subject_id, save_status: 1, rec_type: 2};

        params.products = items.map((it) => ({
            product_id: it.product.product_id,
            product_type: it.product.product_type,
            name: it.product.name,
            desc: it.desc,
            tags: it.tags,
        }));
        return saveRecommendInfo(params).then((res) => {
            if (res.code === '000000') {
                return Promise.resolve();
            }
            return Promise.reject();
        });
    };

    const getValue = () => {
        const result = [];
        list.forEach((sec) => {
            const item = {};
            sec.data.forEach((row) => {
                if (row.key === ListKeys.Product) {
                    item.product = row.value;
                } else if (row.key === ListKeys.Recommend) {
                    item.title = row.value;
                } else {
                    item.tags = (item.tags || []).push(row.value);
                }
            });
            result.push(item);
        });
        return result;
    };
    const rightPress = () => {
        jump({
            path: 'SpecialPreviewRecommend',
            params: {
                type: 2,
                subject_id,
                items: getValue(),
                onSave: () => {
                    navigation.goBack(-3);
                },
            },
        });
    };

    const handleSectionToggle = (section) => {
        section.isOpen = !section.isOpen;
        setList([...list]);
    };
    const handleCellPress = (item, section) => {
        // TODOL
        console.log('handleCellPress:', item);
        if (item.key === ListKeys.Recommend) {
            richTextModalRef.current?.show(item.value, item);
        } else if (item.key === ListKeys.Product) {
            jump({
                path: 'SpecialModifyProductItem',
                params: {
                    callback: (productItem) => {
                        item.value = {
                            product_id: productItem.product_id,
                            product_type: productItem.product_type,
                            name: productItem.name,
                        };
                    },
                },
            });
        }
    };
    const handleTagChange = (item, text) => {
        item.value = text;
        setList([...list]);
    };
    const handleRichTextChange = (text, item) => {
        console.log('handleRichTextChange:', text);
        item.value = text;
        setList([...list]);
    };
    const renderSectionHeader = ({section}) => {
        const {title, isOpen = false} = section;
        return (
            <>
                <View style={{height: px(12), backgroundColor: '#F5F6F8'}} />
                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleSectionToggle(section)}>
                    <Text>{title}</Text>
                    <AntDesign name={isOpen ? 'up' : 'down'} size={12} />
                </TouchableOpacity>
            </>
        );
    };
    const renderItem = ({item, index, section}) => {
        if (!section.isOpen) return null;
        return (
            <>
                <View style={styles.cell}>
                    <item.component
                        {...item}
                        onPress={() => handleCellPress(item, section)}
                        onChangeText={(text) => handleTagChange(item, text)}
                    />
                </View>
            </>
        );
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar
                title={'产品信息填写'}
                leftIcon="chevron-left"
                leftPress={handleBack}
                rightText={'保存'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.content}>
                <View style={styles.listWrap}>
                    <SectionList
                        sections={list}
                        initialNumToRender={20}
                        keyExtractor={(item, index) => item + index}
                        onEndReachedThreshold={0.2}
                        renderSectionHeader={renderSectionHeader}
                        renderItem={renderItem}
                        style={[styles.sectionList, {paddingBottom: insets.bottom}]}
                        stickySectionHeadersEnabled={false}
                    />
                </View>
            </View>
            <RichTextInputModal ref={richTextModalRef} onChangeText={handleRichTextChange} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#fff',
        position: 'relative',
        height: deviceHeight,
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },

    sectionHeader: {
        width: '100%',
        height: px(48),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: px(16),
    },
    cell: {
        width: '100%',
        paddingHorizontal: px(16),
        paddingBottom: px(12),
        backgroundColor: '#fff',
    },
    inputWrap: {
        borderRadius: px(6),
        backgroundColor: '#F5F6F8',

        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: px(12),
    },
    selectInput: {
        height: px(44),
        flexDirection: 'row',
    },
    inputWrap_start: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputWrap_end: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    input_value: {
        color: Colors.defaultFontColor,
        fontSize: px(12),
        marginRight: px(8),
    },
    require: {
        color: '#E74949',
        fontSize: px(12),
    },
    inputTitle: {
        marginLeft: px(3),
        color: '#121D3A',
        fontSize: px(12),
    },

    tagInput: {
        height: px(76),
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingVertical: px(12),
    },
    tagInputWrap_header: {
        // lineHeight:
    },
    tagInputWrap_end: {
        marginTop: px(12),
        width: '100%',
    },
    tagInput_input: {
        fontSize: px(14),
        color: Colors.defaultFontColor,
    },

    listWrap: {
        flexGrow: 1,
    },
});
