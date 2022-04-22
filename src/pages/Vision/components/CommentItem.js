/*
 * @Date: 2022-04-07 17:02:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-22 16:33:31
 * @Description:评论内容体
 */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import Like from './Like';
const CommentItem = ({data, style, key}) => {
    const renderContent = (_data, _style, _key) => {
        return (
            <View key={_key} style={[Style.flexRow, {alignItems: 'flex-start'}, _style]}>
                <FastImage source={{uri: _data?.user_info?.avatar}} style={styles.avatar} />
                <View style={[{flex: 1, top: -px(2)}]}>
                    <View style={[Style.flexBetween, {marginBottom: px(-8)}]}>
                        <Text style={styles.name}>{_data?.user_info?.nickname}</Text>
                        {_data.id != 0 ? (
                            <Like
                                favor_status={_data.is_liked}
                                favor_num={_data.like_num}
                                comment_id={_data.id}
                                style={{top: px(-4)}}
                            />
                        ) : null}
                    </View>
                    <Text style={styles.content}>{_data?.content}</Text>
                    <Text style={styles.date}>{_data?.created_at_human}</Text>
                </View>
            </View>
        );
    };
    return (
        <View style={style} key={key}>
            {renderContent(data, {marginBottom: px(11)})}
            {data?.children?.map((item, index) => {
                return renderContent(item, {marginLeft: px(42), marginBottom: px(11), index});
            })}
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    avatar: {
        width: px(32),
        height: px(32),
        borderRadius: px(16),
        marginRight: px(8),
        borderColor: '#ddd',
        borderWidth: 0.5,
    },
    name: {
        fontSize: px(14),
        color: Colors.lightBlackColor,
    },
    content: {
        marginTop: px(8),
        fontSize: px(14),
        lineHeight: px(22),
    },
    date: {
        fontSize: px(12),
        marginTop: px(8),
        color: Colors.lightGrayColor,
    },
    zan_text: {fontFamily: Font.numRegular, fontSize: px(11), color: Colors.lightBlackColor, right: -px(14)},
});
