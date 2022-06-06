/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: xjh
 * @Date: 2021-02-20 16:34:30
 * @Description: 私募流程页
 * @LastEditors: dx
 * @LastEditTime: 2022-06-06 10:44:22
 */

import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, View, Text, Platform, ScrollView, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX, px} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {FixedButton, Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Html from '../../components/RenderHtml';
import {Modal} from '../../components/Modal';
import Clipboard from '@react-native-community/clipboard';
import Toast from '../../components/Toast';
import {useFocusEffect} from '@react-navigation/native';
import {MethodObj, NativeSignManagerEmitter} from './PEBridge';
import Loading from '../Portfolio/components/PageLoading';

const iconObj = {
    3: require('../../assets/img/fof/waiting.png'),
    4: require('../../assets/img/fof/warning.png'),
    5: require('../../assets/img/fof/check.png'),
};

const PrivateApply = (props) => {
    const {fund_code, order_id, poid, scene} = props.route.params || {};
    const jump = useJump();
    const [data, setData] = useState({});
    const [heightArr, setHeightArr] = useState([]);
    const scrollRef = useRef(null);

    const init = () => {
        http.get(`/private_fund/${scene}_flow/20220510`, {
            fund_code: fund_code,
            poid: poid || '',
        }).then((res) => {
            if (res.code === '000000') {
                const {restart_button, title} = res.result;
                props.navigation.setOptions({
                    headerRight: () =>
                        restart_button ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => showModal({...restart_button, order_id: res.result.order_id})}>
                                <Text style={styles.top_button}>{restart_button.text}</Text>
                            </TouchableOpacity>
                        ) : null,
                    title: title || '购买流程',
                });
                setData(res.result);
            }
        });
    };
    const showModal = (restart_button) => {
        const {order_id: _order_id, popup} = restart_button;
        if (popup) {
            const {back_close, cancel, confirm, content, title, touch_close} = popup;
            Modal.show({
                backButtonClose: back_close,
                cancelText: cancel?.text,
                content,
                confirm: true,
                confirmCallBack: () => {
                    http.post('/private_fund/restart_flow/20220510', {
                        fund_code,
                        order_id: order_id || _order_id,
                    }).then((res) => {
                        Toast.show(res.message);
                        if (res.code === '000000') {
                            init();
                        }
                    });
                },
                confirmText: confirm?.text,
                confirmTextColor: '#D7AF74',
                isTouchMaskToClose: touch_close,
                title,
            });
        }
    };
    const onLayout = (index, e) => {
        let height = e?.nativeEvent?.layout?.height;
        setHeightArr((prev) => {
            const arr = [...prev];
            arr[index] = height;
            return arr;
        });
    };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
                const toast = Toast.showLoading();
                http.post('/file_sign/sign_done/20220510', {file_id: res.fileId, page: 'PrivateApply'}).then((resp) => {
                    Toast.hide(toast);
                    if (resp.code === '000000') {
                        Toast.show(resp.message || '签署成功');
                        if (resp.result.type === 'back') {
                            props.navigation.goBack();
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
        <View style={[styles.container, {paddingBottom: isIphoneX() ? text(85) : text(51)}]}>
            <ScrollView
                bounces={false}
                scrollIndicatorInsets={{right: 1}}
                style={[styles.processContainer]}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}>
                {Object.keys(data).length > 0 &&
                    data?.items.map((item, index, arr) => {
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.processItem,
                                    index === 0 ? {marginTop: Space.marginVertical} : {},
                                    index === arr.length - 1 ? {marginBottom: text(32)} : {},
                                ]}
                                onLayout={(e) => onLayout(index, e)}>
                                <View
                                    style={[
                                        styles.icon,
                                        {
                                            borderWidth: item.status === 2 ? px(1) : 0,
                                            backgroundColor: item.status === 1 ? '#E9EAEF' : '#fff',
                                        },
                                    ]}>
                                    {[3, 4, 5].includes(item.status) ? (
                                        <Image source={iconObj[item.status]} style={{width: '100%', height: '100%'}} />
                                    ) : null}
                                </View>
                                <View style={[styles.contentBox]}>
                                    <FontAwesome
                                        name={'caret-left'}
                                        color={'#fff'}
                                        size={30}
                                        style={styles.caret_sty}
                                    />
                                    <View style={[Style.flexRow, styles.content]}>
                                        <View style={{flex: 1}}>
                                            <View style={Style.flexBetween}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styles.desc, item.status === 3 ? {color: Colors.red} : {}]}>
                                                    {item.title}
                                                </Text>
                                                {item?.text_button && (
                                                    <Button
                                                        color="#EDDBC5"
                                                        disabled={item.text_button.avail === 0}
                                                        disabledColor="#EDDBC5"
                                                        onPress={() => {
                                                            if (item.text_button.type === 'copy') {
                                                                Clipboard.setString(item.text_button.content);
                                                                Toast.show('复制成功');
                                                            } else {
                                                                jump(item.text_button.url);
                                                            }
                                                        }}
                                                        style={{
                                                            ...styles.partButton,
                                                            backgroundColor: item.status === 5 ? '#fff' : '#D7AF74',
                                                        }}
                                                        textStyle={{
                                                            ...styles.partBtnText,
                                                            color: item.status === 5 ? '#D7AF74' : '#fff',
                                                        }}
                                                        title={item.text_button.text}
                                                        type={item.status === 5 ? 'minor' : 'primary'}
                                                    />
                                                )}
                                            </View>
                                            {item.desc && (
                                                <View style={[styles.moreInfo]}>
                                                    {item.desc?.map((val, i) => {
                                                        return val ? (
                                                            <Html
                                                                key={val + i}
                                                                html={val}
                                                                style={styles.moreInfoText}
                                                            />
                                                        ) : null;
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                        {item.button && (
                                            <Button
                                                color={'#EDDBC5'}
                                                disabledColor={'#EDDBC5'}
                                                disabled={!item.button.avail}
                                                title={item.button.text}
                                                style={{
                                                    ...styles.buttonSty,
                                                    backgroundColor: item.status === 5 ? '#fff' : '#D7AF74',
                                                }}
                                                textStyle={{
                                                    ...styles.buttonTextSty,
                                                    color: item.status === 5 ? '#D7AF74' : '#fff',
                                                }}
                                                type={item.status === 5 ? 'minor' : 'primary'}
                                                onPress={() => jump(item.button.url, 'push')}
                                            />
                                        )}
                                        {item.status === 3 ? (
                                            <Text style={[styles.desc, {color: Colors.red}]}>待审核</Text>
                                        ) : null}
                                    </View>
                                </View>
                                {index !== data?.items?.length - 1 && (
                                    <View
                                        style={[
                                            styles.line,
                                            {
                                                height: heightArr[index] || text(46),
                                                backgroundColor: item.status === 5 ? '#D7AF74' : '#CCD0DB',
                                            },
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
            </ScrollView>
            {data.button?.text ? (
                <FixedButton
                    title={data.button.text}
                    style={{...styles.btn_sty, backgroundColor: '#D7AF74'}}
                    onPress={() =>
                        jump(data.button.url, data.button.url.path === 'PrivateApply' ? 'replace' : 'navigate')
                    }
                    color={'#D7AF74'}
                    disabledColor={'#D7AF74'}
                />
            ) : null}
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        borderColor: '#fff',
        borderWidth: 0.5,
    },
    top_button: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        paddingRight: Space.padding,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
        paddingVertical: Space.marginVertical,
        paddingLeft: text(8),
    },
    processContainer: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    processItem: {
        flexDirection: 'row',
        position: 'relative',
        marginBottom: text(12),
    },
    icon: {
        width: text(16),
        height: text(16),
        marginTop: Platform.select({android: text(16), ios: text(14)}),
        marginRight: text(8),
        position: 'relative',
        zIndex: 2,
        borderColor: '#D7AF74',
        borderRadius: text(16),
    },
    contentBox: {
        paddingLeft: text(6),
        // width: text(310.5),
        flex: 1,
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingVertical: text(12),
        paddingHorizontal: Space.padding,
    },
    processTitle: {
        flexDirection: 'row',
    },
    desc: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        maxWidth: text(160),
    },
    date: {
        fontSize: Font.textSm,
        lineHeight: text(13),
        color: Colors.darkGrayColor,
        fontFamily: Font.numRegular,
    },
    moreInfo: {
        marginTop: text(6),
    },
    moreInfoText: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: Colors.descColor,
    },
    line: {
        position: 'absolute',
        top: text(28),
        left: Platform.select({ios: text(7.7), android: text(7)}),
        width: text(1),
        height: text(46),
        backgroundColor: '#CCD0DB',
        zIndex: 1,
    },
    btn: {
        marginHorizontal: text(80),
        marginVertical: text(32),
        borderRadius: text(6),
        height: text(44),
        backgroundColor: Colors.brandColor,
    },
    btnText: {
        fontSize: text(15),
        lineHeight: text(21),
        color: '#fff',
    },
    caret_sty: {
        position: 'absolute',
        top: text(8),
        left: text(-2),
        zIndex: 1,
    },
    buttonSty: {
        height: text(24),
        paddingHorizontal: text(8),
        backgroundColor: '#D7AF74',
        borderRadius: text(4),
        borderColor: '#D7AF74',
    },
    buttonTextSty: {
        fontSize: Font.textH2,
        lineHeight: text(18),
        color: '#fff',
    },
    partButton: {
        paddingHorizontal: text(6),
        borderRadius: text(4),
        height: text(20),
        backgroundColor: '#D7AF74',
        borderColor: '#D7AF74',
    },
    partBtnText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
    },
});

export default PrivateApply;
