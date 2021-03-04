/*
 * @Date: 2021-02-04 11:39:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-04 18:10:20
 * @Description: 个人资料
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';
import Mask from '../../components/Mask';

const Profile = ({navigation}) => {
    const [data, setData] = useState([]);
    const [showMask, setShowMask] = useState(false);

    const onPress = useCallback(
        (item) => {
            if (item.val?.type === 'jump') {
                if (item.key === '银行卡管理') {
                    return navigation.navigate('BankCardList');
                }
                navigation.navigate(item.val.jump_url);
            } else if (item.val?.type === 'select') {
                Keyboard.dismiss();
                setShowMask(true);
                Picker.init({
                    pickerTitleColor: [31, 36, 50, 1],
                    pickerTitleText: `请选择${item.key}`,
                    pickerCancelBtnText: '取消',
                    pickerConfirmBtnText: '确定',
                    pickerBg: [255, 255, 255, 1],
                    pickerToolBarBg: [249, 250, 252, 1],
                    pickerData: item.val.options?.map((option) => option.value),
                    pickerFontColor: [33, 33, 33, 1],
                    pickerRowHeight: 36,
                    pickerConfirmBtnColor: [0, 81, 204, 1],
                    pickerCancelBtnColor: [128, 137, 155, 1],
                    selectedValue: [item.val.text],
                    wheelFlex: [1, 1],
                    onPickerCancel: () => setShowMask(false),
                    onPickerConfirm: (pickedValue, pickedIndex) => {
                        setShowMask(false);
                    },
                });
                Picker.show();
            } else if (item.val?.type === 'input') {
                // hhh
            }
        },
        [navigation]
    );
    // 隐藏选择器
    const hidePicker = useCallback(() => {
        Picker.hide();
        setShowMask(false);
    }, []);

    useEffect(() => {
        http.get('/user_info/20210101', {}).then((res) => {
            console.log(res);
        });
    }, [navigation]);
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index) => {
                    return (
                        <View key={`part${index}`} style={styles.partBox}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.key} style={[i === 0 ? {} : styles.borderTop]}>
                                        {item.val?.type === 'jump' ||
                                        item.val?.type === 'select' ||
                                        item.val?.type === 'input' ? (
                                            <TouchableOpacity
                                                style={[Style.flexBetween, {height: text(56)}]}
                                                onPress={() => onPress(item)}>
                                                <Text style={styles.title}>{item.key}</Text>
                                                <View style={Style.flexRow}>
                                                    {item.val?.desc ? (
                                                        <HTML
                                                            html={item.val.desc}
                                                            style={{...styles.val, ...styles.desc}}
                                                        />
                                                    ) : null}
                                                    {item.val?.text ? (
                                                        <View style={{marginHorizontal: text(12)}}>
                                                            <HTML html={item.val.text} style={styles.val} />
                                                        </View>
                                                    ) : null}
                                                    <Icon
                                                        name={'angle-right'}
                                                        size={20}
                                                        color={Colors.lightGrayColor}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={[Style.flexBetween, {height: text(56)}]}>
                                                <Text style={styles.title}>{item.key}</Text>
                                                {item.val?.type === 'img' && item.val?.text ? (
                                                    <Image source={{uri: item.val.text}} style={styles.avatar} />
                                                ) : (
                                                    <HTML html={item.val.text} style={styles.val} />
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
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
        color: Colors.descColor,
    },
    val: {
        fontSize: Font.textH2,
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    desc: {
        fontSize: Font.textH3,
    },
    avatar: {
        width: text(32),
        height: text(32),
        borderRadius: text(16),
    },
});

export default Profile;
