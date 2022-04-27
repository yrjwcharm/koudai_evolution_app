/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-27 19:01:56
 * @Description:渲染Html片段
 */
import HTML from 'react-native-render-html';
import React from 'react';
import {Dimensions, Text} from 'react-native';
import {px as text} from '../utils/appUtil';
import {useJump} from './hooks';
import {Colors} from '../common/commonStyle';
const width = Dimensions.get('window').width;

const tagsStyles = {
    alink: {color: Colors.btnColor},
};
const RenderHtml = (props) => {
    const {numberOfLines = 10000, style, nativeProps} = props;
    const jump = useJump();
    const renderers = {
        alink: {
            wrapper: 'Text',
            renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                <Text onPress={() => jump(JSON.parse(htmlAttribs.url))}>{children}</Text>
            ),
        },
    };
    return (
        <HTML
            ignoredStyles={[
                'font-family',
                'transform',
                'display',
                'border-style',
                'max-width',
                // 'default-src',
                // 'loadingIndicatorSrc',
            ]}
            debug={true}
            defaultTextProps={{
                allowFontScaling: false,
                numberOfLines,
            }}
            baseFontStyle={style}
            source={{html: props.html}}
            imagesMaxWidth={width - text(30)}
            {...nativeProps}
            tagsStyles={tagsStyles}
            renderers={renderers}
        />
    );
};
export default RenderHtml;
