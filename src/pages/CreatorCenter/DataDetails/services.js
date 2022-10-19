/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-10 10:51:30
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/manage_center/data_detail/index/20221010', data);
};

export const getList = (data) => {
    return http.get('/manage_center/data_detail/list/20221010', data);
};

export const getChartData = (data) => {
    return http.get('/portfolio/yield_chart/20210101', data);
};
