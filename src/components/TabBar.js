/*
 * @Date: 2021-01-20 10:35:46
 * @Description: 自定义tabbar
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {Colors, Space} from '../common/commonStyle';
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
    renderTab = (name, page, isTabActive, onPressHandler) => {
        const textColor = isTabActive
            ? this.props.btnColor
                ? this.props.btnColor
                : Colors.btnColor
            : this.props.inActiveColor
            ? this.props.inActiveColor
            : Colors.darkGrayColor;
        const fontSize = isTabActive
            ? this.props.activeFontSize
                ? this.props.activeFontSize
                : px(15)
            : this.props.inActiveFontSize || px(14);
        return (
            <Button
                style={{flex: 1, height}}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits="button"
                onPress={() => onPressHandler(page)}>
                <View style={[styles.tab]}>
                    <Text
                        style={[
                            {
                                color: textColor,
                                fontWeight: isTabActive ? 'bold' : 'normal',
                                fontSize,
                                paddingVertical: px(6),
                            },
                        ]}>
                        {name}
                    </Text>
                </View>
            </Button>
        );
    };
    _renderUnderline() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const underlineWidth = this.props.underlineWidth || px(20);
        const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 4;
        const deLen = (containerWidth / numberOfTabs - underlineWidth) / 2;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: underlineWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: this.props.btnColor ? this.props.btnColor : Colors.btnColor,
            bottom: 6,
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
                    {this.props.hideUnderLine ? null : this._renderUnderline()}
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
        borderBottomWidth: Space.borderWidth,
        backgroundColor: '#fff',
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
