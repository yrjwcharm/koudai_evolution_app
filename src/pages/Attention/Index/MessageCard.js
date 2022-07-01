/*
 * @Date: 2022-06-21 14:39:44
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-01 15:24:13
 * @Description:消息卡片
 */
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useJump} from '~/components/hooks';
import RenderHtml from '~/components/RenderHtml';
const MessageCard = ({data}) => {
    const {header, body, footer} = data;
    const jump = useJump();
    return (
        <View>
            <View style={[Style.flexBetween, {paddingVertical: px(12)}]}>
                <Image source={{uri: header?.left_btn?.icon_url}} style={{width: px(68), height: px(19)}} />
                <TouchableOpacity
                    style={{...Style.flexRow}}
                    onPress={() => jump(header?.right_btn?.url)}
                    activeOpacity={0.9}>
                    <Image
                        source={require('~/assets/img/attention/messageManage.png')}
                        style={{width: px(14), height: px(14), marginRight: px(2)}}
                    />
                    <Text style={{fontSize: px(12)}}>{header?.right_btn?.text}</Text>
                </TouchableOpacity>
            </View>

            {body?.list?.map((_list, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.card, Style.flexRow]}
                    activeOpacity={0.9}
                    onPress={() => jump(_list.url)}>
                    <View style={{flex: 1}}>
                        <View style={[Style.flexRow, {marginBottom: px(2)}]}>
                            {_list?.type_text ? (
                                <View style={[styles.tag, {backgroundColor: _list?.type_color || 'red'}]}>
                                    <Text style={styles.tag_text}>{_list?.type_text}</Text>
                                </View>
                            ) : null}
                            <Text numberOfLines={1} style={styles.title}>
                                {_list?.title}
                            </Text>
                        </View>
                        <RenderHtml html={_list?.content} style={styles.content} numberOfLines={1} />
                    </View>
                    <EvilIcons name={'chevron-right'} size={px(24)} />
                </TouchableOpacity>
            ))}
            {footer?.link && (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[Style.flexRowCenter, {marginBottom: px(16)}]}
                    onPress={() => jump(footer?.link.url)}>
                    <Text style={{color: Colors.btnColor}}>{footer?.link?.text}</Text>
                    <EvilIcons name={'chevron-right'} size={px(22)} color={Colors.btnColor} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MessageCard;

const styles = StyleSheet.create({
    card: {
        padding: px(12),
        borderRadius: px(6),
        backgroundColor: '#fff',
        marginBottom: px(12),
    },
    title: {
        color: '#121D3A',
        fontWeight: '700',
        fontSize: px(13),
        lineHeight: px(18),
        marginLeft: px(8),
        flex: 1,
    },
    content: {
        color: '#545968',
        fontSize: px(12),
        lineHeight: px(17),
        marginTop: px(5),
    },
    tag: {
        borderRadius: px(6),
        paddingHorizontal: px(6),
        paddingVertical: px(3),
    },
    tag_text: {fontSize: px(11), lineHeight: px(16), color: '#fff'},
});
