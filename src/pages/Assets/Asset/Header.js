/*
 * @Date: 2022-07-13 15:22:30
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity, Image, Platform} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
const Header = ({newMes}) => {
    const jump = useJump();
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.() || {};
    return (
        <>
            <View style={[styles.header, {height: inset.top + px(42)}]}>
                <View style={{height: inset.top}} />
                <View style={[Style.flexBetween, {height: px(42)}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={Style.flexRow}
                        onPress={() => {
                            navigation.navigate('Profile');
                        }}>
                        <Image source={{uri: userInfo?.avatar}} style={styles.avatar} />
                        <Text style={styles.name}>{userInfo?.nickname || '昵称'}</Text>
                        <FontAwesome name={'angle-right'} color={Colors.defaultColor} size={18} />
                    </TouchableOpacity>
                    {/* 消息 */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{position: 'relative', ...Style.flexRow, marginRight: px(10)}}
                        onPress={() => {
                            global.LogTool('indexNotificationCenter');
                            jump({path: 'RemindMessage'});
                        }}>
                        {newMes ? (
                            <View style={[styles.point_sty, Style.flexCenter]}>
                                <Text style={styles.point_text}>{newMes > 99 ? '99+' : newMes}</Text>
                            </View>
                        ) : null}
                        <Image
                            style={{width: px(20), height: px(20)}}
                            source={require('~/assets/img/index/message.png')}
                        />
                        <Text style={{fontSize: px(13)}}>消息中心</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: px(16),
        backgroundColor: '#F1F9FF',
    },
    avatar: {width: px(32), height: px(32), borderRadius: px(16), marginRight: px(10)},
    name: {color: Colors.defaultColor, fontSize: px(14), fontWeight: '700', marginRight: px(4)},
    header_icon: {
        width: px(32),
        height: px(32),
    },
    point_sty: {
        position: 'absolute',
        right: px(-20),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(6),
        paddingVertical: 3,
        paddingHorizontal: 3,
    },
    point_text: {
        color: '#fff',
        fontSize: Font.textSm,
        fontFamily: Font.numFontFamily,
    },
});
