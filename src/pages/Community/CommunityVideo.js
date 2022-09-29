/*
 * @Date: 2022-09-28 14:39:51
 * @Description:
 */
import {StyleSheet, FlatList, View, TouchableWithoutFeedback} from 'react-native';
import React, {useCallback, useState} from 'react';
import Video from './components/Video';
import {deviceHeight as HEIGHT, deviceWidth as WIDTH, px} from '~/utils/appUtil';
import NavBar from '~/components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {Style} from '~/common/commonStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
};
const CommunityVideo = ({navigation}) => {
    const inset = useSafeAreaInsets();
    const [currentItem, setCurrentItem] = useState(0);
    const data = [
        {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/02/1582871555786417_1582872294679554.mp4'},
        {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/06/a96f6886ce33a47326efc005b7e47efa.mp4'},
        {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/06/a96f6886ce33a47326efc005b7e47efa.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/balace_video.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/20220712adjust_long.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/06/a96f6886ce33a47326efc005b7e47efa.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/balace_video.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/20220712adjust_long.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/06/a96f6886ce33a47326efc005b7e47efa.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/balace_video.mp4'},
        // {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/20220712adjust_long.mp4'},
    ];
    const getItemLayout = useCallback((data, index) => {
        return {length: HEIGHT, offset: HEIGHT * index, index};
    }, []);
    const renderItem = ({item, index}) => {
        return (
            <View style={{height: HEIGHT}}>
                <Video data={item} index={index} pause={index != currentItem} currentIndex={currentItem} />
            </View>
        );
    };
    const _onViewableItemsChanged = useCallback(({viewableItems}) => {
        console.log(viewableItems);
        if (viewableItems.length === 1) {
            setCurrentItem(viewableItems[0].index);
        }
    }, []);

    return (
        <View style={{flex: 1}}>
            <View style={[styles.header, Style.flexBetween, {top: inset.top}]}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Icon name="left" color="#fff" size={px(18)} />
                </TouchableWithoutFeedback>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                pagingEnabled={true}
                disableIntervalMomentum
                initialNumToRender={10}
                onViewableItemsChanged={_onViewableItemsChanged}
                // viewabilityConfig={viewabilityConfig}
                updateCellsBatchingPeriod={50}
                removeClippedSubviews={false}
                onEndReached={() => {
                    console.log('first');
                }}
            />
        </View>
    );
};

export default CommunityVideo;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        height: px(44),
        width: WIDTH - px(32),
        left: px(16),
        zIndex: 10,
        // backgroundColor: 'red',
    },
});
