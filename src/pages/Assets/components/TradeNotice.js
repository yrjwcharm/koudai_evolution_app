/*
 * @Date: 2022-09-23 19:14:14
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px} from '~/utils/appUtil';
const TradeNotice = ({data, style, textStyle, iconColor}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.noticeBox, Style.flexRow, style]}
            onPress={() => {
                global.LogTool('click', 'tradeMsg');
                jump(data.url);
            }}>
            <Text style={[styles.noticeText, textStyle]}>{data?.desc}</Text>
            <FontAwesome name={'angle-right'} size={16} color={iconColor || '#fff'} />
        </TouchableOpacity>
    );
};

export default TradeNotice;

const styles = StyleSheet.create({
    noticeBox: {
        marginTop: px(12),
        paddingVertical: px(7),
        paddingHorizontal: px(12),
        backgroundColor: 'rgba(157, 187, 255, 0.68)',
        borderRadius: px(4),
        width: '100%',
    },
    noticeText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        marginRight: px(4),
    },
});
