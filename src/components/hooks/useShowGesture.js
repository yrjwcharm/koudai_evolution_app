/*
 * @Date: 2021-03-23 14:37:37
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-11 19:57:24
 * @Description: 判断是否展示手势密码
 */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import storage from '../../utils/storage';

function useShowGesture() {
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const [showGesture, setShowGesture] = useState(false);
    useEffect(() => {
        storage.get('gesturePwd').then((res) => {
            // console.log(res);
            // console.log(userInfo);
            if (res && res[`${userInfo.uid}`]) {
                storage.get('openGesturePwd').then((result) => {
                    // console.log(result);
                    if (result && result[`${userInfo.uid}`]) {
                        if (userInfo.is_login && !userInfo.verifyGesture) {
                            setShowGesture(true);
                        } else {
                            setShowGesture(false);
                        }
                    } else {
                        setShowGesture(false);
                    }
                });
            } else {
                setShowGesture(false);
            }
        });
    }, [userInfo]);
    return showGesture;
}

export default useShowGesture;
