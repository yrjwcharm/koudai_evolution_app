import http from '../../../services';

/**
 * 获取定投Head数据
 * @param params
 */
export const callFixedHeadDataApi = (params) => http.get(`/platform_tool/invest_regularly/head/20221010`, params);
