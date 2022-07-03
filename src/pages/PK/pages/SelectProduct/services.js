import http from '~/services';

export const addPkProducts = (params) => http.post('/pk/cart/add/20220608', params);

export const deletePkProducts = (params) => http.post('/pk/cart/delate/20220608', params);

export const getPkCartList = (params) => http.get('/pk/cart/list/20220608', params);
