import React, {useEffect, useState} from 'react';
import * as Progress from 'react-native-progress';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import TrackPlayer, {State} from 'react-native-track-player';

// The player is ready to be used
const Audio = () => {
    const [loadProgress, setLoadProgress] = useState(0);
    const startAudio = async () => {
      await TrackPlayer.setupPlayer();
        var track1 = {
            url: 'http://example.com/avaritia.mp3', // Load media from the network
            title: 'Avaritia',
            artist: 'deadmau5',
            album: 'while(1<2)',
            genre: 'Progressive House, Electro House',
            date: '2014-05-20T07:00:00+00:00', // RFC 3339
            artwork: 'http://example.com/cover.png', // Load artwork from the network
            duration: 402, // Duration in seconds
        };
        await TrackPlayer.add([track1]);
        await TrackPlayer.play();
    };
    const getAudioInfo = async () => {
        const state = await TrackPlayer.getState();
        if (state === State.Playing) {
            console.log('The player is playing');
        }

        let trackIndex = await TrackPlayer.getCurrentTrack();
        let trackObject = await TrackPlayer.getTrack(trackIndex);
        console.log(`Title: ${trackObject.title}`);

        const position = await TrackPlayer.getPosition();
        const duration = await TrackPlayer.getDuration();
        console.log(`${duration - position} seconds left.`);
    };
    useEffect(() => {
        startAudio();
        getAudioInfo();
    }, []);
    return (
        <View>
            <Progress.Bar
                progress={loadProgress / 100}
                color={'#EB7121'}
                height={px(12)}
                width={px(173)}
                borderRadius={px(7.5)}>
                <Text>111</Text>
            </Progress.Bar>
        </View>
    );
};
export default Audio;
