/*
 * @Date: 2021-02-04 14:50:00
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-12 17:01:13
 * @Description: 投诉建议
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Animated, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Picker from 'react-native-picker';
import Mask from '../../components/Mask';
import {Button} from '../../components/Button';
import Toast from '../../components/Toast';
import {Modal} from '../../components/Modal';

const ComplaintsAdvices = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [type, setType] = useState(0);
    const [sortList, setSortList] = useState([]);
    const [sort, setSort] = useState({});
    const [content, setContent] = useState('');
    const [showMask, setShowMask] = useState(false);
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const leftHeight = useRef(0);
    const btnClick = useRef(true);

    // 显示选择器
    const showPicker = useCallback(() => {
        global.LogTool('click', 'show_cates');
        Keyboard.dismiss();
        setShowMask(true);
        Picker.init({
            pickerTitleColor: [31, 36, 50, 1],
            pickerTitleText: '请选择分类',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerData: sortList.map((item) => item.value),
            pickerFontColor: [33, 33, 33, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 81, 204, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            selectedValue: [sort.value],
            pickerTextEllipsisLen: 100,
            wheelFlex: [1, 1],
            onPickerCancel: () => setShowMask(false),
            onPickerConfirm: (pickedValue, pickedIndex) => {
                setSort(sortList[pickedIndex]);
                setShowMask(false);
            },
        });
        Picker.show();
    }, [sort, sortList]);
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
    const submit = useCallback(() => {
        global.LogTool('click', 'submit');
        if (!btnClick.current) {
            return false;
        } else {
            btnClick.current = false;
            http.post('/mapi/complain/store/20210101?cate_id=1&content=test', {
                cate_id: sort.key,
                content,
            }).then((res) => {
                if (res.code === '000000') {
                    // Toast.show(res.result.tips);
                    global.LogTool('submit', 'success');
                    Modal.show({
                        content: res.result.tips,
                        confirmCallBack: () => navigation.goBack(),
                        confirmText: '确定',
                        isTouchMaskToClose: false,
                    });
                } else {
                    btnClick.current = true;
                    Toast.show(res.message);
                }
            });
        }
    }, [content, navigation, sort]);

    useEffect(() => {
        http.get('/mapi/complain/suggest/20210101').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '投诉建议'});
                setData(res.result);
                const isRouteParamsType = route.params?.type || route.params?.type === 0;
                setType(isRouteParamsType ? route.params?.type : res.result.active);
                setSortList(res.result.type_cates[res.result.active].items);
                setSort(
                    isRouteParamsType
                        ? res.result.type_cates[route.params?.type].items.find((item) => item.key === route.params.key)
                        : res.result.type_cates[res.result.active].items[0]
                );
            }
        });
    }, [navigation, route]);
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
                            {data.type_cates?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={item.type + index}
                                        style={[Style.flexRow, {marginLeft: index !== 0 ? text(48) : 0}]}
                                        onPress={() => {
                                            global.LogTool('click', item.type);
                                            setType(index);
                                            setSortList(data.type_cates[index].items);
                                            setSort(data.type_cates[index].items[0]);
                                        }}>
                                        <View style={[Style.flexCenter, styles.radioBox]}>
                                            {type === index && <View style={styles.radio} />}
                                        </View>
                                        <Text style={[styles.title, styles.val]}>{item.type}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.borderTop}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Style.flexBetween, {height: text(56)}]}
                            onPress={showPicker}>
                            <Text style={styles.title}>{'分类'}</Text>
                            <View style={Style.flexRow}>
                                <Text style={[styles.title, styles.val, {marginRight: text(12)}]}>{sort.value}</Text>
                                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.partBox}>
                    <Text style={[styles.title, {marginTop: Space.marginVertical, marginBottom: text(4)}]}>
                        {data.content?.desc}
                    </Text>
                    <TextInput
                        editable
                        maxLength={data.content?.limit}
                        multiline
                        numberOfLines={4}
                        onChangeText={(value) => setContent(value)}
                        placeholder={data.content?.prmt}
                        placeholderTextColor={'#CCD0DB'}
                        style={styles.input}
                        value={content}
                    />
                    <Text
                        style={[
                            styles.wordNum,
                            {textAlign: 'right', marginTop: text(4), marginBottom: Space.marginVertical},
                        ]}>
                        {content.length}/{data.content?.limit}
                    </Text>
                </View>
                <Button disabled={content.length === 0} style={styles.btn} title={data.button?.text} onPress={submit} />
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
        // fontFamily: Font.numMedium,
        // fontWeight: '500',
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
