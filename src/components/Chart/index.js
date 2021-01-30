/*
 * @Date: 2021-01-28 17:56:12
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-29 10:58:35
 * @Description:
 */
import React, {PureComponent, createRef} from 'react';
import {StyleSheet, Platform, View, Text} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import * as chartOptions from './chartOptions';
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
        if (data !== nextProps.data) {
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
        const {onChange} = this.props;
        const tooltip = JSON.parse(data);
        onChange(tooltip);
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
        backgroundColor: 'transparent',
    },
});

export {Chart, chartOptions};
