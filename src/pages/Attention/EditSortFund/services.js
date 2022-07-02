/*
 * @Date: 2022-06-29 15:17:41
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-02 14:21:27
 * @Description:
 */
import http from '~/services';

export const getList = (params) => {
    return http.get('/follow/listlite/202206', params);
};
export const changeSort = (params) => {
    return http.post('follow/changesort/202206', params);
};
export const handleCancle = (params) => {
    return http.post('follow/cancel/202206', params);
};
