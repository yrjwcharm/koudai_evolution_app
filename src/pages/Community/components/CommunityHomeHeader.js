/*
 * @Date: 2022-10-14 15:10:12
 * @Description:
 */
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceWidth, px} from '~/utils/appUtil';
import {Style} from '~/common/commonStyle';
import {Colors} from '../../../common/commonStyle';
import {useJump} from '../../../components/hooks';
import http from '../../../services';
import {Button} from '~/components/Button';

const CommunityHomeHeader = ({data, style, item_id, item_type}) => {
    const jump = useJump();
    const [followStatus, setFollowStatus] = useState();
    useEffect(() => {
        setFollowStatus(data?.follow_status);
    }, [data?.follow_status]);
    const handleFollow = () => {
        alert('1');
        if (data?.follow_btn?.url) {
            jump(data?.follow_btn?.url);
            return;
        }
        if (data?.follow_status == 1) return;
        http.post('/follow/add/202206', {item_id, item_type}).then((res) => {
            if (res.code == '000000') {
                setFollowStatus(1);
            }
        });
    };
    return data ? (
        <View
            style={{
                height: px(220),
                paddingHorizontal: px(20),
                ...style,
            }}>
            <View style={Style.flexBetween}>
                <View style={Style.flexRow}>
                    <Image source={{uri: data?.avatar}} style={[styles.headerAvatar]} />
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
                {!!data?.follow_btn && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.attentionBtn, followStatus == 1 && styles.followedBtn]}
                        onPress={handleFollow}>
                        <Text
                            style={{
                                fontSize: px(12),
                                color: followStatus == 1 ? 'rgba(154, 160, 177, 1)' : Colors.btnColor,
                            }}>
                            {data?.follow_btn?.url ? data?.follow_btn?.text : followStatus == 1 ? '已关注' : '+关注'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
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
    followedBtn: {backgroundColor: 'rgba(233, 234, 239, 1)'},
});
