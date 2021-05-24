/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-24 17:20:33
 */
import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {px as text} from '../utils/appUtil';
import PropTypes from 'prop-types';
import {Style} from '../common/commonStyle';
export default class Radio extends Component {
    static defaultProps = {
        checked: false,
    };
    static propTypes = {
        checked: PropTypes.bool.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            // checked: false,
            index: props.index,
        };
    }
    toggle() {
        this.setState({checked: !this.state.checked});
        this.props.onChange(!this.state.checked, this.state.index);
    }
    render() {
        return this.props.click ? (
            <View style={[styles.radio_circle, Style.flexRowCenter, this.props.style]}>
                {this.props.checked && <View style={styles.radio_fill} />}
            </View>
        ) : (
            <TouchableOpacity
                style={[styles.radio_circle, Style.flexRowCenter, this.props.style]}
                activeOpacity={0.9}
                onPress={this.toggle.bind(this)}>
                {this.props.checked && <View style={styles.radio_fill} />}
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    radio_circle: {
        width: text(20),
        height: text(20),
        borderRadius: 50,
        backgroundColor: 'transparent',
        borderColor: '#9095A5',
        borderWidth: 0.5,
    },
    radio_fill: {
        width: text(10),
        height: text(10),
        borderRadius: 50,
        backgroundColor: '#0051CC',
    },
});
