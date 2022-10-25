/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-14 11:08:21
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PageModal} from '~/components/Modal';
import {px} from '~/utils/appUtil';

const AddCategoryModal = ({data, modalData, confirmClick, modalRef}) => {
    const [obj, setObj] = useState(data);
    const [nameFocus, setNameFocus] = useState(false);
    const [descFocus, setDescFocus] = useState(false);
    const [errText, setErrText] = useState('');

    const nameRef = useRef();
    const descRef = useRef();

    useEffect(() => {
        setObj(data);
    }, [data]);

    const onConfirm = useCallback(() => {
        if (!obj.name) {
            setErrText('请填写分类名称');
            nameRef.current.focus();
            return;
        }
        if (modalData?.find?.((item) => item.id !== obj.id && item.name === obj.name)) {
            setErrText('分类名称已存在');
            nameRef.current.focus();
            return;
        }
        setErrText('');
        confirmClick?.(obj);
    }, [confirmClick, modalData, obj]);

    const beforeClose = useCallback(() => {
        setErrText('');
        return true;
    }, []);

    return (
        <PageModal
            ref={modalRef}
            title={'请编辑分类名称与描述'}
            confirmText="确定"
            confirmClick={onConfirm}
            beforeClose={beforeClose}
            style={{height: px(243)}}>
            <View style={styles.addCategoryModalContent}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setDescFocus(false);
                        nameRef.current.focus();
                    }}
                    style={[
                        styles.addCategoryModalOption,
                        nameFocus ? {borderWidth: 1, borderColor: '#0051CC'} : {backgroundColor: '#F5F6F8'},
                    ]}>
                    <View style={styles.addCategoryModalOptionHeader}>
                        <Text style={styles.titleBefore}>*</Text>
                        <Text style={styles.title}>分类名称</Text>
                    </View>
                    <View style={styles.addCategoryModalOptionInputWrap}>
                        <TextInput
                            allowFontScaling={false}
                            autoCapitalize="none"
                            maxLength={6}
                            onChangeText={(name) => {
                                setErrText('');
                                setObj({...obj, name});
                            }}
                            placeholder="请输入分类名称,最多6个字"
                            style={styles.input}
                            value={obj.name}
                            ref={nameRef}
                            onFocus={() => {
                                setNameFocus(true);
                            }}
                            onBlur={() => {
                                setNameFocus(false);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setObj({...obj, name: ''});
                            }}
                            activeOpacity={0.8}>
                            <FastImage
                                source={{
                                    uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/input-close2.png',
                                }}
                                style={[styles.inputClose, {opacity: obj?.name?.length ? 1 : 0}]}
                            />
                        </TouchableOpacity>
                    </View>
                    {errText ? (
                        <Text style={{marginTop: px(12), fontSize: px(11), lineHeight: px(15), color: '#E74949'}}>
                            {errText}
                        </Text>
                    ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setNameFocus(false);
                        descRef.current.focus();
                    }}
                    style={[
                        styles.addCategoryModalOption,
                        descFocus ? {borderWidth: 1, borderColor: '#0051CC'} : {backgroundColor: '#F5F6F8'},
                        {marginTop: px(12)},
                    ]}>
                    <View style={styles.addCategoryModalOptionHeader}>
                        <Text style={styles.title}>分类描述</Text>
                    </View>
                    <View style={styles.addCategoryModalOptionInputWrap}>
                        <TextInput
                            allowFontScaling={false}
                            autoCapitalize="none"
                            maxLength={16}
                            onChangeText={(desc) => {
                                setObj({...obj, desc});
                            }}
                            placeholder="请输入分类描述，最多16个字，选填"
                            style={styles.input}
                            value={obj.desc}
                            ref={descRef}
                            onFocus={() => {
                                setDescFocus(true);
                            }}
                            onBlur={() => {
                                setDescFocus(false);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setObj({...obj, desc: ''});
                            }}
                            activeOpacity={0.8}>
                            <FastImage
                                source={{
                                    uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/input-close2.png',
                                }}
                                style={[styles.inputClose, {opacity: obj?.desc?.length ? 1 : 0}]}
                                onPress={() => {
                                    setObj({...obj, desc: ''});
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <Text style={styles.hint}>
                    *为保证展示效果一致，需保证所有已添加的分类都有或都没有分类描述，若已创建的部分分类缺少描述，则所有分类不展示描述
                </Text>
            </View>
        </PageModal>
    );
};

export default AddCategoryModal;

const styles = StyleSheet.create({
    input: {
        padding: 0,
        flex: 1,
    },
    addCategoryModalContent: {
        padding: px(16),
    },
    inputClose: {
        width: px(14),
        height: px(14),
        marginLeft: px(3),
    },
    addCategoryModalOption: {
        padding: px(12),
        borderRadius: px(6),
    },
    addCategoryModalOptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleBefore: {
        fontSize: px(12),
        lineHeight: px(20),
        color: '#E74949',
    },
    title: {
        fontSize: px(12),
        lineHeight: px(20),
        color: '#121d3a',
    },
    addCategoryModalOptionInputWrap: {
        marginTop: px(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    hint: {
        marginTop: px(12),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
});
