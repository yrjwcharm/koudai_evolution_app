/*
 * @Author: xjh
 * @Date: 2021-02-20 10:33:13
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-20 10:51:53
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function RemindMessage() {
    const [hide, setHide] = useState(false);
    const closeNotice = () => {
        setHide(true);
    };
    return (
        <View>
            {!hide && (
                <View style={[Style.flexRow, styles.yellow_wrap_sty]}>
                    <Text style={styles.yellow_sty}>开启消息通知，避免错过调仓加仓消息</Text>
                    <TouchableOpacity
                        style={{backgroundColor: '#EB7121', borderRadius: text(15), marginRight: text(10)}}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: text(13),
                                paddingHorizontal: text(10),
                                paddingVertical: text(5),
                            }}>
                            开启
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => closeNotice()}>
                        <AntDesign name={'close'} size={12} color={'#EB7121'} />
                    </TouchableOpacity>
                </View>
            )}
            <Text>RemindMessage</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.padding,
    },
    yellow_sty: {
        color: '#EB7121',
        paddingVertical: text(10),
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
});
