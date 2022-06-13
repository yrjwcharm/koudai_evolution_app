/*
 * @Date: 2022-06-13 12:19:36
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-13 17:24:30
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {px} from '../../../../utils/appUtil';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import collectActive from '@/assets/img/pk/pkcollectActive.png';
import collect from '@/assets/img/pk/pkcollect.png';
const SearchContent = () => {
    return (
        <View style={[styles.con, Style.flexBetween]}>
            <View>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>SearchContent</Text>
                    <Text style={styles.code}>000000</Text>
                </View>
                <Text style={styles.rate}>+2.23%</Text>
                <Text style={styles.rateDesc}>近一年收益率</Text>
            </View>
            <View style={Style.flexRow}>
                <TouchableOpacity>
                    <Image source={collect} style={{width: px(26), height: px(26)}} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pkBtn, Style.flexCenter]}>
                    <Text style={{color: '#fff'}}>PK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SearchContent;

const styles = StyleSheet.create({
    con: {
        paddingVertical: px(11),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.4,
    },
    title: {fontSize: px(14), lineHeight: px(20), marginRight: px(6)},
    code: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.darkGrayColor,
    },
    rate: {
        marginTop: px(8),
        fontWeight: '700',
        fontFamily: Font.numMedium,
        fontSize: px(20),
        lineHeight: px(24),
    },
    rateDesc: {
        marginTop: px(2),
        fontSize: px(11),
        lineHeight: px(16),
        color: Colors.darkGrayColor,
    },
    pkBtn: {
        backgroundColor: '#0051CC',
        borderRadius: px(103),
        width: px(50),
        height: px(26),
        marginLeft: px(12),
    },
});
