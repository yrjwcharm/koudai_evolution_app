import http from '../../../services';

/**
 * 获取定投Head数据
 * @param params
 */
export const callFixedHeadDataApi = (params) => http.get(`/platform_tool/invest_regularly/head/20221010`, params);
/**
 * 定投管理工具-历史数据
 * GET /platform_tool/invest_regularly/history/20221010
 * @param params
 */
export const callHistoryDataApi = (params) => http.get(`/platform_tool/invest_regularly/history/20221010`, params);
/**
 * 定投管理工具-已经终止的定投
 * @param params
 */
export const callTerminatedFixedApi = (params) =>
    http.get(`/platform_tool/invest_regularly/terminated/20221010`, params);
