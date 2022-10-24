/*
 * @Date: 2022-10-17 18:43:32
 * @Description: 社区审核页面
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const {audit_id, ...leftParams} = route.params || {};
    const [data] = useState(leftParams || {});
    const {btn_text, btn_url, fr = '', icon, tip_desc, tip_title} = data;

    useEffect(() => {
        navigation.setOptions({title: '提交审核成功'});
        setLoading(false);
    }, []);

    return Object.keys(data).length > 0 ? (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.container}>
            <View style={{alignItems: 'center'}}>
                <Image source={{uri: icon}} style={styles.statusIcon} />
                <View style={{marginTop: px(12)}}>
                    <HTML html={tip_title} style={styles.bigTitle} />
                </View>
                <View style={{marginTop: px(8), maxWidth: px(300)}}>
                    <HTML html={tip_desc} style={styles.desc} />
                </View>
                <Button
                    onPress={() => jump(btn_url, fr === 'Community' ? 'replace' : 'navigate')}
                    style={styles.btn}
                    title={btn_text}
                />
            </View>
        </ScrollView>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    statusIcon: {
        marginTop: px(60),
        width: px(56),
        height: px(56),
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
        textAlign: 'center',
    },
    btn: {
        marginTop: px(40),
        width: px(315),
    },
});

export default withPageLoading(Index);
