/*
 * @Date: 2021-05-31 10:22:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-31 11:32:16
 * @Description:推荐模块
 */
import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, findNodeHandle} from 'react-native';
import {Colors, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';

const RecommendCard = (props) => {
    const [blurRef, setBlurRef] = useState(null);
    const viewRef = useRef(null);
    return (
        <>
            <View
                style={[styles.card, props.style]}
                onLayout={() => {
                    viewRef && setBlurRef(findNodeHandle(viewRef.current));
                }}>
                <FastImage
                    style={{width: '100%', height: px(302)}}
                    source={{
                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/03/recommeng_bg_longterm.png',
                    }}
                />
                <View style={{padding: px(16)}}>
                    <Text style={styles.recommend_title} numberOfLines={2}>
                        理财必须有底线，有底线才能放大钱，标题最多两行一共三十六个字
                    </Text>
                    <View style={Style.flexRow}>
                        {/* <FastImage/> */}
                        <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>理财魔方</Text>
                        {/* <FastImage/> */}
                    </View>
                    <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                        <Text style={styles.light_text}>22人已阅读</Text>

                        {/* <Praise comment={data} type={'article'} /> */}
                    </View>
                </View>
                <View
                    style={{
                        position: 'absolute',
                        width: deviceWidth - px(32),
                        height: px(120),
                        top: px(95),
                        zIndex: 10,
                        alignItems: 'center',
                    }}>
                    <FastImage source={require('../../assets/img/vision/suo.png')} />
                    <Text>1111</Text>
                </View>
                <BlurView
                    blurAmount={2}
                    viewRef={blurRef}
                    blurType={'light'}
                    style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                />
            </View>
        </>
    );
};

export default RecommendCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    recommend_title: {
        fontSize: px(17),
        lineHeight: px(26),
        fontWeight: '700',
    },
});
