/*
 * @Date: 2022-06-14 10:55:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-14 11:15:58
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {px} from '../../../utils/appUtil';
import {Style} from '../../../common/commonStyle';

const BlancedPortfolio = () => {
    return (
        <ScrollView>
            <Header />
        </ScrollView>
    );
};
const Header = () => {
    const [active, setActive] = useState(0);
    return (
        <View style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
            <View style={[styles.tab_con, Style.flexBetween]}>
                <TouchableOpacity style={[styles.activeButton, Style.flexCenter]}>
                    <Text>13</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>13</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default BlancedPortfolio;

const styles = StyleSheet.create({
    tab_con: {
        backgroundColor: '#f4f4f4',
        borderRadius: px(6),
        paddingHorizontal: px(4),
        height: px(44),
    },
    activeButton: {
        backgroundColor: '#fff',
        width: px(166),
        borderRadius: px(6),
        height: px(34),
    },
});
