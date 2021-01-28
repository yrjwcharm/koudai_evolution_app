/*
 * @Author: dx
 * @Date: 2021-01-15 14:35:48
 * @LastEditTime: 2021-01-28 15:08:04
 * @LastEditors: dx
 * @Description: 在APP里阅读PDF
 * @FilePath: /koudai_evolution_app/src/pages/Common/OpenPdf.js
 */
import React, {Component} from 'react';
import {StyleSheet, Dimensions, View, Linking, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import Toast from '../../components/Toast';

export default class OpenPdf extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View style={styles.container}>
                <Pdf
                    source={{uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true}}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(numberOfPages, filePath);
                    }}
                    onPageChanged={(page) => {
                        console.log(`current page: ${page}`);
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
    },
});
