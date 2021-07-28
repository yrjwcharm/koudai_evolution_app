/*
 * @Date: 2021-07-27 17:00:06
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-27 18:34:11
 * @Description:牛人信号
 */
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {WebView} from 'react-native-webview';
import {deviceWidth, px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';

const TopInvestors = () => {
    return (
        <ScrollView style={styles.con}>
            <View style={{width: deviceWidth, height: px(240)}}>
                <WebView
                    startInLoadingState={true}
                    scalesPageToFit={false}
                    source={{
                        uri: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn:10080/signalCanvas',
                    }}
                />
            </View>
            <Text>1111</Text>
            <Text>1111</Text>
        </ScrollView>
    );
};

export default TopInvestors;

const styles = StyleSheet.create({
    con: {
        backgroundColor: '#fff',
        flex: 1,
    },
});
