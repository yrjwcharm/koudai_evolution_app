/*
 * @Date: 2022-06-27 15:33:32
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-26 16:20:56
 * @Description:
 */
import qs from 'qs';
import http from '../../../services';
export const getInfo = (data) => {
    return http.get('/pic/upload/index/20220608', data);
};
export const uploadFile = (data, progressCallBack, params) => {
    return http.uploadFiles(`/pic/upload/20220608${params ? '?' + qs.stringify(params) : ''}`, data, progressCallBack);
};
