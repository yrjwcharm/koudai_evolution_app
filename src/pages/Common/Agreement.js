/*
 * @Author: dx
 * @Date: 2021-01-15 10:31:10
 * @LastEditTime: 2021-03-26 13:31:24
 * @LastEditors: yhc
 * @Description: 用户协议(接口返回内容)
 * @FilePath: /koudai_evolution_app/src/pages/Index/Agreement.js
 */
import React, {Component} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import http from '../../services';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
export class Agreement extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        data: {},
    };
    componentDidMount() {
        http.get('/passport/agreement/detail/20210101', {id: this.props.route.params?.id}).then((res) => {
            this.setState({data: res.result});
            this.props.navigation.setOptions({title: res.result.title || '用户协议'});
        });
    }
    render() {
        const {agreement} = this.state.data;
        return (
            <SafeAreaView edges={['bottom']}>
                <ScrollView style={{backgroundColor: '#fff'}}>
                    <View style={{padding: text(14)}}>
                        {agreement && <Html html={agreement} style={{fontSize: text(14), lineHeight: text(18)}} />}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({});
export default Agreement;
