/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-28 11:21:21
 * @Description:
 */
import actionTypes from '../actionTypes';
// import http from '../service/http'
export const update = (userInfo) => {
    return {
        type: actionTypes.LoginIn,
        payload: userInfo,
    };
};

export function getUserInfo() {
    return (dispatch) => {
        // http.get('/common/passport/user/info/20200808').then((data) => {
        //     dispatch(update(data.result));
        // });
    };
}
