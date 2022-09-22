/*
 * @Date: 2022-03-11 14:51:29
 * @Description: 理性等级
 */
import React, {useCallback, useEffect, useState} from 'react';
import {AppState, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import NumberTicker from '../../components/NumberTicker';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {px} from '../../utils/appUtil';

export default ({navigation}) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const [value, setVal] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const {grade_info, task_list, tip_info} = data || {};

    const init = () => {
        checkNotifications()
            .then(({status}) => {
                const params = {open_push: status === 'granted' ? 1 : 0};
                http.get('/rational/grade/detail/20220315', params).then((res) => {
                    if (res.code === '000000') {
                        res.result.top_button &&
                            navigation.setOptions({
                                headerRight: (props) => (
                                    <>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[Style.flexCenter, {marginRight: Space.marginAlign}]}
                                            onPress={() => {
                                                jump(res.result.top_button.url);
                                                global.LogTool('graderecord');
                                            }}>
                                            <Text style={{...styles.taskTitle, marginRight: 0, fontWeight: '400'}}>
                                                {res.result.top_button.text}
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ),
                            });
                        setVal(res.result.grade_info?.score_text_before);
                        if (res.result.grade_info?.score_add > 0) {
                            setShowAdd(true);
                        } else {
                            setShowAdd(false);
                        }
                        setTimeout(() => {
                            setVal(res.result.grade_info?.score_text);
                            setTimeout(() => {
                                setShowAdd(false);
                            }, 500);
                        }, 1500);
                        setData(res.result);
                    }
                    setRefreshing(false);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        const onStateChange = (appState) => {
            if (appState === 'active') {
                init();
            }
        };
        AppState.addEventListener('change', onStateChange);
        return () => {
            AppState.removeEventListener('change', onStateChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data || {}).length > 0 ? (
        <ScrollView
            refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}
            style={styles.container}>
            {tip_info ? (
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(tip_info.url)} style={styles.topInfo}>
                    <Text style={styles.infoText}>{tip_info.text}</Text>
                </TouchableOpacity>
            ) : null}
            <View style={{paddingHorizontal: Space.padding}}>
                <LinearGradient
                    colors={['#3E4166', '#14102A']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.levelCon}>
                    <Image source={require('../../assets/img/vision/levelBg.png')} style={styles.levelBg} />
                    <View style={[Style.flexRow, {marginTop: px(13)}]}>
                        <Image source={require('../../assets/img/vision/level.png')} style={styles.levelIcon} />
                        <Text style={styles.levelText}>{grade_info?.title}</Text>
                        <Text style={styles.levelNum}>{grade_info?.grade}</Text>
                        {grade_info?.reminder ? (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.levelTips}>{grade_info?.reminder}</Text>
                            </>
                        ) : null}
                    </View>
                    <View style={[styles.levelValCon, {marginTop: value.includes(',') ? px(12) : px(6)}]}>
                        <NumberTicker duration={500} number={value} textSize={px(36)} textStyle={styles.levelVal} />
                        <View>
                            <Text style={{...styles.infoText, color: '#FFEBCB', opacity: showAdd ? 1 : 0}}>
                                +{grade_info?.score_add}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    navigation.navigate('RationalRecord');
                                    global.LogTool('graderecord');
                                }}>
                                <Text style={[styles.linkText, {marginBottom: value.includes(',') ? px(5) : px(-1)}]}>
                                    {'理性值'}
                                    <Icon color={'#FFEBCB'} name="right" size={10} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.barCon, {marginTop: value.includes(',') ? px(2) : px(8)}]}>
                        <LinearGradient
                            colors={['#FFF4E3', '#FFFFFF']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[styles.activeBar, {width: `${grade_info?.progress?.percent}%`}]}
                        />
                        {grade_info?.progress?.percent > 0 && (
                            <View style={[styles.lightCon, {width: `${grade_info?.progress?.percent}%`}]}>
                                <Image source={require('../../assets/img/vision/light.png')} style={styles.light} />
                            </View>
                        )}
                    </View>
                    <View style={[Style.flexBetween, {marginTop: px(4)}]}>
                        {grade_info?.progress?.range_text?.map?.((item, index) => {
                            return (
                                <Text key={item + index} style={{...styles.levelTips, opacity: 0.4}}>
                                    {item}
                                </Text>
                            );
                        })}
                    </View>
                </LinearGradient>
                {task_list?.map?.((item, index) => {
                    return (
                        <View key={item + index} style={[styles.taskCon, index === 0 ? {marginTop: px(20)} : {}]}>
                            <Text style={styles.partTitle}>{item.title}</Text>
                            {item.list?.map?.((task, idx) => {
                                return (
                                    <View
                                        key={task + idx}
                                        onLayout={() => {
                                            if (task.anchor_log) {
                                                const {ctrl, event} = task.anchor_log;
                                                global.LogTool(event, ctrl);
                                            }
                                        }}
                                        style={[
                                            Style.flexBetween,
                                            styles.taskItem,
                                            idx === 0 ? {borderTopWidth: 0} : {},
                                        ]}>
                                        <View>
                                            <View style={Style.flexRow}>
                                                <Text style={styles.taskTitle}>{task.name}</Text>
                                                <Text style={styles.earnNum}>
                                                    <Text style={{fontFamily: Font.numFontFamily}}>
                                                        +{task.score_text}
                                                    </Text>
                                                    {' 理性值'}
                                                </Text>
                                            </View>
                                            {task.tip ? <Text style={styles.taskTips}>{task.tip}</Text> : null}
                                            {task.progress ? (
                                                <View style={[Style.flexRow, {marginTop: px(7)}]}>
                                                    <View style={styles.taskBar}>
                                                        <View
                                                            style={[
                                                                styles.taskActiveBar,
                                                                {width: `${task.progress.percent}%`},
                                                            ]}
                                                        />
                                                    </View>
                                                    <Text style={styles.taskProgress}>
                                                        <Text style={{color: '#EB7121'}}>
                                                            {task.progress.current_num}
                                                        </Text>
                                                        /{task.progress.total_num}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                        {task.button ? (
                                            <TouchableOpacity
                                                activeOpacity={task.button.avail ? 0.8 : 1}
                                                disabled={task.button.avail === 0}
                                                onPress={() => {
                                                    global.LogTool('gradetask', task.name);
                                                    if (task.button.action === 'open_push') {
                                                        // 打开推送权限
                                                        requestNotifications(['alert', 'sound'])
                                                            .then(({status}) => {
                                                                if (status === 'granted') {
                                                                    init();
                                                                } else {
                                                                    Modal.show({
                                                                        backButtonClose: false,
                                                                        isTouchMaskToClose: false,
                                                                        title: '权限申请',
                                                                        content: '开启推送，方便了解市场情况',
                                                                        confirm: true,
                                                                        confirmText: '前往',
                                                                        confirmCallBack: () => {
                                                                            openSettings().catch(() =>
                                                                                console.log('cannot open settings')
                                                                            );
                                                                        },
                                                                    });
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                console.log(error);
                                                            });
                                                    } else {
                                                        jump(task.button.url);
                                                    }
                                                }}
                                                style={[
                                                    styles.btnCon,
                                                    task.button.avail ? {} : {backgroundColor: '#E9EAEF'},
                                                ]}>
                                                <Text
                                                    style={{
                                                        ...styles.infoText,
                                                        color: task.button.avail ? '#242341' : Colors.lightGrayColor,
                                                    }}>
                                                    {task.button?.text}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topInfo: {
        paddingVertical: px(9),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    infoText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#EB7121',
    },
    levelCon: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        minHeight: px(140),
    },
    levelBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px(140),
        height: px(80),
    },
    levelIcon: {
        marginRight: px(5),
        width: px(16),
        height: px(16),
    },
    levelText: {
        fontSize: Font.textH1,
        lineHeight: Platform.select({android: px(19), ios: px(18)}),
        color: '#FFECCF',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    levelNum: {
        marginLeft: px(2),
        fontSize: px(24),
        lineHeight: px(24),
        color: '#FFECCF',
        fontFamily: Font.numFontFamily,
    },
    divider: {
        marginHorizontal: px(8),
        backgroundColor: 'rgba(255, 224, 170, 0.2)',
        width: px(1),
        height: px(13),
    },
    levelTips: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FFECCF',
    },
    levelValCon: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    levelVal: {
        fontSize: px(36),
        lineHeight: px(42),
        color: '#FFECCF',
        fontFamily: Font.numFontFamily,
    },
    linkText: {
        marginTop: px(11),
        marginBottom: px(5),
        marginLeft: px(4),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FFECCF',
    },
    barCon: {
        borderRadius: px(3),
        width: '100%',
        height: px(3),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeBar: {
        height: '100%',
        borderRadius: px(3),
    },
    lightCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: px(3),
        overflow: 'visible',
    },
    light: {
        position: 'absolute',
        top: px(-8),
        right: px(-8),
        width: px(19),
        height: px(19),
    },
    taskCon: {
        marginTop: px(12),
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    taskItem: {
        paddingVertical: Space.padding,
        borderColor: Colors.borderColor,
        borderTopWidth: Space.borderWidth,
    },
    taskTitle: {
        marginRight: px(4),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    earnNum: {
        fontSize: px(13),
        lineHeight: px(15),
        color: '#EB7121',
    },
    taskTips: {
        marginTop: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    btnCon: {
        paddingVertical: px(5),
        paddingHorizontal: px(12),
        borderRadius: px(14),
        backgroundColor: '#E8CF9D',
    },
    taskBar: {
        marginRight: Space.marginAlign,
        borderRadius: px(3),
        width: px(80),
        height: px(5),
        backgroundColor: Colors.bgColor,
    },
    taskActiveBar: {
        borderRadius: px(3),
        height: px(5),
        backgroundColor: '#E8CF9D',
    },
    taskProgress: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.lightGrayColor,
        fontFamily: Font.numFontFamily,
    },
});
