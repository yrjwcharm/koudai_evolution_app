/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-27 13:55:52
 * @Description:渲染Html片段
 */
import HTML from 'react-native-render-html';
import React, {Component} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {px as text} from '../utils/appUtil';
const width = Dimensions.get('window').width;
function aLinkRenderer(htmlAttribs, children, convertedCSSStyles, passProps) {
    console.log(JSON.parse(htmlAttribs.url), children);
    return <TouchableOpacity onPress={() => alert(JSON.parse(htmlAttribs.url).path)}>{children}</TouchableOpacity>;
}
const renderers = {
    alink: aLinkRenderer,
};
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
                renderers={renderers}
                tagsStyles={tagsStyles}
            />
        );
    }
}
