/*
 * @Date: 2022-09-28 14:39:51
 * @Description:
 */
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
import Video from './components/Video';
import {deviceWidth as WIDTH, isIphoneX, px} from '~/utils/appUtil';
import NavBar from '~/components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {Style} from '~/common/commonStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Modalize} from 'react-native-modalize';
const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
};
const HEIGHT = Dimensions.get('screen').height;
const CommunityVideo = ({navigation}) => {
    const inset = useSafeAreaInsets();
    const [currentItem, setCurrentItem] = useState(0);
    const modalizeRef = useRef(null);
    const animated = useRef(new Animated.Value(0)).current;
    const data = [
        {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/02/1582871555786417_1582872294679554.mp4'},
        {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/06/a96f6886ce33a47326efc005b7e47efa.mp4'},
        {uri: 'http://wp0.licaimofang.com/wp-content/uploads/2020/06/a96f6886ce33a47326efc005b7e47efa.mp4'},
    ];
    const getItemLayout = useCallback((data, index) => {
        return {length: HEIGHT, offset: HEIGHT * index, index};
    }, []);
    const renderItem = ({item, index}) => {
        return (
            <View style={{height: HEIGHT}}>
                <Video
                    data={item}
                    index={index}
                    pause={index != currentItem}
                    currentIndex={currentItem}
                    animated={animated}
                    openModal={() => modalizeRef.current.open()}
                />
            </View>
        );
    };
    const _onViewableItemsChanged = useCallback(({viewableItems}) => {
        if (viewableItems.length === 1) {
            setCurrentItem(viewableItems[0].index);
        }
    }, []);

    return (
        <View style={{height: HEIGHT, backgroundColor: '#000'}}>
            <View style={[styles.header, Style.flexBetween, {top: inset.top}]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{width: px(40), height: px(40)}}>
                    <Icon name="left" color="#fff" size={px(18)} />
                </TouchableOpacity>
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
                removeClippedSubviews={false}
                onEndReached={() => {
                    console.log('first');
                }}
            />
            <Modalize
                ref={modalizeRef}
                modalHeight={px(500)}
                withHandle={false}
                closeOnOverlayTap={false}
                overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                // panGestureAnimatedValue={animated}
                HeaderComponent={() => {
                    return (
                        <View style={[{height: px(64), paddingHorizontal: px(16)}, Style.flexBetween]}>
                            <Text style={{fontSize: px(16), fontWeight: '700'}}>评论22</Text>
                            <TouchableWithoutFeedback activeOpacity={0.9} onPress={() => modalizeRef.current?.close()}>
                                <Icon name="close" size={px(20)} />
                            </TouchableWithoutFeedback>
                        </View>
                    );
                }}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                }}
                FooterComponent={() => {
                    return (
                        <TouchableOpacity style={styles.footer} activeOpacity={0.9}>
                            <View style={styles.footer_content}>
                                <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}>
                <>
                    <View style={{height: px(1000)}}>
                        <Text onPress={() => navigation.navigate('Login')}>...your content</Text>
                    </View>
                </>
            </Modalize>
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
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: px(8) + (isIphoneX() ? 34 : 0),
    },
    footer_content: {
        height: px(36),
        backgroundColor: '#F3F5F8',
        borderRadius: px(16),
        justifyContent: 'center',
        paddingLeft: px(16),
    },
});
