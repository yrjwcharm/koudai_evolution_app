/*
 * @Date: 2022-05-21 14:31:35
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-20 15:07:52
 * @Description: 私募产品预约
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FormItem} from './IdentityAssertion';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import Toast from '../../components/Toast';
import {debounce} from 'lodash';
import {MethodObj, NativeRecordManagerEmitter, NativeSignManagerEmitter} from './PEBridge';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, button2 = {}, info: parts = [], tip: tips} = data;
    const popupRef = useRef(true);

    const finished = useMemo(() => {
        const {info: _parts = []} = data;
        return _parts.every((part) => part.list?.every((item) => item.value !== ''));
    }, [data]);

    const init = () => {
        const obj = {
            appointment: '/private_fund/appointment_info/20220510',
            read: '/private_fund/double_record/inform/20220510',
            sign: '/private_fund/double_record/file_sign_info/20220510',
        };
        http.get(obj[route.params.scene || 'appointment'], {
            fund_code: route.params.fund_code || '',
            order_id: route.params.order_id || '',
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '产品预约'});
                setData(res.result);
            }
        });
    };

    const onChange = (value, index, partIndex) => {
        const _data = {...data};
        const _list = _data.info[partIndex].list;
        _list[index].value = value;
        setData(_data);
    };

    const onSubmit = useCallback(
        debounce(
            () => {
                switch (route.params.scene) {
                    case 'appointment':
                        const params = {fund_code: route.params.fund_code || ''};
                        const {info: _parts = []} = data;
                        _parts.forEach((part) => part.list?.forEach((item) => (params[item.id] = item.value)));
                        http.post('/private_fund/appointment_do/20220510', params).then((res) => {
                            if (res.code === '000000') {
                                navigation.goBack();
                            }
                            Toast.show(res.message);
                        });
                        break;
                    case 'read':
                        if (data.isDone) {
                            jump(button.url);
                        } else {
                            Toast.show('请您自助双录前先阅读完待签署文件');
                        }
                        break;
                    case 'sign':
                        http.post('/private_fund/investor_audit/20220510', {
                            order_id: route.params.order_id || '',
                            type: 2,
                        }).then((res) => {
                            if (res.code === '000000') {
                                jump(res.result.url, 'replace');
                            }
                        });
                        break;
                    default:
                        break;
                }
            },
            1000,
            {leading: true, trailing: false}
        ),
        [data, route.params]
    );

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        const {pop} = data;
        if (Object.keys(pop || {}).length > 0 && popupRef.current) {
            const {
                button: {text: btnText},
                content,
                title,
            } = pop;
            Modal.show({
                title,
                backButtonClose: true,
                content,
                confirmText: btnText,
                confirmTextColor: '#D7AF74',
                isTouchMaskToClose: false,
                onCloseCallBack: () => navigation.goBack(),
            });
            popupRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

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
            const orderListener = NativeSignManagerEmitter.addListener(MethodObj.signSuccess, (res) => {
                const toast = Toast.showLoading();
                http.post('/file_sign/sign_done/20220510', {order_id: global.order_id, ...res}).then((resp) => {
                    global.order_id = '';
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
                orderListener.remove();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const listener = DeviceEventEmitter.addListener('record_preview_refresh', init);
            return () => {
                listener.remove();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const {fund_code, order_id} = route.params;
            const listener = NativeRecordManagerEmitter.addListener(MethodObj.recordSuccess, (res) => {
                const toast = Toast.showLoading();
                http.post('/file_sign/video_record_done/20220510', {
                    fund_code,
                    order_id,
                    serial_number: res.serialNo,
                }).then((resp) => {
                    Toast.hide(toast);
                    if (resp.code === '000000') {
                        Toast.show(resp.message || '双录成功');
                        if (resp.result.type === 'back') {
                            navigation.goBack();
                        } else if (resp.result.type === 'refresh') {
                            init();
                        } else if (resp.result.type === 'jump') {
                            jump(resp.result.url, 'replace');
                        } else {
                            init();
                        }
                    } else {
                        Toast.show(resp.message || '双录失败');
                    }
                });
            });
            return () => {
                listener.remove();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                bounces={false}
                enableOnAndroid
                extraScrollHeight={px(100)}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {parts.map((part, i, _parts) => {
                    const {list = [], title} = part;
                    return (
                        <View
                            key={part + i}
                            style={[
                                {marginTop: Space.marginVertical},
                                i === _parts.length - 1 && !tips
                                    ? {
                                          marginBottom: (isIphoneX() ? px(45) + 34 : px(45) + px(16)) + px(20),
                                      }
                                    : {},
                            ]}>
                            {title ? <Text style={styles.partTitle}>{title}</Text> : null}
                            <View style={[styles.contentBox, {marginTop: title ? px(12) : 0}]}>
                                {list?.map?.((item, index) => (
                                    <View
                                        key={item + index}
                                        style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                                        <FormItem data={item} onChange={(val) => onChange(val, index, i)} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
                {tips ? (
                    <View style={styles.tipsBox}>
                        <HTML html={tips} style={styles.tips} />
                    </View>
                ) : null}
            </KeyboardAwareScrollView>
            <View style={[Style.flexRow, styles.btnBox]}>
                {button2.text ? (
                    <Button
                        color="#BDC2CC"
                        disabled={button2.avail === 0}
                        disabledColor="#BDC2CC"
                        onPress={() => jump(button2.url)}
                        style={styles.prevButton}
                        textStyle={styles.btnText}
                        title={button2.text}
                        type={'minor'}
                    />
                ) : null}
                {button.text ? (
                    <Button
                        color="#EDDBC5"
                        disabled={button.avail === 0 || !finished}
                        disabledColor="#EDDBC5"
                        onPress={onSubmit}
                        style={styles.nextButton}
                        textStyle={button2.text ? styles.btnText : {}}
                        title={button.text}
                    />
                ) : null}
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
    partTitle: {
        marginLeft: Space.marginAlign,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    contentBox: {
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    tipsBox: {
        marginTop: px(12),
        marginHorizontal: Space.marginAlign,
        marginBottom: (isIphoneX() ? px(45) + 34 : px(45) + px(16)) + px(20),
    },
    tips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    btnBox: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
    },
    prevButton: {
        marginRight: px(12),
        width: px(166),
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#D7AF74',
    },
    btnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
    },
});
