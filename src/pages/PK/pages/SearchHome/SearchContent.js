/*
 * @Date: 2022-06-13 12:19:36
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-01 15:49:47
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {px} from '../../../../utils/appUtil';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import collectActive from '~/assets/img/pk/pkcollectActive.png';
import collect from '~/assets/img/pk/pkcollect.png';
import {followAdd} from '~/pages/Attention/Index/service';
const SearchContent = ({data}) => {
    const [favor, setFavor] = useState(data.favor);
    const onFavor = () => {
        setFavor((_favor) => !_favor);
        followAdd({item_id: data.code});
    };
    const onPk = () => {};
    return (
        <View style={[styles.con, Style.flexBetween]}>
            <View style={{maxWidth: '60%'}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {data?.name}
                    </Text>
                    <Text style={styles.code}>{data?.code}</Text>
                </View>
                <Text style={styles.rate}>{data?.yield_info?.ratio}</Text>
                <Text style={styles.rateDesc}>{data?.yield_info?.title}</Text>
            </View>
            <View style={Style.flexRow}>
                <TouchableOpacity onPress={onFavor}>
                    <Image source={favor ? collect : collectActive} style={{width: px(26), height: px(26)}} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pkBtn, Style.flexCenter]} onPress={onPk}>
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
