/*
 * @Date: 2021-06-07 11:14:13
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-21 21:08:54
 * @Description:
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors, Style, Space, Font} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '../hooks';
import {Chart, chartOptions} from '../Chart';
import RenderHtml from '../RenderHtml';
const PortfolioCard = ({data, style, onPress}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                global.LogTool('findProduct', data?.plan_id);
                jump(data?.url);
                onPress?.();
            }}
            style={[styles.card, {borderRadius: 8}, Style.flexRow, style]}>
            <View style={{padding: Space.cardPadding, flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.card_title}>{data?.name}</Text>
                    {data?.labels && (
                        <View style={Style.flexRow}>
                            {data?.labels.map((_data, _index) => (
                                <RenderHtml style={styles.card_title_dexc} html={_data} key={_index} />
                            ))}
                        </View>
                    )}
                </View>
                {data.yield ? (
                    <>
                        <Text style={[styles.ratio, {marginTop: px(16)}]}>{data.yield?.ratio}</Text>
                        <Text style={styles.light_text}>{data.yield?.title}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.large_text}>{data?.desc}</Text>
                        <Text style={styles.light_text}>{data?.slogan}</Text>
                    </>
                )}
            </View>
            {data?.background ? (
                <FastImage
                    style={styles.img_icon}
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                        uri: data?.background,
                    }}
                />
            ) : null}
            {data?.yield?.chart && (
                <View
                    style={{
                        height: px(60),
                        width: px(80),
                        marginTop: px(14),
                        marginRight: px(16),
                    }}>
                    <Chart initScript={chartOptions.smChart(data?.yield?.chart)} />
                </View>
            )}
            {data?.hide_arrow ? null : (
                <View style={{position: 'absolute', right: px(16)}}>
                    <FontAwesome name={'angle-right'} size={16} color={'#9095A5'} />
                </View>
            )}
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
    large_text: {
        marginTop: px(16),
        marginBottom: px(2),
        fontSize: px(18),
        color: Colors.red,
        lineHeight: px(25),
    },
    ratio: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        fontSize: px(22),
        lineHeight: px(26),
    },
});
