/*
 * @Date: 2021-01-14 14:58:00
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-04-07 15:56:15
 * @Description:
 */
import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {px as text} from '../utils/appUtil';
import Image from 'react-native-fast-image';
import {Colors, Space} from '../common/commonStyle';

class CheckBox extends React.Component {
    static defaultProps = {
        checked: false,
        onChange: () => {},
        color: '#0052CD',
        style: {},
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
        const {color} = this.props;
        // var source = 'checkbox-blank-circle-outline';
        // if (this.state.checked) {
        //     source = 'checkbox-marked-circle';
        // }
        // var container = <Icon name={source} size={text(18)} color={color ? color : '#0052CD'} />;
        const imgStyle = {width: text(15), height: text(15)};
        const container = this.state.checked ? (
            <Image source={require('../assets/img/login/checked.png')} style={imgStyle} />
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
