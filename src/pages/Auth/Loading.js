/*
 * @Date: 2021-03-18 10:31:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-17 09:45:44
 * @Description:
 */
import React, {useEffect} from 'react';
import Storage from '../../utils/storage';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
export default function Loading({navigation}) {
    const dispatch = useDispatch();
    global.getUserInfo = () => {
        dispatch(getUserInfo());
    };
    dispatch(getUserInfo());
    useEffect(() => {
        Storage.get('AppGuide').then((res) => {
            if (res) {
                navigation.replace('Tab');
            } else {
                navigation.replace('AppGuide');
            }
        });
    }, [navigation, dispatch]);
    return null;
}
