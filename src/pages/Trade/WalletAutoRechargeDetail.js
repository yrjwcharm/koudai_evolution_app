import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';
import Loading from '../Portfolio/components/PageLoading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import {px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';
import http from '../../services/index';
import Toast from '../../components/Toast';
import Html from '../../components/RenderHtml';

const WalletAutoRechargeDetail = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const [data, setData] = useState([]);

    useEffect(() => {
        navigation.setOptions({title: route.params.title});
        let historyRoutes = navigation.dangerouslyGetState?.()?.routes || [];
        const list = historyRoutes;
        for (let i = list.length - 1; i >= 0; i--) {
            const item = list[i];
            if (item.name === 'PortfolioAssets') {
                global.LogTool('FixedPlanAssets_Planrecord_BabyRecharge_Introduction');
                return;
            } else if (item.name === 'TradeBuy') {
                global.LogTool('DetailFixed_TradeBuy_BabyRecharge_Introduction');
                return;
            }
        }
    }, [navigation, route]);

    const getData = () => {
        http.get('/trade/invest_plan/auto_charge_detail/20210101', {poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            } else {
                Toast.show(res.message);
            }
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return data?.[0] ? (
        <>
            <ScrollView
                bounces={false}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, backgroundColor: '#fff', padding: px(16)}}>
                {/* <Image source={{uri: ''}} style={{width: px(343), height: px(835)}} resizeMode="contain" /> */}
                {/* <Image source={{uri: data[0].img}} style={{width: px(343), height: px(30)}} resizeMode="contain" />
                <Text style={styles.desc}>{data[1].desc}</Text>
                <Text style={styles.desc}>{data[2].desc}</Text>
                <Text style={styles.title}>{data[3].title}</Text>
                <Text style={styles.desc}>{data[4].desc}</Text>
                <Image
                    source={{uri: data[5].img}}
                    style={{width: px(343), height: px(132), marginTop: px(8)}}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{data[6].title}</Text>
                <Html html={data[7].desc} style={styles.desc} />
                <Image
                    source={{uri: data[8].img}}
                    style={{width: px(343), height: px(226), marginTop: px(8)}}
                    resizeMode="contain"
                /> */}
                {data.map((item, idx) => {
                    switch (item.key) {
                        case 'img':
                            return (
                                <Image
                                    source={{uri: item.val}}
                                    style={{width: px(item.w), height: px(item.h), marginTop: px(idx > 0 ? 8 : 0)}}
                                    resizeMode="contain"
                                />
                            );
                        case 'desc':
                            return <Html html={item.val} style={styles.desc} />;
                        case 'title':
                            return <Text style={styles.title}>{item.val}</Text>;
                        default:
                            return null;
                    }
                })}
                <View style={{height: insets.bottom + 50}} />
            </ScrollView>
        </>
    ) : (
        <Loading />
    );
};

export default WalletAutoRechargeDetail;

const styles = StyleSheet.create({
    desc: {
        fontSize: px(14),
        fontWeight: '400',
        color: '#585A62',
        lineHeight: px(24),
        marginTop: px(8),
    },
    title: {
        marginTop: px(16),
        fontSize: px(16),
        fontWeight: '500',
        color: Colors.defaultColor,
        lineHeight: px(22),
    },
});
