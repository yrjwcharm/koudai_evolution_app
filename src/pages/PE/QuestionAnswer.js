/*
 * @Date: 2022-05-17 10:28:10
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-17 15:50:29
 * @Description: 私募问答
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import Loading from '../Portfolio/components/PageLoading';
// import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {btns = [], list = [], tips} = data;

    const onSelect = (questionIndex, option) => {
        const _data = {...data};
        const _list = _data.list;
        _list[questionIndex].selected = option.value;
        _list[questionIndex].show_area = option.show_area;
        setData(_data);
    };

    useEffect(() => {
        navigation.setOptions({title: '私募问答'});
        setData({
            btns: [
                {
                    text: '上一步',
                    url: '',
                },
                {
                    text: '提交',
                    url: '',
                },
            ],
            list: [
                {
                    options: [
                        {label: '是', value: 1},
                        {label: '否', value: 0},
                    ],
                    title:
                        '私募基金投资者，最近20个交易日金融资产均不低于人民币300万元，或者最近3年个人年均收入不低于人民币50万元',
                },
                {
                    options: [
                        {label: '是', value: 1},
                        {label: '否', value: 0},
                    ],
                    tips: '是否存在实际控制关系？',
                    title: '是否存在实际控制关系？',
                },
                {
                    options: [
                        {label: '本人', value: 1},
                        {label: '他人', show_area: 1, value: 2},
                    ],
                    title: '交易的实际收益人？',
                },
            ],
            // tips: '*回访说明详细内容占位符。',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                bounces={false}
                extraScrollHeight={px(40)}
                scrollIndicatorInsets={{right: 1}}
                style={styles.scrollView}>
                {tips ? <Text style={[styles.tips, {marginTop: Space.marginVertical}]}>{tips}</Text> : null}
                {list.map((question, i, arr) => {
                    const {
                        info = '',
                        max_length = 300,
                        options,
                        selected,
                        show_area,
                        tips: questionTips,
                        title,
                    } = question;
                    return (
                        <View
                            key={question + i}
                            style={[
                                styles.questionBox,
                                {
                                    marginTop: tips && i === 0 ? px(12) : Space.marginVertical,
                                    marginBottom: i === arr.length - 1 ? px(20) : 0,
                                },
                            ]}>
                            <View style={Style.flexRow}>
                                <Text style={styles.questionTitle}>{title}</Text>
                                {questionTips ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => Modal.show({content: questionTips, title: '提示'})}>
                                        <Image source={require('../../assets/img/tip.png')} style={styles.tipsIcon} />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                            {options.map((option, j) => {
                                const {label, value} = option;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={selected === undefined ? 0.8 : 1}
                                        key={option + j}
                                        onPress={() => selected === undefined && onSelect(i, option)}
                                        style={[
                                            styles.optionBox,
                                            {
                                                marginTop: j === 0 ? Space.marginVertical : px(12),
                                                borderColor:
                                                    selected !== undefined && selected !== value
                                                        ? '#E2E4EA'
                                                        : '#D7AF74',
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.optionLabel,
                                                {color: selected === value ? '#CEA26B' : Colors.defaultColor},
                                            ]}>
                                            {label}
                                            {selected === value ? '（已选）' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            {show_area ? (
                                <View style={styles.inputBox}>
                                    <TextInput
                                        keyboardType={'default'}
                                        maxLength={max_length}
                                        multiline
                                        onChangeText={(_text) => {
                                            const _data = {...data};
                                            const _list = _data.list;
                                            _list[i].info = _text;
                                            setData(_data);
                                        }}
                                        placeholder={'请输入说明'}
                                        placeholderTextColor={'#BDC2CC'}
                                        style={styles.textarea}
                                        textAlignVertical="top"
                                        value={info}
                                    />
                                    <Text style={[styles.btnText, styles.countText]}>
                                        {info.length}/{max_length}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    );
                })}
            </KeyboardAwareScrollView>
            <View style={[Style.flexRow, styles.bottomBtn]}>
                {btns.map((btn, index) => {
                    const {text, url} = btn;
                    return (
                        <Button
                            color={btns.length > 1 && index === 0 ? undefined : '#EDDBC5'}
                            disabledColor={btns.length > 1 && index === 0 ? undefined : '#EDDBC5'}
                            key={btn + index}
                            onPress={() => jump(url)}
                            style={btns.length > 1 && index === 0 ? styles.prevBtn : styles.nextBtn}
                            textStyle={btns.length > 1 ? styles.btnText : undefined}
                            title={text}
                            type={btns.length > 1 && index === 0 ? 'minor' : 'primary'}
                        />
                    );
                })}
            </View>
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
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    tips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    questionBox: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    questionTitle: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    tipsIcon: {
        marginLeft: px(4),
        width: px(16),
        height: px(16),
    },
    optionBox: {
        padding: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
    inputBox: {
        marginTop: px(12),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        position: 'relative',
    },
    textarea: {
        padding: px(12),
        paddingTop: px(12),
        height: px(116),
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    countText: {
        color: '#BDC2CC',
        position: 'absolute',
        right: px(12),
        bottom: px(12),
    },
    bottomBtn: {
        paddingTop: px(8),
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 : px(8),
        backgroundColor: '#fff',
    },
    prevBtn: {
        marginRight: px(12),
        width: px(166),
    },
    nextBtn: {
        flex: 1,
        backgroundColor: '#D7AF74',
    },
    btnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
    },
});
