import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppState, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';

import {Colors, Font, Space, Style} from '~/common/commonStyle';
import AnimateAvatar from '~/components/AnimateAvatar';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import {deviceWidth, px} from '~/utils/appUtil';
import {liveReserve} from '../CommunityIndex/services';
import {CommunityCardCover} from './CommunityCard';

const CommunityRecommendCard = (props) => {
    const {
        attention_num, // 社区关注人数
        attention_user, // 社区关注头像
        author, // 作者信息
        button,
        cover, // 封面
        cover_aspect_ratio, // 封面宽高比
        desc, // 文章内容摘要
        favor_num, // 点赞数
        id,
        live_status, // 直播状态 1 预约中 2 直播中 3 回放
        left_desc, // 直播状态或预约人数
        media_duration, // 媒体时长
        play_mode, // 视频播放模式 1 竖屏 2 横屏
        rec_json = '',
        reserved, // 直播是否已预约
        right_desc, // 直播时间或观看人数
        view_num, //阅读、观看、收听人数
        view_suffix,
        title, // 卡片标题
        type, // 卡片类型 1文章 2音频 3视频 9直播
        type_str, // 类型文案
        url, // 跳转地址
    } = props.data || {};
    const {
        scene, // 场景 article代表在内容详情页 community代表在社区等页面
        style, // 自定义样式
    } = props;
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.();

    const [isReserved, setIsReserved] = useState(reserved); // 直播是否已预约
    const [leftDesc, setLeftDesc] = useState(left_desc);

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
        setLeftDesc(left_desc);
        setIsReserved(reserved);
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, [props.data]);
    return (
        <>
            <View style={[styles.communityCard, style]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        global.LogTool({event: rec_json ? 'rec_click' : 'content', oid: id, rec_json});
                        jump(url, ['article', 'community'].includes(scene) ? 'push' : 'navigate');
                    }}>
                    <View
                        style={[
                            Style.flexBetween,
                            {
                                alignItems: 'flex-start',
                                flexDirection: type == 1 || type == 2 || type == undefined ? 'row' : 'column',
                            },
                        ]}>
                        <View style={{flex: 1}}>
                            {title ? (
                                <Text style={[styles.subTitle]} numberOfLines={2}>
                                    {title}
                                </Text>
                            ) : null}

                            {desc ? (
                                <Text numberOfLines={2} style={[styles.desc]}>
                                    {desc}
                                </Text>
                            ) : null}
                        </View>

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
                                style={[
                                    {
                                        ...styles.followCover,
                                        marginLeft: type == 1 || type == undefined || type == 2 ? px(12) : 0,
                                        width: play_mode === 2 ? '100%' : px(120),
                                    },
                                    !(type == 1 || type == undefined || type == 2) && {marginVertical: px(12)},
                                ]}
                                type={type}
                                type_str={type_str}
                                width={play_mode === 2 ? deviceWidth - 2 * Space.padding - 2 * px(12) : px(120)}
                            />
                        ) : null}
                    </View>
                </TouchableOpacity>

                <View style={[Style.flexBetween, (type == 1 || type == undefined || type == 2) && {marginTop: px(12)}]}>
                    {author?.nickname ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => jump(author.url)} style={Style.flexRow}>
                            {author?.avatar ? (
                                type === 9 && live_status === 2 ? (
                                    <AnimateAvatar source={author.avatar} style={styles.avatar} />
                                ) : (
                                    <Image source={{uri: author.avatar}} style={styles.avatar} />
                                )
                            ) : null}
                            {!!author?.nickname && <Text style={styles.nickname}>{author?.nickname}</Text>}
                        </TouchableOpacity>
                    ) : null}

                    {type === 9 && button?.text && live_status === 1 ? (
                        // 直播预约按钮
                        <View style={[Style.flexBetween, styles.applyBox]}>
                            <Text style={[styles.numDesc]}>直播时间：{right_desc}</Text>
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
                                        {color: isReserved ? Colors.lightGrayColor : Colors.brandColor, marginTop: 0},
                                    ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={Style.flexRow}>
                            {!!view_suffix && (
                                <Text style={[styles.viewNum, {marginRight: px(4)}]}>
                                    {view_num}
                                    {view_suffix}
                                </Text>
                            )}
                            <Text style={styles.viewNum}>
                                {favor_num}
                                点赞
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

export default CommunityRecommendCard;

const styles = StyleSheet.create({
    communityCard: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    avatar: {
        marginRight: px(4),
        borderRadius: px(32),
        width: px(15),
        height: px(15),
    },
    nickname: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    followCover: {
        width: px(98),
        // height: px(77),
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
    operationGifIcon: {
        marginRight: -px(2),
        width: px(24),
        height: px(24),
    },

    applyBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(12),
        borderRadius: px(24),
        borderWidth: Space.borderWidth,
        marginLeft: px(8),
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
        marginTop: px(8),
    },
    viewNum: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    numDesc: {
        fontSize: px(11),
        lineHeight: px(13),
        color: '#545968',
    },
});
