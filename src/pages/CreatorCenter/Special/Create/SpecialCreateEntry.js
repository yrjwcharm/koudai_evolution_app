/*
 * @Date: 2022-10-09 21:53:46
 * @Author: lizhengfeng
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-13 09:33:53
 * @Description:
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity, TextInput, DeviceEventEmitter} from 'react-native';
import NavBar from '~/components/NavBar';
import {isIphoneX, px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import http from '~/services';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '~/components/hooks';
import URI from 'urijs';
import {Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import {Modal, PageModal} from '~/components/Modal';
import {Button} from '~/components/Button';
import Toast from '~/components/Toast';
import {publishNewComment} from '~/pages/Common/CommentList/services';

export default function SpecialCreateEntry({navigation, route}) {
    const jump = useJump();
    const [data, setData] = useState('green');
    const [content, setContent] = useState('');
    const [scrolling, setScrolling] = useState(false);

    const inputModal = useRef();
    const inputRef = useRef();
    const navBarRef = useRef();

    const init = () => {
        http.get('/products/subject/detail_btn/20220901', route?.params?.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    //发布评论
    const publish = () => {
        publishNewComment({
            ...data?.comment_params,
            content,
        }).then((res) => {
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

    const handleEditContent = () => {
        jump({
            path: 'SpecailModifyContent',
        });
    };
    const handleEditComment = () => {
        inputModal.current?.show();
    };
    return (
        <View style={styles.container}>
            <NavBar
                ref={navBarRef}
                renderLeft={
                    <Text
                        style={{
                            fontSize: px(16),
                            lineHeight: px(22),
                            marginLeft: px(13),
                            color: scrolling ? '#121D3A' : '#fff',
                        }}>
                        {data?.title}
                    </Text>
                }
                renderRight={
                    <View
                        style={[
                            styles.rightIconWrap,
                            {
                                backgroundColor: scrolling ? '#fff' : 'rgba(0,0,0,0.2)',
                                borderColor: scrolling ? '#E9EAEF' : 'rgba(255,255,255,0.4)',
                            },
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                DeviceEventEmitter.emit('globalShareShow');
                            }}
                            style={styles.rightIconItemWrap}>
                            <FastImage
                                style={styles.rightIcon}
                                source={{
                                    uri:
                                        'https://static.licaimofang.com/wp-content/uploads/2022/09/more-' +
                                        (scrolling ? 'black' : 'white') +
                                        '.png',
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={[
                                styles.rightIconItemWrap,
                                {
                                    borderLeftWidth: 0.5,
                                    borderLeftColor: scrolling ? '#E9EAEF' : 'rgba(255,255,255,0.5)',
                                },
                            ]}>
                            <FastImage
                                style={styles.rightIcon}
                                source={{
                                    uri:
                                        'https://static.licaimofang.com/wp-content/uploads/2022/09/close-' +
                                        (scrolling ? 'black' : 'white') +
                                        '.png',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                }
                style={{
                    backgroundColor: scrolling ? '#fff' : 'transparent',
                    position: 'absolute',
                    zIndex: 20,
                }}
            />

            <View style={[styles.content]}>
                <TouchableOpacity onPress={handleEditContent} style={styles.btnWrap}>
                    <Text style={styles.btn_text}>编辑精选内容</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEditComment} style={styles.btnWrap}>
                    <Text style={styles.btn_text}>编辑评论</Text>
                </TouchableOpacity>
            </View>
            <PageModal ref={inputModal} title="写评论" style={{height: px(360)}} backButtonClose={true}>
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
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={publish} />
                    </View>
                </View>
            </PageModal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnWrap: {
        minWidth: 100,
        minHeight: 40,
        backgroundColor: 'blue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 15,
    },
    btn_text: {
        color: '#fff',
        fontSize: 16,
    },
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? 35 : px(15),
    },
    footer_content: {
        height: px(36),
        backgroundColor: '#F3F5F8',
        borderRadius: px(322),
        flex: 1,
        paddingLeft: px(16),
        justifyContent: 'center',
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
    },
    rightIconWrap: {
        borderRadius: px(19),
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        width: px(90),
        paddingVertical: px(5),
    },
    rightIconItemWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    rightIcon: {
        width: px(20),
        height: px(20),
    },
});
