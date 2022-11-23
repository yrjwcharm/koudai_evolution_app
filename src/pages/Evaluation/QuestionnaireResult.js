/*
 * @Date: 2021-07-05 18:09:25
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-23 19:56:23
 * @Description: 传统风险评测结果页
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import http from '../../services';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import RenderHtml from '../../components/RenderHtml';
import LinearGradient from 'react-native-linear-gradient';
const QuestionnaireResult = () => {
    const jump = useJump();
    const navigation = useNavigation();
    const route = useRoute();
    const {fr, fund_code = '', upid = '', append = ''} = route.params;
    const [data, setData] = useState({});
    useEffect(() => {
        http.get('/questionnaire/result/20210101', {fr, fund_code, upid, append}).then((res) => {
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
    const buttonJump = (url) => {
        let routes = navigation.dangerouslyGetState()?.routes;
        if (fr?.includes('riskch') || routes[routes.length - 2]?.name === 'PortfolioDetails') {
            navigation.goBack();
        } else {
            jump(url, fr === 'single_buy' && !url?.path?.indexOf('IdAuth') > -1 ? 'navigate' : 'replace');
        }
    };
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
                    {data?.open_account ? (
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            colors={['#FFF9EF', '#FFF0D9']}
                            style={styles.open_account_con}>
                            {data?.open_account?.title && (
                                <RenderHtml
                                    style={{fontSize: px(14), fontWeight: 'bold'}}
                                    html={data?.open_account?.title}
                                />
                            )}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => buttonJump(data?.open_account?.strong_btn?.url)}
                                style={[styles.open_account_btn]}>
                                <Text style={{fontSize: px(12), color: '#fff'}}>
                                    {data?.open_account?.strong_btn?.text}
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={{fontSize: px(12), color: Colors.lightBlackColor}}
                                onPress={() => buttonJump(data?.open_account?.light_btn?.url)}>
                                {data?.open_account?.light_btn?.text}
                            </Text>
                        </LinearGradient>
                    ) : null}
                    {data.button?.text ? (
                        <Button
                            title={data.button.text}
                            onPress={() => buttonJump(data?.button?.url)}
                            style={{position: 'absolute', left: text(32), right: text(32), bottom: text(52)}}
                        />
                    ) : null}
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
    open_account_con: {
        alignItems: 'center',
        marginTop: px(36),
        marginHorizontal: px(32),
        borderRadius: px(6),
        paddingVertical: px(24),
    },
    open_account_btn: {
        ...Style.flexCenter,
        backgroundColor: Colors.red,
        width: px(150),
        height: px(34),
        borderRadius: px(50),
        marginVertical: px(12),
    },
});

export default QuestionnaireResult;
