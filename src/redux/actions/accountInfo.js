/*
 * @Date: 2021-03-26 12:55:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-26 12:56:30
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateVerifyGesture = (payload) => {
    return {
        type: actionTypes.AccountInfo,
        payload,
    };
};
