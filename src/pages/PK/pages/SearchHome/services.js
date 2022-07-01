/*
 * @Date: 2022-06-29 19:29:33
 * @Description:
 */
import http from '~/services';
export const getSearchData = (params) => {
    return http.get('/pk/index/search/20220608', params);
};
