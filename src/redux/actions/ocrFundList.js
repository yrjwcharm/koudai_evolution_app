/*
 * @Date: 2021-11-01 15:04:32
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 23:12:07
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateFundList = (data) => {
    return {
        type: actionTypes.OcrFundList,
        payload: data,
    };
};
