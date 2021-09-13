/*
 * @Date: 2021-09-02 14:06:45
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-13 14:35:00
 * @Description:隐私设置
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import http from '../../services';
import {Colors, Style, Space, Font} from '../../common/commonStyle';
import {px, isIphoneX} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useJump} from '../../components/hooks';
const PrivacySetting = () => {
    const [data, setData] = useState();
    const jump = useJump();
    useEffect(() => {
        http.get('mapi/privacy/setting/20210906').then((res) => {
            setData(res.result);
        });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data?.map((part, index, arr) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.partBox,
                                index === arr.length - 1
                                    ? {marginBottom: isIphoneX() ? 34 + Space.marginVertical : Space.marginVertical}
                                    : {},
                            ]}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.text} style={[i === 0 ? {} : styles.borderTop]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[Style.flexBetween, {height: px(56)}]}
                                            onPress={() => {
                                                jump(item.url);
                                            }}>
                                            <Text style={styles.title}>{item.text}</Text>
                                            <View style={Style.flexRow}>
                                                {item.desc ? (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            {
                                                                marginRight: item.type !== 'about' ? px(8) : 0,
                                                                color: Colors.lightGrayColor,
                                                            },
                                                        ]}>
                                                        {item.desc}
                                                    </Text>
                                                ) : null}
                                                {item.type !== 'about' && (
                                                    <Icon
                                                        name={'angle-right'}
                                                        size={20}
                                                        color={Colors.lightGrayColor}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    partBox: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.lightBlackColor,
    },
});

export default PrivacySetting;
