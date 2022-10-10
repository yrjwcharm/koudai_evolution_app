import http from '~/services';

/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-10 10:51:30
 */
export const getChartData = (data) => {
    return http.get('/portfolio/yield_chart/20210101', data);
};
