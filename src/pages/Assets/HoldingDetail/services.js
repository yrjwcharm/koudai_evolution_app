/*
 * @Date: 2022-07-13 11:06:02
 * @Description: 持仓详情页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/portfolio/asset/detail/20220712', params);

export const getChartData = (params) => http.get('/portfolio/asset/chart/20220712', params);

export const openTool = (params) => http.post('/tool/manage/open/20211207', params);

export const setDividend = (params) => http.post('/portfolio/fund/dividend/20220712', params);

export const postUnFavor = (params) => http.post('/portfolio/asset/close_upgrade/20220712', params);
