/*
 * @Date: 2021-03-23 14:37:37
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-23 14:58:20
 * @Description: 判断是否展示手势密码
 */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import storage from '../../utils/storage';

function useShowGesture() {
    const userInfo = useSelector((store) => store.userInfo);
    const [showGesture, setShowGesture] = useState(false);
    useEffect(() => {
        async function getShowGesture() {
            const res = await storage.get('gesturePwd');
            if (res) {
                const result = await storage.get('openGesturePwd');
                if (result) {
                    if (userInfo?.toJS()?.is_login && !userInfo?.toJS()?.verifyGesture) {
                        setShowGesture(true);
                    } else {
                        setShowGesture(false);
                    }
                } else {
                    setShowGesture(false);
                }
            } else {
                setShowGesture(false);
            }
        }
        getShowGesture();
    }, [userInfo]);
    return showGesture;
}

export default useShowGesture;
