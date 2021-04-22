/*
 * @Date: 2021-01-08 11:43:44
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-22 21:11:44
 * @Description: 分享弹窗
 */
import React, {useState} from 'react';
import {ActionSheetIOS, Platform, View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import Image from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {constants} from './util';
import {isIphoneX, px, deviceHeight, deviceWidth} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../Button';
import Mask from '../Mask';
import Toast from '../Toast';
import Clipboard from '@react-native-community/clipboard';
import * as WeChat from 'react-native-wechat-lib';

const ShareModal = React.forwardRef((props, ref) => {
    const {
        backdrop = true, // 是否有蒙层
        header = '', // 自定义头部
        title = '', // 标题
        isTouchMaskToClose = true, // 是否点击蒙层关闭
        more = false, // 是否包含点赞和收藏
        shareContent = {}, // 分享内容
        likeCallback = () => {},
        collectCallback = () => {},
    } = props;
    const [visible, setVisible] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const [list, setList] = useState([
        {
            img: require('../../assets/img/share/wechat.png'),
            title: '发送微信好友',
            type: 'ShareAppMessage',
        },
        {
            img: require('../../assets/img/share/timeline.png'),
            title: '分享到朋友圈',
            type: 'ShareTimeline',
        },
        {
            img: shareContent?.favor_status
                ? require('../../assets/img/share/likeActive.png')
                : require('../../assets/img/share/like.png'),
            title: shareContent?.favor_status ? '取消点赞' : '点赞',
            type: 'Like',
        },
        {
            img: shareContent?.collect_status
                ? require('../../assets/img/share/collectActive.png')
                : require('../../assets/img/share/collect.png'),
            title: shareContent?.collect_status ? '取消收藏' : '收藏',
            type: 'Collect',
        },
        {
            img: require('../../assets/img/share/copy.png'),
            title: '复制链接',
            type: 'Copy',
        },
        {
            img: require('../../assets/img/share/more.png'),
            title: '更多',
            type: 'MoreOptions',
        },
    ]);
    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    const toastShow = (t, duration = 2000, {onHidden} = {}) => {
        setToastText(t);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setToastText('');
            onHidden && onHidden();
        }, duration);
    };

    const share = (item) => {
        if (item.type === 'ShareAppMessage') {
            WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    try {
                        WeChat.shareWebpage({
                            title: shareContent.title,
                            description: shareContent.content,
                            thumbImageUrl: shareContent.avatar,
                            webpageUrl: shareContent.link,
                            scene: 0,
                        }).then((res) => {
                            hide();
                            Toast.show('分享成功');
                            global.LogTool('share', props.ctrl);
                        });
                    } catch (e) {
                        if (e instanceof WeChat.WechatError) {
                            console.error(e.stack);
                        } else {
                            throw e;
                        }
                    }
                } else {
                    Toast.show('请安装微信');
                    hide();
                }
            });
        } else if (item.type == 'ShareTimeline') {
            WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    try {
                        WeChat.shareWebpage({
                            title: shareContent.title,
                            description: shareContent.content,
                            thumbImageUrl: shareContent.avatar,
                            webpageUrl: shareContent.link,
                            scene: 1,
                        }).then(() => {
                            hide();
                            Toast.show('分享成功');
                            global.LogTool('share', props.ctrl);
                        });
                    } catch (e) {
                        if (e instanceof WeChat.WechatError) {
                            console.error(e.stack);
                        } else {
                            throw e;
                        }
                    }
                } else {
                    Toast.show('请安装微信');
                    hide();
                }
            });
        } else if (item.type === 'Like') {
            // hide();
            setTimeout(() => {
                likeCallback();
            }, 500);
        } else if (item.type === 'Collect') {
            // hide();
            setTimeout(() => {
                collectCallback();
            }, 500);
        } else if (item.type === 'Copy') {
            Clipboard.setString(shareContent.link);
            hide();
            setTimeout(() => {
                Toast.show('复制成功');
            }, 500);
        } else if (item.type === 'MoreOptions') {
            if (Object.keys(shareContent).length > 0) {
                ActionSheetIOS.showShareActionSheetWithOptions(
                    {
                        url: shareContent.link,
                        message: shareContent.content,
                        subject: shareContent.title,
                    },
                    (error) => {
                        hide();
                    },
                    (success, method) => {
                        hide();
                        global.LogTool('share', props.ctrl);
                    }
                );
            }
        }
    };

    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
            toastShow: toastShow,
        };
    });

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            {backdrop && <Mask />}
            <TouchableOpacity
                activeOpacity={1}
                onPress={isTouchMaskToClose ? hide : () => {}}
                style={[styles.container]}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={styles.con}>
                    {header ||
                        (title ? (
                            <View style={[Style.flexCenter, styles.header]}>
                                <Text numberOfLines={1} style={styles.title}>
                                    {title}
                                </Text>
                            </View>
                        ) : null)}
                    <View style={[Style.flexRow, styles.optionBox]}>
                        {list.map((item, index) => {
                            if (item.type === 'Like') {
                                item.title = shareContent?.favor_status ? '取消点赞' : '点赞';
                                item.img = shareContent?.favor_status
                                    ? require('../../assets/img/share/likeActive.png')
                                    : require('../../assets/img/share/like.png');
                            }
                            if (item.type === 'Collect') {
                                item.title = shareContent?.collect_status ? '取消收藏' : '收藏';
                                item.img = shareContent?.collect_status
                                    ? require('../../assets/img/share/collectActive.png')
                                    : require('../../assets/img/share/collect.png');
                            }
                            if (!more) {
                                if (item.type === 'Like' || item.type === 'Collect') {
                                    return null;
                                }
                            }
                            if (Platform.OS === 'android' && item.type === 'MoreOptions') {
                                return null;
                            }
                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => share(item)}
                                    style={[Style.flexCenter, styles.option]}>
                                    <Image source={item.img} style={styles.icon} />
                                    <Text style={styles.opTitle}>{item.title}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Button
                        onPress={hide}
                        title={'取消'}
                        color={Colors.bgColor}
                        style={styles.cancelBtn}
                        textStyle={styles.title}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
            <Modal animationType={'fade'} onRequestClose={() => setShowToast(false)} transparent visible={showToast}>
                <View style={[Style.flexCenter, styles.toastContainer]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>{toastText}</Text>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    con: {
        backgroundColor: Colors.bgColor,
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
    },
    header: {
        paddingTop: px(20),
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: Colors.defaultColor,
        maxWidth: px(280),
    },
    optionBox: {
        paddingTop: px(28),
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    option: {
        marginBottom: px(28),
        width: '25%',
    },
    icon: {
        width: px(52),
        height: px(52),
        marginBottom: px(10),
    },
    opTitle: {
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.lightBlackColor,
    },
    cancelBtn: {
        width: '100%',
        height: isIphoneX() ? px(55) + 34 : px(55),
        backgroundColor: '#fff',
        borderRadius: 0,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        marginTop: px(4),
        paddingBottom: isIphoneX() ? 34 : 0,
    },
    toastContainer: {
        flex: 1,
        height: deviceHeight,
        width: deviceWidth,
    },
    textContainer: {
        padding: 10,
        backgroundColor: '#1E1F20',
        opacity: 0.8,
        borderRadius: 5,
    },
    textStyle: {
        fontSize: Font.textH1,
        lineHeight: px(24),
        color: '#fff',
        textAlign: 'center',
    },
});

ShareModal.propTypes = {
    backdrop: PropTypes.bool,
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType, PropTypes.string]),
    title: PropTypes.string,
    isTouchMaskToClose: PropTypes.bool,
    more: PropTypes.bool,
    shareContent: PropTypes.object.isRequired,
    likeCallback: PropTypes.func,
    collectCallback: PropTypes.func,
};

export default ShareModal;
