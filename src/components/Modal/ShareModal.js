/*
 * @Date: 2021-01-08 11:43:44
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-02 19:24:07
 * @Description: 分享弹窗
 */
import React, {useEffect, useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import Image from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {constants} from './util';
import {isIphoneX, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../Button';
const ShareModal = React.forwardRef((props, ref) => {
    const {
        backdrop = true, // 是否有蒙层
        header = '', // 自定义头部
        title = '', // 标题
        isTouchMaskToClose = true, // 是否点击蒙层关闭
        more = false, // 是否包含点赞和收藏
    } = props;
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([
        {
            img: require('../../assets/img/share/wechat.png'),
            title: '发送微信好友',
        },
        {
            img: require('../../assets/img/share/timeline.png'),
            title: '分享到朋友圈',
        },
        {
            img: require('../../assets/img/share/like.png'),
            title: '点赞',
        },
        {
            img: require('../../assets/img/share/collect.png'),
            title: '收藏',
        },
        {
            img: require('../../assets/img/share/copy.png'),
            title: '复制链接',
        },
        {
            img: require('../../assets/img/share/more.png'),
            title: '更多',
        },
    ]);
    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(!visible);
    };

    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    useEffect(() => {
        if (more) {
            setList([
                {
                    img: require('../../assets/img/share/wechat.png'),
                    title: '发送微信好友',
                },
                {
                    img: require('../../assets/img/share/timeline.png'),
                    title: '分享到朋友圈',
                },
                {
                    img: require('../../assets/img/share/like.png'),
                    title: '点赞',
                },
                {
                    img: require('../../assets/img/share/collect.png'),
                    title: '收藏',
                },
                {
                    img: require('../../assets/img/share/copy.png'),
                    title: '复制链接',
                },
                {
                    img: require('../../assets/img/share/more.png'),
                    title: '更多',
                },
            ]);
        } else {
            setList([
                {
                    img: require('../../assets/img/share/wechat.png'),
                    title: '发送微信好友',
                },
                {
                    img: require('../../assets/img/share/timeline.png'),
                    title: '分享到朋友圈',
                },
                {
                    img: require('../../assets/img/share/copy.png'),
                    title: '复制链接',
                },
                {
                    img: require('../../assets/img/share/more.png'),
                    title: '更多',
                },
            ]);
        }
    }, [more]);

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={isTouchMaskToClose ? hide : () => {}}
                style={[styles.container, {backgroundColor: backdrop ? 'rgba(0,0,0,0.5)' : 'transparent'}]}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={styles.con}>
                    {header ||
                        (title ? (
                            <View style={[Style.flexCenter, styles.header]}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                        ) : null)}
                    <View style={[Style.flexRow, styles.optionBox]}>
                        {list.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
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
});

ShareModal.propTypes = {
    backdrop: PropTypes.bool,
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType, PropTypes.string]),
    title: PropTypes.string,
    isTouchMaskToClose: PropTypes.bool,
    more: PropTypes.bool,
};

export default ShareModal;
