/*
 * @Author: xjh
 * @Date: 2021-02-22 11:01:39
 * @Description:马红漫策略页
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-22 11:44:35
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import Header from '../../components/NavBar';
import {px as text, isIphoneX} from '../../utils/appUtil';
import FitImage from 'react-native-fit-image';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Font, Style, Colors} from '../../common/commonStyle';
export default function StrategyMaHongMan() {
    return (
        <ScrollView>
            <View style={{backgroundColor: '#fff'}}>
                <FitImage
                    source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/09/bg_img.png'}}
                    resizeMode="contain"
                />
                <View style={[Style.flexRowCenter, {marginTop: text(-60)}]}>
                    <Image
                        source={{
                            uri:
                                'https://lcmfsaas.oss-cn-hangzhou.aliyuncs.com/public/2020-09-18-10-48-4257426.png?OSSAccessKeyId=LTAI4Fh8HGz4WFA9TKX7BZiY&Expires=4710797323&Signature=sxVr%2BQTjHof731xjfdnAMiJHE3E%3D',
                        }}
                        style={styles.head_img_sty}
                    />
                </View>
                <View style={[styles.content_sty, Style.columnAlign]}>
                    <Text style={styles.content_title_sty}>主理人：马红漫</Text>
                    <Text>经济学博士、知名财经主持人、财经评论家</Text>
                    <Text style={styles.desc_sty}>
                        长期看，权益投资是回报率最高的投资品种，权益投资必须要遵循价值投资逻辑。“中国式价值投资”需要懂得并研究中国政策方向以及产业发展战略。读懂周期轮动逻辑，可以有效避免回撤风险。注册制改革完成，龙头品种溢价效应将更加突出。符合上述逻辑的优秀基金公司、基金经理、基金产品，值得精选并长期持有。
                    </Text>
                </View>
            </View>
            <View style={{padding: text(16)}}>
                <Text style={styles.title_sty}>马红漫主理组合</Text>
                <TouchableOpacity style={[styles.card_sty, Style.flexBetween]}>
                    <View>
                        <Text style={styles.card_title_sty}>精选低估值组合</Text>
                        <Text style={{color: '#555B6C', fontSize: text(13)}}>紧跟低估值板块，便宜是价值投资的基础</Text>
                        <Text style={styles.radio_sty}>9.45%</Text>
                        <Text style={{color: '#9AA1B2', fontSize: Font.textH3}}>近一年收益率</Text>
                    </View>
                    <AntDesign name={'right'} size={12} color={'#9095A5'} />
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        marginBottom: text(8),
    },
    desc_sty: {
        color: '#555B6C',
        fontSize: Font.textH3,
        marginTop: text(8),
        lineHeight: text(20),
    },
    title_sty: {
        fontSize: text(17),
        fontWeight: 'bold',
        color: Colors.defaultColor,
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
        color: Colors.defaultColor,
        fontSize: text(15),
        fontWeight: 'bold',
        paddingBottom: text(6),
    },
    radio_sty: {
        color: '#E74949',
        fontSize: text(22),
        fontFamily: Font.numFontFamily,
        marginTop: text(16),
        marginBottom: text(4),
    },
});
