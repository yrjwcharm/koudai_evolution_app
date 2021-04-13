/*
 * @Date: 2021-01-07 17:57:49
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-13 17:05:36
 * @Description:
 */
import React, {Component} from 'react';
import RootSiblings from 'react-native-root-siblings';
import ToastContainer, {positions, durations} from './ToastContainer';
let root = null;
class Toast extends Component {
    static displayName = 'Toast';
    static propTypes = ToastContainer.propTypes;
    static positions = positions;
    static durations = durations;

    static show = (message, options) => {
        if (root) {
            root.destroy();
        }
        return (root = new RootSiblings(
            (
                <ToastContainer
                    {...options}
                    visible={true}
                    destroy={() => {
                        root && root.destroy();
                    }}>
                    {message}
                </ToastContainer>
            )
        ));
    };

    static showLoading = (message = '请稍等...', options) => {
        return new RootSiblings(
            (
                <ToastContainer {...options} loading={true} visible={true}>
                    {message}
                </ToastContainer>
            )
        );
    };

    static hide = (toast) => {
        if (toast instanceof RootSiblings) {
            toast.destroy();
        } else {
            console.warn(
                `Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof toast}\` instead.`
            );
        }
    };

    _toast = null;

    UNSAFE_componentWillMount = () => {
        this._toast = new RootSiblings(<ToastContainer {...this.props} duration={0} />);
    };

    UNSAFE_componentWillReceiveProps = (nextProps) => {
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
