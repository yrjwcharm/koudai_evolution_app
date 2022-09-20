/*
 * @Date: 2022-07-01 11:59:15
 * @Description: 基金详情接口
 */
import http from '~/services';

export const getPageData = (params = {}) => http.get('/fund/buttons/20220617', params);
