/*
 * @Date: 2022-07-02 12:46:35
 * @Description:
 */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';
const HotContent = ({data, style, plateid}) => {
    const jump = useJump();
    return (
        <View style={[styles.shadow, style]}>
            <LinearGradient
                start={{x: 0, y: 0}}
                style={[styles.hot_card]}
                end={{x: 0, y: 0.1}}
                colors={['#FFF0EE', '#FFFFFF']}>
                <View style={Style.flexBetween}>
                    <View style={Style.flexRow}>
                        <Image source={{uri: data?.icon}} style={{marginRight: px(4), width: px(68), height: px(19)}} />
                        <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>{data?.desc}</Text>
                    </View>
                    <Image
                        source={require('~/assets/img/attention/hotFund.png')}
                        style={{width: px(33), height: px(33)}}
                    />
                </View>
                <View style={{marginTop: px(11)}}>
                    {data?.list?.map((_list, _index) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{marginBottom: px(11), ...Style.flexRow}}
                            key={_index}
                            onPress={() => {
                                global.LogTool(
                                    {
                                        event: 'rec_click',
                                        rec_json: JSON.stringify(data?.rec_json),
                                        plateid: data?.plateid,
                                    },
                                    'hot_content',
                                    _list.title
                                );
                                jump(_list.url);
                            }}>
                            <View style={styles.circle} />
                            <Text numberOfLines={1} style={styles.hot_fund_list_title}>
                                {_list.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </LinearGradient>
        </View>
    );
};

export default HotContent;

const styles = StyleSheet.create({
    hot_fund_list_title: {
        color: Colors.defaultColor,
        fontSize: px(13),
    },
    hot_card: {
        padding: px(16),
        borderRadius: px(6),
        paddingTop: px(8),
    },
    shadow: {
        shadowColor: '#9799A1',
        shadowOffset: {h: 10, w: 0},
        shadowRadius: px(6),
        shadowOpacity: 0.1,
    },
    circle: {
        width: px(3),
        height: px(3),
        backgroundColor: Colors.defaultColor,
        marginRight: px(7),
        borderRadius: px(4),
    },
});
