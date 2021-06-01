/*
 * @Date: 2021-05-18 11:10:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-01 14:51:18
 * @Description:视野
 */
import React, {useState, useEffect} from 'react';
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
import CommonView from './components/CommonView'; //魔方问答
import LinearGradient from 'react-native-linear-gradient';
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
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        http.get('/vision/tabs/20210524').then((res) => {
            setTabs(res.result);
        });
    }, []);

    const _renderDynamicView = () => {
        const _views = [];
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].k == 'recommend') {
                _views.push(<Recommend tabLabel={tabs[i].v} k={tabs[i].k} />);
            } else {
                _views.push(<CommonView tabLabel={tabs[i].v} k={tabs[i].k} />);
            }
        }
        return _views;
    };

    return (
        <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 0.2}} colors={['#fff', '#F5F6F8']} style={{flex: 1}}>
            <View style={{height: inset.top}} />
            <View style={[Style.flexRow, {flex: 1}]}>
                {tabs?.length > 0 ? (
                    <ScrollableTabView renderTabBar={() => <ScrollTabbar boxStyle={styles.tab} />} initialPage={0}>
                        {_renderDynamicView()}
                    </ScrollableTabView>
                ) : null}
                <BoxShadow setting={shadow}>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#FBFBFC', '#F6F7F9']}>
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
                    </LinearGradient>
                </BoxShadow>
            </View>
        </LinearGradient>
    );
};

export default Vision;

const styles = StyleSheet.create({
    tab: {
        paddingLeft: px(8),
        paddingRight: px(52),
        backgroundColor: 'transparent',
    },
    menu: {
        height: px(42),
        width: px(52),
        paddingLeft: px(11),
        paddingRight: px(17),
        justifyContent: 'center',
        // backgroundColor: '#F5F6F8',
    },
});
