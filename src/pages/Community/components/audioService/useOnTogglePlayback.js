/*
 * @Date: 2022-10-11 12:22:46
 * @Description:
 */
import {useCallback} from 'react';
import TrackPlayer, {usePlaybackState, State} from 'react-native-track-player';

export const useOnTogglePlayback = () => {
    const state = usePlaybackState();
    const isPlaying = state === State.Playing;

    return {
        isPlaying,
        tooglePlay: useCallback(() => {
            if (isPlaying) {
                TrackPlayer.pause();
            } else {
                TrackPlayer.play();
            }
        }, [isPlaying]),
    };
};
