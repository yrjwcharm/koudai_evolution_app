/*
 * @Date: 2021-06-07 11:14:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-07 11:22:09
 * @Description:
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors, Style, Space, Font} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '../hooks';
const PortfolioCard = ({data, style}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                jump(data?.url);
            }}
            style={[styles.card, {borderRadius: 8}, Style.flexRow, style]}>
            <View style={{padding: Space.cardPadding, flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.card_title}>{data?.name}</Text>
                    {data?.labels && (
                        <Text style={styles.card_title_dexc}>
                            {data?.labels.map((_data, _index) =>
                                _index == 0 ? <Text key={_index}>{_data}</Text> : <Text key={_index}>｜{_data}</Text>
                            )}
                        </Text>
                    )}
                </View>
                <Text style={[styles.radio, {marginTop: px(16)}]}>{data?.yield?.ratio}</Text>
                <Text style={styles.light_text}>{data?.yield?.title}</Text>
            </View>
            <FastImage
                style={styles.img_icon}
                resizeMode={FastImage.resizeMode.contain}
                source={{
                    uri: data?.background,
                }}
            />
            <View style={{position: 'absolute', right: px(16)}}>
                <FontAwesome name={'angle-right'} size={16} color={'#9095A5'} />
            </View>
        </TouchableOpacity>
    );
};

export default PortfolioCard;

const styles = StyleSheet.create({
    img_icon: {
        width: px(84),
        height: px(80),
        alignSelf: 'flex-end',
    },

    card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    card_title: {
        fontSize: px(15),
        lineHeight: px(21),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginRight: px(10),
    },
    card_title_dexc: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.darkGrayColor,
    },
    radio: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        fontSize: px(22),
        lineHeight: px(26),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginTop: px(4),
    },
});
