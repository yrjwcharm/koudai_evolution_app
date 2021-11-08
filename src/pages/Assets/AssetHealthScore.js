/*
 * @Date: 2021-11-04 10:41:48
 * @Author: wxp
 * @LastEditors: wxp
 * @LastEditTime: 2021-11-04 14:48:57
 * @Description: 资产健康分
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, Dimensions, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {px, isIphoneX} from '../../utils/appUtil.js';
import {Colors, Font, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button/Button.js';
import * as Animatable from 'react-native-animatable';
import Modal from '../../components/Modal/Modal.js';
import {useJump} from '../../components/hooks';

const AssetHealthScore = ({navigation, route}) => {
    const jump = useJump();
    const [updateType, setUpdateType] = useState('beforeUpdate');
    const [score, setScore] = useState(null);

    const topHeight = 44 + useSafeAreaInsets().top;

    const [checkScales, setCheckScale] = useState([false, false, false]);
    const linearColorType = useMemo(() => {
        return {
            high: ['#5ACB8A', '#45AD72'],
            low: ['#F46E6E', '#E74949'],
            computing: ['#FF915E', '#FF7D41'],
        };
    }, []);

    const [data, setData] = useState({
        desc: '',
        button: {},
        items: [],
        score: '',
        calc_button: {},
    });
    const [updatedData, setUpdatedData] = useState({
        score_info: {},
        tip: '',
        button: {},
    });
    const checkAnimateConfig = useMemo(
        (_) => ({0: {opacity: 0, scale: 0}, 0.5: {opacity: 1, scale: 0.2}, 1: {opacity: 1, scale: 0.6}}),
        []
    );

    const [switchState, setSwitchState] = useState(false);

    const init = useCallback(() => {
        http.get('/position/get_health_score/20210101', {
            poid: route.params?.poid,
        }).then((res) => {
            navigation.setOptions({
                title: '资产健康分',
            });
            if (res.code === '000000') {
                let result = res.result;
                setData(result);
                setScore(result.score);
                setSwitchState(!!result.calc_button.status);
            } else {
                Toast(res.message);
            }
        });
    }, [navigation, route.params.poid]);

    useEffect(() => {
        init();
    }, [init]);

    const updateSwitchState = useCallback(
        (state) => {
            const submit = () => {
                http.post('/position/change_health_auto/20210101', {
                    poid: route.params?.poid,
                    status: +state, // 转换成0/1
                }).then((res) => {
                    if (res.code === '000000') {
                        setSwitchState(state);
                    } else {
                        Toast.show(res.message);
                    }
                });
            };
            if (!state) {
                submit();
            } else {
                Modal.show({
                    title: '开启自动计算',
                    content: '开启后，每天会定时帮您计算资产的健康分。',
                    confirm: true,
                    confirmCallBack: submit,
                });
            }
        },
        [route.params.poid]
    );

    const handlerScoreBgImg = useCallback(() => {
        if (updateType === 'updating') {
            return require('../../assets/animation/healthScore.gif');
        } else {
            return require('../../assets/img/healthScore/healthScore.png');
        }
    }, [updateType]);

    const bgLinearColors = useMemo(() => {
        return updateType === 'updating'
            ? linearColorType.computing
            : score >= 90
            ? linearColorType.high
            : linearColorType.low;
    }, [linearColorType.computing, linearColorType.high, linearColorType.low, score, updateType]);

    // 更新分数/颜色/选中
    const updateAllView = useCallback((Timer) => {
        // 生成随机间隔和步进
        const random = () => {
            let spaceArr = [30, 40, 50];
            let stepArr = [1, 1.1, 1.2];
            return [spaceArr[Date.now() % 3], stepArr[Date.now() % 3]];
        };

        // 时间记录
        let timeRecord = 0;
        // 节流时间记录
        let last = Date.now();

        let [space, step] = random();

        Timer.timer = setInterval(() => {
            timeRecord += 20;

            let now = Date.now();
            if (now - last >= space) {
                last = now;
                // 改变间隔
                space = Math.round(space * 1.03) + 1;

                setScore((val) => {
                    if (val == 29) {
                        setCheckScale([true, false, false]);
                        // 重新生成随机数组
                        let randomArr = random();
                        space = randomArr[0];
                        step = randomArr[1];
                    } else if (val == 59) {
                        setCheckScale([true, true, false]);
                        if (Timer.score) {
                            // 计算剩余时间完成更新
                            let resetTime = 8800 - timeRecord;
                            let resetScore = Timer.score - 59;
                            let limit = Math.round(resetTime / resetScore);
                            space = limit / parseInt(Math.pow(1.03, Math.round(limit / 2)), 10);
                            step = 1;
                        } else {
                            Timer.cancel();
                            Toast.show('网络超时，请重新再试');
                            setUpdateType('beforeUpdate');
                        }
                    } else if (Timer.score && val == Timer.score) {
                        // 完成
                        Timer.cancel();
                        setCheckScale([true, true, true]);
                        setUpdateType('updated');
                        return val;
                    }
                    let newScore = Math.round(val + step);
                    return newScore;
                });
            }
        }, 20);
    }, []);

    const handlerRecalculate = useCallback(() => {
        let Timer = {
            timer: null,
            cancel: function () {
                clearTimeout(this.timer);
                this.timer = null;
            },
            score: null,
        };
        // 更新状态
        setUpdateType('updating');
        // 清空分数和颜色
        setScore(0);
        // 清空check
        setCheckScale([false, false, false]);
        // 发送接口
        http.post('/position/calc_health_score/20210101', {
            poid: route.params?.poid,
        }).then((res) => {
            if (res.code === '000000') {
                let {score_info} = res.result;
                Timer.score = score_info.score;
                setUpdatedData(res.result);
            } else {
                Toast.show(res.message);
                Timer.cancel();
                setUpdateType('beforeUpdate');
            }
        });
        // 更新分数/颜色/选中
        updateAllView(Timer);
    }, [route.params.poid, updateAllView]);
    const genPastTimeText = useCallback(
        (isUpdated) => {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.pastTime}>{isUpdated ? '刚刚更新' : data.desc ? data.desc : null}</Text>
                    {/*  minibtn */}
                    {isUpdated && (
                        <Button
                            type="minor"
                            title="重新计算"
                            textStyle={{
                                color: bgLinearColors[1],
                                ...styles.againButtonTitle,
                            }}
                            style={styles.againButton}
                            onPress={handlerRecalculate}
                        />
                    )}
                </View>
            );
        },
        [data.desc, handlerRecalculate, bgLinearColors]
    );

    const genScoreSubChild = useCallback(
        (type) => {
            switch (type) {
                case 'beforeUpdate':
                    return (
                        <>
                            {genPastTimeText()}
                            {data.button.text ? (
                                <Button
                                    title={data.button.text}
                                    type="minor"
                                    textStyle={{color: bgLinearColors[1]}}
                                    style={styles.scoreButton}
                                    onPress={handlerRecalculate}
                                />
                            ) : null}
                        </>
                    );
                case 'updating':
                    return (
                        <>
                            <Text style={styles.updatingHint}>正在评估资产健康分</Text>
                            <Text style={styles.remark}>请耐心等待，切勿退出</Text>
                        </>
                    );
                case 'updated':
                    return (
                        <>
                            {genPastTimeText(true)}
                            <Text style={styles.updatingHint}>{updatedData.score_info.score_desc}</Text>
                            {updatedData.score_info.need_optimize ? (
                                <Button
                                    title={updatedData.button.text}
                                    type="minor"
                                    textStyle={{color: bgLinearColors[1]}}
                                    style={styles.scoreButton}
                                    onPress={() => {
                                        jump(updatedData?.button?.url);
                                    }}
                                />
                            ) : null}

                            <Text style={styles.remark}>{updatedData.tip}</Text>
                        </>
                    );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [genPastTimeText, updatedData, handlerRecalculate, data.button.text]
    );
    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} bounces={false} scrollIndicatorInsets={{right: 1}}>
                <LinearGradient colors={bgLinearColors} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                    <View style={{height: px(topHeight)}} />
                    <View style={{...styles.scorePanel, minHeight: px(464 - topHeight)}}>
                        <View style={styles.scoreWrap}>
                            <FastImage style={styles.scoreBgImg} source={handlerScoreBgImg()} />
                            <Text style={styles.scoreNum}>{[null, undefined].includes(score) ? '?' : score}</Text>
                        </View>
                        <View style={styles.scoreOperate}>{genScoreSubChild(updateType)}</View>
                    </View>
                </LinearGradient>
                {/* 计算项目 */}
                <View style={styles.calcWrap}>
                    {data.items.map((item, idx, arr) => (
                        <View
                            style={{...styles.calcItem, borderBottomWidth: arr.length - 1 === idx ? 0 : px(0.5)}}
                            key={idx}>
                            <FastImage
                                style={styles.calcItemIcon}
                                source={{
                                    uri: item.icon,
                                }}
                            />
                            <View style={styles.calcItemContent}>
                                <Text style={styles.calcItemTitle}>{item.title}</Text>
                                <Text style={styles.calcItemSubTitle}>{item.desc}</Text>
                            </View>
                            <View style={styles.calcItemRight}>
                                {checkScales[idx] ? (
                                    <Animatable.View animation={checkAnimateConfig} duration={300}>
                                        <Icon name="checkcircle" size={35} color="#4BA471" />
                                    </Animatable.View>
                                ) : null}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {/* <View > */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.11)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.bottomWrap}>
                <View style={styles.bottomMain}>
                    <Text style={styles.bottomTitle}>
                        {data?.calc_button?.title}
                        <Text style={styles.bottomSubTitle}>({data?.calc_button?.desc})</Text>
                    </Text>
                    <Switch
                        ios_backgroundColor={'#CCD0DB'}
                        onValueChange={updateSwitchState}
                        thumbColor={'#fff'}
                        trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                        disabled={!data?.calc_button?.title}
                        value={switchState}
                    />
                </View>
            </LinearGradient>
            {/* </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingBottom: px((isIphoneX() ? 34 : 8) + 44 + 12),
    },
    scorePanel: {
        width: '100%',
        alignItems: 'center',
    },
    scoreWrap: {
        paddingVertical: px(35),
        height: px(260),
        width: px(200),
        ...Style.flexCenter,
    },
    scoreBgImg: {
        width: px(200),
        height: px(200),
        position: 'absolute',
        top: px(30),
    },
    scoreNum: {
        fontSize: px(58),
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        color: '#fff',
    },
    scoreOperate: {
        alignItems: 'center',
    },
    pastTime: {
        fontSize: px(14),
        lineHeight: px(21),
        color: '#fff',
        marginRight: px(5),
        marginBottom: px(20),
    },
    updatingHint: {
        fontSize: px(16),
        lineHeight: px(24),
        color: '#FFF',
        width: Dimensions.get('window').width * 0.78,
        textAlign: 'center',
        marginBottom: px(20),
    },
    remark: {
        marginBottom: px(20),
        lineHeight: px(21),
        fontSize: px(12),
        color: '#FFF',
    },
    scoreButton: {
        width: px(150),
        borderWidth: 0,
        textAlign: 'center',
        marginBottom: px(20),
        height: px(40),
    },
    againButton: {
        borderRadius: px(6),
        borderWidth: 0,
        height: px(23),
        width: px(56),
    },
    againButtonTitle: {
        fontSize: px(11),
        fontWeight: 'bold',
    },
    calcWrap: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        margin: px(16),
        paddingHorizontal: px(16),
    },
    calcItem: {
        paddingVertical: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#e9eaef',
    },
    calcItemIcon: {
        width: px(30),
        height: px(30),
    },
    calcItemContent: {
        flex: 1,
        marginHorizontal: px(12),
    },
    calcItemTitle: {
        fontSize: px(14),
        fontWeight: 'bold',
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    calcItemSubTitle: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#4E556C',
    },
    calcItemRight: {
        width: px(37),
        alignItems: 'center',
    },
    bottomWrap: {
        position: 'absolute',
        paddingHorizontal: px(8),
        paddingTop: px(12),
        bottom: 0,
        width: Dimensions.get('window').width,
        paddingBottom: isIphoneX() ? 34 : px(8),
    },
    bottomMain: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(16),
        height: px(44),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomTitle: {
        fontSize: px(14),
        fontWeight: 'bold',
        lineHeight: px(20),
    },
    bottomSubTitle: {
        fontSize: px(12),
        color: '#9EA5B6',
    },
});

export default AssetHealthScore;
