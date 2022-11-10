/*
 * @Date: 2022-07-13 11:06:02
 * @Description: 持仓详情页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/asset/product/holding/20220915', params);

export const getCommonData = (params) => http.get('/asset/product/common/20220915', params);

export const getDsData = (params) => http.get('/portfolio/funds/user_holding/20210101', params);

export const getChartData = (params) => http.get('/asset/product/chart/20220915', params);

export const setDividend = (params) => http.post('/portfolio/fund/dividend/20220712', params);

export const postUnFavor = (params) => http.post('/portfolio/asset/close_upgrade/20220712', params);

export const postRenewal = (params) => http.post('/tool/signal/renewal/20220810', params);

export const getTransferGuidePop = (params) => http.get('/transfer/force/guide/pop/202208', params);
