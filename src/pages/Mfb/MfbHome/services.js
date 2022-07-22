/*
 * @Date: 2022-07-18 15:04:25
 * @Description: 魔方宝首页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/wallet/v7/dashboard/20220708', params);
