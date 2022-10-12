/*
 * @Date: 2022-10-11 11:50:36
 * @Description:
 */
import Slider from '@react-native-community/slider';
import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {px} from '~/utils/appUtil';
import * as Progress from 'react-native-progress';
import {Colors} from '~/common/commonStyle';
export const ProgressCon = () => {
    const {duration, position} = useProgress();
    return (
        !!duration && (
            <>
                <View>
                    <Progress.Circle
                        size={px(30)}
                        indeterminate={false}
                        progress={position / duration}
                        color={Colors.brandColor}
                        borderWidth={0}>
                        <Image
                            source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png'}}
                            style={styles.avatar}
                        />
                    </Progress.Circle>
                </View>
                {/* <Slider
                    style={styles.container}
                    value={position}
                    minimumValue={0}
                    maximumValue={duration}
                    thumbTintColor="#FFD479"
                    minimumTrackTintColor="#FFD479"
                    maximumTrackTintColor="#FFFFFF"
                    onSlidingComplete={TrackPlayer.seekTo}
                />
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{new Date(position * 1000).toISOString().slice(14, 19)}</Text>
                    <Text style={styles.labelText}>
                        {new Date((duration - position) * 1000).toISOString().slice(14, 19)}
                    </Text>
                </View> */}
            </>
        )
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: px(26),
        height: px(26),
        borderRadius: px(14),
        position: 'absolute',
        left: px(2),
        top: px(2),
    },
    liveContainer: {
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
    },
    liveText: {
        color: '#000',
        alignSelf: 'center',
        fontSize: 18,
    },
    container: {
        height: 40,
        width: 380,
        marginTop: 25,
        flexDirection: 'row',
    },
    labelContainer: {
        width: 370,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelText: {
        color: '#00f',
        fontVariant: ['tabular-nums'],
    },
});
