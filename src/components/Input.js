/*
 * @Date: 2021-01-18 10:49:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-01 18:05:56
 * @Description:带lable的输入框
 */
/**
 * 不可输入时可点击
 */
import React, {Component} from 'react';
import {px as text, px} from '../utils/appUtil';
import PropTypes from 'prop-types';
import {TextInput, View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {Colors, Font} from '../common/commonStyle';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: text(14),
        color: Colors.defaultColor,
        letterSpacing: text(1),
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
        placeholderTextColor: '#BDC2CC',
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
        // this.state = {
        //     value: props.value,
        // };
    }

    render() {
        const {
            label,
            labelTextStyle,
            required,
            textInputStyle,
            placeholderTextColor,
            autoCapitalize,
            isUpdate,
            suffix,
            keyboardType,
            value,
        } = this.props;
        return (
            <View
                style={[
                    {
                        height: text(56),
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: text(14),
                            color: Colors.lightBlackColor,
                        },
                        labelTextStyle,
                    ]}>
                    {label}
                    {required ? <Text style={{fontSize: 16, fontWeight: 'bold', color: '#F00'}}>*</Text> : null}
                </Text>
                {isUpdate ? (
                    <View style={[{flexDirection: 'row', flex: 1, padding: 0}, styles.center]}>
                        <TextInput
                            {...this.props}
                            onBlur={this._onBlur}
                            onFocus={this._onFocus}
                            style={[
                                styles.input,
                                textInputStyle,
                                {fontFamily: value && value.length > 0 ? Font.numMedium : null},
                            ]}
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
                        style={[
                            {
                                flexDirection: 'row',
                                flex: 1,
                                height: '100%',
                                paddingLeft: Platform.OS == 'android' ? px(5) : 0,
                            },
                            styles.center,
                        ]}>
                        <Text style={[{flex: 1, fontSize: text(14)}, textInputStyle]}>
                            <Text style={{fontFamily: Font.numMedium}}>{value}</Text>
                            {value ? null : (
                                <Text style={[{flex: 1, color: placeholderTextColor}]}>{this.props.placeholder}</Text>
                            )}
                        </Text>

                        <Text style={{marginRight: 10}}>{suffix && suffix.length > 3 ? '' : suffix}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

export default Input;
