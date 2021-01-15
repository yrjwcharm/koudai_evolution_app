/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 20:07:43
 */
import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {px as text} from '../utils/appUtil';
import {Style} from '../common/commonStyle';
export default class Radio extends Component {
    static defaultProps = {
        checked: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
        };
    }
    toggle() {
        this.setState({checked: !this.state.checked});
        this.props.onChange(!this.state.checked);
    }
    render() {
        return (
            <View>
                <TouchableOpacity style={[styles.radio_circle, Style.flexRowCenter]} onPress={this.toggle.bind(this)}>
                    {this.state.checked && <View style={styles.radio_fill} />}
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    radio_circle: {
        width: text(15),
        height: text(15),
        borderRadius: 50,
        backgroundColor: 'transparent',
        borderColor: '#9095A5',
        borderWidth: 0.5,
    },
    radio_fill: {
        width: text(8),
        height: text(8),
        borderRadius: 50,
        backgroundColor: '#0051CC',
    },
});
