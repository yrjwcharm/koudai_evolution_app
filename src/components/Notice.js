/*
 * @Author: xjh
 * @Date: 2021-01-25 11:42:26
 * @Description:小黄条
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-16 22:49:08
 */
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation} from 'react-native';
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
                    style={[Style.flexRow, styles.yellow_wrap_sty]}
                    onPress={() => {
                        jump(props.content?.url);
                    }}>
                    <HTML style={styles.yellow_sty} html={props.content.content} />
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
});

Notice.defaultProps = {
    content: {},
    isClose: false,
};
Notice.propTypes = {
    content: PropTypes.object.isRequired,
    isClose: PropTypes.bool,
};
