/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-11 11:58:16
 * @Description:
 */
import actionTypes from '../actionTypes';
import http from '../../services';
export const update = (userInfo) => {
    return {
        type: actionTypes.UserInfo,
        payload: userInfo,
    };
};

export function getUserInfo() {
    return (dispatch) => {
        http.get('/common/user_info/20210101').then((data) => {
            dispatch(update(data.result));
        });
    };
}
