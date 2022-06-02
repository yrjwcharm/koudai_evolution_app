/*
 * @Date: 2022-05-23 15:43:21
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-02 21:18:31
 * @Description: 逐项确认
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Toast from '../../components/Toast';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import {MethodObj, NativeSignManagerEmitter} from './PEBridge';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, list = [], desc: tips} = data;

    const init = () => {
        http.get('/private_fund/double_record/risk_disclosure/20220510', {
            fund_code: route.params.fund_code || '',
            order_id: route.params.order_id || '',
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '逐项确认'});
                setData(res.result);
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
                const toast = Toast.showLoading();
                http.post('/file_sign/sign_done/20220510', {file_id: res.fileId}).then((resp) => {
                    Toast.hide(toast);
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
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {tips ? <Text style={[styles.tips, {marginTop: Space.marginVertical}]}>{tips}</Text> : null}
                {list.map((item, index, arr) => {
                    const {button: btn, desc, type} = item;
                    return (
                        <View
                            key={item + index}
                            style={[
                                styles.partBox,
                                {
                                    marginTop: index === 0 ? px(12) : Space.marginVertical,
                                    marginBottom:
                                        index === arr.length - 1 ? (isIphoneX() ? 34 : px(16) + (px(45) + px(20))) : 0,
                                },
                            ]}>
                            <Text style={styles.content}>{desc}</Text>
                            {btn && btn.text ? (
                                <Button
                                    color={'#EDDBC5'}
                                    disabled={btn.avail === 0}
                                    disabledColor="#BDC2CC"
                                    onPress={() => {
                                        http.post('/private_fund/double_record/risk_disclosure_read/20220510', {
                                            fund_code: route.params.fund_code || '',
                                            order_id: route.params.order_id || '',
                                            type,
                                        }).then(() => {
                                            init();
                                        });
                                    }}
                                    style={[
                                        styles.partButton,
                                        {
                                            backgroundColor: btn.avail == 2 ? '#eadbc7' : '#D7AF74',
                                        },
                                    ]}
                                    textStyle={styles.partBtnText}
                                    title={btn.text}
                                />
                            ) : null}
                        </View>
                    );
                })}
                <View style={{height: px(30)}} />
            </ScrollView>
            {button.text ? (
                <Button
                    color="#EDDBC5"
                    disabled={button.avail === 0}
                    disabledColor="#EDDBC5"
                    onPress={() => jump(button.url)}
                    style={styles.button}
                    title={button.text}
                />
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
    partBox: {
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'flex-end',
    },
    content: {
        fontSize: px(12),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    partButton: {
        marginTop: px(12),
        paddingHorizontal: px(8),
        borderRadius: px(4),
        height: px(24),
        // backgroundColor: '#D7AF74',
    },
    partBtnText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
    },
    button: {
        bottom: isIphoneX() ? 34 : px(16),
        marginHorizontal: px(16),
        backgroundColor: '#D7AF74',
    },
});
