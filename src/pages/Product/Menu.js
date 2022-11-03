/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-03 11:28:51
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';

const Menu = ({proData, bgType}) => {
    const jump = useJump();
    return (
        <View style={styles.menuWrap}>
            {proData?.nav?.map?.((item, idx) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            jump(item.url);
                            global.LogTool({
                                event: item.event_id,
                            });
                        }}
                        style={styles.menuItem}
                        key={idx}>
                        <FastImage
                            source={{
                                uri: item.icon,
                            }}
                            style={styles.menuItemIcon}
                        />
                        <Text style={[styles.menuItemText, {color: bgType ? '#121d3a' : '#fff'}]}>{item.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default Menu;

const styles = StyleSheet.create({
    menuWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: px(28),
        marginTop: px(8),
    },
    menuItem: {
        justifyContent: 'center',
    },
    menuItemIcon: {
        width: px(26),
        height: px(26),
    },
    menuItemText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#fff',
        marginTop: px(7),
        textAlign: 'center',
    },
});
