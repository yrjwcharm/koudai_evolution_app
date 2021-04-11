/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-11 18:43:11
 * @Description:
 */
import actionTypes from '../actionTypes';
import http from '../../services';
import Storage from '../../utils/storage';
export const updateUserInfo = (userInfo) => {
    return {
        type: actionTypes.UserInfo,
        payload: userInfo,
    };
};

export function getUserInfo() {
    return (dispatch) => {
        http.get('/common/user_info/20210101').then(async (data) => {
            if (data?.code === '000000') {
                dispatch(updateUserInfo(data.result));
            }
            if (!data) {
                let result = await Storage.get('loginStatus');
                let userInfo = {
                    is_login: !!result.access_token,
                };
                dispatch(updateUserInfo(userInfo));
                dispatch(getUserInfo());
            }
        });
    };
}

export async function isLogin() {
    let res = await Storage.get('loginStatus');
    return res?.access_token.length() > 0;
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
