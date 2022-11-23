/*
 * @Date: 2022-11-22 16:26:31
 * @Description: 转换投顾机构接口
 */
import http from '~/services';

export const getData = (params) => http.get('/adviser/transfer/detail/20221122', params);

export const doTransfer = (params) => http.post('/adviser/transfer/do/20221122', params);

export const actionReport = (params) => http.post('/advisor/action/report/20220422', params);
