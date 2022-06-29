/*
 * @Date: 2022-06-29 15:17:41
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-29 16:56:33
 * @Description:
 */
import http from '~/services';

export const getList = () => {
    return http.get('/follow/listlite/202206');
};
export const changeSort = (params) => {
    return http.post('follow/changesort/202206', params);
};
export const handleCancle = (params) => {
    return http.post('follow/cancel/202206', params);
};
