import http from '../../../services';

/**
 *
 * @param params
 * @returns {Promise<null|*|undefined>}
 */
export const getChartData = (params) => http.get('/asset/product/chart/20220915', params);
