/*
 * @Date: 2021-03-18 10:31:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-17 15:48:00
 * @Description:
 */
import React, {useEffect} from 'react';
import Storage from '../../utils/storage';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
import http from '../../services';
import Toast from '../../components/Toast';
export default function Loading({navigation}) {
    const dispatch = useDispatch();
    const envList = ['online1'];
    global.getUserInfo = () => {
        dispatch(getUserInfo());
    };
    useEffect(() => {
        Storage.get('AppGuide').then((res) => {
            http.get('/health/check')
                .then((result) => {
                    global.api = result.result.env;
                    dispatch(getUserInfo());
                    if (res) {
                        navigation.replace('Tab');
                    } else {
                        navigation.replace('AppGuide');
                    }
                })
                .catch(() => {
                    const getHealthEnv = (i, length) => {
                        global.LogTool('Host', envList[i]);
                        global.api = envList[i];
                        http.get('/health/check')
                            .then((result) => {
                                console.log(result.result);
                                dispatch(getUserInfo());
                                if (res) {
                                    navigation.replace('Tab');
                                } else {
                                    navigation.replace('AppGuide');
                                }
                            })
                            .catch(() => {
                                if (++i < length) {
                                    getHealthEnv(i, length);
                                } else {
                                    global.LogTool('Host', 'failed');
                                    Toast.show('网络异常，请稍后再试~');
                                }
                            });
                    };
                    getHealthEnv(0, 2);
                });
        });
    }, [navigation, dispatch, envList]);
    return null;
}
