/*
 * @Date: 2021-01-06 18:41:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-22 16:26:37
 * @Description:通用按钮
 */
import React from 'react';
import {Text, StyleSheet, TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';

class Button extends React.Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        onPress: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        textStyle: PropTypes.object,
        descStyle: PropTypes.object,
        title: PropTypes.string.isRequired,
        desc: PropTypes.string,
        type: PropTypes.string,
        color: PropTypes.string,
    };
    static defaultProps = {
        style: {},
        onPress: () => {},
        disabled: false,
        textStyle: {},
        descStyle: {},
        title: '按钮',
        desc: '',
        type: 'primary', //按钮类型 primary重要 minor次要按钮
        color: '#0046B1',
    };
    constructor(props) {
        super(props);
    }
    render() {
        const {type, color, onPress, style, disabled, textStyle, descStyle, title, desc} = this.props;
        return (
            <>
                <TouchableHighlight
                    onPress={onPress}
                    style={[
                        Style.flexCenter,
                        type == 'primary' ? styles.ButtonStyle : styles.minorButtonStyle,
                        style,
                        disabled && styles.disable,
                    ]}
                    underlayColor={type == 'primary' ? (color ? color : '#0046B1') : '#F6F6F6'}
                    disabled={disabled}>
                    <View style={[Style.flexCenter, {width: '100%', height: '100%'}]}>
                        <Text style={[type == 'primary' ? styles.Text : styles.minorText, textStyle]}>{title}</Text>
                        {desc ? <Text style={[descStyle || {}]}>{desc}</Text> : null}
                    </View>
                </TouchableHighlight>
            </>
        );
    }
}
const styles = StyleSheet.create({
    ButtonStyle: {
        backgroundColor: Colors.btnColor,
        height: text(45),
        borderRadius: 8,
    },
    minorButtonStyle: {
        backgroundColor: '#fff',
        height: text(45),
        borderRadius: 8,
        borderColor: '#4E556C',
        borderWidth: text(1),
    },
    Text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: text(16),
    },
    minorText: {
        textAlign: 'center',
        color: '#545968',
        fontSize: text(16),
    },
    disable: {
        backgroundColor: '#c2d5f0',
    },
});
export default Button;
