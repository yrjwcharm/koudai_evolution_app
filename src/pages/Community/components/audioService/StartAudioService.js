import TrackPlayer, {setRepeatMode} from 'react-native-track-player';
import {SetupService} from './SetUpService';
/*
 * @Date: 2022-10-12 15:12:39
 * @Description:
 */
export const startAudio = async (track) => {
    async function run() {
        const isSetup = await SetupService();
        if (isSetup) {
            await TrackPlayer.reset();
            await TrackPlayer.add(track);
            await TrackPlayer.play();
            setRepeatMode('Track');
        }
    }

    run();
};
