/*
 * @Date: 2022-06-29 19:29:33
 * @Description:
 */
import http from '~/services';
export const getSearchData = (params) => {
    return http.get('/pk/index/search/20220608', params);
};
export const getSearchInfo = () => {
    return http.get('/pk/search/default/20220608');
};
export const postSearchKeyword = (params) => {
    return http.post('/pk/search/keyword/20220608', params);
};
export const delSearchKeyword = (params) => {
    return http.post('/pk/search/delete/20220608', params);
};
