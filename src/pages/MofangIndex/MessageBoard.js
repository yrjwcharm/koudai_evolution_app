/*
 * @Date: 2021-02-20 10:34:40
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 16:15:59
 * @Description:用户浏览详情
 */
import React, {useState, useCallback, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import http from '../../services/index.js';
import {px} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import Praise from '../../components/Praise';
import {useNetInfo} from '@react-native-community/netinfo';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
const MessageBoard = (props) => {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(netInfo.isConnected);
    const [comment, setComment] = useState(null);
    const getData = useCallback(() => {
        http.get('/comment/detail/20210101', {
            id: props?.route?.params?.id,
        }).then((res) => {
            setComment(res.result);
        });
    }, [props]);
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);

    useEffect(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);
    useEffect(() => {
        if (hasNet) {
            getData();
        }
    }, [getData, hasNet]);
    return (
        <View style={styles.container}>
            {hasNet ? (
                <>
                    <View style={Style.flexRow}>
                        <FastImage source={{uri: comment?.avatar}} style={styles.avatar} />
                        <View style={{flex: 1}}>
                            <Text style={styles.avatar_name}>{comment?.name}</Text>
                            <Text
                                style={{
                                    fontSize: px(12),
                                    color: Colors.darkGrayColor,
                                }}>
                                {comment?.from}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.about_text} numberOfLines={4}>
                        {comment?.content}
                    </Text>
                    <View style={{alignItems: 'flex-end', margin: px(20)}}>
                        {comment && (
                            <Praise
                                comment={{
                                    favor_status: comment?.favor_status,
                                    favor_num: comment?.favor_num,
                                    id: comment.id,
                                }}
                            />
                        )}
                    </View>
                </>
            ) : (
                <>
                    <Empty
                        img={require('../../assets/img/emptyTip/noNetwork.png')}
                        text={'哎呀！网络出问题了'}
                        desc={'网络不给力，请检查您的网络设置'}
                        style={{paddingVertical: px(60)}}
                    />
                    <Button title={'刷新一下'} style={{marginHorizontal: px(20)}} onPress={refreshNetWork} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: px(20),
    },
    avatar_name: {
        fontSize: px(13),
        color: Colors.lightBlackColor,
        marginBottom: px(6),
    },
    avatar: {
        width: px(32),
        height: px(32),
        marginRight: px(13),
        borderRadius: px(16),
    },
    about_text: {
        fontSize: px(13),
        lineHeight: px(20),
        marginTop: px(16),
    },
});
export default MessageBoard;
