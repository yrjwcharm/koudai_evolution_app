/*
 * @Date: 2021-05-18 11:10:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-20 15:56:50
 * @Description:视野
 */
import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {useJump} from '../../components/hooks';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from './components/ScrollTabbar';
import http from '../../services/index.js';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Colors, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import Recommend from './components/Recommend'; //推荐
import Question from './components/Question'; //魔方问答
import Contact from './components/Contact'; //策略沟通
import MarketDynamic from './components/MarketDynamic'; //市场动态
import Voice from './components/Vioce'; //魔方声音
const shadow = {
    color: '#ddd',
    border: 12,
    radius: 6,
    opacity: 0.4,
    x: -2,
    y: 12,
    width: px(52),
    height: px(22),
    style: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
};
const Vision = ({navigation, route}) => {
    const inset = useSafeAreaInsets();
    const jump = useJump();
    const [show, setShow] = useState(false);
    return (
        <View style={{paddingTop: inset.top, flex: 1, backgroundColor: Colors.bgColor}}>
            <View style={[Style.flexRow, {flex: 1}]}>
                <ScrollableTabView
                    renderTabBar={() => (
                        <ScrollTabbar
                            boxStyle={{paddingLeft: px(8), paddingRight: px(52), backgroundColor: Colors.bgColor}}
                        />
                    )}
                    initialPage={0}>
                    <Recommend tabLabel="推荐" />
                    <Question tabLabel="魔方问答" />
                    <MarketDynamic tabLabel="市场动态" />
                    <Contact tabLabel="策略沟通" />
                    <Voice tabLabel="魔方声音" />
                </ScrollableTabView>
                <BoxShadow setting={shadow}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.menu}
                        onPress={() => {
                            navigation.navigate('VisionCollect');
                        }}>
                        <Image
                            source={require('../../assets/img/vision/menu.png')}
                            style={{width: px(24), height: px(24)}}
                        />
                    </TouchableOpacity>
                </BoxShadow>
            </View>
        </View>
    );
};

export default Vision;

const styles = StyleSheet.create({
    menu: {
        height: px(42),
        width: px(52),
        paddingLeft: px(11),
        paddingRight: px(17),
        justifyContent: 'center',
        backgroundColor: Colors.bgColor,
    },
});
