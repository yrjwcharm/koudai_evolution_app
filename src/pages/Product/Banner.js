/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-03 11:33:57
 */
import React from 'react';
import {View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';

const Banner = ({bgType, proData}) => {
    const jump = useJump();
    return (
        <View style={styles.bannerWrap}>
            {bgType ? (
                <View style={styles.swiperWrap}>
                    {proData?.banner_list?.[0] ? (
                        <Swiper
                            height={px(100)}
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
                            }}
                            onIndexChanged={(index) => {
                                global.LogTool({
                                    event: 'banner_show',
                                    ctrl: proData?.banner_list[index]?.id,
                                });
                            }}>
                            {proData?.banner_list?.map?.((banner, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        global.LogTool({
                                            event: 'banner',
                                            ctrl: banner.id,
                                        });
                                        jump(banner.url);
                                    }}>
                                    <FastImage
                                        style={styles.slide}
                                        source={{
                                            uri: banner.cover,
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </Swiper>
                    ) : null}
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        global.LogTool({
                            event: 'banner',
                            ctrl: proData?.popular_banner_list?.id,
                        });
                        jump(proData?.popular_banner_list?.url);
                    }}>
                    <FastImage
                        style={{width: '100%', height: px(120), marginTop: px(8)}}
                        resizeMode="cover"
                        source={{uri: proData?.popular_banner_list?.cover}}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Banner;

const styles = StyleSheet.create({
    swiperWrap: {
        paddingHorizontal: px(16),
        marginTop: px(16),
    },
    dotStyle: {
        backgroundColor: '#fff',
        borderRadius: 0,
        height: px(3),
    },
    slide: {
        height: px(100),
        borderRadius: px(6),
    },
});
