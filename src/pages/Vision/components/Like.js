/*
 * @Date: 2022-04-15 11:59:41
 * @Description:点赞
 */
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import LottieView from 'lottie-react-native';
import http from '~/services';
const Like = ({favor_num, favor_status, comment_id, style}) => {
    const [favorNum, setFavorNum] = useState(favor_num);
    const [favorStatus, setFavorStatus] = useState(favor_status);
    const [autoPlay, setAutoPlay] = useState(false);
    const zanRef = useRef();
    const onFavor = () => {
        global.LogTool({event: favorStatus ? 'comment_like_cancel' : 'comment_like', oid: comment_id});
        http.post('/community/article/comment/like/20210101', {is_like: favorStatus ? 0 : 1, comment_id});
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
                style={{height: px(26), width: px(26), right: -px(2), top: px(0)}}
            />
        </TouchableOpacity>
    );
};
export default Like;
const styles = StyleSheet.create({
    zan_text: {
        fontFamily: Font.numRegular,
        fontSize: px(12),
        color: Colors.lightBlackColor,
        right: -px(6),
        top: px(2),
    },
});
