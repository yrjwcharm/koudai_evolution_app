/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 11:14:48
 * @Description:
 */
import React, {Component} from 'react';
import {Text, View, Dimensions, ScrollView} from 'react-native';
import Header from '../../components/NavBar';
const width = Dimensions.get('window').width;
import {SafeAreaView} from 'react-native-safe-area-context';

export default class index extends Component {
    constructor(props) {
        super(props);
    }
    back = () => {
        this.props.navigation.goBack();
    };
    render() {
        return (
            <SafeAreaView edges={['bottom']}>
                <Header title={'123'} leftIcon="chevron-left" style={{backgroundColor: 'red'}} />
                <ScrollView>
                    <View style={{flex: 1, height: 2000, backgroundColor: 'pink'}}>
                        <Text>abdddd</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
