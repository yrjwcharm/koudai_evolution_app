/*
 * @Date: 2023-01-09 15:14:38
 * @Description:自定义tab
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const Tab = ({tabs = [], onPress, current}) => {
    return (
        <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false}>
            <View style={[Style.flexRow]}>
                {tabs?.length > 0
                    ? tabs?.map((tab, i) => {
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
                                          backgroundColor: isActive ? '#DEE8FF' : '#fff',
                                      },
                                  ]}>
                                  <Text
                                      style={[
                                          styles.smText,
                                          {
                                              color: isActive ? Colors.btnColor : Colors.defaultColor,
                                              fontWeight: isActive ? Font.weightMedium : '400',
                                          },
                                      ]}>
                                      {name}
                                  </Text>
                              </TouchableOpacity>
                          );
                      })
                    : null}
            </View>
        </ScrollView>
    );
};

export default Tab;

const styles = StyleSheet.create({
    recommendTab: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
});
