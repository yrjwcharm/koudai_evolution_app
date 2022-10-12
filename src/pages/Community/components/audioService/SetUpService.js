/*
 * @Date: 2022-10-11 11:42:15
 * @Description:
 */
import TrackPlayer, {AppKilledPlaybackBehavior, Capability} from 'react-native-track-player';

export const SetupService = async () => {
    let isSetup = false;
    try {
        // this method will only reject if player has not been setup yet
        await TrackPlayer.getCurrentTrack();
        isSetup = true;
    } catch {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
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
        });

        isSetup = true;
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return isSetup;
    }
};
export const resetAudio = () => {
    TrackPlayer.reset();
};
