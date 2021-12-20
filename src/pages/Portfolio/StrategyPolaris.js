/*
 * @Author: xjh
 * @Date: 2021-02-22 11:01:39
 * @Description:马红漫策略页
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-20 12:11:37
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {px as text, px, deviceWidth} from '../../utils/appUtil';
import FitImage from 'react-native-fit-image';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Font, Style, Colors} from '../../common/commonStyle';

export default function StrategyPolaris(props) {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/polaris/strategy/20210101').then((res) => {
            props.navigation.setOptions({
                title: res.result.title,
            });
            setData(res.result);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const jumpTo = (url) => {
        props.navigation.navigate(url.path, url.params);
    };
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            {Object.keys(data).length > 0 && (
                <ScrollView scrollIndicatorInsets={{right: 1}}>
                    {data?.show_top_status ? (
                        <View style={{backgroundColor: '#fff'}}>
                            <FitImage source={{uri: data.bg_img}} resizeMode="contain" />
                            <View style={[Style.flexRowCenter, {marginTop: text(-60)}]}>
                                <Image
                                    source={{
                                        uri: data.avatar,
                                    }}
                                    style={styles.head_img_sty}
                                />
                                <Image source={{uri: data.v_icon}} style={styles.v_icon} />
                            </View>
                            <View style={[styles.content_sty, Style.columnAlign]}>
                                <Text style={styles.content_title_sty}>{data.nickname}</Text>
                                <Text>{data.desc}</Text>
                                <Text style={styles.desc_sty}>{data.strategy}</Text>
                            </View>
                        </View>
                    ) : null}

                    <View style={{padding: text(16), paddingTop: text(20)}}>
                        <Text style={styles.title_sty}>{data.portfolios_title}</Text>
                        {data.portfolios.map((_item, _index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.card_sty, Style.flexBetween]}
                                    key={_index + '_item'}
                                    onPress={() => jumpTo(_item.url)}>
                                    <View style={{marginRight: text(10)}}>
                                        <Text style={styles.card_title_sty}>{_item.name}</Text>
                                        <Text style={{color: '#555B6C', fontSize: text(13), lineHeight: text(18)}}>
                                            {_item.desc}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.radio_sty,
                                                {color: _item.ratio > 0 ? Colors.red : Colors.green},
                                            ]}>
                                            {_item.ratio}%
                                        </Text>
                                        <Text style={{color: '#9AA1B2', fontSize: Font.textH3}}>
                                            {_item.ratio_desc}
                                        </Text>
                                    </View>
                                    <AntDesign name={'right'} size={12} color={'#9095A5'} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    head_img_sty: {
        width: text(80),
        height: text(80),
        borderRadius: text(10),
        borderColor: '#fff',
        borderWidth: 4,
    },
    content_sty: {
        backgroundColor: '#fff',
        marginTop: text(16),
        paddingBottom: text(20),
        paddingHorizontal: text(16),
    },
    content_title_sty: {
        fontSize: text(18),
        fontWeight: 'bold',
        marginBottom: text(12),
    },
    desc_sty: {
        color: '#555B6C',
        fontSize: Font.textH3,
        marginTop: text(16),
        lineHeight: text(20),
    },
    title_sty: {
        fontSize: text(17),
        fontWeight: 'bold',
        color: Colors.defaultFontColor,
        paddingBottom: text(16),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingHorizontal: text(16),
        paddingVertical: text(14),
        marginBottom: text(16),
    },
    card_title_sty: {
        color: Colors.defaultFontColor,
        fontSize: text(15),
        fontWeight: 'bold',
        paddingBottom: text(6),
    },
    radio_sty: {
        fontSize: text(22),
        fontFamily: Font.numFontFamily,
        marginTop: text(14),
        marginBottom: text(4),
    },
    v_icon: {
        width: px(24),
        height: px(24),
        position: 'absolute',
        right: deviceWidth / 2 - text(52),
        bottom: text(-6),
        zIndex: 100,
    },
});
