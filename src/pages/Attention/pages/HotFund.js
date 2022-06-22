/*
 * @Date: 2022-06-21 16:07:16
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-21 20:34:45
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Feather from 'react-native-vector-icons/Feather';
const HotFund = ({data}) => {
    const {body, footer} = data;
    const jump = useJump();
    return (
        <View>
            <View style={styles.card}>
                <View style={[Style.flexBetween, {flexWrap: 'wrap'}]}>
                    {body?.list?.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                Style.flexRow,
                                {alignItems: 'flex-start', width: px(148), height: px(40), marginBottom: px(16)},
                            ]}>
                            <TouchableOpacity style={{height: px(20), marginTop: px(2), width: px(18)}}>
                                <AntDesign name={'checkcircle'} size={px(14)} color={Colors.btnColor} />
                            </TouchableOpacity>
                            <View style={styles.itemRight}>
                                <Text style={styles.fund_name} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={{fontSize: px(11)}}>
                                    HotFund
                                    <Text style={{fontSize: px(13)}}>12%</Text>
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <Button title={body?.button?.text} style={styles.card_button} />
            </View>
            {/* 底部按钮 */}
            <View style={Style.flexBetween}>
                {footer?.button_list?.map((button, index) => (
                    <TouchableOpacity
                        style={styles.bottomBtn}
                        key={index}
                        onPress={() => {
                            jump(button?.url);
                        }}>
                        <Feather size={px(18)} name={button.icon == 'SearchFollow' ? 'search' : 'plus-circle'} />
                        <Text style={{fontSize: px(16), fontWeight: '700', marginLeft: px(4)}}>{button?.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HotFund;

const styles = StyleSheet.create({
    card: {
        padding: px(20),
        borderRadius: px(6),
        backgroundColor: '#fff',
        marginBottom: px(20),
    },
    itemRight: {
        flex: 1,
        height: px(40),
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    fund_name: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    card_button: {borderRadius: px(314), marginHorizontal: px(51), marginTop: px(20)},
    bottomBtn: {
        width: px(164),
        height: px(48),
        ...Style.flexRowCenter,
        backgroundColor: '#fff',
        borderRadius: px(6),
    },
});
