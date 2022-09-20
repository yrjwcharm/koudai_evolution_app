/*
 * @Date: 2022-07-01 11:59:15
 * @Description: 基金首页接口
 */
import http from '~/services';

export const getPageData = (params = {}) => http.get('/products/fund/index/20220901', params);
