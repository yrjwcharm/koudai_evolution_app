/*
 * @Date: 2021-01-06 18:41:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 21:11:51
 * @Description:通用按钮
 */
import React from 'react';
import {Text, StyleSheet, TouchableHighlight} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';

class Button extends React.Component {
    static defaultProps = {
        style: {},
        onPress:()=>{
            
        },
        disabled: false,
        textStyle: {},
        title: '按钮',
        type: 'primary', //按钮类型 primary重要 minor次要按钮
    };
    constructor(props) {
        super(props);
    }
    render() {
        const {type} = this.props;
        return (
            <>
                <TouchableHighlight
                    onPress={this.props.onPress}
                    style={[
                        Style.flexCenter,
                        type == 'primary' ? styles.ButtonStyle : styles.minorButtonStyle,
                        this.props.style,
                        this.props.disabled && styles.disable,
                    ]}
                    underlayColor={type == 'primary' ? '#0046B1' : '#F6F6F6'}
                    disabled={this.props.disabled}>
                    <Text
                        style={[
                            type == 'primary' ? styles.Text : styles.minorText,
                            this.props.textStyle,
                            this.props.disabled && styles.disable,
                        ]}>
                        {this.props.title}
                    </Text>
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
        backgroundColor: '#EEEFF0',
        color: '#9095A5',
        borderWidth: 0,
    },
});
export default Button;
