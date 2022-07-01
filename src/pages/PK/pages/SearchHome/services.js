/*
 * @Date: 2022-06-29 19:29:33
 * @Description:
 */
import http from '~/services';
export const getSearchData = (params) => {
    return http.get('http://kapi-webv7.yitao.mofanglicai.com.cn:10080/pk/index/search/20220608', params);
};
