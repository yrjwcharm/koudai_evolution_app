/*
 * @Date: 2021-03-18 10:31:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-17 11:01:15
 * @Description:
 */
import React, {useEffect} from 'react';
import Storage from '../../utils/storage';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
import http from '../../services';
export default function Loading({navigation}) {
    const dispatch = useDispatch();
    global.getUserInfo = () => {
        dispatch(getUserInfo());
    };
    useEffect(() => {
        Storage.get('AppGuide').then((res) => {
            http.get('/health/check')
                .then((result) => {
                    dispatch(getUserInfo());
                    console.log(result.result); //不能去掉
                    if (res) {
                        navigation.replace('Tab');
                    } else {
                        navigation.replace('AppGuide');
                    }
                })
                .catch(() => {
                    global.api = 'online1';
                    setTimeout(() => {
                        dispatch(getUserInfo());
                    }, 10);
                    if (res) {
                        navigation.replace('Tab');
                    } else {
                        navigation.replace('AppGuide');
                    }
                });
        });
    }, [navigation, dispatch]);
    return null;
}
