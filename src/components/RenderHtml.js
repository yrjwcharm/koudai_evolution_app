/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-12 19:33:47
 * @Description:渲染Html片段
 */
import HTML from 'react-native-render-html';
import React from 'react';
import {Dimensions, Text} from 'react-native';
import {px as text} from '../utils/appUtil';
import {navigate} from './hooks/RootNavigation';
import {Colors} from '../common/commonStyle';
const width = Dimensions.get('window').width;

const tagsStyles = {
    alink: {color: Colors.btnColor},
};
const RenderHtml = (props) => {
    const {ellipsizeMode = 'tail', numberOfLines = 10000, style, nativeProps} = props;
    const renderers = {
        alink: {
            wrapper: 'Text',
            renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                return (
                    <Text key={children[0][0].key} onPress={() => navigate(JSON.parse(htmlAttribs.url))}>
                        {children}
                    </Text>
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
                ellipsizeMode,
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
