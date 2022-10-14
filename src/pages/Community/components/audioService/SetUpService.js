/*
 * @Date: 2022-10-11 11:42:15
 * @Description:
 */
import TrackPlayer from 'react-native-track-player';
import {audioOptions} from './AudioConfig';

export const SetupService = async () => {
    let isSetup = false;
    try {
        // this method will only reject if player has not been setup yet
        await TrackPlayer.getCurrentTrack();
        isSetup = true;
    } catch {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions(audioOptions());
        isSetup = true;
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return isSetup;
    }
};
export const resetAudio = () => {
    TrackPlayer.reset();
};
