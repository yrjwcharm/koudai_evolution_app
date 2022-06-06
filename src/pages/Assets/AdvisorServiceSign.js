import React, {useState, useEffect, useRef, useMemo} from 'react';
import {View, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Space, Colors} from '../../common/commonStyle';
import http from '../../services';
import {px, isIphoneX} from '../../utils/appUtil';
import Loading from '../Portfolio/components/PageLoading';
import Html from '../../components/RenderHtml';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';

const AdvisorServiceSign = ({navigation, route}) => {
    const [data, setData] = useState(null);
    const [deltaHeight, setDeltaHeight] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const passwordRef = useRef(null);
    const timer = useRef(null);

    useEffect(() => {
        http.post('/adviser/adjust/info/20220526', {poid: route?.params.poid}).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title});
                setData(res.result);
                setCountdown(res.result?.count_down || 0);
                timer.current = setInterval(() => {
                    setCountdown((val) => {
                        let newVal = val - 1;
                        if (newVal <= 0) {
                            http.post('/advisor/action/report/20220422', {
                                action: 'read',
                                poids: route?.params?.poid,
                            });
                            clearInterval(timer.current);
                            newVal = 0;
                        }
                        return newVal;
                    });
                }, 1000);
            }
        });

        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, [navigation, route]);

    const onSubmit = async (password) => {
        let rs = await http.post('/advisor/action/report/20220422', {action: 'confirm', poids: route?.params?.poid});
        if (rs?.code !== '000000') return Toast.show(rs.message);
        const loading1 = Toast.showLoading('签约中...');
        http.post('/adviser/adjust/settings/20220526', {
            password,
            poid: route?.params?.poid,
            status: route?.params?.status,
        }).then((res) => {
            Toast.hide(loading1);
            Toast.show(res.message);
            if (res.code === '000000') {
                const routes = navigation.dangerouslyGetState().routes;
                const assetsRoute = routes[routes.length - 3];
                navigation.navigate(assetsRoute.name, assetsRoute.params);
            }
        });
    };

    return data ? (
        <View style={[styles.container, {paddingBottom: (isIphoneX() ? px(85) : px(51)) + deltaHeight}]}>
            <ScrollView scrollIndicatorInsets={{right: 1}} bounces={false} style={{flex: 1}}>
                <View style={styles.tipsCon}>
                    <Text style={styles.tips}>{data.notice_bar}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{data.sub_title}</Text>
                    <ScrollView bounces={false} style={styles.cardContent} scrollIndicatorInsets={{right: 1}}>
                        <Html html={data.content} />
                    </ScrollView>
                </View>
            </ScrollView>
            {data.button && (
                <FixedButton
                    agreement={data?.agreement_bottom || undefined}
                    title={`${countdown ? countdown + '秒后' : ''}${data.button.text}`}
                    disabled={!!countdown}
                    onPress={() => {
                        passwordRef.current?.show?.();
                    }}
                    heightChange={(height) => setDeltaHeight(height)}
                />
            )}
            <PasswordModal onDone={onSubmit} ref={passwordRef} />
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    tipsCon: {
        paddingVertical: px(9),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    tips: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.orange,
    },
    card: {
        margin: px(16),
        borderRadius: px(6),
        backgroundColor: '#fff',
        paddingBottom: px(20),
    },
    cardTitle: {
        textAlign: 'center',
        paddingVertical: px(16),
        fontSize: px(16),
        fontWeight: '500',
        lineHeight: px(22),
        color: '#121D3A',
    },
    cardContent: {
        paddingHorizontal: px(16),
        minHeight: px(210),
        maxHeight: px(320),
    },
});

export default AdvisorServiceSign;
