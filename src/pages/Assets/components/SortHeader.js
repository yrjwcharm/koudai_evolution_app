/*
 * @Date: 2023-01-10 14:28:35
 * @Description:
 */

import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import sortImg from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import RenderHtml from '~/components/RenderHtml';
const SortHeader = ({data = [], onSort, style}) => {
    return (
        <View style={[styles.portCard, Style.flexRow, style]}>
            {data?.map((head, index) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => onSort(head)}
                    style={{
                        flex: index == 0 ? 1.4 : 1,
                        ...Style.flexRow,
                        justifyContent: index == 0 ? 'flex-start' : 'flex-end',
                    }}>
                    <Text style={{color: Colors.lightGrayColor, fontSize: px(11)}}>{head.text}</Text>
                    {head?.sort_key && (
                        <Image
                            source={head?.sort_type == '' ? sortImg : head?.sort_type == 'asc' ? sortUp : sortDown}
                            style={styles.sortImg}
                        />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SortHeader;

const styles = StyleSheet.create({
    sortImg: {
        width: px(6),
        height: px(10),
        marginLeft: px(1),
        marginBottom: px(-2),
    },
    portCard: {
        backgroundColor: '#fff',
        padding: px(12),
        borderRadius: px(6),
    },
});
