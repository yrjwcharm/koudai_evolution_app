/*
 * @Date: 2021-01-07 12:15:57
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-24 18:38:57
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
                    'fontFamily',
                    'transform',
                    'display',
                    'borderStyle',
                    'maxWidth',
                    // 'default-src',
                    // 'loadingIndicatorSrc',
                ]}
                debug={false}
                defaultTextProps={{
                    allowFontScaling: false,
                    numberOfLines,
                }}
                baseStyle={style}
                source={{html: this.props.html}}
            />
        );
    }
}
