/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-22 14:56:00
 * @Description:
 */
import actionTypes from '../actionTypes';
import http from '../../services';
export const updateUserInfo = (userInfo) => {
    return {
        type: actionTypes.UserInfo,
        payload: userInfo,
    };
};

export function getUserInfo() {
    return (dispatch) => {
        http.get('/common/user_info/20210101').then((data) => {
            dispatch(updateUserInfo(data.result));
        });
    };
}

export const updateVerifyGesture = () => {
    return {
        type: actionTypes.UserInfo,
        payload: {verifyGesture: true},
    };
};

export function getVerifyGesture() {
    return (dispatch) => {
        dispatch(updateVerifyGesture());
    };
}
