/*
 * @Author: dx
 * @Date: 2021-01-15 10:31:10
<<<<<<< HEAD
 * @LastEditTime: 2021-03-30 16:25:32
 * @LastEditors: yhc
=======
 * @LastEditTime: 2021-03-29 19:28:19
 * @LastEditors: dx
>>>>>>> ed47b3590583021ebc6e21dbc8a4d33363cd52fb
 * @Description: 用户协议(接口返回内容)
 * @FilePath: /koudai_evolution_app/src/pages/Index/Agreement.js
 */
import React, {Component} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
            <SafeAreaView edges={['bottom']}>
                {agreement && (
                    <ScrollView style={styles.container}>
                        <View style={{paddingHorizontal: text(14), marginBottom: isIphoneX() ? 42 : 8}}>
                            {agreement && <Html html={agreement} style={{fontSize: text(14), lineHeight: text(18)}} />}
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
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
