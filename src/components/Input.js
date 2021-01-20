/*
 * @Date: 2021-01-18 10:49:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 18:40:28
 * @Description:带lable的输入框
 */
/**
 * 不可输入时可点击
 */
import React, {Component} from 'react';
import {px as text} from '../utils/appUtil';
import PropTypes from 'prop-types';
import {TextInput, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Font} from '../common/commonStyle';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: text(16),
        color: Colors.defaultColor,
        letterSpacing: text(1),
        fontFamily:Font.numFontFamily
    },
});

class Input extends Component {
    static propTypes = {
        inputStyle: TextInput.propTypes.style,
        labelTextStyle: TextInput.propTypes.style,
        placeholderTextColor: PropTypes.string,
        isUpdate: PropTypes.bool,
        textInputStyle: TextInput.propTypes.style,
        autoCapitalize: PropTypes.oneOf(['characters', 'words', 'sentences', 'none']),
        label: PropTypes.string,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        placeholderTextColor: '#CCCCCC',
        autoCapitalize: 'none',
        isUpdate: true, //是否可编辑
        label: '文本输入框',
        placeholder: '请输入',
        keyboardType: 'default',
        onClick: () => {
            //不可编辑时点击事件
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
        };
    }

    _onChangeText = (val) => {
        this.setState({value: val});
        this.props.onChange && this.props.onChange(val);
    };

    _renderInputContent = () => {
        const {textInputStyle, placeholderTextColor, autoCapitalize, isUpdate, suffix, keyboardType} = this.props;
        return isUpdate ? (
            <View style={[{flexDirection: 'row', flex: 1}, styles.center]}>
                <TextInput
                    {...this.props}
                    onChangeText={this._onChangeText}
                    onBlur={this._onBlur}
                    onFocus={this._onFocus}
                    style={[styles.input, textInputStyle]}
                    placeholderTextColor={placeholderTextColor}
                    autoCorrect={false}
                    autoCapitalize={autoCapitalize}
                    underlineColorAndroid="transparent"
                    keyboardType={keyboardType}
                />
                <Text style={{marginRight: 10}}>{suffix && suffix.length > 3 ? '' : suffix}</Text>
            </View>
        ) : (
            <TouchableOpacity
                onPress={() => {
                    this.props.onClick && this.props.onClick();
                }}
                style={[{flexDirection: 'row', flex: 1}, styles.center]}>
                {this.props.value && this.props.value !== '' ? (
                    <Text style={[{flex: 1, fontSize: text(16)}, textInputStyle]}>{this.props.value}</Text>
                ) : (
                    <Text style={[{flex: 1, fontSize: text(16), color: placeholderTextColor}]}>
                        {this.props.placeholder}
                    </Text>
                )}

                <Text style={{marginRight: 10}}>{suffix && suffix.length > 3 ? '' : suffix}</Text>
            </TouchableOpacity>
        );
    };

    _renderTextAreaContent = () => {
        const {textInputStyle, placeholderTextColor, autoCapitalize, isUpdate} = this.props;
        return isUpdate ? (
            <TextInput
                numberOfLines={4}
                {...this.props}
                multiline={true}
                onChangeText={this._onChangeText}
                onBlur={this._onBlur}
                onFocus={this._onFocus}
                style={[
                    {marginVertical: 5, height: 60, marginHorizontal: 10, textAlign: 'left', flex: 1},
                    textInputStyle,
                ]}
                placeholderTextColor={placeholderTextColor}
                value={String(this.state.value)}
                autoCorrect={false}
                autoCapitalize={autoCapitalize}
                underlineColorAndroid="transparent"
            />
        ) : (
            <Text
                style={[
                    {
                        marginVertical: 5,
                        height: 60,
                        marginHorizontal: 10,
                        textAlign: 'left',
                        flex: 1,
                        backgroundColor: '#f7f6f5',
                    },
                    textInputStyle,
                ]}>
                {this.state.value}
            </Text>
        );
    };

    render() {
        const {label, labelTextStyle, required, mode} = this.props;
        if (mode === 'TextArea') {
            return (
                <View
                    style={{
                        height: 108,
                        width: '100%',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderColor: '#eae6e4',
                        marginVertical: 5,
                        borderBottomWidth: 0.5,
                        backgroundColor: '#fff',
                    }}>
                    <Text style={[{fontSize: text(14)}, labelTextStyle]}>
                        {label}
                        {required ? <Text style={{fontSize: 16, fontWeight: 'bold', color: '#F00'}}>*</Text> : null}
                    </Text>
                    {this._renderTextAreaContent()}
                </View>
            );
        }
        return (
            <View
                style={[
                    {
                        height: text(54),
                        width: '100%',
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        borderColor: Colors.borderColor,
                        borderBottomWidth: 0.5,
                    },
                    styles.center,
                    this.props.inputStyle,
                ]}>
                <Text
                    style={[
                        {
                            width: text(68),
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            fontSize: text(14),
                            color: '#4C4C4C',
                        },
                        labelTextStyle,
                    ]}>
                    {label}
                    {required ? <Text style={{fontSize: 16, fontWeight: 'bold', color: '#F00'}}>*</Text> : null}
                </Text>
                {this._renderInputContent()}
            </View>
        );
    }
}

export default Input;
