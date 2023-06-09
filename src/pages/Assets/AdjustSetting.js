import React, {useCallback, useRef, useState} from 'react';
import {View, Switch, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import http from '../../services';
import {px} from '../../utils/appUtil';
import Loading from '../Portfolio/components/PageLoading';
import Html from '../../components/RenderHtml';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import Toast from '../../components/Toast';
import {PasswordModal} from '../../components/Password';

const AdjustSetting = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState(null);
    const passwordRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            http.get('/adviser/adjust/detail/20220526', {poid: route?.params?.poid}).then((res) => {
                if (res.code === '000000') {
                    navigation.setOptions({title: res.result.title});
                    setData(res.result);
                } else {
                    Toast.show(res.message, {
                        onHidden: () => {
                            navigation.goBack();
                        },
                    });
                }
            });
        }, [navigation, route])
    );

    const handlerCellClick = () => {
        if (data?.auto_adjust?.need_sign) {
            jump({
                path: data.url,
                params: {
                    poid: route?.params?.poid,
                    status: +!data?.auto_adjust?.status,
                },
            });
        } else {
            passwordRef.current?.show?.();
        }
    };

    const onSubmit = (password) => {
        const loading1 = Toast.showLoading('签约中...');
        http.post('/adviser/adjust/settings/20220526', {
            password,
            poid: route?.params?.poid,
            status: +!data?.auto_adjust?.status,
        }).then((res) => {
            Toast.hide(loading1);
            Toast.show(res.message);
            if (res.code === '000000') {
                navigation.goBack();
            }
        });
    };

    return data ? (
        <ScrollView style={styles.container} scrollIndicatorInsets={{right: 1}}>
            <View style={{padding: px(16), paddingBottom: px(80)}}>
                <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlerCellClick}>
                    <Text style={styles.cardText}>{data?.auto_adjust?.text}</Text>
                    <Switch
                        ios_backgroundColor={'#CCD0DB'}
                        thumbColor={'#fff'}
                        trackColor={{false: '#CCD0DB', true: '#0051CC'}}
                        value={!!data?.auto_adjust?.status}
                        onChange={handlerCellClick}
                    />
                </TouchableOpacity>
                <Text style={styles.tips}>{data.tips}</Text>
                {data.tip_list?.map((item, idx) => (
                    <View
                        key={idx}
                        style={{marginTop: px(idx ? 8 : 0), flexDirection: 'row', paddingHorizontal: px(8)}}>
                        <Text style={styles.tipText}>{idx + 1}. </Text>
                        <Text style={[styles.tipText, {flex: 1}]}>{item}</Text>
                    </View>
                ))}
            </View>
            <PasswordModal onDone={onSubmit} ref={passwordRef} />
        </ScrollView>
    ) : (
        <Loading />
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: px(8),
        paddingHorizontal: px(16),
        paddingVertical: px(18),
    },
    cardText: {
        fontSize: px(16),
        lineHeight: px(20),
        color: '#545968',
        fontWeight: '500',
    },
    tips: {
        fontSize: px(22),
        lineHeight: px(34),
        fontWeight: '500',
        color: '#121D3A',
        marginTop: px(20),
        marginBottom: px(16),
    },
    tipText: {
        fontSize: px(14),
        color: '#121d3a',
        lineHeight: px(28),
    },
});
export default AdjustSetting;
