/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-04 18:27:32
 * @Description:
 */
import actionTypes from '../actionTypes';
import http from '../../services';
export const updateVision = (vision) => {
    return {
        type: actionTypes.Vision,
        payload: vision,
    };
};
export const updateFresh = (value) => {
    return (dispatch) => {
        let _data = {refreshing: true};
        // _data[value] = {};
        dispatch(updateVision(_data));
        setTimeout(() => {
            http.get(`/vision/${value}/articles/20210524`, {
                page: 1,
            }).then((res) => {
                let new_data = {refreshing: false};
                new_data[value] = res.result;
                new_data[value].page = 1;
                dispatch(updateVision(new_data));
            });
        }, 100);
    };
};
