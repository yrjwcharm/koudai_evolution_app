/*
 * @Date: 2022-05-11 15:34:32
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-18 15:48:26
 * @Description: 投资者信息表
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Picker from 'react-native-picker';
import {times} from 'lodash';
import {FormItem} from './IdentityAssertion';
import {Colors, Font, Space} from '../../common/commonStyle';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Mask from '../../components/Mask';
import Loading from '../Portfolio/components/PageLoading';
// import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [showMask, setShowMask] = useState(false);
    const {button = {}, list = []} = data;
    const {text, url} = button;

    const onChange = (index, value) => {
        const _data = {...data};
        const _list = [...list];
        _list[index].value = value;
        _data.list = _list;
        setData(_data);
    };

    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };

    useEffect(() => {
        navigation.setOptions({title: '投资者信息表'});
        setData({
            button: {
                text: '下一步',
                url: '',
            },
            list: [
                {
                    label: '姓名',
                    type: 'text',
                    value: '王某某',
                },
                {
                    label: '证件类型',
                    type: 'text',
                    value: '身份证',
                },
                {
                    label: '证件号',
                    type: 'text',
                    value: '11034565456789',
                },
                {
                    label: '证件有效期是否为永久',
                    options: [
                        {label: '是', value: 1},
                        {label: '否', value: 0},
                    ],
                    type: 'radio',
                    value: 0,
                },
                {
                    label: '证件有效期',
                    type: 'datepicker',
                    value: '2022 / 04 / 27',
                },
                {
                    label: '性别',
                    options: [
                        {label: '男', value: 1},
                        {label: '女', value: 2},
                    ],
                    type: 'picker',
                    value: '请选择',
                },
                {
                    label: '年龄',
                    options: times(101)
                        .slice(1)
                        .map((n) => ({label: `${n}岁`, value: n})),
                    type: 'picker',
                    value: '请选择',
                },
                {
                    input_type: 'phone-pad',
                    label: '手机号',
                    max_length: 11,
                    placeholder: '请输入手机号',
                    type: 'input',
                    value: '',
                },
                {
                    input_type: 'number-pad',
                    label: '邮编',
                    max_length: 6,
                    placeholder: '请输入邮编',
                    type: 'input',
                    value: '',
                },
                {
                    input_type: 'email-address',
                    label: '电子邮箱',
                    max_length: 100,
                    placeholder: '请输入电子邮箱',
                    type: 'input',
                    value: '',
                },
                {
                    input_type: 'default',
                    label: '住址',
                    max_length: 100,
                    placeholder: '请输入住址',
                    type: 'input',
                    value: '',
                },
                {
                    label: '税收居民身份',
                    options: [],
                    tips: '税收居民身份',
                    type: 'picker',
                    value: '请选择',
                },
            ],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <KeyboardAwareScrollView
                bounces={false}
                extraScrollHeight={px(100)}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                <View style={styles.contentBox}>
                    {list?.map?.((item, index) => (
                        <View
                            key={item + index}
                            style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                            <FormItem data={item} onChange={(val) => onChange(index, val)} setShowMask={setShowMask} />
                        </View>
                    ))}
                </View>
            </KeyboardAwareScrollView>
            <FixedButton
                color="#EDDBC5"
                disabledColor="#EDDBC5"
                onPress={() => jump(url)}
                style={{backgroundColor: '#D7AF74'}}
                title={text}
            />
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    contentBox: {
        margin: Space.marginAlign,
        marginBottom: (isIphoneX() ? px(8) + px(45) + 34 : px(8) * 2 + px(45)) + px(20),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    itemLabel: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    inputStyle: {
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
});
