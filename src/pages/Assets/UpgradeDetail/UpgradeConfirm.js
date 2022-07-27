import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';
import {Font} from '~/common/commonStyle';
import Agreements from '~/components/Agreements';
import BottomDesc from '~/components/BottomDesc';
import {Button} from '~/components/Button';
import {PasswordModal} from '~/components/Password';
import Toast from '~/components/Toast';
import {isIphoneX, px} from '~/utils/appUtil';
import {upgradeConfirm, upgradeDo} from './services';

const UpgradeConfirm = ({route, navigation}) => {
    const [data, setData] = useState(null);
    const [curCardLayout, setCurCardLayout] = useState(null);
    const [futureCardLayout, setFutureCardLayout] = useState(null);
    const [check, setCheck] = useState(false);

    const {part1, part2, part3, button, bottom_agreements} = useMemo(() => {
        return data || {};
    }, [data]);

    const passwordModal = useRef(null);

    useEffect(() => {
        upgradeConfirm(route.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);

    const confirm = useCallback(() => {
        passwordModal.current.show();
    }, []);

    const submit = useCallback((password) => {
        upgradeDo({password, upgrade_id: route.params?.upgrade_id}).then((res) => {
            Toast.show(res.result?.message || res.message);
            if (res.code === '000000') {
                navigation.pop(2);
            }
        });
    }, []);

    return data ? (
        <View style={styles.container}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 0.3}} colors={['#fff', '#F5F7F8']} style={{flex: 1}}>
                <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.content}>
                        {/* top */}
                        <View>
                            <LinearGradient
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                colors={['#F5F6F8', '#fff']}
                                style={{borderRadius: px(4), zIndex: 1}}
                                onLayout={(e) => {
                                    setCurCardLayout(e.nativeEvent.layout);
                                }}>
                                <View style={{height: px(2), backgroundColor: '#9AA0B1', borderRadius: px(4)}} />
                                <View style={styles.assetsWrap}>
                                    <View style={styles.header}>
                                        <Text style={styles.headerLabel}>{part1?.head?.[0]}</Text>
                                        <Text style={styles.headerLabel}>{part1?.head?.[1]}</Text>
                                    </View>
                                    {part1?.items?.map((item, idx) => (
                                        <View key={idx} style={[styles.item, {marginTop: px(12)}]}>
                                            <Text style={styles.bigName}>{item.name}</Text>
                                            <Text style={styles.bigAmount}>{item.amount}</Text>
                                        </View>
                                    ))}
                                </View>
                            </LinearGradient>
                            {curCardLayout?.width ? (
                                <View style={{position: 'absolute', left: 0, top: 0}}>
                                    <BoxShadow
                                        setting={{
                                            color: '#3e5aa4',
                                            border: 4,
                                            radius: px(4),
                                            opacity: 0.1,
                                            x: 0,
                                            y: 2,
                                            width: curCardLayout?.width,
                                            height: curCardLayout?.height,
                                        }}
                                    />
                                </View>
                            ) : null}
                        </View>
                        {/* icon */}
                        <FastImage
                            style={styles.icon}
                            source={{
                                uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/151658114869_.pic_.png',
                            }}
                        />
                        {/* bottom */}
                        <View>
                            <LinearGradient
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 0.2}}
                                colors={['#FFF2E1', '#fff']}
                                style={{borderRadius: px(4), zIndex: 1}}
                                onLayout={(e) => {
                                    setFutureCardLayout(e.nativeEvent.layout);
                                }}>
                                <View style={{height: px(2), backgroundColor: '#FF7D41', borderRadius: px(4)}} />
                                <View style={styles.assetsWrap}>
                                    <View style={styles.header}>
                                        <Text style={styles.headerLabel}>{part2?.head?.[0]}</Text>
                                        <Text style={styles.headerLabel}>{part2?.head?.[1]}</Text>
                                    </View>
                                    {part2?.items?.map((item, idx) => (
                                        <View key={idx} style={[styles.item, {marginTop: px(12)}]}>
                                            <Text style={styles.bigName}>{item.name}</Text>
                                            <Text style={styles.bigAmount}>{item.amount}</Text>
                                        </View>
                                    ))}
                                    {/* 具体 */}
                                    <View style={styles.detail}>
                                        <View style={styles.header}>
                                            <Text style={styles.headerLabel}>{part3?.head?.[0]}</Text>
                                            <Text style={styles.headerLabel}>{part3?.head?.[1]}</Text>
                                        </View>
                                        {part3?.items?.map?.((item, idx) => (
                                            <View key={idx} style={[styles.item, {marginTop: px(16)}]}>
                                                <Text style={styles.smallName}>{item.name}</Text>
                                                <Text style={styles.smallAmount}>{item.amount}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </LinearGradient>
                            {futureCardLayout?.width ? (
                                <View style={{position: 'absolute', left: 0, top: 0}}>
                                    <BoxShadow
                                        setting={{
                                            color: '#3e5aa4',
                                            border: 4,
                                            radius: px(4),
                                            opacity: 0.1,
                                            x: 0,
                                            y: 2,
                                            width: futureCardLayout?.width,
                                            height: futureCardLayout?.height,
                                        }}
                                    />
                                </View>
                            ) : null}
                        </View>
                    </View>
                    <BottomDesc />
                </ScrollView>
            </LinearGradient>
            <View style={styles.bottomWrap}>
                {/* agreement agreement_bottom button */}
                <View style={{marginHorizontal: px(16)}}>
                    {!check ? (
                        <View style={styles.checkTag}>
                            <Text style={{fontSize: px(14), lineHeight: px(20), color: '#fff'}}>请勾选</Text>
                            <View style={styles.qualTag} />
                        </View>
                    ) : null}
                    <Agreements
                        check={false}
                        title={data.agreement_before}
                        data={bottom_agreements}
                        text1={data.agreement_after}
                        onChange={(checkStatus) => {
                            setCheck(checkStatus);
                        }}
                    />
                </View>
                <View style={styles.feeWrap}>
                    <Text style={styles.feeBlack}>{data.fee_text}：</Text>
                    <Text
                        style={[
                            styles.feeBlack,
                            {
                                textDecorationLine: 'line-through',
                            },
                        ]}>
                        {data.old_fee}
                    </Text>
                    <Text style={styles.feeHigh}>{data.fee}</Text>
                </View>
                <Button
                    style={{marginTop: px(8), marginHorizontal: px(16)}}
                    disabled={!check || button.avail === 0}
                    title={button.text}
                    onPress={confirm}
                />
            </View>
            <PasswordModal ref={passwordModal} onDone={submit} />
        </View>
    ) : null;
};

export default UpgradeConfirm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
    },
    assetsWrap: {
        padding: px(16),
        paddingTop: px(14),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLabel: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9aa0b1',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bigName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    bigAmount: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121d3a',
        fontFamily: Font.numFontFamily,
    },
    icon: {
        width: px(40),
        height: px(40),
        marginVertical: px(8),
        alignSelf: 'center',
    },
    detail: {
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        marginTop: px(16),
        paddingTop: px(15),
    },
    smallName: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
    },
    smallAmount: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
        fontFamily: Font.numFontFamily,
    },
    checkTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: px(8),
        paddingVertical: px(6),
        position: 'absolute',
        top: -px(43),
        zIndex: 10,
        left: px(-6),
        borderRadius: px(4),
    },
    qualTag: {
        position: 'absolute',
        borderWidth: px(6),
        borderTopColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: 'transparent',
        left: px(8),
        bottom: -px(12),
    },
    bottomWrap: {
        paddingTop: px(10),
        paddingBottom: isIphoneX() ? 34 : px(8),
        backgroundColor: '#fff',
    },
    feeWrap: {
        borderTopColor: '#F4F5F7',
        borderBottomColor: '#F4F5F7',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: px(8),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px(16),
        marginTop: px(8),
    },
    feeBlack: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    feeHigh: {
        fontSize: px(12),
        lineHeight: px(21),
        color: '#ff7d41',
        marginLeft: px(4),
    },
});
