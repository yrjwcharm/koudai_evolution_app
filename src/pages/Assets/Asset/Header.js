/*
 * @Date: 2022-07-13 15:22:30
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity, Image, Platform} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
const Header = ({newMes, light, bgColor}) => {
    const jump = useJump();
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.() || {};
    return (
        <>
            <View
                style={[
                    Style.flexBetween,
                    styles.header,
                    {
                        paddingTop: inset.top + (Platform.OS == 'ios' ? px(5) : px(6)),
                        backgroundColor: bgColor || '#ECF5FF',
                    },
                ]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={Style.flexRow}
                    onPress={() => {
                        jump(userInfo.url);
                    }}>
                    <Image source={{uri: userInfo?.avatar}} style={styles.avatar} />
                    <Text style={[styles.name, {color: light ? '#fff' : Colors.defaultColor}]}>
                        {userInfo?.nickname || '昵称'}
                    </Text>
                    <FontAwesome name={'angle-right'} color={light ? '#fff' : Colors.defaultColor} size={18} />
                </TouchableOpacity>
                {/* 消息 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        global.LogTool('indexNotificationCenter');
                        jump(userInfo.message_center_url);
                    }}>
                    <Image
                        style={{width: px(24), height: px(24)}}
                        source={{
                            uri: light
                                ? 'https://static.licaimofang.com/wp-content/uploads/2022/09/message-centre-2.png'
                                : 'https://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png',
                        }}
                    />
                    {newMes && userInfo.is_login ? (
                        <View style={[styles.point_sty, Style.flexCenter]}>
                            <Text style={styles.point_text}>{newMes > 99 ? '99+' : newMes}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: px(16),
        paddingBottom: px(10),
    },
    avatar: {width: px(30), height: px(30), borderRadius: px(30), marginRight: px(10)},
    name: {fontSize: px(14), fontWeight: '700', marginRight: px(4)},
    header_icon: {
        width: px(32),
        height: px(32),
    },
    point_sty: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(20),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        minWidth: px(14),
    },
    point_text: {
        color: '#fff',
        fontSize: px(9),
        lineHeight: px(10),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
});
