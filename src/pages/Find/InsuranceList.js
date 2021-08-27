/*
 * @Date: 2021-08-19 18:48:05
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-27 17:17:04
 * @Description:
 */
import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, isIphoneX} from '../../utils/appUtil';
import http from '../../services';
import {Button} from '../../components/Button';
import InsuranceCard from '../../components/Portfolios/InsuranceCard';
import {useJump} from '../../components/hooks';
import RenderCate from '../Vision/components/RenderCate';
import {useFocusEffect} from '@react-navigation/native';

const InsuranceList = (props) => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const [data, setData] = useState({});
    useFocusEffect(
        useCallback(() => {
            http.get('/insurance/list/20210820').then((res) => {
                setData(res.result);
            });
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.close_img, {top: insets.top}]}
                onPress={() => {
                    props.navigation.goBack();
                }}>
                <FastImage
                    style={{width: px(24), height: px(24)}}
                    source={require('../../assets/img/find/close.png')}
                />
            </TouchableOpacity>
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: Colors.bgColor}}>
                <FastImage
                    style={{
                        height: px(330),
                    }}
                    source={{uri: data?.part1?.background}}
                />
                <View style={[styles.header, {top: insets.top + px(8)}]}>
                    <Text style={styles.img_desc}>{data?.part1?.name}</Text>
                    <Text style={styles.img_title}>{data?.part1?.slogan}</Text>
                </View>
                <View style={{marginHorizontal: px(16), marginTop: px(-60)}}>
                    <View style={[styles.card, Style.flexCenter]}>
                        <Text style={{fontSize: px(16), fontWeight: '600', marginBottom: px(16)}}>
                            {data?.part1?.card?.name}
                        </Text>
                        <Text style={{fontSize: px(22), fontWeight: '600', color: Colors.red, marginBottom: px(12)}}>
                            {data?.part1?.card?.desc}
                        </Text>
                        <Text style={{fontSize: px(12), color: Colors.lightBlackColor}}>
                            {data?.part1?.card?.slogan}
                        </Text>
                        <Button
                            title={data?.part1?.card?.button?.text}
                            style={styles.button}
                            textStyle={{fontSize: px(15), fontWeight: '600'}}
                            color="#FF7D41"
                            onPress={() => {
                                global.LogTool('enableNotificationStart');
                                jump(data?.part1?.card?.button?.url);
                            }}
                        />
                    </View>
                    <Text style={styles.large_title}>{data?.part2?.group_name}</Text>
                    {data?.part2?.products?.map((item, index) => (
                        <InsuranceCard data={item} key={index} style={{marginBottom: px(13)}} />
                    ))}
                    {data?.part3?.group_name ? (
                        <Text style={[styles.large_title, {marginTop: px(8)}]}>{data?.part3?.group_name}</Text>
                    ) : null}
                    {data?.part3?.list?.map((item, index) => {
                        return RenderCate(item);
                    })}
                    <Text style={styles.bottom_text}>温馨提示：</Text>
                    <Text style={styles.bottom_text}>
                        投保前请您仔细阅读
                        {data?.agreements?.map((item, index) => (
                            <Text
                                key={index}
                                style={{color: Colors.btnColor}}
                                onPress={() => {
                                    jump(item?.url);
                                }}>
                                {item.name}
                                {index == item.length - 1 ? '' : '、'}
                            </Text>
                        ))}
                        等重要内容，请您重点关注产品保险责任、免责条款、犹豫期、等待期、退保等关键信息并确保已完全理解。
                    </Text>
                    <Text
                        style={[
                            styles.bottom_text,
                            {
                                textAlign: 'center',
                                color: '#BDC2CC',
                                marginTop: px(80),
                                marginBottom: px(40),
                            },
                        ]}>
                        本平台涉及的保险产品及服务由玄元保险代理有限公司提供
                    </Text>
                </View>
            </ScrollView>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[
                    styles.contact,
                    Style.flexRowCenter,
                    {
                        bottom: isIphoneX() ? px(40) + 34 : px(40),
                    },
                ]}
                onPress={() => {
                    jump(data?.service?.url);
                }}>
                {data?.service?.un_read > 0 ? (
                    <View style={styles.point_sty}>
                        <Text style={styles.tag_text}>
                            {data?.service?.un_read > 99 ? '99+' : data?.service?.un_read}
                        </Text>
                    </View>
                ) : null}
                <FastImage
                    source={require('../../assets/img/find/contact.png')}
                    style={{width: px(24), height: px(24)}}
                />
            </TouchableOpacity>
        </View>
    ) : (
        <View style={[Style.flexRowCenter, {flex: 1, backgroundColor: '#fff'}]}>
            <ActivityIndicator />
        </View>
    );
};

export default InsuranceList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: Colors.bgColor,
        borderWidth: 0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: px(8),
        paddingVertical: px(24),
        marginBottom: px(20),
    },
    button: {width: px(240), height: px(40), backgroundColor: '#FF7D41', borderRadius: px(20), marginTop: px(16)},
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        color: Colors.defaultColor,
        marginBottom: px(14),
    },
    close_img: {
        position: 'absolute',
        right: px(16),
        zIndex: 20,
    },
    header: {
        position: 'absolute',
        paddingHorizontal: px(16),
    },
    img_desc: {
        color: '#fff',
        fontSize: px(14),
        marginBottom: px(10),
    },
    img_title: {
        color: '#fff',
        fontSize: px(26),
        lineHeight: px(30),
        fontWeight: '700',
    },
    contact: {
        width: px(44),
        height: px(44),
        borderRadius: px(22),
        backgroundColor: Colors.btnColor,
        position: 'absolute',
        right: px(16),
    },
    bottom_text: {
        fontSize: px(11),
        lineHeight: px(16),
        color: Colors.darkGrayColor,
    },
    tag: {
        backgroundColor: Colors.red,
        width: 8,
        height: 8,
        position: 'absolute',
        right: px(4),
        top: 0,
        borderRadius: 4,
    },
    point_sty: {
        position: 'absolute',
        left: px(28),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(50),
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    tag_text: {
        color: '#fff',
        fontSize: Font.textSm,
        lineHeight: Platform.select({ios: px(12), android: Font.textSm}),
        fontFamily: Font.numFontFamily,
        transform: [{translateY: Platform.select({ios: 0, android: px(0.5)})}],
    },
});
