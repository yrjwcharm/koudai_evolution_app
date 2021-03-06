/*
 * @Author: dx
 * @Date: 2021-01-20 17:33:06
 * @LastEditTime: 2021-03-05 19:23:03
 * @LastEditors: xjh
 * @Description: 交易确认页
 * @FilePath: /koudai_evolution_app/src/pages/TradeState/TradeProcessing.js
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {VerifyCodeModal, Modal} from '../../components/Modal/';
import http from '../../services';
import Header from '../../components/NavBar';

const TradeProcessing = ({navigation, route}) => {
    const {txn_id} = route.params || {};
    const [data, setData] = useState({});
    const [finish, setFinish] = useState(false);
    const [heightArr, setHeightArr] = useState([]);
    const verifyCodeModel = React.useRef(null);
    const [bankInfo, setBankInfo] = useState('');
    const [code, setCode] = useState('');
    const [isSign, setSign] = useState(false);

    const loopRef = useRef(0);
    const timerRef = useRef(null);
    const init = useCallback(
        (first) => {
            http.get('/trade/order/processing/20210101', {
                txn_id: txn_id,
                loop: loopRef.current,
            }).then((res) => {
                setData(res.result);
                if (res.result.need_verify_code) {
                    verifyCodeModel.current.show();
                    signSendVerify();
                    return;
                }
                if (res.result.finish || res.result.finish === -2 || res.result.loop >= 40) {
                    setFinish(true);
                } else {
                    timerRef.current = setTimeout(() => {
                        loopRef.current++;
                        if (loopRef.current <= res.result.loop) {
                            init();
                        }
                    }, 1000);
                }
            });
        },
        [loopRef, timerRef, navigation, signSendVerify, txn_id]
    );
    const onLayout = useCallback(
        (index, e) => {
            const arr = [...heightArr];
            arr[index] = e.nativeEvent.layout.height;
            setHeightArr(arr);
        },
        [heightArr]
    );
    const signSendVerify = useCallback(() => {
        http.get('/trade/recharge/verify_code_send/20210101', {
            txn_id: txn_id,
        }).then((res) => {
            setSign(true);
            setBankInfo(res.result);
        });
    }, [txn_id]);
    const modalCancelCallBack = useCallback(() => {
        if (isSign && bankInfo) {
            let content = bankInfo.back_info.content;
            setTimeout(() => {
                Modal.show({content: content, confirm: true, confirmCallBack: confirmCallBack});
            }, 500);
        }
    }, [bankInfo, isSign, confirmCallBack]);
    const confirmCallBack = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);
    const onChangeText = useCallback(
        (value) => {
            setCode(value);
            if (value.length === 6) {
                http.post('/trade/recharge/verify_code_confirm/20210101', {
                    txn_id: bankInfo.txn_id,
                    code: '123456',
                }).then((res) => {
                    if (res.code === '000000') {
                        setSign(false);
                        setTimeout(() => {
                            verifyCodeModel.current.hide();
                        }, 300);
                    } else {
                    }
                });
            }
        },
        [bankInfo.txn_id]
    );
    useEffect(() => {
        init(true);
        return () => clearTimeout(timerRef.current);
    }, [init, timerRef]);
    return (
        <>
            <Header
                title="交易确认页"
                rightText={'完成'}
                // titleStyle={{marginRight: text(-20)}}
                rightPress={() => navigation.navigate('Home')}
                rightTextStyle={{marginRight: text(6)}}
            />
            <ScrollView style={[styles.container]}>
                <Text style={[styles.title]}>购买进度明细</Text>
                <View style={[styles.processContainer]}>
                    {Object.keys(data).length > 0 &&
                        data.items.map((item, index) => {
                            return (
                                <View key={index} style={[styles.processItem]} onLayout={(e) => onLayout(index, e)}>
                                    <View style={[styles.icon, Style.flexCenter]}>
                                        {(item.done === 1 || item.done === -1) && (
                                            <Ionicons
                                                name={item.done === 1 ? 'checkmark-circle' : 'close-circle'}
                                                size={17}
                                                color={item.done === 1 ? Colors.green : Colors.red}
                                            />
                                        )}
                                        {item.done === 0 && (
                                            <FontAwesome
                                                name={'circle-thin'}
                                                size={16}
                                                color={'#CCD0DB'}
                                                style={{
                                                    marginRight: text(2),
                                                    backgroundColor: Colors.bgColor,
                                                }}
                                            />
                                        )}
                                    </View>
                                    <View style={[styles.contentBox]}>
                                        <FontAwesome
                                            name={'caret-left'}
                                            color={'#fff'}
                                            size={30}
                                            style={styles.caret_sty}
                                        />
                                        <View style={[styles.content]}>
                                            <View style={[styles.processTitle, Style.flexBetween]}>
                                                <Text numberOfLines={1} style={[styles.desc]}>
                                                    {item.k}
                                                </Text>
                                                <Text style={[styles.date]}>{item.v}</Text>
                                            </View>
                                            {item.d && item.d.length > 0 && (
                                                <View style={[styles.moreInfo]}>
                                                    {item.d.map((val, i) => {
                                                        return (
                                                            <Text key={val} style={[styles.moreInfoText]}>
                                                                {val}
                                                            </Text>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    {index !== data.items.length - 1 && (
                                        <View
                                            style={[
                                                styles.line,
                                                {
                                                    height: heightArr[index] ? text(heightArr[index] - 4) : text(52),
                                                },
                                            ]}
                                        />
                                    )}
                                </View>
                            );
                        })}
                </View>
                {finish && (
                    <TouchableOpacity
                        style={[styles.btn, Style.flexCenter]}
                        onPress={() => navigation.navigate('Home')}>
                        <Text style={[styles.btnText]}>{data.button.text}</Text>
                    </TouchableOpacity>
                )}

                <VerifyCodeModal
                    ref={verifyCodeModel}
                    desc={bankInfo.content ? bankInfo.content : ''}
                    modalCancelCallBack={modalCancelCallBack}
                    onChangeText={onChangeText}
                    isSign={isSign}
                />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.marginAlign,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
        paddingVertical: Space.marginVertical,
        paddingLeft: text(8),
    },
    processContainer: {
        paddingLeft: text(8),
    },
    processItem: {
        flexDirection: 'row',
        position: 'relative',
        marginBottom: text(12),
    },
    icon: {
        width: text(16),
        height: text(16),
        marginTop: text(16),
        marginRight: text(8),
        position: 'relative',
        zIndex: 2,
    },
    contentBox: {
        paddingLeft: text(6),
        width: text(310.5),
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingVertical: text(14),
        paddingHorizontal: Space.marginAlign,
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
        paddingLeft: Space.marginAlign,
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
        left: text(6.7),
        width: text(1),
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
        top: text(10),
        left: text(-2),
        zIndex: 1,
    },
});

export default TradeProcessing;
