/* eslint-disable radix */
/*
 * @Date: 2021-05-31 10:21:59
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-11 11:17:31
 * @Description:音频模块
 */

import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, debounce} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../redux/actions/visionData';
import LazyImage from '../LazyImage';
const VioceCard = ({data, style, scene}) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const jump = useJump();
    const [is_new, setIsNew] = useState(data.is_new);
    const dispatch = useDispatch();
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, style]}
            onPress={debounce(() => {
                setIsNew(false);
                global.LogTool(scene === 'index' ? 'indexRecArticle' : 'visionArticle', data.id);
                if (visionData?.album_update?.includes(data.album_id)) {
                    let arr = [...visionData?.album_update];
                    arr.splice(arr?.indexOf(data.album_id), 1);
                    dispatch(updateVision({album_update: arr}));
                }
                jump(data?.url, scene == 'article' ? 'push' : 'navigate');
            }, 300)}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    {data?.cate_icon ? (
                        <View style={[Style.flexRow, {marginBottom: px(9)}]}>
                            <FastImage
                                source={{uri: data?.cate_icon}}
                                style={{width: px(16), height: px(16), marginRight: px(6)}}
                            />
                            <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>{data?.cate_name}</Text>
                        </View>
                    ) : null}
                    {data.type == 2 || scene == 'collect' ? (
                        is_new ? (
                            <View>
                                <FastImage
                                    source={require('../../assets/img/article/voiceUpdate.png')}
                                    style={styles.new_tag}
                                />
                                <Text numberOfLines={2} style={styles.title}>
                                    &emsp;&emsp;
                                    {data?.title}
                                </Text>
                            </View>
                        ) : (
                            <Text numberOfLines={2} style={styles.title}>
                                {data.title}
                            </Text>
                        )
                    ) : (
                        <>
                            <View style={Style.flexRow}>
                                <Text numberOfLines={1} style={[styles.title]}>
                                    {data.album_name}
                                </Text>
                                {visionData?.album_update?.includes(data.album_id) ? (
                                    <View style={styles.badge} />
                                ) : null}
                            </View>
                            <Text numberOfLines={2} style={styles.detail}>
                                {data.title}
                            </Text>
                        </>
                    )}

                    <View style={[Style.flexRow, {marginTop: px(12)}]}>
                        <FastImage source={{uri: data?.author?.avatar}} style={styles.avatar} />
                        <Text style={{fontSize: px(13), color: Colors.lightBlackColor, marginHorizontal: px(6)}}>
                            {data?.author?.nickname}
                        </Text>
                        {data?.author?.icon ? (
                            <FastImage source={{uri: data?.author?.icon}} style={{width: px(12), height: px(12)}} />
                        ) : null}
                    </View>
                </View>
                {data?.cover ? (
                    <View style={styles.cover_con}>
                        <LazyImage
                            source={{uri: data?.cover}}
                            style={styles.cover}
                            logoStyle={{width: px(30), height: px(32)}}
                        />
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            style={[styles.media_duration, {justifyContent: 'flex-end'}]}
                            colors={['rgba(0, 0, 0, 0)', 'rgba(27, 25, 32, 1)']}>
                            <View style={[Style.flexRow]}>
                                <Icon name="md-play-circle-outline" size={px(16)} color="#fff" />
                                <Text style={styles.duration_text}>{data?.media_duration}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                ) : null}
            </View>
            {scene == 'collect' ? null : (
                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                    <Text style={styles.light_text}>{data?.view_num}人已收听</Text>
                    <Praise
                        noClick={true}
                        type={'article'}
                        comment={{
                            favor_status: data?.favor_status,
                            favor_num: parseInt(data?.favor_num),
                            id: data?.id,
                        }}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default VioceCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingTop: px(15),
        paddingBottom: px(12),
    },
    detail: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(17),
        height: px(36),
    },
    title: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        lineHeight: px(20),
        marginBottom: px(12),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    cover_con: {
        marginLeft: px(13),
        height: px(106),
        width: px(106),
    },
    cover: {
        height: px(106),
        width: px(106),
        borderRadius: px(6),
    },
    media_duration: {
        bottom: 0,
        zIndex: 100,
        height: px(34),
        width: px(106),
        paddingHorizontal: px(8),
        paddingVertical: px(4),
        position: 'absolute',
        borderBottomLeftRadius: px(8),
        borderBottomRightRadius: px(8),
    },
    avatar: {
        width: px(26),
        height: px(26),
        borderColor: Colors.lineColor,
        borderWidth: 0.5,
        borderRadius: px(13),
    },
    duration_text: {
        fontSize: px(12),
        color: '#fff',
        fontFamily: Font.numMedium,
        marginLeft: px(3),
    },
    badge: {
        width: px(8),
        height: px(8),
        borderRadius: px(4),
        marginLeft: px(8),
        marginTop: px(-12),
        backgroundColor: Colors.red,
    },
    new_tag: {
        width: px(23),
        height: px(18),
        position: 'absolute',
        left: 0,
        top: px(1),
    },
});
