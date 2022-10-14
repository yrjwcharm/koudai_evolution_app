/*
 * @Date: 2022-10-10 20:50:12
 * @Description:
 */
import TrackPlayer, {Event, AppKilledPlaybackBehavior, Capability} from 'react-native-track-player';

export const PlaybackService = async function () {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteSeek, (track) => TrackPlayer.seekTo(track.position));

    // ...
};
export const audioOptions = (init) => {
    return {
        android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        // This flag is now deprecated. Please use the above to define playback mode.
        // stoppingAppPausesPlayback: true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
        progressUpdateEventInterval: 2,
    };
};
