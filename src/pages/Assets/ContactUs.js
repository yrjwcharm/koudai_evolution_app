/*
 * @Date: 2021-02-18 09:56:37
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-18 10:38:30
 * @Description: 联系我们
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const ContactUs = ({navigation}) => {
    const [data, setData] = useState([
        {
            title: '在线客服',
            desc: '在线为您回答常见问题，人工客服可能比较忙，推荐您使用在线客服呦',
            icon:
                'https://upload-images.jianshu.io/upload_images/18473180-45fe8f07218f3ec5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        },
        {
            title: '人工客服 400-080-8208',
            desc: '服务时间：周一至周日9:00-19:00，法定节假日除外',
            icon:
                'https://upload-images.jianshu.io/upload_images/18473180-8f9394c429ba810f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        },
        {
            title: '微信客服',
            desc: '点击复制微信公众号，在微信中完成关注',
            icon:
                'https://upload-images.jianshu.io/upload_images/18473180-b7fc93b600037d00.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        },
    ]);

    useEffect(() => {
        // http.get('').then((res) => {
        //     setData(res.result);
        // });
    }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{'您有问题？'}</Text>
                <Text style={styles.title}>{'欢迎联系我们'}</Text>
            </View>
            {data.map((item, index) => {
                return (
                    <TouchableOpacity key={index} style={[Style.flexRow, styles.contactBox]}>
                        <View style={[Style.flexRow, {flex: 1, marginRight: text(18)}]}>
                            <Image source={{uri: item.icon}} style={styles.icon} />
                            <View style={{flex: 1}}>
                                <Text style={[styles.itemTitle, {marginBottom: text(4)}]}>{item.title}</Text>
                                <Text style={styles.itemDesc}>{item.desc}</Text>
                            </View>
                        </View>
                        <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    titleContainer: {
        paddingVertical: text(24),
        paddingHorizontal: text(20),
    },
    title: {
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    contactBox: {
        marginBottom: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        paddingVertical: text(20),
        paddingHorizontal: text(20),
        paddingRight: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    icon: {
        width: text(40),
        height: text(40),
        marginRight: text(18),
    },
    itemTitle: {
        fontSize: Font.textH1,
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    itemDesc: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.lightGrayColor,
    },
});

export default ContactUs;
