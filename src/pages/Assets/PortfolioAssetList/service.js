import http from '~/services';

/*
 * @Date: 2022-09-23 11:13:21
 * @Description:
 */
export const getData = (parmas) => http.get('/asset/class/common/20220915', parmas);
export const getHold = (params) => http.get('/asset/class/holding/20220915', params);
export const getPageData = (params) => http.get('/asset/product/holding/20220915', params);
