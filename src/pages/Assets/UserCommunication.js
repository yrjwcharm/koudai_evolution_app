/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2022-04-28 15:58:50
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-29 18:25:22
 * @Description: 用户交流
 */
import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from '../../components/Button';
import {Layer, useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

const fontWeightMedium = Platform.select({android: '700', ios: '500'});

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, content: introContent = '', finish_content = '', communicate_question: questions = []} = data;
    const {text = '', url = ''} = button;
    const [finished, setFinished] = useState(false);
    const scrollViewRef = useRef();
    const listener = useRef();
    const {communicate_id, type} = route.params;

    useEffect(() => {
        listener.current = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Modal.show({
                title: '温馨提示',
                content: '是否确认退出本次调研？',
                confirm: true,
                confirmCallBack: () => {
                    navigation.dispatch(e.data.action);
                    if (!finished) {
                        setTimeout(() => {
                            Modal.showLayer(<Layer options={global.layerOptions} type={type} />);
                            global.layerOptions = null;
                        }, 500);
                    }
                },
                isTouchMaskToClose: false,
                backButtonClose: false,
            });
        });
        return () => {
            listener.current?.();
        };
    }, [finished]);

    useEffect(() => {
        http.get('/common/communicate/questions/20220428', {communicate_id}).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: '用户交流'});
                const {communicate_question: _questions} = res.result;
                _questions.forEach((question, index) => {
                    question.answered = false;
                    question.loading = index === 0 ? false : true;
                    question.show = index === 0 ? true : false;
                });
                setData(res.result);
            }
        });
    }, []);

    const onSelect = (i, j) => {
        // console.log(i, j);
        const _data = {...data};
        const {communicate_question: _questions} = _data;
        const {question_options: _options} = _questions[i];
        _options[j].count += 1;
        const total = _options.reduce((prev, curr) => prev + curr.count, 0);
        let totalPercent = 0;
        _options.slice(0, -1).forEach((item) => {
            const percent = Math.round((item.count / total) * 100);
            totalPercent += percent;
            item.rate = percent + '%';
        });
        _options[_options.length - 1].rate = 100 - totalPercent + '%';
        _questions[i].answered = true;
        _questions[i].selected = j;
        http.post('/common/communicate/upload/20220426', {
            communicate_id,
            question_id: _questions[i].question_id,
            option_id: _options[j].option_id,
            is_start: i === 0 ? 1 : 0,
            is_end: i === _questions.length - 1 ? 1 : 0,
        }).then((res) => {
            if (res.code === '000000') {
                if (_questions[i + 1]) {
                    _questions[i + 1].show = true;
                    setTimeout(() => {
                        setData((prev) => {
                            const next = {...prev};
                            next.communicate_question[i + 1].loading = false;
                            return next;
                        });
                    }, 1000);
                } else {
                    setFinished(true);
                }
                setData(_data);
                LayoutAnimation.linear();
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd?.({animated: true});
                }, 1000);
            } else {
                Toast.show(res.message);
            }
        });
    };

    return Object.keys(data || {}).length > 0 ? (
        <ScrollView bounces={false} ref={scrollViewRef} style={styles.container}>
            <View style={styles.paddingBox}>
                <LinearGradient
                    colors={['#DFECFF', '#fff']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={{borderRadius: Space.borderRadius}}>
                    <Image source={require('../../assets/personal/bigQuota.png')} style={styles.bigQuota} />
                    <View style={{padding: Space.padding}}>
                        <Text style={styles.introTitle}>{'尊敬的魔方用户您好！'}</Text>
                        <View style={styles.introContentBox}>
                            <HTML html={introContent} style={styles.introText} />
                        </View>
                    </View>
                </LinearGradient>
                {questions.map((question, i) => {
                    const {
                        answered,
                        loading,
                        question_options: options,
                        selected,
                        show,
                        question_content: title,
                    } = question;
                    return show ? (
                        <View key={question + i} style={styles.questionBox}>
                            {loading ? (
                                <View style={Style.flexCenter}>
                                    <ActivityIndicator color={Colors.brandColor} size="small" />
                                </View>
                            ) : (
                                <>
                                    <HTML html={title} style={styles.introText} />
                                    {options.map((option, j) => {
                                        const {option_content: content, rate} = option;
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={answered ? 1 : 0.8}
                                                key={option + j}
                                                onPress={() => !answered && onSelect(i, j)}
                                                style={[
                                                    styles.questionOption,
                                                    {
                                                        marginTop: j === 0 ? px(16) : px(12),
                                                        borderColor:
                                                            answered && selected !== j ? '#E2E4EA' : Colors.brandColor,
                                                    },
                                                ]}>
                                                <View
                                                    style={[
                                                        styles.percentPart,
                                                        {
                                                            backgroundColor:
                                                                selected === j
                                                                    ? 'rgba(0, 81, 204, 0.1)'
                                                                    : 'rgba(233, 234, 239, 0.5)',
                                                            width: answered ? rate : 0,
                                                        },
                                                    ]}
                                                />
                                                <View style={[Style.flexBetween, styles.optionBox]}>
                                                    <Text
                                                        style={[
                                                            styles.optionText,
                                                            answered && selected === j
                                                                ? {color: Colors.brandColor}
                                                                : {},
                                                        ]}>
                                                        {content}
                                                        {selected === j ? '（已选）' : ''}
                                                    </Text>
                                                    {answered && <Text style={styles.optionText}>{rate || ''}</Text>}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </>
                            )}
                        </View>
                    ) : null;
                })}
                {finished && (
                    <>
                        <Text style={styles.finishText}>{finish_content}</Text>
                        <Button onPress={() => jump(url)} style={styles.button} title={text} />
                    </>
                )}
            </View>
        </ScrollView>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    paddingBox: {
        marginBottom: isIphoneX() ? 34 : px(12),
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
    },
    bigQuota: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px(52),
        height: px(44),
    },
    introTitle: {
        marginTop: px(4),
        fontSize: px(18),
        lineHeight: px(25),
        color: Colors.defaultColor,
        fontWeight: fontWeightMedium,
    },
    introContentBox: {
        marginTop: px(8),
        paddingTop: px(8),
        borderTopWidth: Space.borderWidth,
        borderColor: '#C0D8FF',
    },
    introText: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    questionBox: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    questionOption: {
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        position: 'relative',
        overflow: 'hidden',
    },
    optionBox: {
        paddingVertical: px(9),
        paddingHorizontal: px(12),
    },
    percentPart: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
    },
    optionText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        maxWidth: px(240),
    },
    finishText: {
        marginTop: px(12),
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    button: {
        marginTop: px(40),
        marginHorizontal: px(4),
    },
});
