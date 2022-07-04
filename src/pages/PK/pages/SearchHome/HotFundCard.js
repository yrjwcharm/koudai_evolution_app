/*
 * @Date: 2022-07-02 12:46:35
 * @Description:
 */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import {useJump} from '~/components/hooks';
import {getColor} from './utils';
const HotFundCard = ({data, style, onPress}) => {
    const jump = useJump();
    return (
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 0.1}}
            style={[styles.hot_card, style]}
            colors={['#FFF0EE', '#FFFFFF']}>
            <View style={Style.flexBetween}>
                <View style={Style.flexRow}>
                    <Image source={{uri: data?.icon}} style={{marginRight: px(2), width: px(68), height: px(19)}} />
                    <Text style={{color: '#3D3D3D', fontSize: px(12)}}>{data?.desc}</Text>
                </View>
                <Image source={require('~/assets/img/attention/hotFund.png')} style={{width: px(33), height: px(33)}} />
            </View>
            <View
                style={{
                    ...Style.flexBetween,
                    flexWrap: 'wrap',
                }}>
                {data?.list?.map((_list, _index) => (
                    <TouchableOpacity
                        style={{width: px(148), marginBottom: px(16)}}
                        key={_index}
                        onPress={() => jump(_list.url)}>
                        <Text numberOfLines={1} style={styles.hot_fund_list_title}>
                            {_list.name}
                        </Text>
                        <Text
                            style={{
                                color: getColor(_list?.yield_info?.yield),
                                fontSize: px(13),
                            }}>
                            <Text style={{fontSize: px(11), color: Colors.lightGrayColor}}>
                                {_list?.yield_info?.title}
                            </Text>
                            {''} {''} {''}
                            {_list?.yield_info?.ratio}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </LinearGradient>
    );
};

export default HotFundCard;

const styles = StyleSheet.create({
    hot_fund_list_title: {
        color: Colors.defaultColor,
        fontSize: px(13),
        marginBottom: px(6),
    },
    hot_card: {padding: px(16), borderRadius: px(6), paddingTop: px(8)},
});