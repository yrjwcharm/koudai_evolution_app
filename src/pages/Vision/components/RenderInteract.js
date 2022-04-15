/*
 * @Date: 2022-04-15 11:03:55
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-15 16:53:36
 * @Description: 用户互动
 */
import React, {useEffect, useRef, useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {SelectModal} from '../../../components/Modal';
import Toast from '../../../components/Toast';
import http from '../../../services';
import {px} from '../../../utils/appUtil';

const fontWeight = Platform.select({android: '700', ios: '500'});

export default (props) => {
    const [data, setData] = useState([]);
    const {article_id = '', style = {}} = props;
    const [selected, setSelected] = useState({}); // 选中的选项
    const [visible, setVisible] = useState(false);
    const idRef = useRef('');
    const pkDivider = useRef();
    const {id: selectedId, value: selectedValue} = selected;

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const init = (type) => {
        http.get('/community/survey/list/20210101', {article_id}).then((res) => {
            if (res.code === '000000') {
                setData(res.result || []);
                if (type === 'choose') {
                    LayoutAnimation.linear();
                }
            } else {
                Toast.show(res.message);
            }
        });
    };

    /** @name 渲染选项部分 */
    const renderOptions = ({
        answer_info: {answer = 0, answer_explain = '', answer_label = '', my_answer = 0, my_answer_label = ''} = {},
        answered,
        desc = '',
        id = '',
        option_list = [],
        type = 0,
    }) => {
        switch (type) {
            // PK测试
            case 1:
                return (
                    <>
                        <Text style={styles.desc}>{desc}</Text>
                        {answered ? (
                            <View style={{marginTop: px(12)}}>
                                <View style={Style.flexBetween}>
                                    <Text style={[styles.barText, {color: '#D9544D'}]}>{option_list[0]?.content}</Text>
                                    <Text style={[styles.barText, {color: '#4984F2'}]}>{option_list[1]?.content}</Text>
                                </View>
                                <View
                                    onLayout={(e) => {
                                        const left =
                                            (e.nativeEvent.layout.width * option_list[0]?.rate) / 100 - px(8) / 2;
                                        pkDivider.current.setNativeProps({style: {left}});
                                    }}
                                    style={[Style.flexRow, styles.percentBar]}>
                                    <View
                                        style={{
                                            height: '100%',
                                            backgroundColor: '#D9544D',
                                            width: `${option_list[0]?.rate}%`,
                                        }}
                                    />
                                    <View
                                        style={{
                                            height: '100%',
                                            backgroundColor: '#4984F2',
                                            width: `${option_list[1]?.rate}%`,
                                        }}
                                    />
                                    {option_list[0]?.rate < 100 && (
                                        <Image
                                            ref={pkDivider}
                                            source={require('../../../assets/img/vision/pkDivider.png')}
                                            style={styles.pkDivider}
                                        />
                                    )}
                                </View>
                                <View style={Style.flexBetween}>
                                    <Text style={[styles.barText, {color: '#D9544D'}]}>{option_list[0]?.rate}%</Text>
                                    <Text style={[styles.barText, {color: '#4984F2'}]}>{option_list[1]?.rate}%</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={[Style.flexRowCenter, {marginTop: Space.marginVertical}]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => onAnswer(id, option_list[0]?.value)}
                                    style={[Style.flexRowCenter, styles.button, {backgroundColor: '#D9544D'}]}>
                                    <Text style={styles.buttonText}>{option_list[0]?.content}</Text>
                                </TouchableOpacity>
                                <Image source={require('../../../assets/img/vision/pk.png')} style={styles.pkImg} />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => onAnswer(id, option_list[1]?.value)}
                                    style={[Style.flexRowCenter, styles.button, {backgroundColor: '#4984F2'}]}>
                                    <Text style={styles.buttonText}>{option_list[1]?.content}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                );
            case 2:
            case 3:
                // 2 问卷调查 3 内容问答
                return (
                    <>
                        {option_list?.map?.((option, index) => {
                            const {content, label, rate, value} = option;
                            return (
                                <TouchableOpacity
                                    activeOpacity={answered && (my_answer !== value || type === 3) ? 1 : 0.8}
                                    key={option + index}
                                    onPress={() => {
                                        if (answered) {
                                            if (type === 3) {
                                                return false;
                                            }
                                            setSelected({});
                                            idRef.current = id;
                                            my_answer === value && setVisible(true);
                                        } else {
                                            setSelected({id, value});
                                            onAnswer(id, value);
                                        }
                                    }}
                                    style={[
                                        styles.optionBox,
                                        index === 0 ? {marginTop: Space.marginVertical} : {},
                                        !answered && selectedId === id && selectedValue === value
                                            ? {borderWidth: px(1)}
                                            : {},
                                        type === 3 && answered && (my_answer === value || value === answer)
                                            ? {borderWidth: px(1)}
                                            : {},
                                        answered
                                            ? value === answer
                                                ? {borderColor: Colors.green}
                                                : {borderColor: Colors.red}
                                            : {},
                                    ]}>
                                    {type === 2 && (
                                        <View
                                            style={[
                                                styles.percentPart,
                                                (selectedId === id && selectedValue === value) || my_answer === value
                                                    ? {backgroundColor: 'rgba(0, 81, 204, 0.2)'}
                                                    : {},
                                                {width: answered ? `${rate}%` : 0},
                                            ]}
                                        />
                                    )}
                                    <View style={[Style.flexBetween, {paddingHorizontal: px(12), height: '100%'}]}>
                                        <View style={Style.flexRow}>
                                            {type === 3 && (
                                                <>
                                                    {answered && (my_answer === value || value === answer) ? (
                                                        <Image
                                                            source={
                                                                my_answer === answer || value === answer
                                                                    ? require('../../../assets/img/vision/correct.png')
                                                                    : require('../../../assets/img/vision/error.png')
                                                            }
                                                            style={styles.statusIcon}
                                                        />
                                                    ) : (
                                                        <View
                                                            style={[
                                                                Style.flexCenter,
                                                                styles.optionIndexCon,
                                                                selectedId === id && selectedValue === value
                                                                    ? {backgroundColor: Colors.brandColor}
                                                                    : {},
                                                            ]}>
                                                            <Text
                                                                style={[
                                                                    styles.optionIndexText,
                                                                    selectedId === id && selectedValue === value
                                                                        ? {color: '#fff'}
                                                                        : {},
                                                                ]}>
                                                                {label}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </>
                                            )}
                                            <Text
                                                style={[
                                                    styles.content,
                                                    !answered &&
                                                    ((selectedId === id && selectedValue === value) ||
                                                        my_answer === value)
                                                        ? {color: Colors.brandColor}
                                                        : {},
                                                    type === 2 && my_answer === value ? {color: Colors.brandColor} : {},
                                                    type === 3 && answered && value === answer
                                                        ? {color: Colors.green}
                                                        : {},
                                                ]}>
                                                {content}
                                            </Text>
                                        </View>
                                        {answered && type === 2 && <Text style={styles.content}>{rate}%</Text>}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        {type === 3 && answered && (
                            <>
                                <View style={[styles.answerCon, {marginTop: px(24)}]}>
                                    <Text style={styles.answerText}>
                                        我的选项：
                                        <Text style={{color: my_answer === answer ? Colors.green : Colors.red}}>
                                            {my_answer_label}
                                        </Text>
                                    </Text>
                                </View>
                                <View style={styles.answerCon}>
                                    <Text style={styles.answerText}>
                                        正确选项：
                                        {answer_label}
                                    </Text>
                                </View>
                                <View style={[Style.flexRow, {marginTop: px(24)}]}>
                                    <View style={styles.bar} />
                                    <Text style={styles.answerText}>问题解析：</Text>
                                </View>
                                <Text style={styles.answerAnalysis}>{answer_explain}</Text>
                            </>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    /** @name 上报答案 */
    const onAnswer = (id, value) => {
        http.post('/community/survey/answer/20210101', {answer: value, survey_id: id}).then((res) => {
            if (res.code === '000000') {
                init(value === -1 ? 'cancel' : 'choose');
            } else {
                Toast.show(res.message);
            }
        });
    };

    return data?.length > 0 ? (
        <>
            {data.map((item, index) => {
                const {name = '', title = ''} = item;
                return (
                    <View key={item + index} style={[styles.container, style]}>
                        <Text style={styles.name}>{name}</Text>
                        <View style={styles.contentBox}>
                            <Text style={styles.title}>{title}</Text>
                            {renderOptions(item)}
                        </View>
                    </View>
                );
            })}
            <SelectModal
                callback={(index) => {
                    if (index === 0) {
                        onAnswer(idRef.current, -1);
                    }
                }}
                closeModal={() => setVisible(false)}
                entityList={['取消选择']}
                show={visible}
            />
        </>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: Space.padding,
    },
    name: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight,
    },
    contentBox: {
        marginTop: px(12),
        paddingVertical: px(20),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight,
    },
    desc: {
        marginTop: px(8),
        fontSize: Font.textH3,
        lineHeight: px(18),
        color: Colors.descColor,
    },
    optionBox: {
        marginTop: px(12),
        borderWidth: 0,
        borderColor: Colors.brandColor,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: px(46),
        position: 'relative',
        overflow: 'hidden',
    },
    percentPart: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: '#E2E4EA',
    },
    content: {
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    button: {
        borderRadius: px(18),
        width: px(128),
        height: px(36),
    },
    buttonText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    pkImg: {
        marginHorizontal: px(12),
        width: px(30),
        height: px(30),
    },
    barText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        fontWeight,
    },
    percentBar: {
        marginTop: px(4),
        marginBottom: px(2),
        borderRadius: px(100),
        height: px(6),
        overflow: 'hidden',
    },
    pkDivider: {
        width: px(8),
        height: px(6),
        position: 'absolute',
        top: 0,
    },
    statusIcon: {
        marginRight: px(8),
        width: px(20),
        height: px(20),
    },
    optionIndexCon: {
        marginRight: px(8),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
        width: px(20),
        height: px(20),
    },
    optionIndexText: {
        fontSize: px(13),
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    answerCon: {
        marginTop: px(12),
        paddingVertical: px(7),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#E9EAEF',
    },
    answerText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    bar: {
        marginRight: px(8),
        width: px(4),
        height: px(16),
        backgroundColor: Colors.brandColor,
    },
    answerAnalysis: {
        marginTop: px(12),
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.descColor,
    },
});
