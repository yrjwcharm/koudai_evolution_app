/*
 * @Date: 2022-05-23 09:59:55
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-23 14:33:35
 * @Description: 匹配告知
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Colors, Font, Space} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, desc = ''} = data;
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        http.get('/private_fund/double_record/match_notification/20220510', {
            fund_code: route.params.fund_code || 'SVF805',
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '匹配告知'});
                setCountdown(res.result?.button?.seconds || 0);
                timer = setInterval(() => {
                    setCountdown((prev) => {
                        const next = prev - 1;
                        if (next <= 0) {
                            clearInterval(timer);
                        }
                        return next;
                    });
                }, 1000);
                setData(res.result);
            }
        });
        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                <View style={styles.contentBox}>{desc ? <HTML html={desc} style={styles.content} /> : null}</View>
            </ScrollView>
            {button.text ? (
                <Button
                    color="#EDDBC5"
                    disabled={button.avail === 0 || countdown > 0}
                    disabledColor="#EDDBC5"
                    onPress={() => jump(button.url)}
                    style={styles.button}
                    title={countdown > 0 ? `本人已知晓 (${countdown}s)` : button.text}
                />
            ) : null}
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    contentBox: {
        marginTop: Space.marginVertical,
        marginBottom: (isIphoneX() ? 34 : px(16)) + px(45) + px(20),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    content: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    button: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
        backgroundColor: '#D7AF74',
    },
});
