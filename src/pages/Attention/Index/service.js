/*
 * @Date: 2022-06-21 14:29:37
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-30 18:45:54
 * @Description:
 */
import http from '~/services';

export const getData = () => {
    return http.get('/follow/index/202206');
};
export const getFollowList = (params) => {
    return http.get('/follow/list/202206', params);
};
export const followAdd = (data) => {
    return http.post('/follow/add/202206', data);
};
