/*
 * @Date: 2021-01-06 18:41:17
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-12-21 14:25:43
 * @Description:通用按钮
 */
import React from 'react';
import {Text, StyleSheet, TouchableHighlight, View, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Style} from '../../common/commonStyle';

class Button extends React.Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        onPress: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        disabledColor: PropTypes.string,
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
        disabledColor: '#c2d5f0',
        textStyle: {},
        descStyle: {},
        title: '按钮',
        desc: '',
        type: 'primary', //按钮类型 primary重要 minor次要按钮
        color: '#0046B1',
    };
    constructor(props) {
        super(props);
        this.state = {
            superscriptWidth: text(54),
        };
    }
    render() {
        const {
            type,
            color,
            onPress,
            style,
            disabled,
            disabledColor,
            textStyle,
            descStyle,
            title,
            desc,
            superscript = '',
            onLayout,
        } = this.props;
        const {superscriptWidth} = this.state;
        return (
            <>
                <TouchableHighlight
                    activeOpacity={1}
                    onPress={onPress}
                    style={[
                        Style.flexCenter,
                        type == 'primary' ? styles.ButtonStyle : styles.minorButtonStyle,
                        style,
                        disabled && {backgroundColor: disabledColor, borderColor: disabledColor},
                    ]}
                    underlayColor={type == 'primary' ? (color ? color : '#0046B1') : '#F6F6F6'}
                    disabled={disabled}
                    onLayout={(e) => {
                        onLayout && onLayout(e.nativeEvent.layout);
                    }}>
                    <View style={[Style.flexCenter, {width: '100%', height: '100%'}]}>
                        <View>
                            <Text style={[type == 'primary' ? styles.Text : styles.minorText, textStyle]}>{title}</Text>
                            {desc ? <Text style={[descStyle || {}]}>{desc}</Text> : null}
                            {superscript ? (
                                <View
                                    onLayout={(e) => this.setState({superscriptWidth: e.nativeEvent.layout.width})}
                                    style={[styles.superscriptBox, {right: text(-4) - superscriptWidth}]}>
                                    <Text style={styles.superscript}>{superscript}</Text>
                                </View>
                            ) : null}
                        </View>
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
        borderRadius: 6,
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
    superscriptBox: {
        paddingVertical: text(1),
        paddingHorizontal: text(5),
        borderRadius: text(9),
        borderBottomLeftRadius: text(0.5),
        backgroundColor: Colors.red,
        position: 'absolute',
        bottom: text(11),
    },
    superscript: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
});
export default Button;
