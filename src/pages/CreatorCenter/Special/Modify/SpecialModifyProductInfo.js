/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-17 16:58:12
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
                {props.value.length > 0 && <RenderHtml style={styles.input_value} html={props.value} />}
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

const getProductTemplate = () => [
    {
        title: '选择推广产品',
        require: true,
        key: ListKeys.Product,
        value: '',
        component: SelectInput,
    },
    {
        title: '产品推荐语',
        require: true,
        isHtml: true,
        key: ListKeys.Recommend,
        value: '',
        component: SelectInput,
    },
    {
        title: '标签1',
        require: true,
        key: ListKeys.Tag1,
        value: '',
        component: TagInput,
    },
    {
        title: '标签2',
        require: true,
        key: ListKeys.Tag2,
        value: '',
        component: TagInput,
    },
    {
        title: '标签3',
        require: true,
        key: ListKeys.Tag3,
        value: '',
        component: TagInput,
    },
];

export default function SpecialModifyProductInfo({navigation, route}) {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const richTextModalRef = useRef(null);
    // 当前选择行的产品推荐语
    const [submitable, setSubmitable] = useState(false);
    const jump = useJump();
    const [uid, setUid] = useState('0'); // 当前专题的uid
    const [list, setList] = useState([
        {
            title: '推广产品1(必填)',
            isOpen: true,
            data: getProductTemplate(),
        },
        {
            title: '推广产品2(选填)',
            data: getProductTemplate(),
        },
        {
            title: '推广产品3(选填)',
            data: getProductTemplate(),
        },
    ]);

    const handleBack = () => {
        navigation.goBack();
    };

    const onRefresh = () => {};

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
                        item.value = productItem.title;
                        item.productItem = {...productItem};
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
            <NavBar title={'产品信息填写'} leftIcon="chevron-left" leftPress={handleBack} />
            <View style={styles.content}>
                <View style={styles.listWrap}>
                    <SectionList
                        sections={list}
                        initialNumToRender={20}
                        keyExtractor={(item, index) => item + index}
                        onEndReachedThreshold={0.2}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
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