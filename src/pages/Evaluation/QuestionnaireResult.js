/*
 * @Date: 2021-07-05 18:09:25
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 16:43:18
 * @Description: 传统风险评测结果页
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Font, Space} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import http from '../../services';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';

const QuestionnaireResult = () => {
    const jump = useJump();
    const navigation = useNavigation();
    const route = useRoute();
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/questionnaire/result/20210101', {fr: route.params?.fr, upid: route.params?.upid}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (data.top_button) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => handleJump(data.top_button.url)}>
                        <Text style={styles.top_button}>{data.top_button.text}</Text>
                    </TouchableOpacity>
                ),
                title: data.title,
            });
        }
    }, [data, handleJump, navigation]);

    const handleJump = useCallback(
        (url) => {
            jump(url, 'replace');
        },
        [jump]
    );
    return (
        <ScrollView style={styles.container}>
            {Object.keys(data).length > 0 && (
                <ImageBackground source={require('../../assets/img/evaluate/wrap.png')} style={styles.cardWrap}>
                    <Text style={styles.titleWrap}>{data.risk_title}</Text>
                    <Text style={styles.descWrap}>{data.risk_name}</Text>
                    <View style={styles.contentBox}>
                        <HTML html={data.risk_content} style={styles.contentWrap} />
                        <Image
                            source={require('../../assets/img/evaluate/yinhaozuo.png')}
                            style={{
                                width: text(24),
                                height: text(24),
                                position: 'absolute',
                                left: text(20),
                                top: text(44),
                            }}
                        />
                        <Image
                            source={require('../../assets/img/evaluate/yinhao.png')}
                            style={{
                                width: text(24),
                                height: text(24),
                                position: 'absolute',
                                right: text(20),
                                bottom: text(-8),
                            }}
                        />
                    </View>
                    {data?.tips ? (
                        <View style={{paddingHorizontal: px(51), marginTop: px(10)}}>
                            <HTML html={data?.tips} style={{fontSize: text(11), lineHeight: text(17)}} />
                        </View>
                    ) : null}
                    <Button
                        title={data.button.text}
                        onPress={() => {
                            //调整风险工具
                            if (route?.params?.fr?.includes('riskch')) {
                                navigation.goBack();
                            } else {
                                jump(data?.button?.url, route?.params?.fr === 'single_buy' ? 'navigate' : 'replace');
                            }
                        }}
                        style={{position: 'absolute', left: text(32), right: text(32), bottom: text(52)}}
                    />
                </ImageBackground>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    top_button: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        paddingRight: Space.padding,
    },
    coverImage: {
        height: text(132),
    },
    cardWrap: {
        marginTop: Space.marginVertical,
        marginHorizontal: text(3),
        minHeight: text(520),
        position: 'relative',
    },
    titleWrap: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
        textAlign: 'center',
        marginTop: text(32),
    },
    descWrap: {
        fontSize: text(22),
        lineHeight: text(30),
        color: Colors.red,
        textAlign: 'center',
        fontWeight: '600',
        marginTop: text(12),
    },
    contentBox: {
        paddingTop: text(44),
        paddingHorizontal: text(51),
        position: 'relative',
    },
    contentWrap: {
        fontSize: Font.textH2,
        lineHeight: text(22),
        color: Colors.descColor,
    },
});

export default QuestionnaireResult;
