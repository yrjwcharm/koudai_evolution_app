/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-03 16:42:35
 * @Description:渲染Html片段
 */
import HTML from 'react-native-render-html';
import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {px as text} from '../utils/appUtil';
const width = Dimensions.get('window').width;
export default class RenderHtml extends Component {
    // state = {
    //   style: this.props.style,
    //   html: this.props.html
    // }
    render() {
        const {numberOfLines = 10000, style} = this.props;
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
            />
        );
    }
}
