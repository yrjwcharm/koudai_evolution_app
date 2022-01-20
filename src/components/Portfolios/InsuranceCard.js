/*
 * @Date: 2021-08-20 10:39:20
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-20 17:22:18
 * @Description: 保险产品卡片
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Font, Style} from '../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import {useJump} from '../hooks';

const InsuranceCard = ({data, style}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, style]}
            onPress={() => {
                global.LogTool('insuranceProductStart', data.plan_id);
                jump(data?.url);
            }}>
            <View style={Style.flexRow}>
                {data.icon ? (
                    <FastImage
                        style={styles.card_img}
                        source={{
                            uri: data.icon,
                        }}
                    />
                ) : null}
                <View>
                    <Text style={{fontSize: px(14), fontWeight: '600', lineHeight: px(20), marginVertical: px(4)}}>
                        {data?.name}
                    </Text>
                    <Text style={[styles.gray_text, {marginBottom: px(6)}]}>{data?.slogan}</Text>
                    <Text style={styles.gray_text}>
                        <Text
                            style={{
                                fontSize: px(22),
                                lineHeight: px(26),
                                color: Colors.red,
                                fontFamily: Font.numFontFamily,
                            }}>
                            {data?.price}
                        </Text>
                        &nbsp;起
                    </Text>
                </View>
            </View>
            {data?.recommend ? (
                <View style={styles.tip}>
                    <FastImage source={require('../../assets/img/find/mark.png')} style={styles.mark} />
                    <Text style={{color: Colors.yellow, fontSize: px(12), lineHeight: px(17)}}>
                        <Text style={{fontWeight: '600'}}>推荐理由：</Text>
                        {data?.recommend}
                    </Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

export default InsuranceCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        paddingTop: px(16),
        paddingBottom: px(12),
        paddingHorizontal: px(16),
        borderRadius: px(6),
    },
    gray_text: {fontSize: px(12), lineHeight: px(20), color: Colors.lightBlackColor},
    tip: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: px(12),
        paddingVertical: px(6),
        marginTop: px(12),
        borderRadius: px(2),
    },
    mark: {width: px(12), height: px(10), position: 'absolute', left: 0, top: 0},
    card_img: {
        width: px(72),
        height: px(72),
        borderRadius: px(6),
        marginRight: px(12),
    },
});
