/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-02 16:05:03
 * @Description:
 */
import actionTypes from '../actionTypes';

export const updateVision = (vision) => {
    return {
        type: actionTypes.Vision,
        payload: vision,
    };
};
