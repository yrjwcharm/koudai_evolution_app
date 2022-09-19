/*
 * @Date: 2022-09-16 11:07:53
 * @Description: 交易引导页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/trade_guide/info/20220914', params);

export const getReward = (params) => http.post('/trade_guide/reward/20220914', params);
