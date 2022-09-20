/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-16 16:55:33
 */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {useJump} from '~/components/hooks';
import http from '~/services';
import {px} from '~/utils/appUtil';

const PortfolioIndex = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const init = () => {
        http.get('/products/portfolio/index/20220901', route?.params?.params).then((res) => {
            if (res.code === '000000') {
                const {title} = res.result;
                navigation.setOptions({
                    title: title || '组合',
                    headerRight: () => {
                        <TouchableOpacity
                            style={[Style.flexRowCenter, {marginRight: Space.marginAlign}]}
                            activeOpacity={0.8}
                            onPress={onHeaderRightPress}>
                            <FastImage
                                source={{
                                    uri: 'http://static.licaimofang.com/wp-content/uploads/2022/09/header-right.png',
                                }}
                                style={{width: px(24), height: px(24)}}
                            />
                        </TouchableOpacity>;
                    },
                });
                setData(res.result);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const onHeaderRightPress = () => {};

    const genTopMenu = () => {
        return (
            <View style={styles.topMenu}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item, idx) => (
                    <View style={[styles.topMenuItem]}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <FastImage
                                source={{
                                    uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/jyyd@3x.png',
                                }}
                                style={styles.topMenuItemIcon}
                            />
                        </View>
                        <Text style={styles.topMenuItemText}>分类名称</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}} scrollEventThrottle={16}>
                <LinearGradient
                    colors={['#FFFFFF', '#F4F5F7']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={{height: px(353)}}>
                    {genTopMenu()}
                </LinearGradient>
                <BottomDesc />
            </ScrollView>
        </View>
    );
};

export default PortfolioIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    topMenu: {
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    topMenuItem: {
        width: px(68),
        marginTop: px(16),
    },
    topMenuItemIcon: {
        width: px(26),
        height: px(26),
    },
    topMenuItemText: {
        fontSize: px(11),
        color: '#121d3a',
        lineHeight: px(15),
        marginTop: px(8),
        textAlign: 'center',
    },
});
