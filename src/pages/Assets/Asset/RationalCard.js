/*
 * @Date: 2022-07-12 14:12:07
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const shadow = {
    color: '#E3E6EE',
    border: 8,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 2,
};
const RationalCard = () => {
    return (
        <View style={[Style.flexBetween, {marginBottom: px(20), marginHorizontal: px(16)}]}>
            <BoxShadow setting={{...shadow, width: px(166), height: px(63)}}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[Style.flexBetween, styles.secure_card]}
                    onPress={() => {
                        // jump(item?.url);
                    }}>
                    <View style={{flex: 1}}>
                        <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                            {/* <FastImage
                                resizeMode={FastImage.resizeMode.contain}
                                style={{width: px(24), height: px(24)}}
                                source={{uri: item.icon}}
                            /> */}
                            <Text style={[styles.secure_title, {marginLeft: px(4)}]}>
                                {'理性等级'}
                                {''} {''}
                            </Text>
                            <FontAwesome name={'angle-right'} size={18} color="#71A4FF" />
                        </View>
                        <Text style={{fontSize: px(12), lineHeight: px(17), color: Colors.lightGrayColor}}>
                            {'理性等级'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </BoxShadow>
            <BoxShadow setting={{...shadow, width: px(166), height: px(63)}}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[Style.flexBetween, styles.secure_card]}
                    onPress={() => {
                        // jump(item?.url);
                    }}>
                    <View style={{flex: 1}}>
                        <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                            {/* <FastImage
                                resizeMode={FastImage.resizeMode.contain}
                                style={{width: px(24), height: px(24)}}
                                source={{uri: item.icon}}
                            /> */}
                            <Text style={[styles.secure_title, {marginLeft: px(4)}]}>
                                {'理性等级'}
                                {''} {''}
                            </Text>
                            <FontAwesome name={'angle-right'} size={18} color="#71A4FF" />
                        </View>
                        <Text style={{fontSize: px(12), lineHeight: px(17), color: Colors.lightGrayColor}}>
                            {'理性等级'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </BoxShadow>
        </View>
    );
};

export default RationalCard;

const styles = StyleSheet.create({
    secure_card: {
        width: px(166),
        paddingVertical: px(12),
        paddingHorizontal: px(14),
        height: px(63),
        borderRadius: px(6),
        backgroundColor: '#fff',
    },
    secure_title: {
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: '700',
        color: Colors.defaultColor,
    },
});
