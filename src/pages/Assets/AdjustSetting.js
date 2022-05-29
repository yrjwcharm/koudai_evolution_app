import React, {useEffect, useState} from 'react';
import {View, Switch, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import http from '../../services';
import {px} from '../../utils/appUtil';
import Loading from '../Portfolio/components/PageLoading';
import Html from '../../components/RenderHtml';
import {useJump} from '../../components/hooks';

const AdjustSetting = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState(null);

    useEffect(() => {
        http.get('/adviser/adjust/detail/20220526').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title});
                setData(res.result);
            }
        });
    }, [navigation]);

    return data ? (
        <ScrollView style={styles.container}>
            <View style={{padding: px(16), paddingBottom: px(80)}}>
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.8}
                    onPress={() => {
                        jump({
                            path: data.url,
                            params: {
                                poid: route?.params?.poid,
                                status: data?.auto_adjust?.status,
                            },
                        });
                    }}>
                    <Text style={styles.cardText}>{data?.auto_adjust?.text}</Text>
                    <Switch
                        ios_backgroundColor={'#CCD0DB'}
                        thumbColor={'#fff'}
                        trackColor={{false: '#CCD0DB', true: '#0051CC'}}
                        value={!!data?.auto_adjust?.status}
                    />
                </TouchableOpacity>
                <Text style={styles.tips}>{data.tips}</Text>
                {data.tip_list.map((item, idx) => (
                    <View key={idx} style={{marginTop: px(idx ? 20 : 0)}}>
                        <Html html={item} style={{fontSize: px(12), color: '#545968', lineHeight: px(20)}} />
                    </View>
                ))}
            </View>
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
        fontSize: px(14),
        lineHeight: px(20),
        color: '#545968',
    },
    tips: {
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: '500',
        color: '#121D3A',
        marginTop: px(20),
        marginBottom: px(6),
    },
});
export default AdjustSetting;
