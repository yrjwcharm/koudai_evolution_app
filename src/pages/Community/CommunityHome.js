// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:
// //  */
import {StyleSheet, Text, View, Animated} from 'react-native';
import React, {useRef} from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const CommunityHome = () => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(42);
    const parallaxHeaderHeight = px(130);
    const scrollY = useRef(new Animated.Value(0)).current;
    const Header = () => {
        return (
            <Animated.View
                style={{
                    height: headerHeight,
                    paddingTop: inset.top,
                    position: 'absolute',
                    width: deviceWidth,
                    // backgroundColor: '#fff',
                    zIndex: 10,
                    backgroundColor: scrollY.interpolate({
                        inputRange: [0, px(130)],
                        outputRange: ['rgba(0,0,0,0)', '#fff'],
                    }),
                }}>
                <Text>123</Text>
            </Animated.View>
        );
    };
    return (
        <>
            <Header />
            <Animated.ScrollView
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                            },
                        ],
                        {
                            useNativeDriver: false,
                            listener: (e) => {
                                let y = e.nativeEvent.contentOffset.y;
                                console.log(e);
                            },
                        }
                    ) // 使用原生动画驱动
                }>
                <Header />
                <Text>CommunityHome</Text>
                <Text>CommunityHome</Text>
                <Text>CommunityHome</Text>
                <Text>CommunityHome</Text>
                <ScrollableTabView renderTabBar={() => <ScrollTabbar />}>
                    <View style={{height: px(500), backgroundColor: 'red'}} tabLabel="哈哈" />
                    <View style={{height: px(1500), backgroundColor: 'blue'}} tabLabel="哈哈11" />
                </ScrollableTabView>
            </Animated.ScrollView>
        </>
    );
};

export default CommunityHome;

const styles = StyleSheet.create({});
