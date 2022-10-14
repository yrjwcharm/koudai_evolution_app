/*
 * @Date: 2022-10-09 14:51:26
 * @Description: 社区卡片
 */
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import collect from '~/assets/img/icon/collect.png';
import collectActive from '~/assets/img/icon/collectActive.png';
import comment from '~/assets/img/icon/comment.png';
import live from '~/assets/img/vision/live.gif';
import share from '~/assets/img/icon/share.png';
import video from '~/assets/img/vision/video.png';
import videoPlay from '~/assets/img/icon/videoPlay.png';
import zan from '~/assets/img/icon/zan.png';
import zanActive from '~/assets/img/icon/zanActive.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import AnimateAvatar from '~/components/AnimateAvatar';
import {useJump} from '~/components/hooks';
import {ShareModal} from '~/components/Modal';
import {deviceWidth, formaNum, px} from '~/utils/appUtil';

/** @name 社区卡片封面 */
export const CommunityCardCover = ({
    attention_num,
    attention_user,
    cover, // 封面
    cover_aspect_ratio,
    live_status, // 直播状态 1 预约中 2 直播中 3 回放
    media_duration, // 媒体时长
    people_num_desc, // 直播时间或观看人数
    status_desc, // 直播状态或预约人数
    style, // 自定义样式
    type, // 卡片类型 1文章 2音频 3视频 9直播
    type_str, // 类型文案
    width: coverWidth = px(180), // 封面宽度
}) => {
    const [aspectRatio, setAspectRatio] = useState(cover_aspect_ratio || Infinity); // 图片宽高比
    const statusColor = useRef({
        1: '#FF7D41',
        2: Colors.red,
        3: Colors.brandColor,
    });

    return (
        <View style={[Style.flexCenter, styles.coverContainer, {height: coverWidth / aspectRatio}, style]}>
            <Image
                onLoad={({nativeEvent: {width, height}}) => !cover_aspect_ratio && setAspectRatio(width / height)}
                source={{uri: cover}}
                style={styles.cover}
            />
            {/* 预约人数直播观看人数 */}
            {people_num_desc || status_desc ? (
                <View style={[Style.flexRow, styles.liveInfo]}>
                    {people_num_desc ? (
                        <View
                            style={[
                                Style.flexRow,
                                styles.waitTag,
                                {backgroundColor: statusColor.current[live_status]},
                            ]}>
                            <Image source={live_status === 2 ? live : video} style={styles.liveIcon} />
                            <Text style={styles.numDesc}>{status_desc}</Text>
                        </View>
                    ) : null}
                    {status_desc ? (
                        <View style={[Style.flexRow, styles.waitTag, {paddingLeft: px(6)}]}>
                            <Text style={styles.numDesc}>{people_num_desc}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
            {/* 媒体时长或类型文案 */}
            {media_duration || type_str ? (
                <View style={[Style.flexRow, styles.durationBox]}>
                    {media_duration ? (
                        type === 2 ? (
                            <Feather color="#fff" name="headphones" size={px(8)} />
                        ) : (
                            <FontAwesome5 color="#fff" name="play" size={px(8)} />
                        )
                    ) : null}
                    <Text style={media_duration ? [styles.numDesc, {fontFamily: Font.numRegular}] : styles.numDesc}>
                        {media_duration || type_str}
                    </Text>
                </View>
            ) : null}
            {/* 视频播放图片 */}
            {type === 3 ? <Image source={videoPlay} style={styles.videoPlay} /> : null}
            {/* 社区关注人数 */}
            {attention_num && attention_user ? (
                <View style={[Style.flexRow, styles.communityFollowNum]}>
                    {attention_user.map?.((img, i) => {
                        return (
                            <Image
                                key={img + i}
                                source={{uri: img}}
                                style={[styles.smAvatar, {marginLeft: i === 0 ? 0 : -px(4)}]}
                            />
                        );
                    })}
                    <Text style={[styles.smText, {marginLeft: px(4), color: '#fff'}]}>
                        <Text style={{fontFamily: Font.numRegular}}>{formaNum(attention_num, 'nozero')}</Text>
                        人关注
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

/** @name 社区关注卡片 */
export const CommunityFollowCard = ({
    author, // 作者信息
    author_desc,
    button,
    collect_num, // 收藏数
    collect_status, // 收藏状态 0 未收藏 1 已收藏
    comment_num, // 评论数
    cover, // 封面
    desc, // 文章内容摘要
    favor_num, // 点赞数
    favor_status, // 点赞状态 0 未点赞 1 已点赞
    live_status, // 直播状态 1 预约中 2 直播中 3 回放
    people_num_desc, // 直播时间或观看人数
    play_mode, // 视频播放模式 1 竖屏 2 横屏
    reserved, // 直播是否已预约
    share_num, // 分享数
    share_info, // 分享相关信息
    status_desc, // 直播状态或预约人数
    style, // 自定义样式
    title, // 卡片标题
    type, // 卡片类型 1文章 2音频 3视频 9直播
    type_str, // 类型文案
    url, // 跳转地址
}) => {
    const jump = useJump();
    const [collected, setCollected] = useState(collect_status); // 是否收藏
    const [favored, setFavored] = useState(favor_status); // 是否点赞
    const [isReserved, setIsReserved] = useState(reserved); // 直播是否已预约
    const shareModal = useRef();

    return (
        <>
            <View style={[styles.communityCard, style]}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(url)}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(author.url)} style={Style.flexRow}>
                        {type === 9 && live_status === 2 ? (
                            <AnimateAvatar source={author.avatar} style={styles.avatar} />
                        ) : (
                            <Image source={{uri: author.avatar}} style={styles.avatar} />
                        )}
                        <View>
                            <Text style={styles.subTitle}>{author.nickname}</Text>
                            <Text style={[styles.smText, {marginTop: px(2)}]}>{author_desc}</Text>
                        </View>
                    </TouchableOpacity>
                    {title ? <Text style={[styles.subTitle, {marginTop: px(8)}]}>{title}</Text> : null}
                    {desc ? <Text style={[styles.desc, {marginTop: px(8)}]}>{desc}</Text> : null}
                    {cover ? (
                        <CommunityCardCover
                            cover={cover}
                            live_status={live_status}
                            people_num_desc={people_num_desc}
                            status_desc={status_desc}
                            style={{...styles.followCover, width: play_mode === 2 ? '100%' : px(180)}}
                            type={type}
                            type_str={type_str}
                            width={play_mode === 2 ? deviceWidth - 2 * Space.padding - 2 * px(12) : px(180)}
                        />
                    ) : null}
                </TouchableOpacity>
                {type === 9 ? (
                    live_status === 1 ? (
                        // 直播预约按钮
                        <View style={[Style.flexBetween, styles.applyBox]}>
                            <Text style={[styles.numDesc, {color: Colors.defaultColor}]}>
                                直播时间：{people_num_desc}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isReserved}
                                onPress={() => setIsReserved((prev) => Number(!prev))}
                                style={[
                                    styles.applyBtn,
                                    {borderColor: isReserved ? Colors.lightGrayColor : Colors.brandColor},
                                ]}>
                                <Text
                                    style={[
                                        styles.desc,
                                        {color: isReserved ? Colors.lightGrayColor : Colors.brandColor},
                                    ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                ) : (
                    // 卡片底部分享、收藏、评论和点赞
                    <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => shareModal.current?.show()}
                            style={Style.flexRow}>
                            <Image source={share} style={styles.operationIcon} />
                            <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{share_num}</Text>
                        </TouchableOpacity>
                        <View style={Style.flexRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setCollected((prev) => Number(!prev))}
                                style={[Style.flexRow, {marginRight: px(16)}]}>
                                <Image
                                    source={collected === 0 ? collect : collectActive}
                                    style={styles.operationIcon}
                                />
                                <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{collect_num}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={[Style.flexRow, {marginRight: px(16)}]}>
                                <Image source={comment} style={styles.operationIcon} />
                                <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{comment_num}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setFavored((prev) => Number(!prev))}
                                style={Style.flexRow}>
                                <Image source={favored === 0 ? zan : zanActive} style={styles.operationIcon} />
                                <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{favor_num}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            {share_info ? (
                <ShareModal ref={shareModal} shareContent={share_info} title={share_info.title || ''} />
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    coverContainer: {
        width: px(180),
        height: px(240),
        overflow: 'hidden',
    },
    cover: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    liveInfo: {
        borderBottomRightRadius: Space.borderRadius,
        height: px(20),
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    waitTag: {
        paddingRight: px(6),
        paddingLeft: px(8),
        height: '100%',
    },
    liveIcon: {
        marginRight: px(4),
        width: px(12),
        height: px(12),
    },
    numDesc: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    communityCard: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    avatar: {
        marginRight: px(6),
        borderRadius: px(32),
        width: px(32),
        height: px(32),
    },
    followCover: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
    },
    durationBox: {
        paddingHorizontal: px(6),
        borderRadius: px(4),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: px(16),
        position: 'absolute',
        right: px(8),
        bottom: px(8),
    },
    videoPlay: {
        width: px(48),
        height: px(48),
    },
    communityFollowNum: {
        position: 'absolute',
        top: px(8),
        left: px(10),
    },
    smAvatar: {
        borderRadius: px(16),
        width: px(16),
        height: px(16),
    },
    operationIcon: {
        marginRight: px(2),
        width: px(16),
        height: px(16),
    },
    applyBox: {
        marginTop: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(8),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    applyBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(12),
        borderRadius: px(24),
        borderWidth: Space.borderWidth,
    },
});
