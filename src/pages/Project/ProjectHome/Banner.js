/*
 * @Date: 2022-07-20 10:59:36
 * @Description:
 */
import {StyleSheet, Platform, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';
import {px} from '~/utils/appUtil';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
const Banner = ({data}) => {
    const jump = useJump();
    return (
        <View style={{height: px(120), marginBottom: px(16)}}>
            {data && data.length > 0 && (
                <Swiper
                    height={px(120)}
                    autoplay
                    loadMinimal={Platform.OS == 'ios' ? true : false}
                    removeClippedSubviews={false}
                    autoplayTimeout={4}
                    paginationStyle={{
                        bottom: px(5),
                    }}
                    dotStyle={{
                        opacity: 0.5,
                        width: px(4),
                        ...styles.dotStyle,
                    }}
                    activeDotStyle={{
                        width: px(12),
                        ...styles.dotStyle,
                    }}>
                    {data.map((banner, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            onPress={() => {
                                global.LogTool('project_swiper', banner.id);
                                jump(banner.url);
                            }}>
                            <FastImage
                                style={{height: px(120), borderRadius: px(6)}}
                                source={{
                                    uri: banner.cover,
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </Swiper>
            )}
        </View>
    );
};

export default Banner;

const styles = StyleSheet.create({
    dotStyle: {
        backgroundColor: '#fff',
        borderRadius: 0,
        height: px(3),
    },
});
