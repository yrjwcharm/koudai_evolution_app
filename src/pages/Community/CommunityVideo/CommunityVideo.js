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
    Platform,
    TextInput,
} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import Video from '../components/Video';
import {deviceWidth as WIDTH, isIphoneX, px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Style} from '~/common/commonStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Modalize} from 'react-native-modalize';
import {getCommentList, getVideoList} from './service';
import CommentItem from '~/pages/Vision/components/CommentItem';
import {Button} from '~/components/Button';
import http from '~/services';
import {BottomModal, Modal, PageModal} from '~/components/Modal';
import Toast from '~/components/Toast';
const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
};
const inputMaxLength = 500;
const HEIGHT = Dimensions.get('screen').height;
const CommunityVideo = ({navigation, route}) => {
    const inset = useSafeAreaInsets();
    const [currentItem, setCurrentItem] = useState(0);
    const modalizeRef = useRef(null);
    const {muid, type, community_id, video_id} = route?.params || {};
    const animated = useRef(new Animated.Value(0)).current;
    const [videoData, setVideoData] = useState({});
    const [commentData, setCommentData] = useState([]);
    const inputModal = useRef();
    const inputRef = useRef();
    const [content, setContent] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const getData = async () => {
        let res = await getVideoList({muid, type, community_id, video_id});
        setVideoData(res.result);
    };
    const getCommentData = async (_page) => {
        let res = await getCommentList({article_id: videoData?.items[currentItem].id, page: _page});
        setTotalCount(res.result.total_count);
        setHasMore(res.result.has_more);
        if (page != 1) {
            setCommentData((prevData) => {
                return prevData.concat(res.result?.list || []);
            });
        } else {
            setCommentData(res.result?.list || []);
        }
    };
    const handleComment = async (foucus) => {
        getCommentData(page);
        modalizeRef.current.open();
        if (foucus) {
            setTimeout(() => {
                commentInput();
            }, 200);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    const getItemLayout = useCallback((data, index) => {
        return {length: HEIGHT, offset: HEIGHT * index, index};
    }, []);
    const _onViewableItemsChanged = useCallback(({viewableItems}) => {
        if (viewableItems.length === 1) {
            setCurrentItem(viewableItems[0].index);
        }
    }, []);
    //发布评论
    const publish = () => {
        http.post('/community/article/comment/add/20210101', {
            article_id: videoData?.items[currentItem].id,
            content,
        }).then((res) => {
            if (res.code == '000000') {
                inputModal.current.hide();
                setContent('');
                Modal.show({
                    title: '提示',
                    content: res.result.message,
                });
            } else {
                Toast.show(res.message);
            }
        });
    };
    const commentInput = () => {
        inputModal?.current.show();
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 100);
    };

    const renderItem = ({item, index}) => {
        return (
            <View style={{height: HEIGHT}}>
                <Video
                    data={item}
                    index={index}
                    pause={index != currentItem}
                    currentIndex={currentItem}
                    animated={animated}
                    handleComment={handleComment}
                    community_id={community_id}
                    muid={muid}
                />
            </View>
        );
    };
    return (
        <View style={{height: HEIGHT, backgroundColor: '#000'}}>
            <View style={[styles.header, Style.flexBetween, {top: inset.top}]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{width: px(40), height: px(40)}}>
                    <Icon name="left" color="#fff" size={px(18)} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={videoData?.items}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                pagingEnabled={true}
                disableIntervalMomentum
                initialNumToRender={10}
                onViewableItemsChanged={_onViewableItemsChanged}
                removeClippedSubviews={false}
            />
            <Modalize
                ref={modalizeRef}
                modalHeight={px(560)}
                withHandle={false}
                overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                // panGestureAnimatedValue={animated}
                HeaderComponent={() => {
                    return (
                        <View style={[{height: px(64), paddingHorizontal: px(16)}, Style.flexBetween]}>
                            <Text style={{fontSize: px(16), fontWeight: '700'}}>评论{totalCount}</Text>
                            <TouchableWithoutFeedback activeOpacity={0.9} onPress={() => modalizeRef.current?.close()}>
                                <Icon name="close" size={px(20)} />
                            </TouchableWithoutFeedback>
                        </View>
                    );
                }}
                flatListProps={{
                    data: commentData,
                    style: styles.con,
                    showsVerticalScrollIndicator: false,
                    renderItem: ({item}) => {
                        return <CommentItem key={item.id} data={item} style={{marginBottom: px(9)}} />;
                    },
                    keyExtractor: (item) => item.id,
                    onEndReached: () => {
                        if (hasMore) {
                            setPage((p) => {
                                getCommentData(++p);
                                return p + 1;
                            });
                        }
                    },
                }}
                FooterComponent={() => {
                    return (
                        <>
                            <TouchableOpacity style={styles.footer} activeOpacity={0.9} onPress={commentInput}>
                                <View style={styles.footer_content}>
                                    <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                                </View>
                                <BottomModal
                                    ref={inputModal}
                                    title="写评论"
                                    style={{height: px(360)}}
                                    modalHeight={px(360)}
                                    withHandle={false}
                                    keyboardAvoidingBehavior={'padding'}>
                                    <TextInput
                                        ref={inputRef}
                                        value={content}
                                        multiline={true}
                                        style={styles.input}
                                        onChangeText={(value) => {
                                            setContent(value);
                                        }}
                                        maxLength={inputMaxLength}
                                        textAlignVertical="top"
                                        placeholder="我来聊两句..."
                                    />
                                    <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                                        <View style={Style.flexRow}>
                                            <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                                                {content.length}/{inputMaxLength}
                                            </Text>
                                            <Button
                                                title="发布"
                                                disabled={content.length <= 0}
                                                style={styles.button}
                                                onPress={publish}
                                            />
                                        </View>
                                    </View>
                                </BottomModal>
                            </TouchableOpacity>
                        </>
                    );
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
    con: {flex: 1, backgroundColor: '#fff', padding: px(16), paddingRight: px(18)},
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
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
});
