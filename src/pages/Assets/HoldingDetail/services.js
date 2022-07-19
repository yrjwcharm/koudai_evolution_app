/*
 * @Date: 2022-07-13 11:06:02
 * @Description: 持仓详情页接口
 */
import http from '~/services';

export const getPageData = (params) =>
    http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/portfolio/asset/detail/20220712', params);

export const getChartData = (params) =>
    http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/portfolio/asset/chart/20220712', params);
