/*
 * @Date: 2021-05-18 11:46:01
 * @Description:
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated} from 'react-native';
import {px} from '../utils/appUtil';
import {Colors} from '../common/commonStyle';
import {connect} from 'react-redux';
const PhoneWidth = Dimensions.get('window').width;
const tabHeight = px(42);
const Button = (props) => {
    return (
        <TouchableOpacity {...props} activeOpacity={0.95}>
            {props.children}
        </TouchableOpacity>
    );
};
class ScrollTabbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabLeft: px(12),
        };
        this.tabsLayouts = {};
        //Tab项总长
        this.tabsWidth = 0;
        //Tab显示区域宽度
        this.tabsViewportWidth = 0;
        //Tab显示区左边界
        this.underlineWidth = px(20);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.scrollToIndex(nextProps.activeTab);
    }
    componentDidMount() {
        setTimeout(() => {
            this.scrollToIndex(this.props.activeTab);
        }, 100);
    }
    scrollToIndex = (index) => {
        setTimeout(() => {
            let {width, left} = this.tabsLayouts[index] || {};
            let newX = 0;
            //半屏宽度值
            let halfWidth = this.tabsViewportWidth / 2;
            newX = left - halfWidth + width / 2;
            if (newX < 0) {
                newX = 0;
            }
            if (this?._scrollTabBarView && this.props.container != 'View') {
                this?._scrollTabBarView?.scrollTo({x: newX, animated: true});
            }
        }, 10);
    };
    measureTabContainer(evt) {
        const {width} = evt.nativeEvent.layout;
        this.tabsViewportWidth = width;
    }
    measureTab = (idx, evt) => {
        const {x, width, height} = evt.nativeEvent.layout;
        if (idx == this.props.activeTab) {
            this.setState({tabLeft: (width - this.underlineWidth) / 2});
        }
        let right = x + width;
        this.tabsLayouts[idx] = {left: x, right, width, height};
        if (idx == this.props.tabs.length - 1) {
            this.tabsWidth = right;
        }
    };
    _renderUnderline() {
        const numberOfTabs = this.props.tabs.length;
        const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 4;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: this.underlineWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: this.props.underlineColor ? this.props.underlineColor : Colors.defaultColor,
            bottom: 6,
            left: this.state.tabLeft,
        };
        const inputRange = [];
        const outputRange = [];
        for (var i = 0; i < numberOfTabs; i++) {
            if (numberOfTabs == 1) {
                inputRange.push(i);
                outputRange.push(this.tabsLayouts[i]?.left || 0);
            }
            inputRange.push(i);
            outputRange.push(this.tabsLayouts[i]?.left || 0);
        }
        const translateX = this.props.scrollValue.interpolate({
            inputRange,
            outputRange,
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
    renderTab = (name, page, isTabActive, onPressHandler) => {
        const textColor = isTabActive ? Colors.defaultColor : Colors.lightBlackColor;
        const textFontSize = isTabActive ? this.props.activeFontSize || px(16) : this.props.inActiveFontSize || px(14);
        const textFontWeight = isTabActive ? '700' : '400';
        return (
            <Button
                style={{flex: 1, height: tabHeight, paddingHorizontal: px(8)}}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                onLayout={this.measureTab.bind(this, page)}
                accessibilityTraits="button"
                onPress={() => {
                    onPressHandler(page);
                }}>
                <View style={[styles.tab]}>
                    <Text style={[{color: textColor, fontSize: textFontSize, fontWeight: textFontWeight}]}>{name}</Text>
                </View>
            </Button>
        );
    };
    render() {
        let Con = this.props.container == 'View' ? View : ScrollView;
        return (
            <View style={[styles.tabBarBox, this.props.boxStyle]}>
                <Con
                    bounces={false}
                    ref={(ref) => (this._scrollTabBarView = ref)}
                    horizontal
                    style={{flexDirection: 'row'}}
                    onLayout={this.measureTabContainer.bind(this)}
                    showsHorizontalScrollIndicator={false}>
                    <View style={{flexDirection: 'row'}}>
                        {this.props.tabs.map((name, page) => {
                            const isTabActive = this.props.activeTab === page;
                            const renderTab = this.props.renderTab || this.renderTab;
                            return renderTab(name, page, isTabActive, this.props.goToPage);
                        })}
                        {this._renderUnderline()}
                    </View>
                </Con>
            </View>
        );
    }
}
const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(ScrollTabbar);
const styles = StyleSheet.create({
    tabBarBox: {
        height: tabHeight,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        margin: 15,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        width: PhoneWidth / 3,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around',
    },
    badge: {
        width: px(8),
        height: px(8),
        borderRadius: px(4),
        backgroundColor: Colors.red,
        position: 'absolute',
        right: px(-4),
        top: px(8),
    },
});
