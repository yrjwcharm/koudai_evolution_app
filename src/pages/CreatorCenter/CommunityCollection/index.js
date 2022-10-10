/*
 * @Description: 社区合集
 * @Autor: wxp
 * @Date: 2022-10-10 14:04:29
 */
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';

const CommunityCollection = () => {
    const [refreshing, setRefreshing] = useState(false);

    const onChangeTab = () => {};
    return (
        <View style={styles.container}>
            <ScrollableTabView
                renderTabBar={() => (
                    <ScrollableTabBar
                        style={{paddingHorizontal: px(34), backgroundColor: '#fff', paddingTop: px(10)}}
                    />
                )}
                onChangeTab={onChangeTab}>
                {['已发布', '审核未通过', '审核中'].map((item, idx) => (
                    <ScrollView
                        tabLabel={item}
                        key={idx}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
                        style={{flex: 1}}>
                        <View style={styles.cardsWrap}>
                            {[1, 2, 3].map((itm, index) => (
                                <View style={styles.cardItem} key={index}>
                                    <View style={styles.cardItemMain}>
                                        <FastImage
                                            style={styles.cardItemAvatar}
                                            source={{
                                                uri:
                                                    'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png',
                                            }}
                                        />
                                        <View style={styles.cardItemMainCenter}>
                                            <Text style={styles.cardItemMainTitle}>元芳周期社区</Text>
                                            <Text style={styles.cardItemMainDesc} numberOfLines={2}>
                                                理财魔方联合创始人，对外经贸大学经济学硕14年证券从业经验，基金投资行为研究与基金...
                                            </Text>
                                        </View>
                                        <Icon
                                            color={Colors.descColor}
                                            name="angle-right"
                                            size={px(14)}
                                            style={{marginLeft: px(8)}}
                                        />
                                    </View>
                                    <View style={styles.cardItemBottom}>
                                        <FastImage
                                            source={{
                                                uri:
                                                    'http://static.licaimofang.com/wp-content/uploads/2022/10/edit.png',
                                            }}
                                            style={styles.cardItemBottomIcon}
                                        />
                                        <Text style={styles.cardItemBottomText}>修改社区</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View style={{height: 50}} />
                    </ScrollView>
                ))}
            </ScrollableTabView>
        </View>
    );
};

export default CommunityCollection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardsWrap: {
        padding: px(16),
    },
    cardItem: {
        paddingHorizontal: px(12),
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginBottom: px(12),
    },
    cardItemMain: {
        paddingVertical: px(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardItemAvatar: {
        width: px(54),
        height: px(54),
        borderRadius: px(54),
    },
    cardItemMainCenter: {
        marginLeft: px(12),
        flex: 1,
    },
    cardItemMainTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        fontWeight: 'bold',
    },
    cardItemMainDesc: {
        marginTop: px(4),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
    },
    cardItemBottom: {
        borderTopColor: '#E9EAEF',
        borderTopWidth: 0.5,
        paddingVertical: px(12),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardItemBottomText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051cc',
    },
    cardItemBottomIcon: {
        width: px(16),
        height: px(16),
        marginRight: px(4),
    },
});
