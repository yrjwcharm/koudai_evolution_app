/*
 * @Date: 2021-01-14 14:58:00
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 17:43:43
 * @Description:
 */
import React from 'react';
import {TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {px as text} from '../utils/appUtil';

class CheckBox extends React.Component {
    static defaultProps = {
        checked: false,
        onChange: () => {},
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
        var source = 'checkbox-blank-circle-outline';
        if (this.state.checked) {
            source = 'checkbox-marked-circle';
        }
        var container = <Icon name={source} size={text(18)} color="#0052CD" />;
        return (
            <TouchableHighlight onPress={this.toggle.bind(this)} underlayColor="white">
                {container}
            </TouchableHighlight>
        );
    }
}
export default CheckBox;
