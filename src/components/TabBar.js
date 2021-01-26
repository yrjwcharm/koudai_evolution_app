/*
 * @Date: 2021-01-20 10:35:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-25 16:57:31
 * @Description: 自定义tabbar
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {Colors} from '../common/commonStyle';
import {px} from '../utils/appUtil';
const Button = (props) => {
    return (
        <TouchableOpacity {...props} activeOpacity={0.95}>
            {props.children}
        </TouchableOpacity>
    );
};
const height = px(42);
export default class TabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    renderTab(name, page, isTabActive, onPressHandler) {
        const textColor = isTabActive ? Colors.btnColor : Colors.darkGrayColor;
        const fontSize = isTabActive ? px(15) : px(14);
        return (
            <Button
                style={{flex: 1, height, backgroundColor: '#fff'}}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits="button"
                onPress={() => onPressHandler(page)}>
                <View style={[styles.tab]}>
                    <Text style={[{color: textColor, fontWeight: 'bold', fontSize, paddingVertical: px(6)}]}>
                        {name}
                    </Text>
                </View>
            </Button>
        );
    }
    _renderUnderline() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const underlineWidth = px(20);
        const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 4;
        const deLen = (containerWidth / numberOfTabs - underlineWidth) / 2;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: underlineWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: Colors.btnColor,
            bottom: 2,
            left: deLen,
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs],
        });

        const scaleValue = (defaultScale) => {
            let arr = new Array(numberOfTabs * 2);
            return arr.fill(0).reduce(
                function (pre, cur, idx) {
                    idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5);
                    idx % 2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1);
                    return pre;
                },
                {inputRange: [], outputRange: []}
            );
        };

        const scaleX = this.props.scrollValue.interpolate(scaleValue(scale));

        return (
            <Animated.View
                style={[
                    tabUnderlineStyle,
                    {
                        transform: [{translateX}, {scaleX}],
                    },
                    this.props.underlineStyle,
                ]}
            />
        );
    }

    render() {
        return (
            <View style={[styles.tabBarBox, this.props.style]}>
                <View style={{flexDirection: 'row'}}>
                    {this.props.tabs.map((name, page) => {
                        const isTabActive = this.props.activeTab === page;
                        const renderTab = this.props.renderTab || this.renderTab;
                        return renderTab(name, page, isTabActive, this.props.goToPage);
                    })}
                    {this._renderUnderline()}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tabBarBox: {
        height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.borderColor,
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
