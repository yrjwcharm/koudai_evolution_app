/*
 * @Author: dx
 * @Date: 2021-01-15 10:31:10
 * @LastEditTime: 2021-04-06 12:16:19
 * @LastEditors: yhc
 * @Description: 用户协议(接口返回内容)
 * @FilePath: /koudai_evolution_app/src/pages/Index/Agreement.js
 */
import React, {Component} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import http from '../../services';
import {px as text, isIphoneX} from '../../utils/appUtil';
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
            <ScrollView style={styles.container}>
                <View style={{paddingHorizontal: text(14), marginBottom: isIphoneX() ? 42 : 8}}>
                    {agreement && <Html html={agreement} style={{fontSize: text(14), lineHeight: text(18)}} />}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
export default Agreement;
