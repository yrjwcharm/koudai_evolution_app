/*
 * @Date: 2021-03-18 10:31:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-16 17:11:54
 * @Description:
 */
import React, {useEffect} from 'react';
import Storage from '../../utils/storage';
import {useDispatch} from 'react-redux';
import {getUserInfo, updateUserInfo} from '../../redux/actions/userInfo';
import http from '../../services';
export default function Loading({navigation}) {
    const dispatch = useDispatch();
    global.getUserInfo = () => {
        dispatch(getUserInfo());
    };
    dispatch(getUserInfo());
    useEffect(() => {
        Storage.get('AppGuide').then((res) => {
            // try {
            //     http.get('/mapi/app/config/2021010/1')
            //         .then((result) => {
            //             console.log(result);
            //         })
            //         .catch(() => {
            //             console.log('/mapi/app/config/20210111');
            //             dispatch(updateUserInfo({api: 'cn'}));
            //         });
            // } catch (error) {
            //     console.log(error, '12312312');
            // }

            if (res) {
                navigation.replace('Tab');
            } else {
                navigation.replace('AppGuide');
            }
        });
    }, [navigation, dispatch]);
    return null;
}
