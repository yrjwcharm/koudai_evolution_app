/*
 * @Date: 2022-09-22 21:30:06
 * @Description:投顾观点 重要观点
 */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
const PointCard = ({data, style}) => {
    const {icon, list, number, url} = data;
    const jump = useJump();
    return (
        <View style={[styles.card, style]}>
            <TouchableOpacity
                style={[
                    Style.flexBetween,
                    {
                        height: px(40),
                        borderBottomColor: Colors.borderColor,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    },
                ]}
                onPress={() => {
                    global.LogTool('guide_click', '重要观点-标题', data?.log_id);
                    jump(url);
                }}
                activeOpacity={0.8}>
                <View style={Style.flexRow}>
                    <Image source={{uri: icon}} style={{width: px(56), height: px(20)}} />
                    <Text style={{fontWeight: '600'}}>
                        {''} ({number})
                    </Text>
                </View>
                <Image source={require('~/assets/personal/arrowRight.png')} style={{width: px(12), height: px(12)}} />
            </TouchableOpacity>
            <View style={{paddingBottom: px(6), paddingTop: px(12)}}>
                {list?.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        style={[Style.flexRow, {marginBottom: px(12)}]}
                        onPress={() => {
                            global.LogTool('guide_click', `重要观点${index + 1}`, data?.log_id);
                            jump(item.url);
                        }}>
                        <View style={styles.circle} />
                        <Text numberOfLines={1} style={{flex: 1, lineHeight: px(17), fontSize: px(12)}}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default PointCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        marginHorizontal: px(16),
        borderRadius: px(6),
        marginBottom: px(12),
    },
    circle: {
        backgroundColor: '#000',
        width: px(3),
        height: px(3),
        borderRadius: px(2),
        marginRight: px(7),
    },
});
