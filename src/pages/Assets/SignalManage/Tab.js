/*
 * @Date: 2023-01-09 15:14:38
 * @Description:自定义tab
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const Tab = ({tabs, onPress, current}) => {
    return (
        <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={{flex: 1}}>
            <View style={[Style.flexRow, {paddingHorizontal: Space.padding}]}>
                {tabs?.map((tab, i) => {
                    const {name, type} = tab;
                    const isActive = current === i;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={isActive}
                            key={name + type}
                            onPress={() => {
                                global.LogTool({event: 'recommend_content', oid: type});
                                onPress && onPress(i);
                            }}
                            style={[
                                styles.recommendTab,
                                {
                                    marginLeft: i === 0 ? 0 : px(8),
                                    backgroundColor: isActive ? Colors.brandColor : '#fff',
                                },
                            ]}>
                            <Text
                                style={[
                                    styles.smText,
                                    {
                                        color: isActive ? '#fff' : Colors.defaultColor,
                                        fontWeight: isActive ? Font.weightMedium : '400',
                                    },
                                ]}>
                                {name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default Tab;

const styles = StyleSheet.create({});
