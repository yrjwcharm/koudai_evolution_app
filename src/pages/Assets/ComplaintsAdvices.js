/*
 * @Date: 2021-02-04 14:50:00
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-05 10:43:06
 * @Description: 投诉建议
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Animated, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Picker from 'react-native-picker';
import Mask from '../../components/Mask';
import {Button} from '../../components/Button';

const ComplaintsAdvices = () => {
    const [type, setType] = useState(1);
    const [sortList, setSortList] = useState([
        {key: '产品功能', val: 1},
        {key: '投顾服务', val: 2},
        {key: '信息推送', val: 3},
        {key: '策略沟通会', val: 4},
        {key: '活动', val: 5},
        {key: '其他', val: 6},
    ]);
    const [sort, setSort] = useState(sortList[0]);
    const [content, setContent] = useState('');
    const [showMask, setShowMask] = useState(false);
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const leftHeight = useRef(0);
    // 显示选择器
    const showPicker = useCallback(() => {
        Keyboard.dismiss();
        setShowMask(true);
        Picker.init({
            pickerTitleText: '请选择分类',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerData: sortList.map((item) => item.key),
            pickerFontColor: [33, 33, 33, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            wheelFlex: [1, 1],
            onPickerCancel: () => setShowMask(false),
            onPickerConfirm: (pickedValue, pickedIndex) => {
                setSort(sortList[pickedIndex]);
                setShowMask(false);
            },
        });
        Picker.show();
    }, [sortList]);
    // 隐藏选择器
    const hidePicker = useCallback(() => {
        Picker.hide();
        setShowMask(false);
    }, []);
    // 键盘调起
    const keyboardWillShow = useCallback(
        (e) => {
            const value = e.endCoordinates.height - (isIphoneX() ? 34 : 0) - leftHeight.current + 16;
            Animated.timing(keyboardHeight, {
                toValue: value > 0 ? value : 0,
                duration: e.duration,
                useNativeDriver: false,
            }).start();
        },
        [keyboardHeight]
    );
    // 键盘隐藏
    const keyboardWillHide = useCallback(
        (e) => {
            Animated.timing(keyboardHeight, {
                toValue: 0,
                duration: e.duration,
                useNativeDriver: false,
            }).start();
        },
        [keyboardHeight]
    );

    useEffect(() => {
        if (type === 1) {
            setSortList([
                {key: '产品功能', val: 1},
                {key: '投顾服务', val: 2},
                {key: '信息推送', val: 3},
                {key: '策略沟通会', val: 4},
                {key: '活动', val: 5},
                {key: '其他', val: 6},
            ]);
        } else {
            setSortList([
                {key: '组合收益', val: 1},
                {key: '投顾服务', val: 2},
                {key: 'APP功能', val: 3},
                {key: '信息推送', val: 4},
                {key: '活动', val: 5},
                {key: '其他', val: 6},
            ]);
        }
    }, [type]);
    useEffect(() => {
        setSort(sortList[0]);
    }, [sortList]);
    useEffect(() => {
        Picker.hide();
        Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        Keyboard.addListener('keyboardWillHide', keyboardWillHide);
        return () => {
            setShowMask(false);
            Picker.hide();
            Keyboard.removeListener('keyboardWillShow', keyboardWillShow);
            Keyboard.removeListener('keyboardWillHide', keyboardWillHide);
        };
    }, [keyboardWillShow, keyboardWillHide]);
    return (
        <Animated.View
            style={[styles.container, {bottom: keyboardHeight}]}
            onLayout={(e) => (leftHeight.current = e.nativeEvent.layout.height - text(379.5))}>
            {showMask && <Mask onClick={hidePicker} />}
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                <View style={styles.partBox}>
                    <View style={[Style.flexBetween, {height: text(56)}]}>
                        <Text style={styles.title}>{'类型'}</Text>
                        <View style={Style.flexRow}>
                            <TouchableOpacity
                                style={[Style.flexRow, {marginRight: text(48)}]}
                                onPress={() => setType(1)}>
                                <View style={[Style.flexCenter, styles.radioBox]}>
                                    {type === 1 && <View style={styles.radio} />}
                                </View>
                                <Text style={[styles.title, styles.val]}>{'建议'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[Style.flexRow]} onPress={() => setType(2)}>
                                <View style={[Style.flexCenter, styles.radioBox]}>
                                    {type === 2 && <View style={styles.radio} />}
                                </View>
                                <Text style={[styles.title, styles.val]}>{'投诉'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.borderTop}>
                        <TouchableOpacity style={[Style.flexBetween, {height: text(56)}]} onPress={showPicker}>
                            <Text style={styles.title}>{'分类'}</Text>
                            <View style={Style.flexRow}>
                                <Text style={[styles.title, styles.val, {marginRight: text(12)}]}>{sort.key}</Text>
                                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.partBox}>
                    <Text style={[styles.title, {marginTop: Space.marginVertical, marginBottom: text(4)}]}>
                        {'内容描述'}
                    </Text>
                    <TextInput
                        editable
                        maxLength={200}
                        multiline
                        numberOfLines={4}
                        onChangeText={(value) => setContent(value)}
                        placeholder={'请输入您的宝贵意见，我们会为您不断改善'}
                        placeholderTextColor={'#CCD0DB'}
                        style={styles.input}
                        value={content}
                    />
                    <Text
                        style={[
                            styles.wordNum,
                            {textAlign: 'right', marginTop: text(4), marginBottom: Space.marginVertical},
                        ]}>
                        {content.length}/200
                    </Text>
                </View>
                <Button style={styles.btn} title={'提交'} />
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        position: 'relative',
    },
    partBox: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
    val: {
        lineHeight: text(24),
        color: Colors.lightGrayColor,
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    wordNum: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightGrayColor,
    },
    radioBox: {
        width: text(14),
        height: text(14),
        borderWidth: Space.borderWidth,
        borderColor: Colors.lightGrayColor,
        padding: text(2),
        marginRight: text(8),
        borderRadius: text(8),
    },
    radio: {
        width: text(10),
        height: text(10),
        borderRadius: text(6),
        backgroundColor: Colors.brandColor,
    },
    input: {
        height: text(84),
    },
    btn: {
        marginTop: text(30),
        marginHorizontal: text(4),
        height: text(44),
    },
});

export default ComplaintsAdvices;
