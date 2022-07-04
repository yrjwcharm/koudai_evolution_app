import http from '~/services';
import {debounce} from 'lodash';

export const getBuyInfo = (params) => http.get('/fund/buy/info/20220701', params);

export const getBuyFee = debounce((params) => http.get('/fund/buy/fee/20220701', params), 500, {leading: true});

export const fundBuyDo = (params) => http.post('/fund/buy/do/20220701', params);
