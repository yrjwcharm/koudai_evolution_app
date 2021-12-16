/*
 * @Date: 2021-11-01 15:04:32
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-01 15:11:17
 * @Description:
 */
import actionTypes from '../actionTypes';
export const updateModal = (info) => {
    return {
        type: actionTypes.Modal,
        payload: info,
    };
};

export const deleteModal = () => {
    return {
        type: actionTypes.DeleteModal,
    };
};
