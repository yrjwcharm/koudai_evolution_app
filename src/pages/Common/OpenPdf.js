/*
 * @Date: 2021-01-15 14:35:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-12 19:04:05
 * @Description: 在APP里阅读PDF
 */
import React, {Component} from 'react';
import {StyleSheet, Dimensions, View, Linking, Alert} from 'react-native';
import Pdf from 'react-native-pdf';
import Toast from '../../components/Toast';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

export default class OpenPdf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canOpen: false,
        };
    }
    componentDidMount() {
        if (this.props.route.params && this.props.route.params.title) {
            this.props.navigation.setOptions({title: this.props.route.params.title});
        }
        if (!this.props.route.params.url) {
            Toast.show('空链接');
        } else {
            console.log(this.props.route.params.url);
            fetch(this.props.route.params.url)
                .then((res) => {
                    // console.log(res);
                    if (res.status === 200) {
                        this.setState({canOpen: true});
                    }
                })
                .catch((error) => {
                    // console.log(error);
                    // Toast.show('链接不可用');
                });
        }
    }
    render() {
        const {canOpen} = this.state;
        const {url} = this.props.route.params || {};
        return (
            <View style={styles.container}>
                {canOpen && url ? (
                    <Pdf
                        source={{uri: url, cache: true}}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(numberOfPages, filePath);
                        }}
                        onPageChanged={(page) => {
                            // console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            Toast.show(error);
                        }}
                        onPressLink={(uri) => {
                            // console.log(`Link presse: ${uri}`);
                            Linking.canOpenURL(uri)
                                .then((supported) => {
                                    if (!supported) {
                                        return Toast.show('您的设备不支持打开网址');
                                    }
                                    return Linking.openURL(uri);
                                })
                                .catch((err) => Alert(err));
                        }}
                        style={styles.pdf}
                    />
                ) : (
                    <Empty text={'找不到文档'} />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
    },
});
