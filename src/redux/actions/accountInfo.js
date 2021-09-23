/*
 * @Date: 2021-09-23 11:33:02
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-23 11:39:19
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateAccount = (info) => {
    return {
        type: actionTypes.Account,
        payload: info,
    };
};
