/*
 * @Date: 2022-08-18 15:33:19
 * @Description: 什么是计划
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import NavBar from '~/components/NavBar';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {getPageData} from './services';

const Index = ({navigation, route}) => {
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const {bottom_pic = [], head_pic = [], mid_data, title = ''} = data;
    const {list, slogan, title: modeTitle} = mid_data || {};
    const [scrollY, setScrollY] = useState(0);
    const imgArr = useRef([]);

    /** @name 加载时计算图片高度 */
    const onLoad = (e, key) => {
        // console.log(e.nativeEvent);
        const {width, height} = e.nativeEvent;
        imgArr.current[key]?.setNativeProps({
            style: {
                height: (deviceWidth * height) / width,
            },
        });
    };

    useEffect(() => {
        if (scrollY > 0 || scrollY < -20) {
            StatusBar.setBarStyle('dark-content');
        } else {
            StatusBar.setBarStyle('light-content');
        }
    }, [scrollY]);

    useEffect(() => {
        getPageData(route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
                StatusBar.setBarStyle('light-content');
            });
        return () => {
            StatusBar.setBarStyle('dark-content');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <NavBar
                        leftIcon={'chevron-left'}
                        fontStyle={{color: scrollY > 0 || scrollY < -60 ? Colors.navLeftTitleColor : '#fff'}}
                        style={{
                            backgroundColor: scrollY > 0 ? '#fff' : 'transparent',
                            opacity: scrollY < 50 && scrollY > 0 ? scrollY / 50 : 1,
                            position: 'absolute',
                        }}
                        title={scrollY > 0 ? title : ''}
                    />
                    <ScrollView
                        bounces={false}
                        onScroll={({
                            nativeEvent: {
                                contentOffset: {y},
                            },
                        }) => setScrollY(y)}
                        scrollEventThrottle={16}
                        scrollIndicatorInsets={{right: 1}}
                        style={{flex: 1}}>
                        {head_pic?.map?.((img, i) => {
                            return (
                                <Image
                                    key={img + i}
                                    onLoad={(e) => onLoad(e, `head_pic${i}`)}
                                    ref={(ref) => (imgArr.current[`head_pic${i}`] = ref)}
                                    source={{uri: img}}
                                    style={{width: '100%'}}
                                />
                            );
                        })}
                        {mid_data ? (
                            <View style={styles.modeBox}>
                                <View style={[Style.flexRow, {paddingTop: px(12)}]}>
                                    <Text style={styles.bigTitle}>{modeTitle}</Text>
                                    <View style={styles.divider} />
                                    <Text style={[styles.label, {color: Colors.descColor}]}>{slogan}</Text>
                                </View>
                                {list?.map?.((item, index) => {
                                    const {pattern, title: patternTitle} = item;
                                    return (
                                        <View key={patternTitle + index} style={styles.patternBox}>
                                            <Text style={styles.patternTitle}>{patternTitle}</Text>
                                            {pattern?.map?.((p, i) => {
                                                const {schema, tool} = p;
                                                const {label: schemaLabel, value: schemaValue} = schema;
                                                const {label: toolLabel, signal: toolSignal} = tool;
                                                return (
                                                    <View
                                                        key={schemaLabel + i}
                                                        style={[Style.flexRow, styles.modeItem]}>
                                                        <View style={[Style.flexRow, {flex: 1}]}>
                                                            <Text style={[styles.label, {marginRight: px(2)}]}>
                                                                {schemaLabel}
                                                            </Text>
                                                            <Text style={styles.value}>{schemaValue}</Text>
                                                        </View>
                                                        <View style={[Style.flexRow, styles.signalBox]}>
                                                            <Text style={[styles.label, {marginRight: px(2)}]}>
                                                                {toolLabel}
                                                            </Text>
                                                            <View>
                                                                {toolSignal?.map?.((signal, idx) => {
                                                                    const {icon, text, url} = signal;
                                                                    return (
                                                                        <TouchableOpacity
                                                                            activeOpacity={0.8}
                                                                            key={text + idx}
                                                                            onPress={() => jump(url)}
                                                                            style={[
                                                                                Style.flexRow,
                                                                                styles.signalItem,
                                                                                {marginTop: idx === 0 ? 0 : px(8)},
                                                                            ]}>
                                                                            {icon ? (
                                                                                <Image
                                                                                    source={{uri: icon}}
                                                                                    style={styles.signalIcon}
                                                                                />
                                                                            ) : null}
                                                                            <Text style={styles.signalText}>
                                                                                {text}
                                                                            </Text>
                                                                            <Icon
                                                                                color={Colors.defaultColor}
                                                                                name="chevron-right"
                                                                                size={px(10)}
                                                                            />
                                                                        </TouchableOpacity>
                                                                    );
                                                                })}
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    );
                                })}
                            </View>
                        ) : null}
                        {bottom_pic?.map?.((img, i) => {
                            return (
                                <Image
                                    key={img + i}
                                    onLoad={(e) => onLoad(e, `bottom_pic${i}`)}
                                    ref={(ref) => (imgArr.current[`bottom_pic${i}`] = ref)}
                                    source={{uri: img}}
                                    style={{width: '100%'}}
                                />
                            );
                        })}
                        <View style={{paddingBottom: isIphoneX() ? 34 : Space.marginVertical}} />
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    modeBox: {
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        paddingBottom: Space.padding,
        borderBottomRightRadius: px(8),
        borderBottomLeftRadius: px(8),
        backgroundColor: '#fff',
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    label: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    divider: {
        marginHorizontal: px(8),
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.defaultColor,
        height: px(12),
    },
    patternBox: {
        marginTop: px(12),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    patternTitle: {
        paddingVertical: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    modeItem: {
        paddingVertical: px(8),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    value: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    signalBox: {
        paddingLeft: px(12),
        borderLeftWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flex: 1,
    },
    signalItem: {
        padding: px(2),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
    },
    signalIcon: {
        marginRight: px(4),
        width: px(16),
        height: px(16),
    },
    signalText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
});

export default Index;
