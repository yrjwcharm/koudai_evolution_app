/*
 * @Date: 2022-04-06 17:26:18
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-15 10:48:34
 * @Description:文章评论解表
 */
import {StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Platform, FlatList} from 'react-native';
import React, {useRef, useState} from 'react';
import {BottomModal, PageModal} from '../../components/Modal';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {isIphoneX, px} from '../../utils/appUtil';
import {Button} from '../../components/Button';
import {Style} from '../../common/commonStyle';
import CommentItem from './components/CommentItem';
const inputMaxLength = 500;
const ArticleCommentList = ({navigation, route}) => {
    const inputModal = useRef();
    const inputRef = useRef();
    const [content, setContent] = useState('');
    const DATA = [
        {
            title: 'First Item',
        },
        {
            title: 'Second Item',
        },
        {
            title: 'Third Item',
        },
        {
            title: 'First Item',
        },
        {
            title: 'Second Item',
        },
        {
            title: 'Third Item',
        },
    ];

    return (
        <>
            <Header
                title="评论"
                renderLeft={
                    <TouchableOpacity style={styles.title_btn} onPress={() => navigation.goBack()}>
                        <Icon name="close" size={px(18)} />
                    </TouchableOpacity>
                }
            />

            <FlatList
                style={styles.con}
                renderItem={({item}) => {
                    return <CommentItem data={item} style={{marginBottom: px(20)}} />;
                }}
                data={DATA}
                keyExtractor={(item, index) => index.toString()}
            />
            {/* <Modal
                ref={inputModal}
                title="写评论"
                height={px(370)}
                style={{height: px(370)}}
                headerShown={false}
                position="bottom">
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
                    placeholder="聊点什么吧..."
                />
                <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                    <View style={Style.flexRow}>
                        <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                            {content.length}/{inputMaxLength}
                        </Text>
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={() => {}} />
                    </View>
                </View>
            </Modal> */}
            <PageModal
                ref={inputModal}
                title="写评论"
                height={px(370)}
                style={{height: px(370)}}
                headerShown={false}
                position="bottom">
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
                    placeholder="聊点什么吧..."
                />
                <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                    <View style={Style.flexRow}>
                        <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                            {content.length}/{inputMaxLength}
                        </Text>
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={() => {}} />
                    </View>
                </View>
            </PageModal>
            {/* footer */}
            <TouchableOpacity
                style={styles.footer}
                activeOpacity={0.9}
                onPress={() => {
                    inputModal?.current?.show();
                    setTimeout(() => {
                        inputRef?.current?.focus();
                    }, 100);
                }}>
                <View style={styles.footer_content}>
                    <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default ArticleCommentList;

const styles = StyleSheet.create({
    con: {flex: 1, backgroundColor: '#fff', paddingHorizontal: px(16), paddingTop: px(16)},
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
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: px(20) + isIphoneX() ? 34 : 0,
    },
    footer_content: {
        height: px(31),
        backgroundColor: '#F3F5F8',
        borderRadius: px(16),
        justifyContent: 'center',
        paddingLeft: px(16),
    },
});
