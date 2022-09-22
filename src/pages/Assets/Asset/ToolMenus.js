/*
 * @Date: 2022-07-13 15:01:25
 * @Description:底部menu
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';

const BottomMenus = ({data}) => {
    const jump = useJump();
    return (
        <View style={[styles.topMenu, Style.flexRow]}>
            {data?.map((item) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={item.tool_id}
                        style={[Style.flexRow, {width: '20%', marginBottom: px(18)}]}
                        onPress={() => {
                            global.LogTool('assetsIconsStart', 'bottom_menus', item.id);
                            jump(item.url);
                        }}>
                        <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                        <Text style={[styles.topMenuTitle]}>{item.text}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BottomMenus;

const styles = StyleSheet.create({
    topMenu: {
        paddingVertical: px(12),
        flexWrap: 'wrap',
        marginBottom: px(20),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    topMenuIcon: {
        width: px(24),
        height: px(24),
        marginBottom: px(4),
    },
    topMenuTitle: {
        fontSize: Font.textH3,
        lineHeight: px(15),
        color: Colors.defaultColor,
    },
});
