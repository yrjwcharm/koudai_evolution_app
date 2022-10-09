/*
 * @Date: 2022-10-09 14:51:26
 * @Description: 社区卡片
 */
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import collect from '~/assets/img/icon/collect.png';
import collectActive from '~/assets/img/icon/collectActive.png';
import comment from '~/assets/img/icon/comment.png';
import live from '~/assets/img/vision/live.gif';
import share from '~/assets/img/icon/share.png';
import video from '~/assets/img/vision/video.png';
import zan from '~/assets/img/icon/zan.png';
import zanActive from '~/assets/img/icon/zanActive.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import AnimateAvatar from '~/components/AnimateAvatar';
import {useJump} from '~/components/hooks';
import {ShareModal} from '~/components/Modal';
import {px} from '~/utils/appUtil';

export const LiveImage = ({cover, media_duration, people_num_desc, status, status_desc, style}) => {
    return (
        <View style={[styles.liveImgContainer, style]}>
            <Image source={{uri: cover}} style={{width: '100%', height: '100%'}} />
            {/* 预约人数直播观看人数 */}
            {people_num_desc && status_desc ? (
                <View style={[Style.flexRow, styles.liveInfo]}>
                    <View
                        style={[
                            Style.flexRow,
                            styles.waitTag,
                            {
                                backgroundColor:
                                    status === 1 ? '#FF7D41' : status === 2 ? Colors.red : Colors.brandColor,
                            },
                        ]}>
                        <Image source={status === 1 || status === 3 ? video : live} style={styles.liveIcon} />
                        <Text style={styles.numDesc}>{status === 2 ? '直播中' : people_num_desc}</Text>
                    </View>
                    {status === 1 ? (
                        <View style={[Style.flexRow, styles.waitTag, {paddingLeft: px(6)}]}>
                            <Text style={styles.numDesc}>{status_desc}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
            {/* 媒体时长 */}
            {media_duration ? (
                <View style={[Style.flexRow, styles.durationBox]}>
                    <FontAwesome5 color="#fff" name="play" size={px(8)} />
                    <Text style={[styles.numDesc, {fontFamily: Font.numRegular}]}>{media_duration}</Text>
                </View>
            ) : null}
        </View>
    );
};

export const CommunityCard = ({
    author,
    author_desc,
    collect_num,
    collect_status,
    comment_num,
    cover,
    desc,
    favor_num,
    favor_status,
    live_status,
    share_num,
    share_info,
    style,
    title,
    url,
}) => {
    const jump = useJump();
    const [collected, setCollected] = useState(collect_status);
    const [favored, setFavored] = useState(favor_status);
    const shareModal = useRef();

    return (
        <>
            <View style={[styles.communityCard, style]}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(url)}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(author.url)} style={Style.flexRow}>
                        {live_status === 2 ? (
                            <AnimateAvatar source={author.avatar} style={styles.avatar} />
                        ) : (
                            <Image source={{uri: author.avatar}} style={style.avatar} />
                        )}
                        <View>
                            <Text style={styles.subTitle}>{author.nickname}</Text>
                            <Text style={[styles.smText, {marginTop: px(2)}]}>{author_desc}</Text>
                        </View>
                    </TouchableOpacity>
                    {title ? <Text style={[style.subTitle, {marginTop: px(8)}]}>{title}</Text> : null}
                    {desc ? <Text style={[styles.desc, {marginTop: px(8)}]}>{desc}</Text> : null}
                    {cover ? <LiveImage cover={cover} /> : null}
                </TouchableOpacity>
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => shareModal.current.show()}
                        style={Style.flexRow}>
                        <Image source={share} style={styles.operationIcon} />
                        <Text style={[styles.desc, {fontFamily: Font.numRegular}]}>{share_num}</Text>
                    </TouchableOpacity>
                    <View style={Style.flexRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setCollected((prev) => Number(!prev))}
                            style={[Style.flexRow, {marginRight: px(16)}]}>
                            <Image source={collected === 0 ? collect : collectActive} style={styles.operationIcon} />
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
            </View>
            <ShareModal ref={shareModal} shareContent={share_info} title={share_info.title || ''} />
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
    liveImgContainer: {
        width: px(180),
        height: px(240),
        overflow: 'hidden',
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
        width: px(32),
        height: px(32),
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
    operationIcon: {
        marginRight: px(2),
        width: px(16),
        height: px(16),
    },
});
