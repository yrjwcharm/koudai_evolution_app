/*
 * @Date: 2022-02-16 15:15:02
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-17 16:03:56
 * @Description:直播
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import http from '../../services';
import RenderTitle from './components/RenderTitle';
import RenderCate from './components/RenderCate';
import {px} from '../../utils/appUtil';
import {useJump} from '../../components/hooks';

const Live = () => {
    const [data, setData] = useState();
    const [playBackList, setPlayBackList] = useState();
    const jump = useJump();
    const init = useCallback(() => {
        http.get('http://127.0.0.1:4523/mock2/587315/11748061').then((res) => {
            setData(res.result);
        });
    }, []);
    useEffect(() => {
        init();
    }, [init]);
    return (
        <ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data?.part2?.items?.map((_article, index) => {
                    return RenderCate(_article, {
                        marginBottom: px(12),
                        marginRight: px(12),
                    });
                })}
            </ScrollView>
        </ScrollView>
    );
};

export default Live;

const styles = StyleSheet.create({});
