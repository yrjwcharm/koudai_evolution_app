/*
 * @Date: 2021-01-28 17:56:12
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-25 19:05:15
 * @Description:
 */
import React, {PureComponent, createRef} from 'react';
import {StyleSheet, Platform, View, ActivityIndicator} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import * as chartOptions from './chartOptions';
import {Colors, Style} from '../../common/commonStyle';
import {isEqual} from 'lodash';
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
        onLoadEnd: () => {},
    };

    constructor(props) {
        super(props);
        this.chart = createRef();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {data} = this.props;
        if (!isEqual(data, nextProps.data)) {
            this.update(nextProps.data);
        }
    }

    update = (data) => {
        if (this.props.updateScript) {
            this.chart.current.injectJavaScript(this.props.updateScript(data));
        } else {
            // console.log('update');
            this.chart.current.injectJavaScript(changeData(data));
        }
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
                androidLayerType="software"
                allowFileAccess
                allowFileAccessFromFileURLs
                allowUniversalAccessFromFileURLs
                javaScriptEnabled
                ref={this.chart}
                scrollEnabled={false}
                style={styles.webView}
                injectedJavaScript={initScript}
                renderLoading={() => (
                    <View style={[Style.flexCenter, {position: 'absolute', left: 0, right: 0, bottom: 0, top: 0}]}>
                        <ActivityIndicator color={Colors.brandColor} />
                    </View>
                )}
                onLoadEnd={this.props.onLoadEnd}
                source={source}
                startInLoadingState={true}
                originWhitelist={['*']}
                onMessage={this.onMessage}
                textZoom={100}
                {...props}
            />
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
        opacity: 0.99,
    },
});

export {Chart, chartOptions};
