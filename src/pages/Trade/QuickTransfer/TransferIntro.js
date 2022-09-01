/*
 * @Date: 2022-08-25 15:48:38
 * @Description: 一键转换介绍页
 */
import React, {useCallback, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {FixedButton} from '../../../components/Button';
import {useJump} from '../../../components/hooks';
import HTML from '../../../components/RenderHtml';
import withPageLoading from '../../../components/withPageLoading';
import {isIphoneX, px} from '../../../utils/appUtil';
import {getIntroData} from './services';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {bottom_button: btn, list = []} = data;
    const lineArr = useRef([]);

    useFocusEffect(
        useCallback(() => {
            getIntroData(route.params || {})
                .then((res) => {
                    if (res.code === '000000') {
                        const {title = '一键转换'} = res.result;
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
            <ScrollView
                bounces={false}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, paddingHorizontal: Space.padding}}>
                {list?.map?.((item, index) => {
                    const {content, pic, step, title: partTitle} = item;
                    return (
                        <View
                            key={partTitle + index}
                            style={[
                                styles.partBox,
                                {
                                    borderTopWidth: index === 0 ? 0 : Space.borderWidth,
                                    paddingBottom: pic?.length > 0 ? 0 : px(20),
                                },
                            ]}>
                            <Text style={styles.title}>{partTitle}</Text>
                            {content?.map?.((c, i) => {
                                return (
                                    <View key={c + i} style={{marginTop: i === 0 ? px(6) : px(8)}}>
                                        <HTML html={c} style={styles.content} />
                                    </View>
                                );
                            })}
                            {pic?.map?.((p, i) => {
                                return <Image key={p + i} source={{uri: p}} style={styles.img} />;
                            })}
                            {step?.map?.((s, i, arr) => {
                                return (
                                    <View key={s + i} style={{marginTop: i === 0 ? px(12) : Space.marginVertical}}>
                                        <View
                                            onLayout={({
                                                nativeEvent: {
                                                    layout: {height},
                                                },
                                            }) => lineArr.current[i]?.setNativeProps?.({style: {height: height - 2}})}
                                            style={[Style.flexRow, {alignItems: 'flex-start'}]}>
                                            <View style={[Style.flexCenter, styles.circle]}>
                                                <Text style={styles.stepIndex}>{i + 1}</Text>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <HTML html={s} style={styles.content} />
                                            </View>
                                        </View>
                                        {i < arr.length - 1 && (
                                            <View ref={(ref) => (lineArr.current[i] = ref)} style={styles.line} />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
            {btn?.text ? (
                <>
                    <View style={styles.borderTop} />
                    <FixedButton disabled={btn.avail === 0} onPress={() => jump(btn.url)} title={btn.text} />
                </>
            ) : null}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: px(8) + px(45) + (isIphoneX() ? 34 : px(8)),
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    partBox: {
        paddingVertical: px(20),
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    content: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    img: {
        width: px(342),
        height: px(75),
    },
    circle: {
        marginTop: px(2),
        marginRight: px(8),
        borderRadius: px(14),
        width: px(14),
        height: px(14),
        backgroundColor: Colors.defaultColor,
    },
    stepIndex: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    line: {
        position: 'absolute',
        top: px(18),
        left: px(6),
        width: px(1),
        height: px(16),
        backgroundColor: '#BDC2CC',
    },
});

export default withPageLoading(Index);
