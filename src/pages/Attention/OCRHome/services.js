/*
 * @Date: 2022-06-27 15:33:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-29 19:07:29
 * @Description:
 */
import http from '../../../services';
export const getInfo = () => {
    return http.get('/pic/upload/index/20220608');
};
export const uploadFile = (data, progressCallBack) => {
    return http.uploadFiles('/pic/upload/20220608', data, progressCallBack);
};
