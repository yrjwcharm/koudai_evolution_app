/*
 * @Date: 2022-07-13 10:28:43
 * @Description:
 */
import http from '~/services';

export const getInfo = () => {
    return http.get('/asset/overview/common/20220915');
};
export const getHolding = () => {
    return http.get('/asset/overview/holding/20220915');
};
export const postAssetClass = (params) => {
    return http.post('/asset/class/report/20220915', params);
};
export const getChart = () => {
    return http.get('/asset/overview/chart/20220915');
};
