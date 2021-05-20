/*
 * @Date: 2021-05-18 11:46:01
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-19 15:44:22
 * @Description:
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {px} from '../../../utils/appUtil';
import {Colors} from '../../../common/commonStyle';
const PhoneWidth = Dimensions.get('window').width;
const tabHeight = px(42);
const Button = (props) => {
    return (
        <TouchableOpacity {...props} activeOpacity={0.95}>
            {props.children}
        </TouchableOpacity>
    );
};
export default class SegmentTabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.tabsLayouts = {};
        //Tab项总长
        this.tabsWidth = 0;
        //Tab显示区域宽度
        this.tabsViewportWidth = 0;
        //Tab显示区左边界
    }
    componentWillReceiveProps(nextProps) {
        this.scrollToIndex(nextProps.activeTab);
    }
    componentDidMount() {
        setTimeout(() => {
            this.scrollToIndex(this.props.activeTab);
        }, 100);
    }
    scrollToIndex = (index) => {
        setTimeout(() => {
            let {width, left} = this.tabsLayouts[index];

            let newX = 0;
            //半屏宽度值
            let halfWidth = this.tabsViewportWidth / 2;
            newX = left - halfWidth + width / 2;
            if (newX < 0) {
                newX = 0;
            }
            this?._scrollTabBarView?.scrollTo({x: newX, animated: true});
            // }
        });
    };
    measureTabContainer(evt) {
        const {width} = evt.nativeEvent.layout;
        this.tabsViewportWidth = width;
    }
    measureTab(idx, evt) {
        const {x, width, height} = evt.nativeEvent.layout;
        let right = x + width;
        this.tabsLayouts[idx] = {left: x, right, width, height};
        if (idx == this.props.tabs.length - 1) {
            this.tabsWidth = right;
        }
    }

    renderTab = (name, page, isTabActive, onPressHandler) => {
        const textColor = isTabActive ? Colors.defaultColor : Colors.lightBlackColor;
        const textFontSize = isTabActive ? px(20) : px(14);
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
                    <Text style={[{color: textColor, fontSize: textFontSize}]}>{name}</Text>
                </View>
            </Button>
        );
    };

    render() {
        return (
            <View style={[styles.tabBarBox, this.props.boxStyle]}>
                <ScrollView
                    ref={(ref) => (this._scrollTabBarView = ref)}
                    onLayout={this.measureTabContainer.bind(this)}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={{flexDirection: 'row'}}>
                        {this.props.tabs.map((name, page) => {
                            const isTabActive = this.props.activeTab === page;
                            const renderTab = this.props.renderTab || this.renderTab;
                            return renderTab(name, page, isTabActive, this.props.goToPage);
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabBarBox: {
        height: tabHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
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
});
