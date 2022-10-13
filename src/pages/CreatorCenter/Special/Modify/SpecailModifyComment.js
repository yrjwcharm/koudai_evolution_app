/*
 * @Date: 2022-10-11 13:03:31
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-13 20:55:14
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecailModifyComment.js
 * @Description: 精选内容
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Platform, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {deviceHeight, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, PageModal, BottomModal, SelectModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import {Style, Colors, Space, Font} from '~/common/commonStyle';
// import ScrollableTabBar from '../../components/ScrollableTabBar';
import {Button} from '~/components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/AntDesign';

/** 列表为空时填充 */
function EmptyLit() {
    return (
        <View style={styles.emptyTipWrap}>
            <FastImage
                style={styles.searchEmpty_image}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../../../../assets/img/emptyTip/empty.png')}
            />
            <Text style={styles.searchEmpty_text}>暂无内容</Text>
            <View style={styles.line} />
        </View>
    );
}

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

function AddCommentWrap({publish}) {
    const [content, setContent] = useState('');
    const inputModalRef = useRef(null);
    const inputRef = useRef(null);
    const handleShowComment = () => {
        inputModalRef.current?.show();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    };
    const handlePublish = () => {
        inputModalRef.current?.hide();
    };
    return (
        <>
            <TouchableOpacity style={styles.footer} onPress={handleShowComment}>
                <View style={styles.footer_textWrap}>
                    <Text style={styles.footer_text}>我来聊两句…</Text>
                </View>
            </TouchableOpacity>
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
}

const IconMap = {
    pass: require('~/assets/img/special/pass.png'),
    refuse: require('~/assets/img/special/refuse.png'),
    like: require('~/assets/img/special/like.png'),
    // like2: require('~/assets/img/special/like-1.png'),
    // comment: require('~/assets/img/special/comment.png'),
    del: require('~/components/IM/app/source/image/delete.png'),
    recommend: require('~/assets/img/special/recommend.png'),
    recommend2: require('~/assets/img/special/recommend-1.png'),
};

// 获取评论中操作类型对于的图标
const getIconByOP = (op) => {
    if (op.op_type === 'like') {
        if (op.is_liked) return IconMap.like2;
        return IconMap.like;
    }
    if (op.op_type === 'recommend') {
        if (op.is_recommend) return IconMap.recommend2;
        return IconMap.recommend;
    }

    return IconMap[op.op_type] || '';
};

function CommentItem(props) {
    const {item, onAction} = props;
    return (
        <View style={[styles.commentItem, item.isSub ? styles.commentItem_sub : {}]}>
            <FastImage
                style={styles.commentItem_avator}
                source={{uri: 'https://static.licaimofang.com//wp-content//uploads//2021//03//tx_moren.png'}}
            />
            <View style={styles.commentItem_contentWrap}>
                <Text style={styles.commentItem_name}>{item.user_info.nickname}</Text>
                <Text style={styles.commentItem_content}>{item.content}</Text>
                <View style={styles.commentItem_footer}>
                    <Text style={styles.commentItem_time}>{item.created_at_human}</Text>
                    <View style={styles.commentItem_actionWrap}>
                        {(item.op_list || []).map((op) => (
                            <TouchableOpacity
                                onPress={onAction}
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
    );
}

/** 添加内容 */
export default function SpecailModifyComment({navigation}) {
    const [data, setData] = useState([
        {
            user_info: {
                nickname: '肆意妹妹',
                avatar: '',
            },
            created_at_human: '1天前',
            isSub: false,
            content:
                '看到理财魔方，感觉像是找到人生中的灯塔，照亮我前行的方向，之前啥也不懂，亏钱亏钱亏钱亏到怀疑人生，现在好了，稳定赚钱赚钱。',
            op_list: [
                {
                    icon: '',
                    text: '通过',
                    op_type: 'pass',
                },
                {
                    icon: '',
                    text: '失败',
                    op_type: 'refuse',
                },
            ],
        },
        {
            user_info: {
                nickname: '肆意妹妹',
                avatar: '',
            },
            created_at_human: '1天前',
            isSub: false,
            content:
                '看到理财魔方，感觉像是找到人生中的灯塔，照亮我前行的方向，之前啥也不懂，亏钱亏钱亏钱亏到怀疑人生，现在好了，稳定赚钱赚钱。',
            op_list: [
                {
                    icon: '',
                    text: '1,256',
                    op_type: 'like',
                    is_liked: false,
                },
                {
                    icon: '',
                    text: '1',
                    op_type: 'comment',
                },
                {
                    icon: '',
                    text: '删除',
                    op_type: 'del',
                },
                {
                    icon: '',
                    text: '',
                    op_type: 'recommend',
                },
            ],
        },
        {
            user_info: {
                nickname: '肆意妹妹',
                avatar: '',
            },
            isSub: true,
            created_at_human: '1天前',
            content:
                '看到理财魔方，感觉像是找到人生中的灯塔，照亮我前行的方向，之前啥也不懂，亏钱亏钱亏钱亏到怀疑人生，现在好了，稳定赚钱赚钱。',
        },
    ]);

    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const inputModal = useRef(null);
    const inputRef = useRef(null);
    const bottomModal = useRef(null);

    useEffect(() => {
        loadTemplate();
    }, [activeTab]);
    const rightPress = () => {
        // TODO: save stash
        navigation.goBack();
    };

    const loadTemplate = () => {
        // TODO: load stash
        // setData([]);
    };
    const handleBack = () => {
        navigation.goBack();
    };

    const handlePublish = () => {};
    const handlePageChange = (idx) => {
        setActiveTab(idx);
    };
    const handleCommentAction = (comment, op) => {};

    const renderItem = ({item, index}) => {
        return <CommentItem item={item} index={index} onAction={(op) => handleCommentAction(item, op)} />;
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar title={'评论'} leftIcon="chevron-left" leftPress={handleBack} />
            <Tabs tabs={['待审核', '已发布']} activeTab={activeTab} goToPage={setActiveTab} />
            <View style={styles.listWrap}>
                {data.length === 0 && <EmptyLit />}

                <FlatList
                    data={data}
                    refreshing={refreshing}
                    onRefresh={loadTemplate}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <AddCommentWrap inputModal={inputModal} inputRef={inputRef} publish={handlePublish} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#fff',
        minHeight: '100%',
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
        height: px(8),
        width: px(8),
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
