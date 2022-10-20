/*
 * @Date: 2022-10-14 14:59:10
 * @Description:
 */
import http from '~/services';

export const getPersonalHomeData = (params) => {
    return http.get('/community/personal/homepage/20220928', params);
};
export const getCommunityHomeData = (params) => {
    return http.get('/community/homepage/20220928', params);
};
export const getPersonaProductList = (params) => {
    return http.get('/community/resource/list/20220928', params);
};
export const getCommunityProductList = (params) => {
    return http.get('/community/relation/list/20220928', params);
};
export const removeProduct = (params) => {
    return http.post('/community/remove_relation/data/20220928', params);
};
