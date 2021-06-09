/*
 * @Author: xjh
 * @Date: 2021-01-25 11:42:26
 * @Description:小黄条
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-09 17:13:52
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
        <>
            {props.content?.content ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[Style.flexBetween, styles.yellow_wrap_sty, props.style]}
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
        </>
    );
}

const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.padding,
        paddingVertical: px(8),
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
        paddingVertical: px(5),
        paddingHorizontal: px(10),
        backgroundColor: '#FF7D41',
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
