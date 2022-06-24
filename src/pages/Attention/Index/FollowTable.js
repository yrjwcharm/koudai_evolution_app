/*
 * @Date: 2022-06-22 10:25:59
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-23 17:54:25
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';

const FollowTable = ({data = {}}) => {
    const {body, header} = data;
    return (
        <>
            {body ? (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{minWidth: '100%'}}>
                        <View style={[styles.tr, {height: px(47)}]}>
                            <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                {body?.th &&
                                    body?.th?.map((_item, index) => (
                                        <View
                                            style={[
                                                {
                                                    width: index == 0 ? px(130) : px(80),
                                                    alignItems: index == 0 ? 'flex-start' : 'center',
                                                },
                                            ]}
                                            key={index}>
                                            <View>
                                                <View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            fontSize: index == 0 ? px(14) : px(12),
                                                            color: Colors.lightBlackColor,
                                                        }}>
                                                        {_item?.line?.title}
                                                    </Text>
                                                    {_item?.line?.desc ? (
                                                        <Text style={styles.th_line_desc}>{_item?.line?.desc}</Text>
                                                    ) : null}
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                            </View>
                        </View>
                        {/* tr */}
                        {body?.tr?.map((tr, index) => (
                            <View style={[styles.tr]}>
                                <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                    {tr.map((item, _index) => (
                                        <View
                                            key={_index}
                                            style={[
                                                {
                                                    width: _index == 0 ? px(130) : px(80),
                                                    alignItems: _index == 0 ? 'flex-start' : 'center',
                                                },
                                            ]}>
                                            {/* 每一个td */}
                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        {
                                                            color: item?.line1?.color || Colors.lightBlackColor,

                                                            fontSize: px(14),
                                                        },
                                                        _index != 0 && {fontFamily: Font.numFontFamily},
                                                    ]}>
                                                    {item?.line1?.value}
                                                </Text>
                                                {item?.line2 ? (
                                                    <Text
                                                        style={{
                                                            color: item?.line2?.color || Colors.lightBlackColor,
                                                            fontFamily: Font.numFontFamily,
                                                            fontSize: px(14),
                                                            marginTop: px(2),
                                                        }}>
                                                        {item?.line2?.value}
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : null}
        </>
    );
};

export default FollowTable;

const styles = StyleSheet.create({
    // td:{
    //     width
    // },
    tr: {
        paddingVertical: px(12),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        height: px(58),
    },
    th_line_desc: {
        color: Colors.lightGrayColor,
        fontSize: px(10),
        marginTop: px(2),
    },
});
