/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-03 11:09:07
 */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import http from '~/services';
import {px} from '~/utils/appUtil';

const LinearHeader = ({bgType, proData, tabActive, tabRef}) => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo);

    const [allMsg, setAll] = useState(0);

    const readInterface = useCallback(() => {
        http.get('/message/unread/20210101').then((res) => {
            setAll(res.result.all);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (userInfo.toJS().is_login) readInterface();
        }, [readInterface, userInfo])
    );

    return (
        <LinearGradient
            style={{paddingTop: insets.top + px(6), height: px(170)}}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={(bgType ? proData?.bg_colors : proData?.popular_banner_list?.bg_colors) || ['#EBF5FF', '#F4F5F7']}>
            <View style={[styles.searchWrap]}>
                <View style={styles.tabTextWrap}>
                    <Text
                        style={[
                            styles.tabText,
                            {color: bgType ? '#121D3A' : '#fff'},
                            tabActive === 0 ? styles.tabActive : {},
                        ]}
                        suppressHighlighting={true}
                        onPress={() => {
                            proData?.follow_url ? jump(proData.follow_url) : tabRef.current.goToPage(0);
                        }}>
                        自选
                    </Text>
                    <Text
                        style={[
                            styles.tabText,
                            {color: bgType ? '#121D3A' : '#fff'},
                            tabActive === 1 ? styles.tabActive : {},
                        ]}
                        suppressHighlighting={true}
                        onPress={() => {
                            tabRef.current.goToPage(1);
                        }}>
                        产品
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.searchInput]}
                    onPress={() => {
                        jump(proData?.search?.url);
                    }}>
                    <FastImage
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/pk-search.png'}}
                        style={{width: px(18), height: px(18), marginLeft: px(2), marginRight: px(4)}}
                    />
                    <Text style={styles.searchPlaceHolder}>{proData?.search?.placeholder}</Text>
                </TouchableOpacity>
                {proData?.message ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{marginRight: px(16)}}
                        onPress={() => {
                            global.LogTool('indexNotificationCenter');
                            jump(proData?.message?.url);
                        }}>
                        {allMsg ? (
                            <View style={[styles.point_sty, Style.flexCenter, {left: allMsg > 99 ? px(11) : px(15)}]}>
                                <Text style={styles.point_text}>{allMsg > 99 ? '99+' : allMsg}</Text>
                            </View>
                        ) : null}
                        <FastImage
                            style={{width: px(24), height: px(24)}}
                            source={{
                                uri: bgType
                                    ? 'https://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png'
                                    : 'https://static.licaimofang.com/wp-content/uploads/2022/09/message-centre-2.png',
                            }}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
        </LinearGradient>
    );
};

export default LinearHeader;

const styles = StyleSheet.create({
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabTextWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabText: {
        marginLeft: px(20),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
    },
    tabActive: {
        fontSize: px(18),
        lineHeight: px(25),
        fontWeight: 'bold',
    },
    searchInput: {
        marginLeft: px(20),
        marginRight: px(12),
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: px(146),
        paddingHorizontal: px(6),
        paddingVertical: px(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchPlaceHolder: {
        fontSize: px(13),
        color: '#545968',
        lineHeight: px(18),
    },
    point_sty: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(20),
        zIndex: 3,
        minWidth: px(14),
        height: px(14),
        paddingHorizontal: 4,
    },
    point_text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: px(9),
        lineHeight: px(13),
        fontFamily: Font.numFontFamily,
    },
});
