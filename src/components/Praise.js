/*
 * @Date: 2021-02-20 11:22:15
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-24 18:23:12
 * @Description:点赞模块
 */

import React, {useState, useCallback} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {px, formaNum} from '../utils/appUtil';
import FastImage from 'react-native-fast-image';
import {Style, Colors} from '../common/commonStyle';
import http from '../services';
export default function Praise(props) {
    const {style, comment, id} = props;
    const [like, setLike] = useState(comment.like_status);
    const [num, setNum] = useState(comment.like_num);
    const postLike = useCallback((id, _like) => {
        http.get('/comment/like/20210101', {id, like: _like});
    }, []);
    const press = () => {
        if (like == 1) {
            setLike(0);
            let like_num = num - 1;
            setNum(like_num);
            postLike(id, 0);
        } else {
            setLike(1);
            let like_num = num + 1;
            setNum(like_num);
            postLike(id, 1);
        }
    };

    return (
        <TouchableOpacity style={[Style.flexRow, style]} onPress={press}>
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
                {formaNum(num)}
            </Text>
        </TouchableOpacity>
    );
}
