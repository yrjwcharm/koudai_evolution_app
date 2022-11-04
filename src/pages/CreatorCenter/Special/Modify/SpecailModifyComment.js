/*
 * @Date: 2022-10-11 13:03:31
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-04 14:57:01
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecailModifyComment.js
 * @Description: 修改专题-评论管理
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Platform, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal, PageModal} from '~/components/Modal';
import {Style, Colors, Font} from '~/common/commonStyle';
import {getCommentList, getManageComment, addComment, doCommentOP} from './services';
import {Button} from '~/components/Button';
import LoadingTips from '~/components/LoadingTips';
import Toast from '~/components/Toast';

function Tabs(props) {
    return (
        <View style={[styles.tabContainer]}>
            {props.tabs.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.tabItem]}
                    key={idx}
                    onPress={() => {
                        props.goToPage(idx);
                    }}>
                    <Text style={[props.activeTab === idx ? styles.tabTextActive : styles.tabTextDefault]}>{item}</Text>
                    <View style={[styles.underLine, {opacity: props.activeTab === idx ? 1 : 0}]} />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const AddCommentModal = React.forwardRef(({onPublish}, ref) => {
    const [content, setContent] = useState('');
    const inputRef = useRef(null);
    const inputModalRef = useRef(null);

    const handlePublish = () => {
        onPublish(content).then((_) => {
            inputModalRef.current?.hide();
        });
    };
    const handleShow = () => {
        setContent('');
        inputModalRef.current?.show();
    };

    React.useImperativeHandle(ref, () => {
        return {
            show: handleShow,
        };
    });
    return (
        <>
            <PageModal ref={inputModalRef} title="写评论" style={{height: px(360)}} backButtonClose={true}>
                <TextInput
                    ref={inputRef}
                    value={content}
                    multiline={true}
                    style={styles.input}
                    onChangeText={(value) => {
                        setContent(value);
                    }}
                    maxLength={500}
                    textAlignVertical="top"
                    placeholder="我来聊两句..."
                />
                <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                    <View style={Style.flexRow}>
                        <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                            {content.length}/{500}
                        </Text>
                        <Button
                            title="发布"
                            disabled={content.length <= 0}
                            style={styles.button}
                            onPress={handlePublish}
                        />
                    </View>
                </View>
            </PageModal>
        </>
    );
});

const IconMap = {
    pass: require('~/assets/img/special/pass.png'),
    refuse: require('~/assets/img/special/refuse.png'),
    like: require('~/assets/img/special/like.png'),
    like2: require('~/assets/img/special/like-1.png'),
    comment: require('~/assets/img/special/comment.png'),
    del: require('~/assets/img/special/trash.png'),
    recommend: require('~/assets/img/special/recommend.png'),
    recommend2: require('~/assets/img/special/recommend-1.png'),
};

// 获取评论中操作类型对于的图标
const getIconByOP = (op) => {
    if (op.op_type === 'like') {
        if (op.op_value === 1) return IconMap.like2;
        return IconMap.like;
    }
    if (op.op_type === 'recommend') {
        if (op.op_value === 1) return IconMap.recommend2;
        return IconMap.recommend;
    }

    return IconMap[op.op_type] || '';
};

function CommentItem(props) {
    const {item, onAction, isSub} = props;

    return (
        <>
            <View style={[styles.commentItem, isSub ? styles.commentItem_sub : {}]}>
                <FastImage style={styles.commentItem_avator} source={{uri: item.user_info.avatar}} />
                <View style={styles.commentItem_contentWrap}>
                    <Text style={styles.commentItem_name}>{item.user_info.nickname}</Text>
                    <Text style={styles.commentItem_content}>{item.content}</Text>
                    <View style={styles.commentItem_footer}>
                        <Text style={styles.commentItem_time}>{item.created_at_human}</Text>
                        <View style={styles.commentItem_actionWrap}>
                            {(item.op_list || []).map((op) => (
                                <TouchableOpacity
                                    onPress={() => onAction(item, op)}
                                    style={[styles.commentItem_action, styles[`commentItem_action_${op.op_type}`]]}>
                                    <FastImage
                                        source={op.icon ? {uri: op.icon} : getIconByOP(op)}
                                        style={[
                                            styles.commentItem_actionImg,
                                            styles[`commentItem_actionImg_${op.op_type}`],
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.commentItem_actionText,
                                            styles[`commentItem_actionText_${op.op_type}`],
                                        ]}>
                                        {op.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
            {(item.children || []).map((it, i) => (
                <CommentItem item={it} index={props.index * 10 + i} isSub={true} onAction={onAction} />
            ))}
        </>
    );
}

/** 添加审核评论 */
export default function SpecailModifyComment({navigation, route}) {
    const subject_id = route?.params?.subject_id || 1024;
    const [pageData, setPageData] = useState();
    const [data, setData] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const commentModalRef = useRef(null);

    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const commentRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        getManageComment()
            .then((res) => {
                if (res.code === '000000') {
                    setPageData(res.result);
                    setPage(1);
                    setActiveTab(0);
                }
            })
            .finally((_) => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log('change page:', page);
        if (!pageData || !subject_id) return;
        getList(pageData.tabs[activeTab].type, page, subject_id);
    }, [pageData, page, activeTab, subject_id]);

    const refresh = () => {
        if (!pageData || !subject_id) return;
        setPage(1);
        getList(pageData.tabs[activeTab].type, 1, subject_id);
    };

    const getList = useCallback((type, tpage, sid) => {
        if (tpage === 1) {
            setRefreshing(true);
            setData([]);
        }
        getCommentList({sid, type: type, page: tpage})
            .then((res) => {
                if (res.code === '000000') {
                    let tmp = tpage === 1 ? [] : data;
                    tmp = tmp.concat(res.result?.comment_list || []);
                    setData(tmp);
                    setHasMore(res.result.hasMore);
                }
            })
            .finally((_) => {
                setRefreshing(false);
            });
    }, []);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleShowComment = () => {
        commentRef.current = {object_id: subject_id, object_type: 2, parent_id: 0};
        commentModalRef.current?.show();
    };

    const handlePublish = (content, id) => {
        return addComment({content, ...commentRef.current}).then((res) => {
            if (res.code === '000000') {
                refresh();
                if ((res?.result?.message?.length ?? 0) > 0) {
                    Toast.show(res.result.message);
                }
                return Promise.resolve();
            }
            return Promise.reject();
        });
    };
    const handleTabChange = (idx) => {
        setActiveTab(idx);
        setPage(1);
    };
    const handleCommentAction = (item, op) => {
        const doAction = () => {
            doCommentOP({
                op_type: op.op_type,
                comment_id: item.id,
                op_value: op.op_value === 0 ? 1 : 0,
            }).then((res) => {
                if (res.code === '000000') {
                    refresh();
                }
            });
        };
        if (op.op_type === 'del') {
            Modal.show({
                content: '删除后相关点赞数、评论都将删除，且不可恢复，确认要删除评论吗？',
                confirm: true,
                confirmText: '确认',
                confirmCallBack: () => {
                    doAction();
                },
            });
            return;
        } else if (op.op_type === 'recommend') {
            if (op.op_value === 1) return; // 已经是推荐的不能再点击了
            Modal.show({
                content: '是否将该评论替换成专题简介？',
                confirm: true,
                confirmText: '确认',
                confirmCallBack: () => {
                    doAction();
                },
            });
            return;
        } else if (op.op_type === 'comment') {
            commentRef.current = {parent_id: item.id, object_id: op.object_id, object_type: op.object_type};
            commentModalRef.current?.show();
        } else {
            doAction();
        }
    };

    const renderItem = ({item, index}) => {
        return <CommentItem item={item} isSub={false} index={index} onAction={handleCommentAction} />;
    };
    const Footer = () => {
        if (!data || data.length === 0 || refreshing || hasMore) return null;
        return (
            <View style={{width: '100%', paddingVertical: px(20), ...Style.flexCenter}}>
                <Text style={{color: Colors.lightGrayColor}}>没有更多了</Text>
            </View>
        );
    };
    /** 列表为空时填充 */
    const EmptyLit = () => {
        if (refreshing) return null;
        return (
            <View style={styles.emptyTipWrap}>
                <FastImage
                    style={styles.searchEmpty_image}
                    resizeMode={FastImage.resizeMode.contain}
                    source={require('../../../../assets/img/emptyTip/empty.png')}
                />
                <Text style={styles.searchEmpty_text}>暂无内容</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']}>
                <NavBar title={'评论'} leftIcon="chevron-left" leftPress={handleBack} />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }
    const tabsText = pageData.tabs.map((it) => it.title);

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar title={'评论'} leftIcon="chevron-left" leftPress={handleBack} />
            <Tabs tabs={tabsText} activeTab={activeTab} goToPage={handleTabChange} />
            <View style={styles.listWrap}>
                <FlatList
                    data={data}
                    refreshing={refreshing}
                    ListEmptyComponent={EmptyLit}
                    onRefresh={() => refresh()}
                    onEndReached={() => {
                        if (hasMore) {
                            setPage(page + 1);
                        }
                    }}
                    ListFooterComponent={Footer}
                    onEndReachedThreshold={0.5}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
                <TouchableOpacity style={styles.footer} onPress={handleShowComment}>
                    <View style={styles.footer_textWrap}>
                        <Text style={styles.footer_text}>我来聊两句…</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <AddCommentModal ref={commentModalRef} onPublish={handlePublish} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#fff',
        minHeight: '100%',
        flex: 1,
    },
    listWrap: {
        flex: 1,
        height: '100%',
    },
    tabContainer: {
        width: '100%',
        height: px(36),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabTextDefault: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        fontWeight: 'bold',
    },
    tabTextActive: {
        fontSize: px(14),
        fontWeight: 'bold',
        color: '#121D3A',
        lineHeight: px(20),
    },
    underLine: {
        width: px(20),
        height: 2,
        borderRadius: 1,
        backgroundColor: '#121d3a',
        marginTop: 3,
    },
    space1: {
        marginTop: px(12),
    },
    space2: {
        marginTop: px(20),
    },
    line: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#BDC2CC',
    },
    commentItem: {
        flexDirection: 'row',
        width: '100%',
        marginTop: px(20),
        paddingHorizontal: px(20),
    },
    commentItem_sub: {
        paddingLeft: px(52),
    },
    commentItem_avator: {
        width: px(24),
        height: px(24),
        borderRadius: px(12),
    },
    commentItem_contentWrap: {
        flex: 1,
        marginLeft: px(8),
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    commentItem_name: {
        fontSize: px(12),
        color: '#545968',
    },
    commentItem_content: {
        marginTop: px(8),
        fontSize: px(12),
        color: '#121D3A',
        lineHeight: px(20),
    },
    commentItem_footer: {
        marginTop: px(8),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    commentItem_time: {
        fontSize: px(11),
        color: '#9AA0B1',
        lineHeight: px(17),
    },
    commentItem_actionWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    commentItem_action: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: px(12),
    },
    commentItem_action_pass: {
        backgroundColor: '#F1F6FF',
        borderRadius: px(8),
        paddingHorizontal: px(6),
        paddingVertical: px(1),
    },
    commentItem_action_refuse: {
        backgroundColor: '#FFF2F2',
        borderRadius: px(8),
        paddingHorizontal: px(6),
        paddingVertical: px(1),
    },
    commentItem_actionImg: {
        height: px(16),
        width: px(16),
    },
    commentItem_actionImg_recommend: {
        height: px(16),
        width: px(16),
    },
    commentItem_actionText: {
        fontSize: px(10),
        color: '#545968',
        marginLeft: px(4),
    },
    commentItem_actionText_pass: {
        marginLeft: px(2),
        color: '#0051CC',
    },
    commentItem_actionText_refuse: {
        marginLeft: px(2),
        color: '#E74949',
    },

    emptyTipWrap: {
        width: '100%',
        height: px(210),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
    },

    footer: {
        paddingHorizontal: px(16),
        width: '100%',
    },
    footer_textWrap: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: px(16),
        width: '100%',
        backgroundColor: '#F3F4F7',
        height: px(36),
        borderRadius: px(321),
    },
    footer_text: {
        color: '#9AA0B1',
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
});
