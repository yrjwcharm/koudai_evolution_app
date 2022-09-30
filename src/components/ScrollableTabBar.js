/*
 * @Description: 适用于ScrollableTabView的TabBar
 * @Autor: wxp
 * @Date: 2022-09-30 17:13:41
 */

/** 
   使用方式
   <ScrollableTabView
      ...
      renderTabBar={() => (
          <ScrollableTabBar />
      }
  >
 */
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {px} from '~/utils/appUtil';

const ScrollableTabBar = (props) => {
    return (
        <View style={styles.optionalTabsWrap}>
            {props.tabs.map((item, idx) => (
                <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    style={[
                        styles.optionalTabWrap,
                        {
                            backgroundColor: props.activeTab === idx ? '#0051CC' : '#fff',
                        },
                        {marginLeft: idx > 0 ? px(8) : 0},
                    ]}
                    onPress={() => {
                        props.goToPage(idx);
                    }}>
                    <Text style={[styles.optionalTabText, {color: props.activeTab === idx ? '#fff' : '#121D3A'}]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ScrollableTabBar;

const styles = StyleSheet.create({
    optionalTabsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionalTabWrap: {
        borderRadius: px(20),
        paddingHorizontal: px(12),
        paddingVertical: px(6),
    },
    optionalTabText: {
        fontSize: px(11),
        lineHeight: px(15),
    },
});
