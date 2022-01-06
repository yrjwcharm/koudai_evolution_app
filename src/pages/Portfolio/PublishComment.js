/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-12-29 17:29:36
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-01-05 09:48:43
 * @Description: 发布评论
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {px} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';
import http from '../../services/index.js';

export default ({navigation, route}) => {
    const [value, setValue] = useState('');
    const [hide, setHide] = useState(false);

    const onSubmit = () => {
        console.log(value, hide);
        http.post('/community/comment/save/20220101', {
            account_id: route.params.account_id,
            content: value,
            show_status: hide ? 2 : 1,
        }).then((res) => {
            if (res.code === '000000') {
                Toast.show('评论发布成功，精选后展示');
                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
            }
        });
    };

    useEffect(() => {
        navigation.setOptions({title: route.params.title || '发布评论'});
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Modal.show({
                title: '温馨提示',
                content: '退出后将无法享受此次评论机会，是否继续评论',
                confirm: true,
                confirmText: '继续编辑',
                cancelText: '确认退出',
                cancelCallBack: () => navigation.dispatch(e.data.action),
                isTouchMaskToClose: false,
                backButtonClose: false,
            });
        });
    }, []);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                bounces={false}
                extraScrollHeight={px(16)}
                style={{flex: 1, paddingHorizontal: Space.padding}}
                scrollIndicatorInsets={{right: 1}}>
                <View style={styles.inputBox}>
                    <TextInput
                        allowFontScaling={false}
                        autoCapitalize="none"
                        maxLength={150}
                        multiline
                        onChangeText={(text) => setValue(text)}
                        placeholder="快和大家分享您的购买原因、交易心得、投资观点吧…"
                        style={styles.input}
                        textAlignVertical="top"
                        value={value}
                    />
                    <Text style={styles.count}>{value.length}/150字</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setHide((prev) => !prev)}
                    style={[Style.flexRow, {marginVertical: Space.padding}]}>
                    <CheckBox checked={hide} onChange={(checked) => setHide(checked)} style={{marginRight: px(8)}} />
                    <Text style={styles.hideText}>
                        {'匿名评论'}
                        <Text style={{color: Colors.lightGrayColor}}>{'（隐藏自己的头像和名称）'}</Text>
                    </Text>
                </TouchableOpacity>
                <Button disabled={value.length < 10} onPress={onSubmit} style={styles.button} title="发布" />
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    inputBox: {
        marginTop: Space.marginVertical,
        borderWidth: Space.borderWidth,
        borderRadius: Space.borderRadius,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
        position: 'relative',
        minHeight: px(284),
    },
    input: {
        padding: Space.padding,
        paddingTop: Space.padding,
        width: '100%',
        height: px(284),
    },
    count: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
        position: 'absolute',
        right: px(12),
        bottom: px(12),
    },
    hideText: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.descColor,
    },
    button: {
        width: '100%',
    },
});
