/*
 * @Date: 2022-10-10 20:44:41
 * @Description:音频
 */
import React, {useEffect, useState} from 'react';

import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {resetAudio} from './audioService/SetUpService';
import {useCurrentTrack} from './audioService/useCurrentTrack';
import {ProgressCon} from './audioService/ProgressCom';
import {Style} from '~/common/commonStyle';
import {useOnTogglePlayback} from './audioService/useOnTogglePlayback';
import Icon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
// The player is ready to be used
const Audio = () => {
    const [showPlayer, setShowPlayer] = useState(true);
    const userInfo = useSelector((store) => store.userInfo).toJS();
    const {isPlaying, tooglePlay} = useOnTogglePlayback();
    const track = useCurrentTrack();
    console.log(track);
    useEffect(() => {
        // startAudio();
    }, []);
    console.log(userInfo.showAudioModal, 'showAudioModal');
    // console.log(track);
    return track && userInfo?.showAudioModal ? (
        <View style={[Style.flexRow, styles.con]}>
            {/* 进度 */}
            <ProgressCon />
            {/* title */}
            <Text style={styles.audioTitle}>{track?.title}</Text>
            <TouchableOpacity onPress={tooglePlay}>
                <Text>{isPlaying ? '正在播放' : '暂停'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{position: 'absolute', right: 0, top: -px(8)}}
                onPress={() => {
                    resetAudio();
                }}>
                <Icon name="closecircle" size={px(18)} color="#9ba1b0" />
            </TouchableOpacity>
        </View>
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
