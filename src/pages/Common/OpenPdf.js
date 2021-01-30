/*
 * @Date: 2021-01-15 14:35:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-28 19:29:56
 * @Description: 在APP里阅读PDF
 */
import React, {Component} from 'react';
import {StyleSheet, Dimensions, View, Linking, Alert} from 'react-native';
import Pdf from 'react-native-pdf';
import Toast from '../../components/Toast';

export default class OpenPdf extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        if (this.props.route.params && this.props.route.params.title) {
            this.props.navigation.setOptions({title: this.props.route.params.title});
        }
    }
    render() {
        const {url} = this.props.route.params || {};
        return (
            <View style={styles.container}>
                <Pdf
                    source={{uri: url || 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true}}
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
