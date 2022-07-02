/*
 * @Date: 2022-07-01 11:59:15
 * @Description: 基金榜单接口
 */
import http from '~/services';

export const getFeatureList = (params = {}) => http.get('/fund/feature/list/20220608', params);

export const getRankList = (params = {}) => http.get('/fund/rank/list/20220608', params);
