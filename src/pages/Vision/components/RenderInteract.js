/*
 * @Date: 2022-04-15 11:03:55
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-15 14:35:47
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
    const [selected, setSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const idRef = useRef('');

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
            }
        });
    };

    const renderOptions = ({
        answer_info: {answer = 0, my_answer = 0} = {},
        answered,
        desc = '',
        id = '',
        option_list = [],
        type = 0,
    }) => {
        switch (type) {
            case 1:
                return (
                    <>
                        <Text style={styles.desc}>{desc}</Text>
                        {answered ? (
                            <View>
                                <></>
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
                return (
                    <>
                        {option_list?.map?.((option, index) => {
                            const {content, rate, value} = option;
                            return (
                                <TouchableOpacity
                                    activeOpacity={answered && my_answer !== value ? 1 : 0.8}
                                    key={option + index}
                                    onPress={() => {
                                        if (answered) {
                                            setSelected('');
                                            idRef.current = id;
                                            my_answer === value && setVisible(true);
                                        } else {
                                            setSelected(value);
                                            onAnswer(id, value);
                                        }
                                    }}
                                    style={[
                                        Style.flexBetween,
                                        styles.optionBox,
                                        index === 0 ? {marginTop: Space.marginVertical} : {},
                                        !answered && selected === value ? {borderWidth: px(1)} : {},
                                    ]}>
                                    <View
                                        style={[
                                            styles.percentPart,
                                            selected === value || my_answer === value
                                                ? {backgroundColor: 'rgba(0, 81, 204, 0.2)'}
                                                : {},
                                            {width: answered ? `${rate}%` : 0},
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.content,
                                            selected === value || my_answer === value ? {color: Colors.brandColor} : {},
                                        ]}>
                                        {content}
                                    </Text>
                                    {answered && <Text style={styles.content}>{rate}%</Text>}
                                </TouchableOpacity>
                            );
                        })}
                    </>
                );
            case 3:
                return <>{}</>;
            default:
                return null;
        }
    };

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
                    <View style={[styles.container, style]}>
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
        paddingHorizontal: px(12),
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
});
