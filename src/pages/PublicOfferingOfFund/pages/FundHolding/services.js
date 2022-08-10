/*
 * @Date: 2022-08-10 10:56:52
 * @Description: 基金持仓页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/fund/asset/deploy/20220809', params);
