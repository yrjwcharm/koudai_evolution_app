/*
 * @Date: 2022-06-13 12:19:36
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-14 18:09:52
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {px} from '../../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../../common/commonStyle';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {useJump} from '~/components/hooks';
import {getColor} from './utils';
import RenderHtml from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {debounce} from 'lodash';
const SearchContent = ({data}) => {
    const [favor, setFavor] = useState(data.favor);
    const jump = useJump();
    const onFavor = useCallback(
        debounce(
            () => {
                setFavor((_favor) => {
                    if (_favor) {
                        followCancel({item_id: data.code_id, item_type: data.item_type || 1}).then((res) => {
                            res.message && Toast.show(res.message);
                        });
                    } else {
                        followAdd({item_id: data.code_id, item_type: data.item_type || 1}).then((res) => {
                            res.message && Toast.show(res.message);
                        });
                    }
                    return !_favor;
                });
            },
            500,
            {leading: true, trailing: false}
        ),
        []
    );
    return (
        <TouchableOpacity style={[styles.con, Style.flexBetween]} onPress={() => jump(data.url)} activeOpacity={0.9}>
            <View style={{maxWidth: '60%'}}>
                <View style={Style.flexRow}>
                    <RenderHtml html={data?.name} style={styles.title} numberOfLines={1} />
                    <Text style={styles.code}>{data?.code}</Text>
                </View>
                <Text style={[styles.rate, {color: getColor(parseFloat(data?.yield_info?.ratio))}]}>
                    {data?.yield_info?.ratio}
                </Text>
                <Text style={styles.rateDesc}>{data?.yield_info?.title}</Text>
            </View>
            <View style={Style.flexRow}>
                <TouchableOpacity
                    style={[styles.pkBtn, Style.flexCenter, {borderColor: favor ? '#BDC2CC' : Colors.brandColor}]}
                    onPress={onFavor}
                    activeOpacity={0.8}>
                    <Text
                        style={[
                            {fontSize: Font.textH3, lineHeight: px(17)},
                            {color: favor ? '#BDC2CC' : Colors.brandColor},
                        ]}>
                        {favor ? '已自选' : '+自选'}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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
        marginLeft: px(6),
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
        paddingVertical: px(3),
        paddingHorizontal: px(14),
        borderWidth: Space.borderWidth,
        borderRadius: px(103),
    },
});
