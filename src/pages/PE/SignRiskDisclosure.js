/*
 * @Date: 2022-05-23 15:43:21
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-24 15:48:40
 * @Description: 逐项确认
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import Toast from '../../components/Toast';
import {NativeSignManagerEmitter, MethodObj} from './PEBridge';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, list = [], desc: tips} = data;

    const finished = useMemo(() => {
        return data?.list?.every((item) => item.is_show);
    }, [data]);

    useEffect(() => {
        http.get('/private_fund/double_record/risk_disclosure/20220510', {
            fund_code: route.params.fund_code || '',
            order_id: route.params.order_id || '',
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '逐项确认'});
                setData(res.result);
            }
        });
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
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {tips ? <Text style={[styles.tips, {marginTop: Space.marginVertical}]}>{tips}</Text> : null}
                {list.map((item, index, arr) => {
                    const {button: btn, name, password_content, is_show = false} = item;
                    return (
                        <View
                            key={item + index}
                            style={[
                                Style.flexBetween,
                                styles.partBox,
                                {
                                    marginTop: index === 0 ? px(12) : Space.marginVertical,
                                    marginBottom:
                                        index === arr.length - 1 ? (isIphoneX() ? 34 : px(16) + (px(45) + px(20))) : 0,
                                },
                            ]}>
                            <View>
                                <Text style={styles.tips}>{name}</Text>
                                <Text
                                    style={[
                                        styles.content,
                                        {marginTop: px(8), color: is_show ? Colors.defaultColor : '#BDC2CC'},
                                    ]}>
                                    {is_show ? password_content : '点击查看按钮后可显示'}
                                </Text>
                            </View>
                            {btn && btn.text ? (
                                <Button
                                    color="#EDDBC5"
                                    disabled={btn.avail === 0 || is_show}
                                    disabledColor="#BDC2CC"
                                    onPress={() => {
                                        const _data = {...data};
                                        _data.list[index].is_show = true;
                                        _data.list[index].button.text = '已确认';
                                        setData(_data);
                                    }}
                                    style={styles.partButton}
                                    textStyle={styles.partBtnText}
                                    title={btn.text}
                                />
                            ) : null}
                        </View>
                    );
                })}
            </ScrollView>
            {button.text ? (
                <Button
                    color="#EDDBC5"
                    disabled={button.avail === 0 || !finished}
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
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: px(83),
    },
    content: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    partButton: {
        paddingHorizontal: px(8),
        borderRadius: px(4),
        height: px(24),
        backgroundColor: '#D7AF74',
    },
    partBtnText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
    },
    button: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
        backgroundColor: '#D7AF74',
    },
});
