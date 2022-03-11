/*
 * @Date: 2022-03-11 17:01:58
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-11 17:54:02
 * @Description:投顾观点
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {px} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import {useJump} from '../hooks';

const InvestPointCard = ({data, style}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            style={[Style.card, style]}
            activeOpacity={0.9}
            onPress={() => {
                jump(data.url);
            }}>
            <View style={Style.flexBetween}>
                <Image source={{uri: data?.cate_icon}} style={{width: px(100), height: px(22)}} />
                <Text style={styles.time}>{data?.published_at}</Text>
            </View>
            <Text numberOfLines={2} style={[Style.title, {marginTop: px(12)}]}>
                {data?.title}
            </Text>
            <Text numberOfLines={2} style={[Style.title_desc, {marginTop: px(8)}]}>
                {data?.desc}
            </Text>
            {data?.blogger ? (
                <View style={[Style.flexRow, {marginTop: px(8)}]}>
                    <Image source={{uri: data?.blogger?.avatar}} style={styles.card_avatar} />
                    <Text style={[Style.title_desc, {fontSize: px(13)}]}>{data?.blogger?.nickname}</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

export default InvestPointCard;

const styles = StyleSheet.create({
    time: {
        color: Colors.defaultColor,
        fontSize: px(11),
        paddingVertical: px(3),
        paddingHorizontal: px(5),
        borderRadius: px(6),
        backgroundColor: Colors.bgColor,
    },
    card_avatar: {
        width: px(24),
        height: px(24),
        borderRadius: px(12),
        marginRight: px(8),
        borderWidth: 0.5,
        borderColor: '#DEDEDE',
    },
});
