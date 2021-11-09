/*
 * @Date: 2021-01-14 14:58:00
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-08 20:16:22
 * @Description:
 */
import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../../../utils/appUtil';
import Image from 'react-native-fast-image';
import {Colors, Space} from '../../../common/commonStyle';

class CheckBox extends React.Component {
    static defaultProps = {
        checked: false,
        onChange: () => {},
        color: '#0052CD',
        style: {},
        control: false, // 是否受控
    };
    static propTypes = {
        checked: PropTypes.bool,
        onChange: PropTypes.func,
        control: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
        };
    }
    toggle() {
        if (this.props.control) {
            this.props.onChange && this.props.onChange(!this.props.checked);
        } else {
            this.setState({checked: !this.state.checked}, () => {
                this.props.onChange(this.state.checked);
            });
        }
    }

    render() {
        const {control} = this.props;
        const imgStyle = {width: text(15), height: text(15)};
        const container = (control ? this.props.checked : this.state.checked) ? (
            <Image source={require('../../../assets/img/login/checked.png')} style={imgStyle} />
        ) : (
            <View
                style={{
                    ...imgStyle,
                    borderColor: Colors.darkGrayColor,
                    borderWidth: Space.borderWidth,
                    borderRadius: text(15),
                }}
            />
        );
        return (
            <TouchableHighlight onPress={this.toggle.bind(this)} underlayColor="white" style={this.props.style}>
                {container}
            </TouchableHighlight>
        );
    }
}
export default CheckBox;
