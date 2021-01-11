/*
 * @Date: 2021-01-07 17:57:49
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-08 11:21:48
 * @Description:
 */
import React, {Component} from 'react';
import RootSiblings from 'react-native-root-siblings';
import ToastContainer, {positions, durations} from './ToastContainer';

class Toast extends Component {
    static displayName = 'Toast';
    static propTypes = ToastContainer.propTypes;
    static positions = positions;
    static durations = durations;

    static show = (message, options) => {
        return new RootSiblings(
            (
                <ToastContainer {...options} visible={true}>
                    {message}
                </ToastContainer>
            ),
        );
    };

    static hide = (toast) => {
        if (toast instanceof RootSiblings) {
            toast.destroy();
        } else {
            console.warn(
                `Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof toast}\` instead.`,
            );
        }
    };

    _toast = null;

    componentWillMount = () => {
        this._toast = new RootSiblings(<ToastContainer {...this.props} duration={0} />);
    };

    componentWillReceiveProps = (nextProps) => {
        this._toast.update(<ToastContainer {...nextProps} duration={0} />);
    };

    componentWillUnmount = () => {
        this._toast.destroy();
    };

    render() {
        return null;
    }
}

export {RootSiblings as Manager};
export default Toast;
