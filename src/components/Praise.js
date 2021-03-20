/*
 * @Date: 2021-02-20 11:22:15
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-20 14:49:21
 * @Description:点赞模块
 */

import React, {useState, useCallback} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {px, formaNum} from '../utils/appUtil';
import FastImage from 'react-native-fast-image';
import {Style, Colors} from '../common/commonStyle';
import http from '../services';
export default function Praise(props) {
    const {style, comment, type = ''} = props;
    const [like, setLike] = useState(comment.favor_status);
    const [num, setNum] = useState(comment.favor_num);
    // console.log(comment, num);
    const postLike = useCallback(
        (_like) => {
            if (type == 'article') {
                http.post('/community/favor/20210101', {
                    resource_id: comment.id,
                    action_type: _like,
                    resource_cate: type,
                });
            } else {
                http.post('/comment/like/20210101', {id: comment.id, favor: _like});
            }
        },
        [comment.id, type]
    );
    const press = () => {
        if (like == 1) {
            setLike(0);
            let like_num = num - 1;
            setNum(like_num);
            postLike(0);
        } else {
            setLike(1);
            let like_num = num + 1;
            setNum(like_num);
            postLike(1);
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.8} style={[Style.flexRow, style]} onPress={press}>
            {like == 1 ? (
                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    style={{width: px(12), height: px(12)}}
                    source={require('../assets/img/article/zanActive.png')}
                />
            ) : (
                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    style={{width: px(12), height: px(12)}}
                    source={require('../assets/img/article/zan.png')}
                />
            )}

            <Text
                style={{
                    fontSize: px(12),
                    color: Colors.lightBlackColor,
                    marginLeft: px(4),
                }}>
                {num < 0 ? 0 : formaNum(num, 'nozero')}
            </Text>
        </TouchableOpacity>
    );
}
