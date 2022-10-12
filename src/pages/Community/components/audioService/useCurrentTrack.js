/*
 * @Date: 2022-10-11 11:46:05
 * @Description:
 */
import {useState, useEffect} from 'react';
import TrackPlayer, {useTrackPlayerEvents, Event} from 'react-native-track-player';

export const useCurrentTrack = () => {
    const [index, setIndex] = useState(0);
    const [track, setTrack] = useState();
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async ({track}) => {
        setIndex(track);
    });

    useEffect(() => {
        (async () => {
            const _track = await TrackPlayer.getTrack(0);
            setTrack(_track || undefined);
        })();
    }, [index]);

    return track;
};
