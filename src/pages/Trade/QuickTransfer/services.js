/*
 * @Date: 2022-08-25 15:48:51
 * @Description: 一键转换接口
 */
import http from '../../../services';

export const getIntroData = (params) => http.get('/transfer/introduce/202208', params);

export const getTransferList = (params) => http.get('/transfer/list/202208', params);

export const getTransferPreData = (params) => http.get('/transfer/portfolio/preview/202208', params);

export const transfetCalc = (params) => http.get('/transfer/portfolio/trial/202208', params);

export const transferConfirm = (params) => http.post('/transfer/portfolio/doconfirm/202208', params);

export const getTransferDetail = (params) => http.get('/transfer/portfolio/detail/202208', params);
