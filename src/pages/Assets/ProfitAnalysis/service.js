import http from '../../../services';

/**
 * 获取累计收益chart
 * @param params
 * @returns {Promise<null|*|undefined>}
 */
export const getChartData = (params) => http.get('/asset/product/chart/20220915', params);
