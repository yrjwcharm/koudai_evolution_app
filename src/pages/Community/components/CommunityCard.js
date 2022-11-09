/*
 * @Date: 2022-10-09 14:51:26
 * @Description: 社区卡片
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppState, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import HapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import LazyImage from '~/components/LazyImage';
import {Modal, ShareModal} from '~/components/Modal';
import HTML from '~/components/RenderHtml';
import {deviceWidth, formaNum, px} from '~/utils/appUtil';
import {liveReserve, postCollect, postFavor, postShare} from '../CommunityIndex/services';
import {debounce} from 'lodash';

/** @name 社区卡片封面 */
export const CommunityCardCover = ({
    attention_num, // 社区关注人数
    attention_user, // 社区关注头像
    cover, // 封面
    cover_aspect_ratio, // 封面宽高比
    left_desc, // 直播状态或预约人数
    live_status, // 直播状态 1 预约中 2 直播中 3 回放
    media_duration, // 媒体时长
    right_desc, // 直播时间或观看人数
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
        <View style={[styles.coverContainer, {height: coverWidth / aspectRatio}, style]}>
            <LazyImage
                onLoad={({nativeEvent: {width, height}}) => !cover_aspect_ratio && setAspectRatio(width / height)}
                source={{uri: cover}}
                style={styles.cover}
            />
            {/* 预约人数直播观看人数 */}
            {left_desc || right_desc ? (
                <View style={[Style.flexRow, styles.liveInfo]}>
                    {left_desc ? (
                        <View
                            style={[
                                Style.flexRow,
                                styles.waitTag,
                                {backgroundColor: statusColor.current[live_status]},
                            ]}>
                            <Image source={live_status === 2 ? live : video} style={styles.liveIcon} />
                            <Text style={styles.numDesc}>{left_desc}</Text>
                        </View>
                    ) : null}
                    {right_desc ? (
                        <View style={[Style.flexRow, styles.waitTag, {paddingLeft: px(6)}]}>
                            <Text style={styles.numDesc}>{right_desc}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
            {/* 媒体时长或类型文案 */}
            {media_duration || type_str ? (
                <View style={[Style.flexRow, styles.durationBox]}>
                    {type === 2 || type === 3 ? (
                        <View style={{marginRight: px(4)}}>
                            {type === 2 ? (
                                <Feather color="#fff" name="headphones" size={px(8)} />
                            ) : (
                                <FontAwesome color="#fff" name="play" size={px(5)} />
                            )}
                        </View>
                    ) : null}
                    <Text
                        style={
                            type === 2 || type === 3 ? [styles.numDesc, {fontFamily: Font.numRegular}] : styles.numDesc
                        }>
                        {type === 2 || type === 3 ? media_duration : type_str}
                    </Text>
                </View>
            ) : null}
            {/* 视频播放图片 */}
            {type === 3 ? <Image source={videoPlay} style={styles.videoPlay} /> : null}
            {/* 社区关注人数 */}
            {attention_num && attention_user ? (
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0)']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.communityFollowNumBg}>
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
                </LinearGradient>
            ) : null}
        </View>
    );
};

/** @name 社区关注卡片 */
export const CommunityCard = (props) => {
    const {
        attention_num, // 社区关注人数
        attention_user, // 社区关注头像
        author, // 作者信息
        author_desc,
        button,
        collect_num, // 收藏数
        collect_status, // 收藏状态 0 未收藏 1 已收藏
        comment_info, //评论
        comment_num, // 评论数
        comment_url, // 评论页地址
        cover, // 封面
        cover_aspect_ratio, // 封面宽高比
        desc, // 文章内容摘要
        favor_num, // 点赞数
        favor_status, // 点赞状态 0 未点赞 1 已点赞
        id,
        live_status, // 直播状态 1 预约中 2 直播中 3 回放
        left_desc, // 直播状态或预约人数
        media_duration, // 媒体时长
        can_delete, //是否显示移除
        play_mode, // 视频播放模式 1 竖屏 2 横屏
        product_type, // "article_history" 不展示底部操作按钮
        relation_type,
        reserved, // 直播是否已预约
        right_desc, // 直播时间或观看人数
        share_num, // 分享数
        share_info, // 分享相关信息
        title, // 卡片标题
        type, // 卡片类型 1文章 2音频 3视频 9直播
        type_str, // 类型文案
        url, // 跳转地址
    } = props.data || {};
    const {
        isRecommend = false, // 是否推荐卡片
        onDelete, //移除作品
        style, // 自定义样式
    } = props;
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.();
    const [collected, setCollected] = useState(collect_status); // 是否收藏
    const [favored, setFavored] = useState(favor_status); // 是否点赞
    const [isReserved, setIsReserved] = useState(reserved); // 直播是否已预约
    const [leftDesc, setLeftDesc] = useState(left_desc);
    const [favorNum, setFavorNum] = useState(favor_num);
    const [collectNum, setCollectNum] = useState(collect_num);
    const [shareNum, setShareNum] = useState(share_num);
    const shareModal = useRef();

    const onBottomOps = useCallback(
        debounce(
            (opType, otherParams = {}) => {
                if (opType === 'collect')
                    global.LogTool({event: collected ? 'cancel_collection' : 'content_collection', oid: id});
                else if (opType === 'favor')
                    global.LogTool({event: favored ? 'cancel_like' : 'content_thumbs', oid: id});
                else global.LogTool({ctrl: otherParams.share_to, event: 'content_share', oid: id});
                const postParams = {resource_id: id};
                if (opType === 'collect' || opType === 'favor') {
                    postParams.action_type = Number(!(opType === 'collect' ? collected : favored));
                    postParams.resource_cate = 'article';
                } else {
                    Object.assign(postParams, otherParams);
                }
                (opType === 'collect' ? postCollect : opType === 'favor' ? postFavor : postShare)(postParams).then(
                    (res) => {
                        if (res.code === '000000') {
                            if (opType === 'collect' || opType === 'favor') {
                                (opType === 'collect' ? setCollected : setFavored)((status) => {
                                    !status &&
                                        HapticFeedback.trigger('impactLight', {
                                            enableVibrateFallback: true,
                                            ignoreAndroidSystemSettings: false,
                                        });
                                    return Number(!status);
                                });
                                (opType === 'collect' ? setCollectNum : setFavorNum)((num) =>
                                    !(opType === 'collect' ? collected : favored) ? num + 1 : num - 1
                                );
                            } else {
                                setShareNum((n) => n + 1);
                            }
                        }
                    }
                );
            },
            300,
            {leading: true, trailing: false}
        ),
        [collected, favored]
    );

    const checkPermission = (sucess, fail) => {
        checkNotifications().then(({status}) => {
            if (status === 'blocked' || status === 'denied') {
                fail();
            } else {
                sucess();
            }
        });
    };

    const handleAppStateChange = (nextState) => {
        if (nextState === 'active' && !isReserved) {
            checkPermission(
                () => postReserve(id),
                () => {
                    AppState.removeEventListener('change', handleAppStateChange);
                    setIsReserved(false);
                }
            );
        }
    };

    const postReserve = (liveId) => {
        liveReserve({id: liveId}).then((res) => {
            if (res.code === '000000') {
                const {desc: content, title: modalTitle} = res.result;
                const reservedNum = /\d+/.exec(leftDesc);
                setIsReserved(true);
                reservedNum && setLeftDesc((prev) => prev.replace(/\d+/, Number(reservedNum) + 1));
                modalTitle && Modal.show({content, title: modalTitle});
            }
        });
    };

    const onReserve = () => {
        if (!userInfo.is_login) jump({path: 'Login'});
        else {
            checkPermission(
                () => postReserve(id),
                () => {
                    requestNotifications(['alert', 'sound']).then(({status: _status}) => {
                        if (_status === 'granted') {
                            postReserve(id);
                        } else {
                            Modal.show({
                                title: '权限申请',
                                content: '我们将在直播前10分钟为您推送提醒，请开启通知权限',
                                confirm: true,
                                confirmText: '前往',
                                confirmCallBack: () => {
                                    AppState.addEventListener('change', handleAppStateChange);
                                    openSettings().catch(() => console.warn('cannot open settings'));
                                },
                            });
                        }
                    });
                }
            );
        }
    };

    useEffect(() => {
        setCollected(collect_status);
        setCollectNum(collect_num);
        setFavored(favor_status);
        setFavorNum(favor_num);
        setShareNum(share_num);
        setLeftDesc(left_desc);
        setIsReserved(reserved);
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, [props.data]);

    return (
        <>
            <View style={[isRecommend ? {} : styles.communityCard, style]}>
                {can_delete && (
                    <TouchableOpacity
                        style={[styles.cardDelete, Style.flexRow]}
                        onPress={() => {
                            onDelete(relation_type, id);
                        }}>
                        <AntdIcon name="close" color={Colors.lightGrayColor} />
                        <Text style={{fontSize: px(11), color: Colors.lightGrayColor}}>移除</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        global.LogTool({event: 'content', oid: id});
                        jump(url);
                    }}>
                    {isRecommend ? null : (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(author.url)}
                                style={Style.flexRow}>
                                {author?.avatar ? (
                                    type === 9 && live_status === 2 ? (
                                        <AnimateAvatar source={author.avatar} style={styles.avatar} />
                                    ) : (
                                        <Image source={{uri: author.avatar}} style={styles.avatar} />
                                    )
                                ) : null}
                                <View>
                                    <Text style={styles.subTitle}>{author?.nickname}</Text>
                                    <Text style={[styles.smText, {marginTop: px(2)}]}>{author_desc}</Text>
                                </View>
                            </TouchableOpacity>
                            {title ? <Text style={[styles.subTitle, {marginTop: px(8)}]}>{title}</Text> : null}
                            {desc ? <Text style={[styles.desc, {marginTop: px(8)}]}>{desc}</Text> : null}
                        </>
                    )}
                    {cover ? (
                        <CommunityCardCover
                            attention_num={attention_num}
                            attention_user={attention_user}
                            cover={cover}
                            cover_aspect_ratio={cover_aspect_ratio}
                            live_status={live_status}
                            left_desc={leftDesc}
                            media_duration={media_duration}
                            right_desc={right_desc}
                            style={
                                isRecommend
                                    ? {width: (deviceWidth - 3 * px(5)) / 2}
                                    : {...styles.followCover, width: play_mode === 2 ? '100%' : px(180)}
                            }
                            type={type}
                            type_str={type_str}
                            width={
                                isRecommend
                                    ? (deviceWidth - 3 * px(5)) / 2
                                    : play_mode === 2
                                    ? deviceWidth - 2 * Space.padding - 2 * px(12)
                                    : px(180)
                            }
                        />
                    ) : isRecommend ? (
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/contentBg.png'}}
                            style={styles.contentBg}
                        />
                    ) : null}
                </TouchableOpacity>
                {/* 评论 */}
                {comment_info && !isRecommend && (
                    <View style={{padding: px(8), backgroundColor: '#F5F6F8', borderRadius: px(6), marginTop: px(9)}}>
                        <View style={Style.flexBetween}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(comment_info?.url)}
                                style={Style.flexRow}>
                                <Image
                                    source={{uri: comment_info?.avatar}}
                                    style={{width: px(16), height: px(16), marginRight: px(4), borderRadius: px(8)}}
                                />
                                <Text>{comment_info?.nickname}</Text>
                            </TouchableOpacity>
                            <View style={Style.flexRow}>
                                <Text style={[styles.smText, {fontFamily: Font.numRegular}]}>
                                    {comment_info?.favor_num}
                                </Text>
                                <Image source={zan} style={{width: px(16), height: px(16), marginLeft: px(4)}} />
                            </View>
                        </View>
                        <Text
                            style={{
                                color: Colors.lightBlackColor,
                                fontSize: px(12),
                                lineHeight: px(20),
                                marginTop: px(8),
                            }}>
                            {comment_info?.content}
                        </Text>
                    </View>
                )}
                {isRecommend ? (
                    <View style={{padding: px(10), paddingBottom: px(12)}}>
                        {title ? <HTML html={title} numberOfLines={2} style={styles.subTitle} /> : null}
                        {desc ? (
                            <HTML
                                html={desc}
                                nativeProps={{containerStyle: {marginTop: px(8)}}}
                                numberOfLines={4}
                                style={styles.desc}
                            />
                        ) : null}
                        {author?.nickname ? (
                            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                                <View style={Style.flexRow}>
                                    {author?.avatar ? (
                                        type === 9 && live_status === 2 ? (
                                            <AnimateAvatar source={author.avatar} style={styles.recommendAvatar} />
                                        ) : (
                                            <Image source={{uri: author.avatar}} style={styles.recommendAvatar} />
                                        )
                                    ) : null}
                                    <Text numberOfLines={1} style={[styles.smText, {maxWidth: px(88)}]}>
                                        {author.nickname}
                                    </Text>
                                </View>
                                {live_status === 1 && button?.text ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        disabled={isReserved}
                                        onPress={onReserve}
                                        style={[
                                            styles.applyBtn,
                                            {borderColor: isReserved ? Colors.lightGrayColor : Colors.brandColor},
                                        ]}>
                                        <Text
                                            style={[
                                                styles.desc,
                                                {color: isReserved ? Colors.lightGrayColor : Colors.brandColor},
                                            ]}>
                                            {isReserved ? '已预约' : button.text}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                ) : type === 9 ? (
                    button?.text && live_status === 1 ? (
                        // 直播预约按钮
                        <View style={[Style.flexBetween, styles.applyBox]}>
                            <Text style={[styles.numDesc, {color: Colors.defaultColor}]}>直播时间：{right_desc}</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isReserved}
                                onPress={onReserve}
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
                ) : // 卡片底部分享、收藏、评论和点赞
                product_type === 'article_history' ? null : (
                    <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => shareModal.current?.show()}
                            style={Style.flexRow}>
                            <Image source={share} style={styles.operationIcon} />
                            <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{shareNum}</Text>
                        </TouchableOpacity>
                        <View style={Style.flexRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onBottomOps('collect')}
                                style={[Style.flexRow, {marginRight: px(16)}]}>
                                <Image
                                    source={collected === 0 ? collect : collectActive}
                                    style={styles.operationIcon}
                                />
                                <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{collectNum}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(comment_url)}
                                style={[Style.flexRow, {marginRight: px(16)}]}>
                                <Image source={comment} style={styles.operationIcon} />
                                <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{comment_num}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onBottomOps('favor')}
                                style={Style.flexRow}>
                                <Image source={favored === 0 ? zan : zanActive} style={styles.operationIcon} />
                                <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{favorNum}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            {share_info && !isRecommend ? (
                <ShareModal
                    ref={shareModal}
                    shareCallback={(share_to) => onBottomOps('share', {share_to})}
                    shareContent={share_info}
                    title={share_info.title || ''}
                />
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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: -px(24)}, {translateY: -px(24)}],
        width: px(48),
        height: px(48),
    },
    communityFollowNumBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: px(40),
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
    cardDelete: {
        position: 'absolute',
        right: px(0),
        top: px(0),
        padding: px(12),
        zIndex: 10,
    },
    contentBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px(68),
        height: px(54),
    },
    recommendAvatar: {
        marginRight: px(4),
        borderRadius: px(16),
        width: px(16),
        height: px(16),
    },
});
