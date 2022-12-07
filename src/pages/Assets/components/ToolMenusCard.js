/*
 * @Date: 2022-07-13 15:01:25
 * @Description:底部menu
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';

const ToolMenusCard = ({data, style}) => {
    const jump = useJump();
    return (
        <View style={[Style.flexRow, styles.topMenu, style]}>
            {data?.map((item) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={item.tool_id}
                        style={[
                            {width: Math.floor((deviceWidth - px(52)) / 5), marginBottom: px(16), alignItems: 'center'},
                        ]}
                        onPress={() => {
                            if (item?.tip) {
                                global.LogTool('guide_click', item?.text, item.tool_id);
                            } else {
                                global.LogTool('icon_click', item?.text, item.tool_id);
                            }
                            jump(item.url);
                        }}>
                        <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                        <Text style={[styles.topMenuTitle]}>{item.text}</Text>
                        {item?.tip ? (
                            item?.tip?.is_number ? (
                                <View style={styles.numberTip}>
                                    <Text style={{fontSize: px(8), color: '#fff', lineHeight: px(11)}}>
                                        {item?.tip?.desc}
                                    </Text>
                                </View>
                            ) : !item?.tip?.desc ? (
                                <View style={styles.circleTip} />
                            ) : (
                                <View style={styles.tip}>
                                    <Text style={{fontSize: px(8), color: '#fff', lineHeight: px(11)}}>
                                        {item?.tip?.desc}
                                    </Text>
                                </View>
                            )
                        ) : null}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default ToolMenusCard;

const styles = StyleSheet.create({
    topMenu: {
        paddingTop: px(16),
        flexWrap: 'wrap',
        marginBottom: px(12),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        paddingHorizontal: px(10),
        alignItems: 'flex-start',
    },
    topMenuIcon: {
        width: px(24),
        height: px(24),
        marginBottom: px(8),
    },
    topMenuTitle: {
        fontSize: Font.textSm,
        lineHeight: px(15),
    },
    tip: {
        position: 'absolute',
        backgroundColor: Colors.red,
        borderRadius: px(4),
        paddingVertical: px(1),
        paddingHorizontal: px(3),
        borderBottomLeftRadius: 0,
        right: px(-10),
        top: px(-5),
    },
    circleTip: {
        position: 'absolute',
        backgroundColor: Colors.red,
        borderRadius: px(8),
        width: px(8),
        height: px(8),
        right: px(16),
        top: px(0),
    },
    numberTip: {
        position: 'absolute',
        backgroundColor: Colors.red,
        borderRadius: px(8),
        padding: px(2),
        right: px(10),
        top: px(-8),
    },
});
