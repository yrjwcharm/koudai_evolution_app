import http from '../../../services';

/**
 * 收益明细-获取头部数据
 * @param params
 */
export const getHeadData = (params) => http.get(`/platform_tool/profit/head/20221010`, params);

/**
 * 收益明细-获取统计数据
 * @param params
 */
export const getChartData = (params) => http.get(`/platform_tool/profit/chart/20221010`, params);
/**
 * 收益明细-收益明细列表
 * @param params
 */
export const getProfitDetail = (params) => http.get(`/platform_tool/profit/detail/20221010`, params);
/**
 * 获取收益更新说明
 */
export const getEarningsUpdateNote = (params) => http.get(`/platform_tool/profit/declare/20221010`, params);
