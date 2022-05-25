/*
 * @Date: 2021-07-05 18:09:25
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-25 17:26:53
 * @Description: 私募风险评测结果页
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import {NativeSignManagerEmitter, MethodObj} from './PEBridge';
import Toast from '../../components/Toast';

const PEQuestionnaireResult = () => {
    const jump = useJump();
    const navigation = useNavigation();
    const route = useRoute();
    const [data, setData] = useState({});
    const {button, desc, level, level_tip, logs = {}, tips} = data;
    const {list = [], th = [], title: logTitle} = logs;

    const init = () => {
        http.get('/private_fund/risk_evaluation_result/20220510', {fr: route.params?.fr || ''}).then((res) => {
            if (res.code === '000000') {
                const {title, again_button} = res.result;
                if (again_button) {
                    navigation.setOptions({
                        headerRight: () => (
                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleJump(again_button.url)}>
                                <Text style={styles.top_button}>{again_button.text}</Text>
                            </TouchableOpacity>
                        ),
                        title: title || '评测结果',
                    });
                }
                setData(res.result);
            }
        });
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
            http.post('/file_sign/sign_done/20220510', {file_id: res.fileId}).then((resp) => {
                if (resp.code === '000000') {
                    Toast.show(resp.message || '签署成功');
                    if (resp.result.type === 'back') {
                        navigation.goBack();
                    } else if (resp.result.type === 'refresh') {
                        init();
                    } else {
                        init();
                    }
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

    const handleJump = useCallback(
        (url) => {
            jump(url, 'replace');
        },
        [jump]
    );
    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <View style={{paddingHorizontal: Space.padding}}>
                    <View style={styles.resultBox}>
                        <Text style={styles.desc}>{desc}</Text>
                        <Text style={styles.level}>{level}</Text>
                        <View style={{marginTop: px(8), marginHorizontal: px(28)}}>
                            <HTML html={level_tip} style={styles.level_tip} />
                        </View>
                        {logs && Object.keys(logs).length > 0 ? (
                            <View style={{width: '100%'}}>
                                <View style={{marginTop: px(12), backgroundColor: Colors.bgColor}}>
                                    <Image
                                        source={require('../../assets/img/fof/divider.png')}
                                        style={styles.divider}
                                    />
                                </View>
                                <View style={{marginTop: px(10), marginHorizontal: px(28)}}>
                                    <Text style={styles.desc}>{logTitle}</Text>
                                    <View style={styles.tableBox}>
                                        <View style={[Style.flexRow, styles.tableHead]}>
                                            {th.map((item, index) => {
                                                return (
                                                    <View
                                                        key={item + index}
                                                        style={[
                                                            Style.flexCenter,
                                                            styles.tableCell,
                                                            index === 1 ? styles.borderCell : {},
                                                        ]}>
                                                        <Text
                                                            style={[
                                                                styles.tableText,
                                                                {
                                                                    fontWeight: Platform.select({
                                                                        android: '700',
                                                                        ios: '500',
                                                                    }),
                                                                },
                                                            ]}>
                                                            {item}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                        {list.map((tr, i) => {
                                            const {level: trLevel, time, button: trBtn} = tr;
                                            return (
                                                <View
                                                    key={tr + i}
                                                    style={[
                                                        Style.flexRow,
                                                        styles.tableTr,
                                                        {backgroundColor: i % 2 === 0 ? '#fff' : Colors.bgColor},
                                                    ]}>
                                                    <View style={[Style.flexCenter, styles.tableCell]}>
                                                        <Text style={styles.tableText}>{trLevel}</Text>
                                                    </View>
                                                    <View
                                                        style={[Style.flexCenter, styles.tableCell, styles.borderCell]}>
                                                        <Text style={styles.tableText}>{time}</Text>
                                                    </View>
                                                    <View style={[Style.flexCenter, styles.tableCell]}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.8}
                                                            onPress={() => jump(trBtn.url)}>
                                                            <Text style={[styles.tableText, {color: '#D7AF74'}]}>
                                                                {trBtn.text}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>
                        ) : null}
                    </View>
                    {tips ? (
                        <View style={{marginTop: Space.marginVertical}}>
                            <HTML html={tips} style={styles.tips} />
                        </View>
                    ) : null}
                </View>
            </ScrollView>
            {button ? <Button title={button.text} onPress={() => jump(button.url)} style={styles.button} /> : null}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    top_button: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        paddingRight: Space.padding,
    },
    resultBox: {
        marginTop: Space.marginVertical,
        paddingTop: px(20),
        paddingBottom: px(28),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    desc: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    level: {
        marginTop: px(4),
        fontSize: px(32),
        lineHeight: px(45),
        color: Colors.red,
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    level_tip: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.descColor,
    },
    divider: {
        width: '100%',
        height: px(28),
    },
    tableBox: {
        marginTop: Space.marginVertical,
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        overflow: 'hidden',
    },
    tableHead: {
        height: px(44),
        backgroundColor: Colors.bgColor,
    },
    tableCell: {
        flex: 1,
        height: '100%',
        borderColor: Colors.borderColor,
    },
    tableText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    tableTr: {
        height: px(40),
    },
    borderCell: {
        flex: 2,
        borderLeftWidth: Space.borderWidth,
        borderRightWidth: Space.borderWidth,
    },
    tips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
        textAlign: 'justify',
    },
    button: {
        position: 'absolute',
        right: px(16),
        left: px(16),
        bottom: isIphoneX() ? 34 : px(20),
        backgroundColor: '#D7AF74',
    },
});

export default PEQuestionnaireResult;
