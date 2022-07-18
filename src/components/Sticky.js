/*
 * @Date: 2021-01-06 21:53:00
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-16 11:15:51
 * @Description:
 */
import * as React from 'react';
import {StyleSheet, Animated} from 'react-native';

/**
 * 滑动吸顶效果组件
 * @export
 * @class StickyHeader
 */
export default class StickyHeader extends React.Component {
    static defaultProps = {
        stickyHeaderY: -1,
        stickyScrollY: new Animated.Value(0),
    };

    constructor(props) {
        super(props);
        this.state = {
            stickyLayoutY: 0,
        };
    }

    // 兼容代码，防止没有传头部高度
    _onLayout = (event) => {
        this.setState({
            stickyLayoutY: event.nativeEvent.layout.y,
        });
    };

    render() {
        // 传入itemHeight的时候可以做多个标题轮询吸顶 参考我的资产
        const {stickyHeaderY, stickyScrollY, children, style, itemHeight} = this.props;
        const {stickyLayoutY} = this.state;
        let y = stickyHeaderY !== -1 ? stickyHeaderY : stickyLayoutY;
        const translateY = stickyScrollY.interpolate({
            inputRange: [-1, 0, y, y + 1],
            outputRange: [0, 0, 0, 1],
        });
        let t = y + itemHeight + 1 || 1000;
        // 从距离底部40的时候开始渐变0
        const opacity = itemHeight
            ? stickyScrollY.interpolate({
                  inputRange: [-1, 0, y, y + 1, t - 40, t],
                  outputRange: [1, 1, 1, 1, 1, 0],
              })
            : 1;
        return (
            <Animated.View
                onLayout={this._onLayout}
                style={[style, styles.container, {opacity, transform: [{translateY}]}]}>
                {children}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
    },
});
