/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-27 17:19:23
 * @Description:渲染Html片段
 */
import HTML from 'react-native-render-html';
import React, {Component} from 'react';
import {Dimensions, Text} from 'react-native';
import {px as text} from '../utils/appUtil';
import {useJump} from './hooks';
const width = Dimensions.get('window').width;

const tagsStyles = {
    alink: {color: 'red'},
};

export default class RenderHtml extends Component {
    // state = {
    //   style: this.props.style,
    //   html: this.props.html
    // }
    render() {
        const {numberOfLines = 10000, style, nativeProps} = this.props;
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
                source={{html: this.props.html}}
                imagesMaxWidth={width - text(30)}
                {...nativeProps}
                tagsStyles={tagsStyles}
                renderers={{
                    alink: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                        <Text onPress={() => alert(JSON.parse(htmlAttribs.url).path)}>{children}</Text>
                    ),
                    wrapper: 'Text',
                }}
            />
        );
    }
}
