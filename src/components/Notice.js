/*
 * @Author: xjh
 * @Date: 2021-01-25 11:42:26
 * @Description:小黄条
 * @LastEditors: yhc
 * @LastEditTime: 2022-05-05 15:16:12
 */
import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {px as text, px} from '../utils/appUtil';
import {Space, Style} from '../common/commonStyle';
import {useJump} from './hooks';
import HTML from '../components/RenderHtml';
export default function Notice(props) {
    const jump = useJump();
    return (
        <View style={styles.yellow_wrap_sty}>
            {props.content && Array.isArray(props.content) ? (
                props.content?.map((item, index, arr) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            style={[
                                Style.flexBetween,
                                {
                                    paddingVertical: px(8),
                                },
                                arr.length > 1 && index != arr.length - 1
                                    ? {
                                          borderBottomColor: '#F7CFB2',
                                          borderBottomWidth: px(0.5),
                                      }
                                    : {},
                                props.style,
                            ]}
                            onPress={() => {
                                item?.log_id && global.LogTool(item?.log_id);
                                jump(item?.button?.url);
                            }}>
                            <View style={{flex: 1}}>
                                <Text style={styles.yellow_sty} numberOfLines={arr.length > 1 ? 2 : 100}>
                                    {item?.desc}
                                </Text>
                            </View>
                            {item?.button ? (
                                <View style={styles.btn}>
                                    <Text style={styles.btn_text}>{item?.button?.text}</Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    );
                })
            ) : props.content?.content ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                        Style.flexBetween,
                        {
                            paddingVertical: px(8),
                        },
                        props.style,
                    ]}
                    onPress={() => {
                        props.content?.log_id && global.LogTool(props.content?.log_id);
                        jump(props.content?.url);
                    }}>
                    <HTML style={styles.yellow_sty} html={props.content.content} />
                    {props.content?.button ? (
                        <View style={styles.btn}>
                            <Text style={styles.btn_text}>{props.content?.button?.text}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.padding,
    },
    yellow_sty: {
        color: '#EB7121',
        paddingVertical: text(5),
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
    btn: {
        borderRadius: px(14),
        paddingVertical: px(4),
        paddingHorizontal: px(10),
        backgroundColor: '#FF7D41',
        marginLeft: px(12),
    },
    btn_text: {
        fontWeight: '600',
        color: '#fff',
        fontSize: px(12),
        lineHeight: px(17),
    },
});

Notice.defaultProps = {
    content: {},
    isClose: false,
};
Notice.propTypes = {
    content: PropTypes.object.isRequired,
    isClose: PropTypes.bool,
};
