/*
 * @Date: 2022-09-21 10:36:18
 * @Description: 公共评论列表
 */
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {Modal, PageModal} from '~/components/Modal';
import Header from '~/components/NavBar';
import Toast from '~/components/Toast';
import {isIphoneX, px} from '~/utils/appUtil';
import CommentItem from '~/pages/Vision/components/CommentItem';
import {getCommentList, publishNewComment} from './services';

const inputMaxLength = 500;
const CommentList = ({navigation, route}) => {
    const inputModal = useRef();
    const inputRef = useRef();
    const [content, setContent] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const {comment_id, show_modal = true} = route.params || {};

    const getData = () => {
        getCommentList({
            ...(route.params || {}),
            page,
        })
            .then((res) => {
                setHasMore(res.result.has_more);
                if (page !== 1) {
                    setCommentList((prevData) => {
                        return prevData.concat(res.result?.list || []);
                    });
                } else {
                    setCommentList(res.result?.list || []);
                }
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };
    const onRefresh = () => {
        setRefreshing(true);
        if (page === 1) {
            getData();
        } else {
            setPage(1);
        }
    };
    // 调起评论输入框
    const commentInput = () => {
        inputModal?.current?.show();
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 100);
    };
    // 发布评论
    const publish = () => {
        publishNewComment({...(route.params || {}), content}).then((res) => {
            if (res.code == '000000') {
                inputModal.current.cancel();
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

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    useEffect(() => {
        if (comment_id === undefined && show_modal) {
            setTimeout(() => {
                commentInput();
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingBottom: px(40)}]}>
                {hasMore ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4), fontSize: px(12)}}>
                            正在加载...
                        </Text>
                    </>
                ) : commentList.length >= 10 ? (
                    <Text style={{color: Colors.darkGrayColor, fontSize: px(12)}}>已显示全部评论</Text>
                ) : null}
            </View>
        );
    };

    return (
        <>
            <Header
                title="评论"
                renderLeft={
                    <TouchableOpacity style={styles.title_btn} onPress={() => navigation.goBack()}>
                        <Icon name="close" size={px(24)} />
                    </TouchableOpacity>
                }
            />

            <FlatList
                style={styles.con}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={({item, index}) => {
                    return <CommentItem data={item} style={{marginBottom: px(9)}} />;
                }}
                ListEmptyComponent={() =>
                    !loading && (
                        <View style={[{height: px(40)}, Style.flexCenter]}>
                            <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                                暂无评论&nbsp;
                                <Text style={{color: Colors.btnColor}} onPress={commentInput}>
                                    我来写一条
                                </Text>
                            </Text>
                        </View>
                    )
                }
                ListFooterComponent={!refreshing && commentList.length > 0 && ListFooterComponent}
                data={commentList}
                onEndReached={() => {
                    if (hasMore) {
                        setPage((p) => p + 1);
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
            />

            <PageModal ref={inputModal} title="写评论" style={{height: px(360)}} backButtonClose={true}>
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
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={publish} />
                    </View>
                </View>
            </PageModal>
            {/* footer */}
            <TouchableOpacity style={styles.footer} activeOpacity={0.9} onPress={commentInput}>
                <View style={styles.footer_content}>
                    <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default CommentList;

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: '#fff',
        padding: Space.padding,
        paddingRight: px(18),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.select({android: px(16), ios: px(10)}),
        height: px(215),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
    footer: {
        paddingHorizontal: Space.padding,
        borderColor: Colors.borderColor,
        borderTopWidth: Space.borderWidth,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: px(8) + (isIphoneX() ? 34 : 0),
    },
    footer_content: {
        height: px(31),
        backgroundColor: '#F3F5F8',
        borderRadius: px(16),
        justifyContent: 'center',
        paddingLeft: px(16),
    },
});