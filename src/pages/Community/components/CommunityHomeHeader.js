/*
 * @Date: 2022-10-14 15:10:12
 * @Description:
 */
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Style} from '~/common/commonStyle';

const CommunityHomeHeader = ({data, style}) => {
    return data ? (
        <ImageBackground
            source={{
                uri: data?.bg_img || data?.avatar,
            }}
            resizeMode="cover"
            style={{
                height: px(220),
                paddingHorizontal: px(20),
                ...style,
            }}>
            <View style={Style.flexBetween}>
                <View style={Style.flexRow}>
                    <Image source={{uri: data?.avatar}} style={styles.headerAvatar} />
                    <View>
                        <Text style={styles.vName}>{data?.name}</Text>
                        {!!data?.creator_name && (
                            <View style={Style.flexRow}>
                                <Image
                                    source={{
                                        uri: data?.creator_avatar,
                                    }}
                                    style={{width: px(16), height: px(16), borderRadius: px(8), marginRight: px(4)}}
                                />
                                <Text style={{fontSize: px(12), lineHeight: px(17), color: '#fff'}}>
                                    {data?.creator_name}
                                </Text>
                                <View style={styles.tag}>
                                    <Text style={{color: '#fff', fontSize: px(11)}}>{data?.creator_extra}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.attentionBtn}>
                    <Text style={{fontSize: px(12)}}>已关注</Text>
                </View>
            </View>
        </ImageBackground>
    ) : null;
};

export default CommunityHomeHeader;

const styles = StyleSheet.create({
    headerAvatar: {
        width: px(66),
        height: px(66),
        marginRight: px(12),
        borderRadius: px(33),
        borderWidth: px(2),
        borderColor: '#fff',
    },
    vName: {
        fontSize: px(18),
        lineHeight: px(25),
        marginBottom: px(6),
        color: '#fff',
        fontWeight: '700',
    },
    attentionBtn: {
        paddingVertical: px(6),
        paddingHorizontal: px(14),
        borderRadius: px(103),
        backgroundColor: '#FFFFFF',
    },
    tag: {
        padding: px(3),
        borderWidth: 0.5,
        borderColor: '#fff',
        borderRadius: px(2),
        marginLeft: px(4),
    },
});
