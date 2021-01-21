/*
 * @Author: dx
 * @Date: 2021-01-15 10:31:10
 * @LastEditTime: 2021-01-21 11:50:08
 * @LastEditors: dx
 * @Description: 用户协议(接口返回内容)
 * @FilePath: /koudai_evolution_app/src/pages/Index/Agreement.js
 */
import React, {Component} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
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
        http.get('/common/passport/agreement/20200808', {type: this.props.route.params.type}).then((res) => {
            this.setState({data: res.result});
            this.props.navigation.setOptions({title: res.result.title});
        });
    }
    render() {
        const {agreement} = this.state.data;
        return (
            <SafeAreaView edges={['bottom']}>
                <ScrollView>
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
