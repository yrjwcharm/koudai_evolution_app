/*
 * @Date: 2021-01-14 14:58:00
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-02-07 14:26:55
 * @Description:
 */
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../utils/appUtil';
import Image from 'react-native-fast-image';
import {Colors, Space} from '../common/commonStyle';

class CheckBox extends React.Component {
    static defaultProps = {
        checked: false,
        onChange: () => {},
        color: '#0052CD',
        style: {},
        control: false, // 是否受控
        checkedIcon: null,
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
        this.setState({checked: !this.state.checked}, () => {
            this.props.onChange(this.state.checked);
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.checked != this.state.checked) {
            this.setState({checked: nextProps.checked});
        }
    }
    render() {
        const {control, checkedIcon} = this.props;
        // var source = 'checkbox-blank-circle-outline';
        // if (this.state.checked) {
        //     source = 'checkbox-marked-circle';
        // }
        // var container = <Icon name={source} size={text(18)} color={color ? color : '#0052CD'} />;
        const imgStyle = {width: text(15), height: text(15)};
        const container = (control ? this.state.checked : this.props.checked) ? (
            checkedIcon ? (
                checkedIcon
            ) : (
                <Image source={require('../assets/img/login/checked.png')} style={imgStyle} />
            )
        ) : (
            <View
                style={{
                    borderColor: Colors.darkGrayColor,
                    borderWidth: Space.borderWidth,
                    borderRadius: text(15),
                    ...imgStyle,
                }}
            />
        );
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.toggle.bind(this)} style={this.props.style}>
                {container}
            </TouchableOpacity>
        );
    }
}
export default CheckBox;
