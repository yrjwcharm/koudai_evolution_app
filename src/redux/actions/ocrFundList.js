/*
 * @Date: 2021-11-01 15:04:32
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-28 13:57:26
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateFundList = (data) => {
    return {
        type: actionTypes.OcrFundList,
        payload: data,
    };
};
