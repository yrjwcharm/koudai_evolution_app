/*
 * @Author: dx
 * @Date: 2021-01-20 17:33:06
 * @LastEditTime: 2021-04-18 14:43:52
 * @LastEditors: yhc
 * @Description: 交易确认页
 * @FilePath: /koudai_evolution_app/src/pages/TradeState/TradeProcessing.js
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, ScrollView, View, Text, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {VerifyCodeModal, Modal} from '../../components/Modal/';
import http from '../../services';
import Header from '../../components/NavBar';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Toast from '../../components/Toast';
import FastImage from 'react-native-fast-image';
const TradeProcessing = ({navigation, route}) => {
    const {txn_id} = route.params || {};
    const [data, setData] = useState({});
    const [finish, setFinish] = useState(false);
    const [heightArr, setHeightArr] = useState([]);
    const verifyCodeModal = React.useRef(null);
    const [bankInfo, setBankInfo] = useState('');
    const [isSign, setSign] = useState(false);
    const jump = useJump();
    const loopRef = useRef(0);
    const scrollRef = useRef();
    const timerRef = useRef(null);
    const init = useCallback(
        (first) => {
            http.get('/trade/order/processing/20210101', {
                txn_id: txn_id,
                loop: loopRef.current,
            }).then((res) => {
                setData(res.result);

                if (res.result.need_verify_code) {
                    verifyCodeModal.current.show();
                    return signSendVerify();
                }
                if (res.result.finish || res.result.finish === -2 || loopRef.current++ >= res.result.loop) {
                    setFinish(true);
                    setTimeout(() => {
                        scrollRef?.current?.scrollToEnd({animated: true});
                    }, 200);
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
        [loopRef, timerRef, signSendVerify, txn_id]
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
            if (res.code === '000000') {
                setSign(true);
                setBankInfo(res.result);
            } else {
                Toast.show(res.message);
            }
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
            if (value.length === 6) {
                http.post('/trade/recharge/verify_code_confirm/20210101', {
                    txn_id: bankInfo.txn_id,
                    code: value,
                }).then((res) => {
                    if (res.code === '000000') {
                        setSign(false);
                        setTimeout(() => {
                            verifyCodeModal.current.hide();
                        }, 300);
                    } else {
                        verifyCodeModal.current.toastShow(res.message);
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
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <Header
                title="交易确认"
                rightText={'完成'}
                rightPress={() => {
                    if (route?.params?.fr == 'trade_buy') {
                        navigation.pop(2);
                    } else {
                        jump(data.button.url);
                    }
                }}
                rightTextStyle={{marginRight: text(6)}}
            />
            <ScrollView
                style={[styles.container]}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}>
                {Object.keys(data).length > 0 && data?.header && (
                    <View style={styles.contentStyle}>
                        <FastImage source={{uri: data.header.img}} style={styles.coverImage} />
                        <Text style={{fontSize: text(16), paddingVertical: text(10)}}>{data.header.status}</Text>
                        {data.header.amount ? <Text style={styles.head_text}>{data.header.amount}</Text> : null}
                        <Text style={styles.head_text}>{data.header.pay_method}</Text>
                    </View>
                )}

                {Object.keys(data).length > 0 && <Text style={[styles.title]}>{data?.desc}</Text>}
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
                                    {index !== data.items.length - 1 && (
                                        <View
                                            style={[
                                                styles.line,
                                                {
                                                    height: index == data?.items?.length - 1 ? 0 : heightArr[index],
                                                },
                                            ]}
                                        />
                                    )}
                                    <View style={[styles.contentBox]}>
                                        <FontAwesome
                                            name={'caret-left'}
                                            color={'#fff'}
                                            size={30}
                                            style={styles.caret_sty}
                                        />
                                        <View style={[styles.content]}>
                                            <View style={[styles.processTitle, Style.flexBetween]}>
                                                <Text style={[styles.desc]}>{item.k}</Text>
                                                {item.v ? <Text style={[styles.date]}>{item.v}</Text> : null}
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
                                </View>
                            );
                        })}
                </View>
                {finish && (
                    <Button
                        title={data.button.text}
                        style={{margin: text(40), marginTop: text(20)}}
                        onPress={() => {
                            if (route?.params?.fr == 'trade_buy') {
                                navigation.pop(2);
                            } else {
                                jump(data.button.url);
                            }
                        }}
                    />
                )}
            </ScrollView>
            <VerifyCodeModal
                ref={verifyCodeModal}
                desc={bankInfo.content ? bankInfo.content : ''}
                modalCancelCallBack={modalCancelCallBack}
                onChangeText={onChangeText}
                isSign={isSign}
                getCode={signSendVerify}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
        paddingVertical: Space.marginVertical,
        paddingLeft: text(16),
    },
    processContainer: {
        paddingLeft: text(16),
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
        flex: 1,
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
        top: text(30),
        left: text(6.5),
        width: text(1),
        backgroundColor: '#CCD0DB',
        zIndex: 1,
    },
    head_text: {color: '#555B6C', fontSize: text(12), paddingBottom: text(5)},
    caret_sty: {
        position: 'absolute',
        top: text(10),
        left: text(-2),
        zIndex: 1,
    },
    contentStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: text(30),
        backgroundColor: '#fff',
    },
    coverImage: {
        width: text(50),
        height: text(50),
    },
});

export default TradeProcessing;
