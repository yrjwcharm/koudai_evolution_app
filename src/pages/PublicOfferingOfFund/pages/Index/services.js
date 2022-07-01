/*
 * @Date: 2022-07-01 11:59:15
 * @Description: 公募基金首页接口
 */
import http from '~/services';

export const getPageData = (params = {}) => http.get('/fund/public/index/20220610', params);
