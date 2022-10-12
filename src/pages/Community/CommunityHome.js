// // /*
// //  * @Date: 2022-10-09 14:35:24
// //  * @Description:
// //  */
import {StyleSheet, Text, View, Animated, ImageBackground, Image, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import {deviceWidth, px} from '~/utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '~/common/commonStyle';
const CommunityHome = ({navigation}) => {
    const inset = useSafeAreaInsets();
    const headerHeight = inset.top + px(44);
    const parallaxHeaderHeight = px(130);
    const [parallTitle, setParallTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const Header = () => {
        return (
            <Animated.View
                style={[
                    styles.header,
                    Style.flexBetween,
                    {
                        height: headerHeight,
                        paddingTop: inset.top,
                        backgroundColor: scrollY.interpolate({
                            inputRange: [px(50), px(130)],
                            outputRange: ['rgba(0,0,0,0)', '#fff'],
                            extrapolate: 'clamp',
                        }),
                    },
                ]}>
                <TouchableOpacity style={{width: px(40)}} onPress={() => navigation.goBack()}>
                    <Icon name="left" size={px(18)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity>
                {parallTitle && (
                    <Text style={[styles.vName, {color: Colors.defaultColor, marginBottom: 0}]}>马老师</Text>
                )}
                <TouchableOpacity style={{width: px(40), alignItems: 'flex-end'}}>
                    <Icon name="ellipsis1" size={px(30)} color={parallTitle ? Colors.defaultColor : '#fff'} />
                </TouchableOpacity>
            </Animated.View>
        );
    };
    return (
        <>
            <Header />
            <Animated.ScrollView
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                        },
                    ],
                    {
                        useNativeDriver: false,
                        listener: (e) => {
                            let y = e.nativeEvent.contentOffset.y;
                            if (y - parallaxHeaderHeight > -px(50)) {
                                setParallTitle(true);
                            } else {
                                setParallTitle(false);
                            }
                        },
                    }
                )}>
                <ImageBackground
                    source={{
                        uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/08/yanglao2@3x.jpg',
                    }}
                    style={{
                        width: deviceWidth,
                        height: px(220),
                        paddingTop: headerHeight + px(20),
                        paddingHorizontal: px(20),
                    }}>
                    <View style={Style.flexRow}>
                        <Image
                            source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png'}}
                            style={styles.headerAvatar}
                        />
                        <View>
                            <Text style={styles.vName}>马老师</Text>
                            <View style={Style.flexRow}>
                                <Image
                                    source={{
                                        uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png',
                                    }}
                                    style={{width: px(16), height: px(16), borderRadius: px(8), marginRight: px(2)}}
                                />
                                <Text style={{fontSize: px(12), lineHeight: px(17), color: '#fff'}}>马老师</Text>
                            </View>
                        </View>
                        <View style={{paddingVertical: px(6), paddingHorizontal: px(14), borderRadius: px(103)}}>
                            <Text>已关注</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{marginTop: px(-30), backgroundColor: '#fff'}}>
                    <Text>
                        从大明星到小黑马，从权益到债券，从理念到八卦，这群中国最聪明的人，全天候社区带你慢慢了解！
                    </Text>
                    <ScrollableTabView renderTabBar={() => <ScrollTabbar />}>
                        <View style={{height: px(500), backgroundColor: 'red'}} tabLabel="哈哈" pointerEvents="none" />
                        <View style={{height: px(1500)}} tabLabel="哈哈11" />
                    </ScrollableTabView>
                </View>
            </Animated.ScrollView>
        </>
    );
};

export default CommunityHome;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width: deviceWidth,
        zIndex: 20,
        paddingHorizontal: px(16),
    },
    headerAvatar: {
        width: px(66),
        height: px(66),
        marginRight: px(12),
        borderRadius: px(33),
        borderWidth: px(2),
        borderColor: '#fff',
    },
    vName: {
        fontSize: px(18),
        lineHeight: px(25),
        marginBottom: px(6),
        color: '#fff',
        fontWeight: '700',
    },
});
