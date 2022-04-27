/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-27 21:26:40
 * @Description:弹窗内渲染Html片段
 */
import HTML from 'react-native-render-html';
import React from 'react';
import {Dimensions} from 'react-native';
import {Colors} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
const width = Dimensions.get('window').width;

const tagsStyles = {
    alink: {color: Colors.btnColor},
};
const RenderHtml = (props) => {
    const {numberOfLines = 10000, style, nativeProps} = props;

    return (
        <HTML
            ignoredStyles={['font-family', 'transform', 'display', 'border-style', 'max-width']}
            debug={false}
            defaultTextProps={{
                allowFontScaling: false,
                numberOfLines,
            }}
            baseFontStyle={style}
            source={{html: props.html}}
            imagesMaxWidth={width - px(30)}
            {...nativeProps}
            tagsStyles={tagsStyles}
        />
    );
};
export default RenderHtml;
