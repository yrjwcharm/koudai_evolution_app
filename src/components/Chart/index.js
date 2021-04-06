/*
 * @Date: 2021-01-28 17:56:12
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-06 12:58:22
 * @Description:
 */
import React, {PureComponent, createRef} from 'react';
import {StyleSheet, Platform, View, Text} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import * as chartOptions from './chartOptions';
import _ from 'lodash';
const changeData = (data) => `chart.changeData(${JSON.stringify(data)});`;

const source = Platform.select({
    ios: require('./f2chart.html'),
    android: {uri: 'file:///android_asset/f2chart.html'},
});

// type Props = {
//     initScript: string,
//     data?: Array<Object>,
//     onChange?: Function,
//     webView?: any,
// };

class Chart extends PureComponent {
    static defaultProps = {
        onChange: () => {},
        initScript: '',
        data: [],
        webView: RNWebView,
    };

    constructor(props) {
        super(props);
        this.chart = createRef();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {data} = this.props;
        if (!_.isEqual(data, nextProps.data)) {
            this.update(nextProps.data);
        }
    }

    update = (data) => {
        this.chart.current.injectJavaScript(changeData(data));
    };

    onMessage = (event) => {
        const {
            nativeEvent: {data},
        } = event;
        const {onChange, onHide} = this.props;
        const tooltip = JSON.parse(data);
        tooltip.type === 'onChange' && onChange && onChange(tooltip.obj);
        tooltip.type === 'onHide' && onHide && onHide(tooltip.obj);
    };

    render() {
        const {webView: WebView, data, onChange, initScript, ...props} = this.props;
        return (
            <WebView
                javaScriptEnabled
                ref={this.chart}
                scrollEnabled={false}
                style={styles.webView}
                injectedJavaScript={initScript}
                source={source}
                startInLoadingState={true}
                originWhitelist={['*']}
                onMessage={this.onMessage}
                {...props}
            />
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
        // height: 300,
        // backgroundColor: 'transparent',
    },
});

export {Chart, chartOptions};
