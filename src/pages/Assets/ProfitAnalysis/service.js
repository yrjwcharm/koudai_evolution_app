import http from '../../../services';

/**
 *
 * @param params
 * @returns {Promise<null|*|undefined>}
 */
export const getChartData = (params) => http.get('/asset/product/chart/20220915', params);

/**
 * 获取日收益数据
 * @param params
 * @returns {Promise<null|*|undefined>}
 */
export const getDailyProfitData = (params) => http.get(`/profit/portfolio_nav/2021010`, params);
/**
 * 收益明细工具-获取头部数据
 * @param params
 * @returns {Promise<null|*|undefined>}
 */
export const getHeadData = (params) => http.get(`/platform_tool/profit/head/20221010`, params);
