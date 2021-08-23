/*
 * @Date: 2021-08-19 18:48:05
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-23 15:22:24
 * @Description:
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Style} from '../../common/commonStyle';
import {px, isIphoneX} from '../../utils/appUtil';
import http from '../../services';
import {Button} from '../../components/Button';
import InsuranceCard from '../../components/Portfolios/InsuranceCard';
import {useJump} from '../../components/hooks';
import RenderCate from '../Vision/components/RenderCate';

const InsuranceList = (props) => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const [data, setData] = useState({});
    useEffect(() => {
        http.get('/insurance/list/20210820').then((res) => {
            setData(res.result);
        });
    }, []);

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
});
