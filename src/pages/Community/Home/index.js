/*
 * @Date: 2022-10-08 15:06:39
 * @Description: 社区首页
 */
import React, {useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import AnimateAvatar from '~/components/AnimateAvatar';
import {Button} from '~/components/Button';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {getPageData} from './services';

const avatar =
    'https://thirdwx.qlogo.cn/mmopen/vi_32/WAY6CYMkF4V0TEE0YcJX6uBDYsvtfZOzOIKssCXqhBvn14lCg1WMAqiaTNpFpFHZmDmGrYRUA9MFGjgrmNVZ9Og/132';

const Header = ({active, setActive}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[Style.flexBetween, styles.header, {paddingTop: insets.top + px(4)}]}>
            <TouchableOpacity activeOpacity={0.8}>
                <Image
                    source={{
                        uri: avatar,
                    }}
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <View style={Style.flexRow}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setActive(0)}
                    style={{marginRight: px(20), marginLeft: px(30)}}>
                    <Text style={[styles.headerTabText, active === 0 ? styles.activeTabText : {}]}>关注</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setActive(1)}>
                    <Text style={[styles.headerTabText, active === 1 ? styles.activeTabText : {}]}>推荐</Text>
                </TouchableOpacity>
            </View>
            <View style={Style.flexRow}>
                <TouchableOpacity activeOpacity={0.8} style={{marginRight: px(12)}}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/09/header-right.png'}}
                        style={styles.headerRightIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                    <Image
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png'}}
                        style={styles.headerRightIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Follow = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});

    return (
        <>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} />}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                <View style={{paddingHorizontal: Space.padding}}>
                    <Text style={[styles.title, {marginTop: px(8)}]}>推荐关注</Text>
                    <View style={[Style.flexBetween, styles.recommendItem]}>
                        <View style={Style.flexRow}>
                            <Image
                                source={{
                                    uri: avatar,
                                }}
                                style={styles.authorAvatar}
                            />
                            <View>
                                <Text style={styles.subTitle}>全天候社区</Text>
                                <Text style={[styles.smText, {marginTop: px(2)}]}>内容：10｜粉丝：21</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.followBtn,
                                {borderColor: true ? Colors.brandColor : Colors.placeholderColor},
                            ]}>
                            <Text style={[styles.desc, {color: true ? Colors.brandColor : Colors.placeholderColor}]}>
                                +关注
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={[Style.flexRow, styles.followedList]}>
                        {[1, 2, 3, 4, 5, 6].map((item, index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={index}
                                    style={[Style.flexCenter, {marginLeft: index === 0 ? 0 : px(28)}]}>
                                    {/* <Image
                                        source={{
                                            uri:
                                                avatar,
                                        }}
                                        style={styles.followedAvatar}
                                    /> */}
                                    <AnimateAvatar source={avatar} style={styles.followedAvatar} />
                                    <Text style={[styles.desc, {marginTop: px(8)}]}>全部</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </ScrollView>
            <Button style={styles.quickFollowBtn} title="一键关注" />
        </>
    );
};

const Index = () => {
    const [active, setActive] = useState(0);

    return (
        <View style={styles.container}>
            <Header active={active} setActive={setActive} />
            <ScrollableTabView locked page={active} renderTabBar={false} style={{flex: 1}}>
                <View style={{flex: 1}} tabLabel="关注">
                    <Follow />
                </View>
                <View style={{flex: 1}} tabLabel="推荐">
                    <Text>推荐</Text>
                </View>
            </ScrollableTabView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    header: {
        paddingHorizontal: Space.padding,
        paddingBottom: px(10),
    },
    avatar: {
        borderRadius: px(30),
        width: px(30),
        height: px(30),
    },
    headerTabText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    activeTabText: {
        fontSize: px(18),
        lineHeight: px(25),
        fontWeight: Font.weightMedium,
    },
    headerRightIcon: {
        width: px(24),
        height: px(24),
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    recommendItem: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    authorAvatar: {
        marginRight: px(6),
        borderRadius: px(32),
        width: px(32),
        height: px(32),
    },
    followBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(14),
        borderRadius: px(30),
        borderWidth: Space.borderWidth,
    },
    quickFollowBtn: {
        position: 'absolute',
        right: px(16),
        bottom: px(16),
        left: px(16),
    },
    followedList: {
        paddingTop: px(8),
        paddingHorizontal: Space.padding,
        paddingBottom: Space.padding,
    },
    followedAvatar: {
        borderRadius: px(54),
        width: px(54),
        height: px(54),
    },
});

export default Index;
