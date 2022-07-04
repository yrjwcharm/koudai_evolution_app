import http from '~/services';

export const getBuyInfo = (params) => http.get('/fund/buy/info/20220701', params);

export const getBuyFee = (params) => http.get('/fund/buy/fee/20220701', params);

export const fundBuyDo = (params) => http.post('/fund/buy/do/20220701', params);
