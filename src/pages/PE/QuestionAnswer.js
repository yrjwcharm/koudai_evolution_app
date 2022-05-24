/*
 * @Date: 2022-05-17 10:28:10
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-24 18:25:43
 * @Description: 私募问答
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import {NativeSignManagerEmitter, MethodObj} from './PEBridge';
import {debounce} from 'lodash';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button: btns = [], questions: list = [], tip: tips} = data;

    const finished = useMemo(() => {
        const {questions = []} = data;
        return questions.every((item) => {
            const {info, show_extra, selected} = item;
            if (show_extra) {
                return selected !== undefined && info;
            } else {
                return selected !== undefined;
            }
        });
    }, [data]);

    const onSelect = (questionIndex, option) => {
        const {pop} = option;
        const _data = {...data};
        const _list = _data.questions;
        if (pop) {
            const {cancel, confirm, content, title, type} = pop;
            Modal.show({
                backButtonClose: false,
                cancelCallBack: () => {
                    _list[questionIndex].selected = cancel.val;
                    _list[questionIndex].show_extra = cancel.show_extra;
                    setData(_data);
                },
                cancelText: cancel.text,
                confirm: type === 'confirm',
                confirmCallBack: () => {
                    _list[questionIndex].selected = confirm.val;
                    _list[questionIndex].show_extra = confirm.show_extra;
                    setData(_data);
                },
                confirmText: confirm.text,
                confirmTextColor: '#D7AF74',
                content,
                isTouchMaskToClose: false,
                title,
            });
        } else {
            _list[questionIndex].selected = option.val;
            _list[questionIndex].show_extra = option.show_extra;
            setData(_data);
        }
    };

    const onSubmit = useCallback(
        debounce(
            () => {
                const {fund_code, order_id, scene} = route.params;
                const params = {fund_code: fund_code || '', order_id: order_id || ''};
                params.answer_list = JSON.stringify(
                    data?.questions?.map((item) => {
                        return {answer: item.selected, question_id: item.id, extra: item.info || ''};
                    })
                );
                const obj = {
                    investorInfo: '/private_fund/submit_investor_info_question/20220510',
                    return: '/private_fund/submit_return_visit/20220510',
                };
                http.post(obj[scene || 'investorInfo'], params).then((res) => {
                    if (res.code === '000000') {
                        if (scene === 'investorInfo') {
                            navigation.goBack();
                        } else {
                            jump(res.result.url);
                        }
                    } else {
                        if (scene === 'return') {
                            navigation.goBack();
                        }
                    }
                    Toast.show(res.message);
                });
            },
            1000,
            {leading: true, trailing: false}
        ),
        [data, route.params]
    );

    useEffect(() => {
        const {fund_code, order_id, scene} = route.params;
        const obj = {
            investorInfo: '/private_fund/investor_info_question/20220510',
            return: '/private_fund/return_visit/20220510',
        };
        http.get(obj[scene || 'investorInfo'], {
            fund_code: fund_code || '',
            order_id: order_id || '',
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '私募问答'});
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
            http.post('/file_sign/sign_done/20220510', {file_id: res.fileId}).then((resp) => {
                if (resp.code === '000000') {
                    Toast.show(resp.message || '签署成功');
                    navigation.goBack();
                } else {
                    Toast.show(resp.message || '签署失败');
                }
            });
        });
        return () => {
            listener.remove();
        };
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
                        option_list: options,
                        selected,
                        show_extra,
                        tip: questionTips,
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
                                        onPress={() =>
                                            Modal.show({
                                                confirmText: '确定',
                                                content: questionTips.content,
                                                title: '提示',
                                            })
                                        }>
                                        <Image source={require('../../assets/img/tip.png')} style={styles.tipsIcon} />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                            {options.map((option, j) => {
                                const {desc: label, val: value} = option;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={selected === undefined ? 0.8 : 1}
                                        key={option + j}
                                        onPress={() => onSelect(i, option)}
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
                            {show_extra ? (
                                <View style={styles.inputBox}>
                                    <TextInput
                                        keyboardType={'default'}
                                        maxLength={max_length}
                                        multiline
                                        onChangeText={(_text) => {
                                            const _data = {...data};
                                            const _list = _data.questions;
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
            {btns.length > 0 ? (
                <View style={[Style.flexRow, styles.bottomBtn]}>
                    {btns.map((btn, index) => {
                        const {text, url} = btn;
                        return (
                            <Button
                                color={btns.length > 1 && index === 0 ? undefined : '#EDDBC5'}
                                disabled={index === 1 ? !finished : false}
                                disabledColor={btns.length > 1 && index === 0 ? undefined : '#EDDBC5'}
                                key={btn + index}
                                onPress={() => {
                                    if (btns.length > 1 && index === 0) {
                                        jump(url);
                                    } else {
                                        onSubmit();
                                    }
                                }}
                                style={btns.length > 1 && index === 0 ? styles.prevBtn : styles.nextBtn}
                                textStyle={btns.length > 1 ? styles.btnText : undefined}
                                title={text}
                                type={btns.length > 1 && index === 0 ? 'minor' : 'primary'}
                            />
                        );
                    })}
                </View>
            ) : null}
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
