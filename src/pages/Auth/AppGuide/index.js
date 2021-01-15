/*
 * @Date: 2021-01-15 16:51:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 17:34:21
 * @Description:app引导页
 */
// import React, {Component} from 'react';
// import {Text, View} from 'react-native';
// export default class Index extends Component {
//     render() {
//         return (
//             <View>
//                 <Text>1111</Text>
//             </View>
//         );
//     }
// }
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default class SwiperComponent extends Component {
    render() {
        return (
            <Swiper style={styles.wrapper} loop={false}>
                <View style={styles.slide1}>
                    <Text style={styles.text}>Hello Swiper</Text>
                </View>
                <View style={styles.slide2}>
                    <Text style={styles.text}>Beautiful</Text>
                </View>
                <View style={styles.slide3}>
                    <Text style={styles.text}>And simple</Text>
                </View>
            </Swiper>
        );
    }
}
