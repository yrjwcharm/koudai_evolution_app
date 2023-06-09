/*
 * @Date: 2021-01-20 17:33:06
 * @Description: 交易确认页
 */
import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, ScrollView, View, Text, BackHandler} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px, px as text} from '~/utils/appUtil';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {VerifyCodeModal, Modal} from '~/components/Modal';
import http from '~/services';
import Header from '~/components/NavBar';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';
import FastImage from 'react-native-fast-image';
import Html from '~/components/RenderHtml';
import withNetState from '~/components/withNetState';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '~/redux/actions/userInfo';
import {useFocusEffect} from '@react-navigation/native';

const TradeProcessing = ({navigation, route}) => {
    const dispatch = useDispatch();
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
    const signFlag = useRef(false);
    const init = useCallback((sign = false, refused = 0) => {
        http.get('/trade/order/processing/20210101', {
            txn_id: txn_id,
            loop: loopRef.current,
            refused,
        }).then((res) => {
            setData(res.result);
            if (res.result.need_verify_code && !sign) {
                verifyCodeModal.current.show();
                return signSendVerify();
            }
            if (res.result.finish || res.result.finish === -2 || loopRef.current >= res.result.loop) {
                setFinish(true);
                setTimeout(() => {
                    scrollRef?.current?.scrollToEnd({animated: true});
                }, 200);
            } else {
                timerRef.current = setTimeout(() => {
                    loopRef.current++;
                    if (loopRef.current <= res.result.loop) {
                        init(sign, refused);
                    }
                }, 1000);
            }
        });
    }, []);
    const onLayout = useCallback(
        (index, e) => {
            const arr = [...heightArr];
            arr[index] = e.nativeEvent.layout.height;
            setHeightArr(arr);
        },
        [heightArr]
    );
    //获取验证码信息
    const signSendVerify = useCallback(() => {
        http.get('/trade/recharge/verify_code_send/20210101', {
            txn_id: txn_id,
        }).then((res) => {
            if (res.code === '000000') {
                setBankInfo(res.result);
            } else {
                Toast.show(res.message);
            }
        });
    }, [txn_id]);
    //重新发送验证码
    const signSendAgain = () => {
        http.post('/trade/recharge/verify_code_again/20210101', {
            txn_id,
        }).then((res) => {
            verifyCodeModal.current.toastShow(res.message);
            if (res.code === '000000') {
                verifyCodeModal.current.show();
            } else {
                verifyCodeModal.current.show(false);
            }
        });
    };
    const modalCancelCallBack = useCallback(() => {
        if (bankInfo) {
            let content = bankInfo.back_info.content;
            setTimeout(() => {
                Modal.show({
                    content: content,
                    confirmText: '立即签约',
                    confirmCallBack: () => {
                        verifyCodeModal.current.show(true, 0);
                    },
                    onCloseCallBack: () => {
                        loopRef.current++;
                        setTimeout(() => {
                            init(true, 1);
                        }, 300);
                    },
                });
            }, 500);
        }
    }, [bankInfo, init]);
    const buttonCallBack = (value) => {
        if (signFlag.current) return;
        signFlag.current = true;
        http.post('/trade/recharge/verify_code_confirm/20210101', {
            txn_id: txn_id,
            code: value,
        }).then((res) => {
            setTimeout(() => {
                signFlag.current = false;
            }, 300);
            if (res.code === '000000') {
                setSign(true);
                loopRef.current++;
                setTimeout(() => {
                    init(true);
                }, 300);
                verifyCodeModal.current.hide();
            } else {
                verifyCodeModal.current.toastShow(res.message);
            }
        });
    };
    useFocusEffect(
        useCallback(() => {
            init();
            const listener = BackHandler.addEventListener('hardwareBackPress', () => true);
            return () => {
                listener.remove();
            };
        }, [])
    );
    const finishClick = () => {
        dispatch(getUserInfo());
        if (['trade_buy', 'fund_trade_buy'].includes(route?.params?.fr)) {
            navigation.pop(2);
        } else {
            jump(data.button.url);
        }
    };

    const handlerChildren = (item) => {
        switch (item.type) {
            case 'upgrade_compare':
                return (
                    <View style={[styles.buy_table, {borderTopWidth: item?.children?.head ? 0.5 : 0}]}>
                        {item?.children?.head && (
                            <View style={[Style.flexBetween, {height: px(30)}]}>
                                {item?.children?.head.map((val, key) => (
                                    <Text key={key} style={[styles.light_text, {textAlign: 'left', width: px(113)}]}>
                                        {val}
                                    </Text>
                                ))}
                            </View>
                        )}
                        <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: px(14),
                                },
                            ]}>
                            {item?.children.src && (
                                <View>
                                    {item?.children.src.map((itm, idx) => (
                                        <Text
                                            key={idx}
                                            numberOfLines={1}
                                            style={[
                                                styles.compareText,
                                                {
                                                    marginTop: idx > 0 ? px(4) : 0,
                                                },
                                            ]}>
                                            {itm}
                                        </Text>
                                    ))}
                                </View>
                            )}
                            <FastImage
                                source={{
                                    uri:
                                        'https://static.licaimofang.com/wp-content/uploads/2022/08/trade-record-detail-arrow-1.png',
                                }}
                                resizeMode="contain"
                                style={{width: px(21), height: px(12)}}
                            />
                            {item?.children.dst && (
                                <View>
                                    {item?.children.dst.map((itm, idx) => (
                                        <Text
                                            key={idx}
                                            numberOfLines={1}
                                            style={[
                                                styles.compareText,
                                                {
                                                    marginTop: idx > 0 ? px(4) : 0,
                                                },
                                            ]}>
                                            {itm}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <Header
                title="交易确认"
                rightText={finish ? '完成' : ''}
                rightPress={finishClick}
                rightTextStyle={{marginRight: text(6)}}
            />
            <ScrollView
                bounces={false}
                style={[styles.container]}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}>
                {Object.keys(data).length > 0 && data?.header && (
                    <View style={styles.contentStyle}>
                        <FastImage source={{uri: data.header.img}} style={styles.coverImage} />
                        <View style={{marginVertical: text(16)}}>
                            <Html style={{fontSize: text(16), textAlign: 'center'}} html={data.header.status} />
                        </View>
                        {data.header.amount ? <Text style={styles.head_text}>{data.header.amount}</Text> : null}
                        <Text style={styles.head_text}>{data.header.pay_method}</Text>
                    </View>
                )}

                {data?.desc ? <Text style={[styles.title]}>{data?.desc}</Text> : null}
                <View style={[styles.processContainer]}>
                    {Object.keys(data).length > 0 &&
                        data.items?.map?.((item, index) => {
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
                                                        return <Html key={i} html={val} style={styles.moreInfoText} />;
                                                    })}
                                                </View>
                                            )}
                                            {item.children && handlerChildren(item)}
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
                        onPress={finishClick}
                    />
                )}
            </ScrollView>
            <VerifyCodeModal
                scene={'sign'}
                ref={verifyCodeModal}
                desc={bankInfo.content ? bankInfo.content : ''}
                modalCancelCallBack={modalCancelCallBack}
                isSign={isSign}
                validateLength={6}
                buttonCallBack={buttonCallBack}
                buttonText={'立即签约'}
                getCode={signSendAgain}
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
        color: Colors.lightBlackColor,
    },
    line: {
        position: 'absolute',
        top: text(30),
        left: text(7),
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
    buy_table: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    compareText: {
        fontSize: px(13),
        color: '#545B6C',
        lineHeight: px(18),
        marginTop: px(4),
        width: px(113),
    },
});

export default withNetState(TradeProcessing);
