import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import {SetupService} from './SetUpService';
/*
 * @Date: 2022-10-12 15:12:39
 * @Description:
 */
export const startAudio = async (track) => {
    async function run() {
        const isSetup = await SetupService();
        const current_track = await TrackPlayer.getTrack(0);
        if (isSetup) {
            if (current_track && current_track?.title != track?.title) {
                console.log('reset');
                await TrackPlayer.reset();
            }
            await TrackPlayer.add(track);
            await TrackPlayer.play();
            TrackPlayer.setRepeatMode(RepeatMode.Track);
        }
    }

    run();
};
