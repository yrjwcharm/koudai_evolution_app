/*
 * @Date: 2021-03-26 12:55:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-26 13:33:44
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateAccountInfo = (payload) => {
    return {
        type: actionTypes.AccountInfo,
        payload,
    };
};
