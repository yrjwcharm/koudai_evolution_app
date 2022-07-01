/*
 * @Date: 2022-06-21 14:29:37
 * @Description:关注相关接口
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
export const followCancel = (data) => {
    return http.post('/follow/cancel/202206', data);
};
