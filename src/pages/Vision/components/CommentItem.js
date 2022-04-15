/*
 * @Date: 2022-04-07 17:02:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-15 11:06:38
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import LottieView from 'lottie-react-native';
const CommentItem = ({data, style}) => {
    const [favor_num, setFavorNum] = useState(100);
    const [favor_status, setFavorStatus] = useState(false);
    const zanRef = useRef();

    const onFavor = () => {
        setFavorNum((preNum) => {
            return favor_status ? --preNum : ++preNum;
        });
        setFavorStatus((pre_status) => {
            zanRef.current.play();
            return !pre_status;
        });
    };
    const renderContent = (_style) => {
        return (
            <View style={[Style.flexRow, {alignItems: 'flex-start'}, _style]}>
                <FastImage
                    source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/avatar_013.jpeg'}}
                    style={styles.avatar}
                />
                <View style={[{flex: 1}]}>
                    <View style={[Style.flexBetween, {marginBottom: px(-10)}]}>
                        <Text style={styles.name}>{data.title}</Text>
                        <TouchableOpacity style={Style.flexRow} onPress={onFavor} activeOpacity={0.9}>
                            <Text style={styles.zan_text}>{favor_num}</Text>
                            <LottieView
                                ref={zanRef}
                                loop={false}
                                autoPlay
                                source={
                                    favor_status
                                        ? require('../../../assets/animation/zanActive.json')
                                        : require('../../../assets/animation/zan.json')
                                }
                                style={{height: px(36), width: px(36), right: -px(4)}}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.content}>
                        看到理财魔方，感觉像是找到人生中的灯塔，照亮我前行的方向，之前啥也不懂，亏钱亏钱亏钱亏到怀疑人生，现在好了，稳定赚钱赚钱，文章显示最多500个中文字。
                    </Text>
                    <Text style={styles.date}>3月10日</Text>
                </View>
            </View>
        );
    };
    return (
        <View style={style}>
            {renderContent({marginBottom: px(11)})}
            {renderContent({marginLeft: px(46), marginBottom: px(11)})}
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    avatar: {
        width: px(32),
        height: px(32),
        borderRadius: px(16),
        marginRight: px(12),
    },
    name: {
        fontSize: px(14),
        color: Colors.lightBlackColor,
    },
    content: {
        marginTop: px(8),
        fontSize: px(14),
        lineHeight: px(22),
        textAlign: 'justify',
    },
    date: {
        fontSize: px(12),
        marginTop: px(8),
        color: Colors.lightGrayColor,
    },
    zan_text: {fontFamily: Font.numRegular, fontSize: px(11), color: Colors.lightBlackColor, right: -px(14)},
});
