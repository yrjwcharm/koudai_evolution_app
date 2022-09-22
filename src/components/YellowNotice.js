/*
 * @Date: 2022-07-19 10:54:46
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useJump} from '~/components/hooks';
import {Colors, Space, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import AntdD from 'react-native-vector-icons/AntDesign';
const YellowNotice = ({data}) => {
    const jump = useJump();
    return data?.map((system, index, arr) => (
        <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            style={[styles.systemMsgContainer, arr.length > 1 && {marginBottom: px(12)}]}
            onPress={() => {
                system?.log_id && global.LogTool(system?.log_id);
                jump(system?.url);
            }}>
            <View
                style={[
                    Style.flexBetween,
                    {
                        paddingVertical: px(8),
                    },
                ]}>
                <Text style={styles.systemMsgText} numberOfLines={arr.length > 1 ? 2 : 100}>
                    {system?.desc}
                </Text>
                {system?.can_close && (
                    <TouchableOpacity style={{alignSelf: 'flex-start', right: -px(8)}}>
                        <AntdD name="close" size={px(16)} color={Colors.yellow} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    ));
};

export default YellowNotice;

const styles = StyleSheet.create({
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.marginAlign,
        marginHorizontal: px(16),
    },
    systemMsgText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.yellow,
        textAlign: 'justify',
        flex: 1,
    },
});
