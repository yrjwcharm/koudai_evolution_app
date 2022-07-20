/*
 * @Date: 2022-07-19 10:54:46
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useJump} from '~/components/hooks';
import {Colors, Space, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const YellowNotice = ({data}) => {
    const jump = useJump();
    return data?.map((system, index, arr) => (
        <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            style={styles.systemMsgContainer}
            onPress={() => {
                system?.log_id && global.LogTool(system?.log_id);
                jump(system?.button?.url);
            }}>
            <View
                style={[
                    Style.flexBetween,
                    {
                        paddingTop: px(8),
                        paddingBottom: px(12),
                    },
                    arr.length > 1 && index != arr.length - 1
                        ? {
                              borderBottomColor: '#F7CFB2',
                              borderBottomWidth: 0.5,
                          }
                        : {},
                ]}>
                <Text style={styles.systemMsgText} numberOfLines={arr.length > 1 ? 2 : 100}>
                    {system?.desc}
                </Text>
                {system?.button ? (
                    <View style={styles.btn}>
                        <Text style={styles.btn_text}>{system?.button?.text}</Text>
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    ));
};

export default YellowNotice;

const styles = StyleSheet.create({
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.marginAlign,
    },
    systemMsgText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.yellow,
        textAlign: 'justify',
        flex: 1,
    },
});
