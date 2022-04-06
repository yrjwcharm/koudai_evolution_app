/*
 * @Date: 2022-04-06 17:26:18
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-06 18:28:55
 * @Description:文章评论解表
 */
import {StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import {BottomModal, PageModal} from '../../components/Modal';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {px} from '../../utils/appUtil';
const ArticleCommentList = ({navigation, route}) => {
    const inputModal = useRef();

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
            <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() => inputModal?.current?.show()}>
                    <Text>发布</Text>
                </TouchableOpacity>
                <Text>CommentLisy</Text>
            </ScrollView>
            <PageModal ref={inputModal} title="写留言" height={px(360)}>
                <TextInput />
            </PageModal>
        </>
    );
};

export default ArticleCommentList;

const styles = StyleSheet.create({});
