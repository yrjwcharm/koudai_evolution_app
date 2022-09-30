/*
 * @Date: 2022-07-21 18:26:32
 * @Description:运营位图
 */
import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';

const AdInfo = ({ad_info}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                global.LogTool('guide_click', 'banner', ad_info?.id);
                jump(ad_info?.url);
            }}>
            <FastImage
                source={{
                    uri: ad_info?.cover,
                }}
                style={styles.ad_info}
            />
        </TouchableOpacity>
    );
};

export default AdInfo;

const styles = StyleSheet.create({
    ad_info: {
        height: px(60),
        borderRadius: 8,
        marginBottom: px(12),
        marginHorizontal: px(16),
    },
});
