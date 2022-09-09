/*
 * @Date: 2022-08-26 10:29:18
 * @Description: 选择转换组合
 */
import React, {useCallback, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {Button} from '../../../components/Button';
import {useJump} from '../../../components/hooks';
import HTML from '../../../components/RenderHtml';
import withPageLoading from '../../../components/withPageLoading';
import {isIphoneX, px} from '../../../utils/appUtil';
import {getTransferList} from './services';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {list = []} = data;

    useFocusEffect(
        useCallback(() => {
            getTransferList(route.params || {})
                .then((res) => {
                    if (res.code === '000000') {
                        const {title = '选择转换组合'} = res.result;
                        navigation.setOptions({title});
                        setData(res.result);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <View style={{padding: Space.padding, paddingBottom: isIphoneX() ? 34 : Space.padding}}>
                    {list?.map?.((item, index) => {
                        const {btn, labels, name, plan_id, url, yield: yieldInfo} = item;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={name + index}
                                onPress={() => jump(url)}
                                style={[styles.portfolioBox, {marginTop: index === 0 ? 0 : px(12)}]}>
                                <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                                    <Text style={styles.name}>{name}</Text>
                                    {labels?.map?.((label, i) => {
                                        return (
                                            <View key={label + i} style={{marginLeft: px(8)}}>
                                                <HTML html={label} style={styles.label} />
                                            </View>
                                        );
                                    })}
                                </View>
                                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                                    <View>
                                        <Text style={styles.ratio}>{yieldInfo.ratio}</Text>
                                        <Text style={styles.smText}>{yieldInfo.title}</Text>
                                    </View>
                                    {btn?.text ? (
                                        <Button
                                            disabled={btn.avail === 0}
                                            onPress={() => {
                                                global.LogTool('PortfolioTransition_ObjectChoice', plan_id);
                                                jump(btn.url);
                                            }}
                                            style={styles.btn}
                                            textStyle={styles.btnText}
                                            title={btn.text}
                                        />
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    portfolioBox: {
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    label: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    ratio: {
        fontSize: px(20),
        lineHeight: px(24),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    btn: {
        paddingHorizontal: px(12),
        borderRadius: px(26),
        height: px(26),
    },
    btnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
    },
});

export default withPageLoading(Index);
