/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-27 22:53:01
 * @Description:渲染Html片段
 */
import HTML from 'react-native-render-html';
import React from 'react';
import {Dimensions, Text} from 'react-native';
import {px as text} from '../utils/appUtil';
// import {useJump} from './hooks';
import {Colors} from '../common/commonStyle';
const width = Dimensions.get('window').width;

const tagsStyles = {
    alink: {color: Colors.btnColor},
};
const RenderHtml = (props) => {
    const {numberOfLines = 10000, style, nativeProps} = props;
    // const jump = useJump();
    const renderers = {
        alink: {
            wrapper: 'Text',
            renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                return (
                    // onPress={() => jump(JSON.parse(htmlAttribs.url))}
                    <Text key={children[0][0].key}>{children}</Text>
                );
            },
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
            debug={false}
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
