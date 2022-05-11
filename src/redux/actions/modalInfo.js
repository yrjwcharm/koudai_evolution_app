/*
 * @Date: 2021-11-01 15:04:32
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-11 09:15:45
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateModal = (info) => {
    return {
        type: actionTypes.Modal,
        payload: info,
    };
};

export const deleteModal = (payload = '') => {
    return {
        type: actionTypes.DeleteModal,
        payload,
    };
};
