/*
 * @Date: 2021-11-26 10:59:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-26 18:05:27
 * @Description: 牛人跟投设置
 */
import React, {useCallback, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {BankCardModal, InputModal} from '../../components/Modal';
import Loading from '../Portfolio/components/PageLoading';
import {formaNum, onlyNumber, px} from '../../utils/appUtil';
import http from '../../services';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [open, setOpen] = useState(true);
    const [amount, setAmount] = useState('');
    const [inputVal, setInputVal] = useState('');
    const inputModal = useRef();
    const inputRef = useRef();
    const [selectedBank, setSelectedBank] = useState({});
    const bankModal = useRef();

    useFocusEffect(
        useCallback(() => {
            http.get('/niuren/follow_invest/setting/info/20210801', {poid: route.params?.poid}).then((res) => {
                if (res.code === '000000') {
                    setOpen(res.result.status);
                    setAmount(res.result.amount);
                    setSelectedBank(res.result.pay_methods[0]);
                    setData(res.result);
                    navigation.setOptions({title: res.result.title || '设置'});
                }
            });
        }, [navigation, route.params])
    );

    const onToggle = () => {
        setOpen((prev) => !prev);
    };

    const confirmClick = () => {
        if (inputVal < data.min_amount) {
            inputRef?.current?.blur();
            inputModal.current.toastShow(`最小起购金额${formaNum(data.min_amount, 'int')}元`, 2000, {
                onHidden: () => {
                    inputRef?.current?.focus();
                },
            });
        } else if (inputVal > data.max_amount) {
            inputRef?.current?.blur();
            inputModal.current.toastShow(`最大购买金额${formaNum(data.max_amount, 'int')}元`, 2000, {
                onHidden: () => {
                    inputRef?.current?.focus();
                },
            });
        } else {
            inputModal.current.hide();
            setAmount(parseFloat(inputVal));
        }
    };

    const onSave = () => {
        http.post('/niuren/follow_invest/setting/modify/20210801', {
            amount,
            pay_method: selectedBank.pay_method,
            poid: route.params?.poid,
            status: open ? 1 : 0,
        }).then((res) => {
            if (res.code === '000000') {
                Toast.show('保存成功');
                setTimeout(() => {
                    if (res.result.url) {
                        jump(res.result.url, route.params?.ref === 'TopInvestors' ? 'replace' : 'navigate');
                    } else {
                        navigation.goBack();
                    }
                }, 2000);
            } else {
                Toast.show(res.message);
            }
        });
    };

    return (
        <>
            {Object.keys(data || {}).length > 0 ? (
                <ScrollView bounces={false} style={styles.container}>
                    <View style={styles.topPart}>
                        <View style={[Style.flexBetween, {paddingVertical: px(18)}]}>
                            <Text style={styles.label}>{'自动跟投'}</Text>
                            <Switch
                                ios_backgroundColor={'#CCD0DB'}
                                onValueChange={onToggle}
                                thumbColor={'#fff'}
                                trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                value={open}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setInputVal(`${amount}`);
                                inputModal.current?.show?.();
                                // setTimeout(() => {
                                //     inputRef.current?.focus?.();
                                // }, 200);
                            }}
                            style={[Style.flexBetween, styles.inputBox]}>
                            <Text style={styles.label}>{'跟投金额(元)'}</Text>
                            <Text style={styles.amount}>{formaNum(amount, 'int')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal: Space.padding}}>
                        <Text style={styles.desc}>{data.desc}</Text>
                        <Text style={[styles.desc, {marginTop: px(4), color: Colors.lightGrayColor}]}>{data.tip}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => bankModal.current?.show()}
                        style={[Style.flexBetween, styles.bankChange]}>
                        <View style={Style.flexRow}>
                            <Image source={{uri: selectedBank.bank_icon}} style={styles.bankIcon} />
                            <View>
                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color: Colors.defaultColor,
                                            fontWeight: Platform.select({android: '700', ios: '500'}),
                                        },
                                    ]}>
                                    {selectedBank.bank_name}
                                    {selectedBank.bank_no ? <Text>({selectedBank.bank_no})</Text> : null}
                                </Text>
                                <Text style={styles.limitDesc}>{selectedBank.limit_desc}</Text>
                            </View>
                        </View>
                        <View style={Style.flexRow}>
                            <Text style={[styles.limitDesc, {lineHeight: px(17)}]}>切换</Text>
                            <AntDesign color={Colors.lightGrayColor} name={'right'} size={px(12)} />
                        </View>
                    </TouchableOpacity>
                    <Button
                        onPress={onSave}
                        style={{marginTop: px(40), marginHorizontal: Space.marginAlign}}
                        title={'保存'}
                    />
                </ScrollView>
            ) : (
                <Loading />
            )}
            <InputModal confirmClick={confirmClick} ref={inputModal} title={'请输入跟投金额'}>
                <View style={[Style.flexRow, styles.inputContainer]}>
                    <Text style={styles.unit}>¥</Text>
                    <TextInput
                        autoFocus
                        ref={inputRef}
                        clearButtonMode={'never'}
                        keyboardType={'number-pad'}
                        onChangeText={(value) => setInputVal(onlyNumber(value))}
                        style={styles.inputStyle}
                        value={inputVal}
                    />
                    {inputVal.length === 0 && <Text style={styles.placeholder}>{'请输入跟投金额(元)'}</Text>}
                    {inputVal.length > 0 && (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setInputVal('')}>
                            <AntDesign name={'closecircle'} color={'#CDCDCD'} size={px(16)} />
                        </TouchableOpacity>
                    )}
                </View>
            </InputModal>
            <BankCardModal
                data={data.pay_methods || []}
                onDone={(select) => setSelectedBank(select)}
                ref={bankModal}
                select={data?.pay_methods?.findIndex?.((item) => item.pay_method === selectedBank.pay_method) || 0}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        marginVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    inputBox: {
        paddingVertical: px(18),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    label: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    amount: {
        fontSize: Font.textH1,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    inputContainer: {
        marginVertical: px(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: px(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        position: 'relative',
    },
    unit: {
        fontSize: px(26),
        fontFamily: Font.numFontFamily,
    },
    inputStyle: {
        flex: 1,
        fontSize: px(35),
        lineHeight: px(42),
        height: px(42),
        marginLeft: px(14),
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: px(28),
        top: px(3.5),
        fontSize: px(26),
        lineHeight: px(37),
        color: Colors.placeholderColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(21),
        color: Colors.descColor,
    },
    bankChange: {
        marginTop: px(20),
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    bankIcon: {
        marginRight: px(8),
        width: px(28),
        height: px(28),
    },
    limitDesc: {
        fontSize: Font.textH3,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
});
