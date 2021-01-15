/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-14 18:53:10
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-14 18:56:13
 */
/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-04 15:00:14
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-07 16:34:28
 */
/**
 * placeholder占位符；
 * value 输入框的值；
 * password 是否密文输入；
 * editable 输入框是否可编辑
 * returnkeyType 键盘return键类型；
 * onChange 当文本变化时候调用；
 * onEndEditing 当结束编辑时调用；
 * onSubmitEding 当结束编辑提交按钮时候调动；
 * onChangeText:读取TextInput的用户输入；
 */
import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TextInput} from 'react-native';
// import EStyleSheet from 'react-native-extended-stylesheet';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }
    changeText = (text) => {
        this.setState({text: text});
    };
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    returnKeyType={'done'}
                    style={styles.input}
                    editable={this.props.editable}
                    placeholder={this.props.placeholder}
                    onChangeText={this.changeText}
                />
                {/* <Text style={styles.text}>{this.state.text}</Text> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        marginTop: 25,
    },
    input: {
        margin: 25,
        height: 50,
        borderWidth: 1,
        borderColor: '#F4F4F4',
        borderRadius: 10,
        fontSize: 16,
    },
    text: {
        marginLeft: 35,
        marginTop: 10,
        fontSize: 16,
    },
});
