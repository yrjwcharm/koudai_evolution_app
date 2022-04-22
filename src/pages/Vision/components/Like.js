/*
 * @Date: 2022-04-15 11:59:41
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-22 16:14:09
 * @Description:点赞
 */
/*
 * @Date: 2022-04-07 17:02:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-15 11:57:10
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import LottieView from 'lottie-react-native';
import http from '../../../services';
const Like = ({favor_num, favor_status, comment_id, style}) => {
    const [favorNum, setFavorNum] = useState(favor_num);
    const [favorStatus, setFavorStatus] = useState(favor_status);
    const [autoPlay, setAutoPlay] = useState(false);
    const zanRef = useRef();
    const onFavor = () => {
        http.post('/community/article/comment/like/20210101', {is_like: favorStatus ? 0 : 1, comment_id: comment_id});
        setFavorNum((preNum) => {
            return favorStatus ? --preNum : ++preNum;
        });
        setFavorStatus((pre_status) => {
            setAutoPlay(true);
            zanRef.current.play();
            return !pre_status;
        });
    };
    return (
        <TouchableOpacity style={[Style.flexRow, style]} onPress={onFavor} activeOpacity={0.9}>
            <Text style={styles.zan_text}>{favorNum}</Text>
            <LottieView
                ref={zanRef}
                loop={false}
                autoPlay={autoPlay}
                source={
                    (autoPlay ? favorStatus : !favorStatus)
                        ? require('../../../assets/animation/zanActive.json')
                        : require('../../../assets/animation/zan.json')
                }
                style={{height: px(36), width: px(36), right: -px(4)}}
            />
        </TouchableOpacity>
    );
};
export default Like;
const styles = StyleSheet.create({
    zan_text: {
        fontFamily: Font.numRegular,
        fontSize: px(11),
        color: Colors.lightBlackColor,
        right: -px(14),
        top: px(2),
    },
});
