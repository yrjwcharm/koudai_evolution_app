/*
 * @Date: 2022-08-26 14:32:19
 * @Description: 一键转换
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';
import AntDesign from 'react-native-vector-icons/AntDesign';
import transfer from '../../../assets/img/trade/transfer.png';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {FixedButton} from '../../../components/Button';
import {useJump} from '../../../components/hooks';
import {Modal} from '../../../components/Modal';
import {PasswordModal} from '../../../components/Password';
import HTML from '../../../components/RenderHtml';
import Toast from '../../../components/Toast';
import withPageLoading from '../../../components/withPageLoading';
import {formaNum, isIphoneX, px} from '../../../utils/appUtil';
import {getTransferPreData, transfetCalc, transferConfirm} from './services';

const weightMedium = Platform.select({android: '700', ios: '500'});

const settting = {
    width: px(140),
    height: px(62),
    color: '#3E5AA4',
    border: px(8),
    radius: px(4),
    opacity: 0.05,
    x: 0,
    y: px(2),
};

export const PortfolioTransfering = ({data = {}}) => {
    const {from, to} = data;
    return (
        <LinearGradient
            colors={['#fff', Colors.bgColor]}
            start={{x: 0, y: 0.53}}
            end={{x: 0, y: 0.97}}
            style={[Style.flexBetween, {padding: Space.padding}]}>
            <BoxShadow setting={settting}>
                <LinearGradient
                    colors={[Colors.bgColor, '#fff']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.portfolioBox}>
                    <View style={[Style.flexCenter, styles.borderBox, {borderTopColor: '#9AA0B1'}]}>
                        <Text style={[styles.subTitle, {fontWeight: weightMedium}]}>{from?.poid_name}</Text>
                        <Text style={[styles.desc, {marginTop: px(4)}]}>{from?.gateway_name}</Text>
                    </View>
                </LinearGradient>
            </BoxShadow>
            <Image source={transfer} style={styles.transfer} />
            <BoxShadow setting={settting}>
                <LinearGradient
                    colors={['#EEF5FF', '#fff']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.portfolioBox}>
                    <View style={[Style.flexCenter, styles.borderBox, {borderTopColor: Colors.brandColor}]}>
                        <Text style={[styles.subTitle, {fontWeight: weightMedium}]}>{to?.poid_name}</Text>
                        <Text style={[styles.desc, {marginTop: px(4)}]}>{to?.gateway_name}</Text>
                    </View>
                </LinearGradient>
            </BoxShadow>
        </LinearGradient>
    );
};

export const CalcResult = ({data = {}}) => {
    const jump = useJump();
    const {card_body, card_header, from, to} = data;

    return (
        <>
            <View style={[Style.flexRowCenter, {marginTop: px(12)}]}>
                <View style={Style.flexCenter}>
                    <Text style={styles.bigNumText}>{formaNum(from?.amount || 0)}</Text>
                    <Text style={[styles.desc, {marginTop: px(2), color: Colors.descColor}]}>{from?.text}</Text>
                </View>
                <View style={[Style.flexCenter, {marginLeft: px(80)}]}>
                    <Text style={styles.bigNumText}>{formaNum(to?.amount || 0)}</Text>
                    <Text style={[styles.desc, {marginTop: px(2), color: Colors.descColor}]}>{to?.text}</Text>
                </View>
            </View>
            {card_header?.length > 0 && (
                <View style={[Style.flexRow, styles.tableHeader]}>
                    {card_header.map?.((c, i, arr) => {
                        return (
                            <Text
                                key={c + i}
                                style={[
                                    styles.desc,
                                    i === 0
                                        ? {width: px(180)}
                                        : {flex: 1, textAlign: i < arr.length - 1 ? 'center' : 'right'},
                                ]}>
                                {c}
                            </Text>
                        );
                    })}
                </View>
            )}
            {card_body?.map?.((row, i) => {
                const {amount, bank_limit, bank_name, bank_no, count, label, tips} = row;
                const {bg_color, btn, btn_font_color, content} = tips || {};
                return (
                    <View key={bank_name + i} style={styles.tableRow}>
                        <View style={Style.flexRow}>
                            <View style={{width: px(180)}}>
                                <View style={Style.flexRow}>
                                    <Text style={[styles.subTitle, {fontWeight: weightMedium}]}>{bank_name}</Text>
                                    <Text style={[styles.desc, {color: Colors.defaultColor}]}>{bank_no}</Text>
                                    {label?.text ? (
                                        <View style={[styles.tagBox, {backgroundColor: label.bg_color}]}>
                                            <Text style={[styles.tagText, {color: label.font_color}]}>
                                                {label.text}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                                <Text numberOfLines={1} style={[styles.smText, {marginTop: px(2)}]}>
                                    {bank_limit}
                                </Text>
                            </View>
                            <Text style={[styles.numText, {flex: 1, textAlign: 'center'}]}>{count}</Text>
                            <Text style={[styles.numText, {flex: 1, textAlign: 'right'}]}>{formaNum(amount || 0)}</Text>
                        </View>
                        {content ? (
                            <View style={[Style.flexRow, styles.tipBox, {backgroundColor: bg_color}]}>
                                <View style={{flex: 1}}>
                                    <HTML html={content} style={{...styles.desc, color: Colors.defaultColor}} />
                                </View>
                                {btn?.text ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            Modal.close();
                                            jump(btn.url);
                                        }}
                                        style={[Style.flexCenter, styles.tipBtn, {borderColor: btn_font_color}]}>
                                        <Text style={[styles.desc, {color: btn_font_color}]}>{btn.text}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                );
            })}
        </>
    );
};

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {btn, from, percent, to} = data;
    const [value, setValue] = useState('');
    const [calcData, setCalcData] = useState();
    const [calculating, setCalculating] = useState(false);
    const inputRef = useRef();
    const timer = useRef();
    const passwordModal = useRef();

    /** @name 点击确认转换 */
    const onSubmit = () => {
        if (btn.action === 'password') {
            passwordModal.current?.show();
        } else if (btn.url) {
            const url = {...btn.url, params: {...(btn.url.params || {}), percent: value}};
            jump(url);
        }
    };

    /** @name 输完交易密码 */
    const onFinish = (password) => {
        const loading = Toast.showLoading();
        transferConfirm({password, percent: value, ...(route.params || {})})
            .then((res) => {
                Toast.hide(loading);
                res.message && Toast.show(res.message);
                if (res.code === '000000') {
                    const {url} = res.result;
                    url && jump(url);
                }
            })
            .finally(() => {
                Toast.hide(loading);
            });
    };

    useEffect(() => {
        getTransferPreData(route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    const {title = '一键转换'} = res.result;
                    navigation.setOptions({title});
                    setValue(`${res.result.percent?.btn_value || ''}`);
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (!value) {
                setCalcData();
            } else {
                setCalculating(true);
                timer.current && clearTimeout(timer.current);
                timer.current = setTimeout(() => {
                    transfetCalc({percent: value, ...(route.params || {})})
                        .then((res) => {
                            if (res.code === '000000') {
                                setCalcData(res.result);
                            }
                        })
                        .finally(() => {
                            setCalculating(false);
                        });
                }, 300);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <PasswordModal onDone={onFinish} ref={passwordModal} />
            <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {from && to ? <PortfolioTransfering data={{from, to}} /> : null}
                <View style={{padding: Space.padding}}>
                    <Text style={styles.bigTitle}>{percent?.title}</Text>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                const input = inputRef.current;
                                const isFocused = input.isFocused();
                                if (!isFocused) {
                                    input.focus();
                                }
                            }}
                            style={[Style.flexRowCenter, {paddingBottom: px(8)}]}>
                            {value?.length === 0 && <Text style={styles.placeholder}>{percent?.placeholder_text}</Text>}
                            <TextInput
                                clearButtonMode="never"
                                keyboardType="number-pad"
                                maxLength={3}
                                onChangeText={(val) => setValue(parseFloat(val) > 100 ? '100' : val.replace(/\D/g, ''))}
                                ref={inputRef}
                                style={styles.input}
                                value={value}
                            />
                            {parseFloat(value) > 0 && <Text style={styles.percent}>{'%'}</Text>}
                            <View style={[Style.flexRow, styles.rightBtns]}>
                                {value?.length > 0 && (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setValue('')}
                                        style={styles.clearBtn}>
                                        <AntDesign color={'#CDCDCD'} name="closecircle" size={px(16)} />
                                    </TouchableOpacity>
                                )}
                                {parseFloat(value) !== 100 && percent?.btn_text ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setValue(`${percent?.btn_value || ''}`)}
                                        style={styles.allBtn}>
                                        <Text style={[styles.subTitle, {color: Colors.brandColor}]}>
                                            {percent.btn_text}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={Style.flexRow}>
                        <Text style={styles.title}>{percent.tip_title}</Text>
                        <Text style={[styles.desc, {marginLeft: px(8)}]}>{percent.tip_text}</Text>
                    </View>
                    {calcData ? <CalcResult data={calcData} /> : null}
                    {calculating && (
                        <View style={[Style.flexCenter, {height: px(200)}]}>
                            <ActivityIndicator color={Colors.lightGrayColor} />
                        </View>
                    )}
                </View>
            </ScrollView>
            {btn?.text ? (
                <>
                    <View style={styles.borderTop} />
                    <FixedButton disabled={btn.avail === 0 || !value} onPress={onSubmit} title={btn.text} />
                </>
            ) : null}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: px(8) + px(45) + (isIphoneX() ? 34 : px(8)),
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    portfolioBox: {
        borderRadius: px(4),
        overflow: 'hidden',
        width: px(140),
    },
    borderBox: {
        padding: px(10),
        borderTopWidth: px(2),
    },
    transfer: {
        width: px(35),
        height: px(16),
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    numText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    bigNumText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    unit: {
        fontSize: Font.textSm,
        lineHeight: px(16),
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: weightMedium,
    },
    inputWrapper: {
        marginVertical: px(24),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    placeholder: {
        position: 'absolute',
        bottom: px(8),
        width: '100%',
        fontSize: px(26),
        lineHeight: px(36),
        color: Colors.placeholderColor,
        textAlign: 'center',
    },
    input: {
        padding: 0,
        paddingHorizontal: px(2),
        fontSize: px(34),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
    percent: {
        marginTop: px(4),
        fontSize: px(26),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
    rightBtns: {
        position: 'absolute',
        right: 0,
        height: '100%',
    },
    clearBtn: {
        marginRight: px(8),
    },
    allBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(8),
        borderRadius: px(4),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    tableHeader: {
        marginTop: px(12),
        paddingBottom: px(8),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tableRow: {
        paddingVertical: px(8),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    tagBox: {
        marginLeft: px(6),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
    },
    tagText: {
        fontSize: px(10),
        lineHeight: px(14),
    },
    tipBox: {
        marginTop: px(6),
        padding: px(8),
        borderRadius: Space.borderRadius,
    },
    tipBtn: {
        marginLeft: px(8),
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        height: px(24),
    },
});

export default withPageLoading(Index);
