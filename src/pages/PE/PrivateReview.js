/*
 * @Date: 2022-05-18 10:32:42
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-23 18:42:51
 * @Description: 私募审核页面
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button: {text, url} = {}, desc, icon, status} = data;

    useEffect(() => {
        http.get('/private_fund/investor_audit_result/20220510', route.params).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '特定对象认证审核'});
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <View style={styles.topPart}>
                    <Image source={{uri: icon}} style={styles.icon} />
                    <Text style={styles.title}>{status}</Text>
                    <Text style={styles.desc}>{desc}</Text>
                </View>
            </ScrollView>
            <Button
                color="#EDDBC5"
                disabledColor="#EDDBC5"
                onPress={() => jump(url)}
                style={styles.button}
                title={text}
            />
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
    topPart: {
        paddingTop: px(36),
        paddingHorizontal: px(32),
        paddingBottom: px(30),
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    icon: {
        width: px(40),
        height: px(40),
    },
    title: {
        marginTop: Space.marginVertical,
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    desc: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(22),
        color: Colors.descColor,
        textAlign: 'center',
    },
    button: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(20),
        left: px(16),
        backgroundColor: '#D7AF74',
    },
});
