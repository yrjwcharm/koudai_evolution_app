/*
 * @Date: 2022-04-06 17:26:18
 * @Description:文章评论列表
 */
import {StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Platform, FlatList} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Header from '~/components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {isIphoneX, px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import CommentItem from './components/CommentItem';
import {CommentModal} from '~/pages/Common/CommentList';
import http from '~/services';

const ArticleCommentList = ({navigation, route}) => {
    const commentModal = useRef();
    const [commentList, setCommentList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const {article_id, comment_id, show_modal = true} = route.params || {};
    const getData = useCallback(() => {
        http.get('/community/article/comment/list/20210101', {
            article_id,
            page,
            comment_id,
        }).then((res) => {
            setLoading(false);
            setRefreshing(false);
            setHasMore(res.result.has_more);
            if (page !== 1) {
                setCommentList((prevData) => {
                    return prevData.concat(res.result?.list || []);
                });
            } else {
                setCommentList(res.result?.list || []);
            }
        });
    }, [page]);
    useEffect(() => {
        getData();
    }, [getData]);
    useEffect(() => {
        if (comment_id === undefined && show_modal) {
            setTimeout(() => {
                commentInput();
            }, 500);
        }
    }, []);
    const onRefresh = () => {
        setRefreshing(true);
        if (page === 1) {
            getData();
        } else {
            setPage(1);
        }
    };
    //commentInput
    const commentInput = () => {
        commentModal?.current?.show();
    };
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
                    return <CommentItem key={index} data={item} style={{marginBottom: px(9)}} />;
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

            <CommentModal
                article_id={article_id}
                postMethod={(params) => http.post('/community/article/comment/add/20210101', params)}
                _ref={commentModal}
            />
            {/* footer */}
            <TouchableOpacity style={styles.footer} activeOpacity={0.9} onPress={commentInput}>
                <View style={styles.footer_content}>
                    <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default ArticleCommentList;

const styles = StyleSheet.create({
    con: {flex: 1, backgroundColor: '#fff', padding: px(16), paddingRight: px(18)},
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS === 'ios' ? px(10) : px(16),
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
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
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
