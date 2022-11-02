/*
 * @Date: 2022-10-10 20:44:41
 * @Description:音频
 */
import React from 'react';

import {StyleSheet, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {resetAudio} from './audioService/SetUpService';
import {useCurrentTrack} from './audioService/useCurrentTrack';
import {ProgressCon} from './audioService/ProgressCom';
import {Style} from '~/common/commonStyle';
import {useOnTogglePlayback} from './audioService/useOnTogglePlayback';
import Icon from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {navigationRef} from '~/components/hooks/RootNavigation';
import {updateUserInfo} from '~/redux/actions/userInfo';
// The player is ready to be used
const Audio = () => {
    const userInfo = useSelector((store) => store.userInfo).toJS();
    const {isPlaying, tooglePlay} = useOnTogglePlayback();
    const track = useCurrentTrack();
    const dispatch = useDispatch();
    return track && userInfo?.showAudioModal ? (
        <TouchableOpacity
            style={[Style.flexRow, styles.con]}
            activeOpacity={1}
            onPress={() => {
                navigationRef.current.navigate(userInfo?.showAudioModal?.path, userInfo?.showAudioModal?.params);
            }}>
            {/* 进度 */}
            <ProgressCon cover={track?.artwork} />
            {/* title */}
            <Text style={styles.audioTitle}>{track?.title}</Text>
            <TouchableWithoutFeedback onPress={tooglePlay}>
                <Image
                    style={{width: px(24), height: px(24)}}
                    source={
                        !isPlaying
                            ? require('~/assets/img/community/audioPlay.png')
                            : require('~/assets/img/community/audioPause.png')
                    }
                />
                {/* <Text>{isPlaying ? '正在播放' : '暂停'}</Text> */}
            </TouchableWithoutFeedback>
            <TouchableOpacity
                style={{position: 'absolute', right: 0, top: -px(8)}}
                onPress={() => {
                    resetAudio();
                    dispatch(updateUserInfo({showAudioModal: ''}));
                }}>
                <Icon name="closecircle" size={px(18)} color="#9ba1b0" />
            </TouchableOpacity>
        </TouchableOpacity>
    ) : null;
};
const styles = StyleSheet.create({
    con: {
        backgroundColor: '#CEDDF5',
        borderRadius: px(394),
        height: px(43),
        paddingLeft: px(8),
        paddingRight: px(20),
        position: 'absolute',
        zIndex: 10,
        width: deviceWidth - px(16),
        left: px(8),
        bottom: isIphoneX() ? px(96) : px(60),
    },
    audioTitle: {fontSize: px(13), marginHorizontal: px(8), flex: 1, fontWeight: '700'},
});
export default Audio;
