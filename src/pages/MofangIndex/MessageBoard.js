/*
 * @Date: 2021-02-20 10:34:40
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-12 17:06:35
 * @Description:用户浏览详情
 */
import React, {useState, useCallback, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import http from '../../services/index.js';
import {px} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import Praise from '../../components/Praise';
const MessageBoard = (props) => {
    const [comment, setComment] = useState(null);
    const getData = useCallback(() => {
        http.get('/comment/detail/20210101', {
            id: props?.route?.params?.id,
        }).then((res) => {
            setComment(res.result);
        });
    }, [props]);
    useEffect(() => {
        getData();
    }, [getData]);
    return (
        <View style={styles.container}>
            <View style={Style.flexRow}>
                <FastImage source={{uri: comment?.avatar}} style={styles.avatar} />
                <View style={{flex: 1}}>
                    <Text style={styles.avatar_name}>{comment?.name}</Text>
                    <Text
                        style={{
                            fontSize: px(12),
                            color: Colors.darkGrayColor,
                        }}>
                        {comment?.from}
                    </Text>
                </View>
            </View>
            <Text style={styles.about_text} numberOfLines={4}>
                {comment?.content}
            </Text>
            <View style={{alignItems: 'flex-end', margin: px(20)}}>
                {comment && (
                    <Praise
                        comment={{
                            favor_status: comment?.favor_status,
                            favor_num: comment?.favor_num,
                            id: comment.id,
                        }}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: px(20),
    },
    avatar_name: {
        fontSize: px(13),
        color: Colors.lightBlackColor,
        marginBottom: px(6),
    },
    avatar: {
        width: px(32),
        height: px(32),
        marginRight: px(13),
        borderRadius: px(16),
    },
    about_text: {
        fontSize: px(13),
        lineHeight: px(20),
        marginTop: px(16),
    },
});
export default MessageBoard;
