/*
 * @Date: 2022-07-01 11:59:15
 * @Description: 基金分类接口
 */
import http from '~/services';

export const getFundCate = (params = {}) => http.get('/fund/cate/navigation/20220610', params);

export const getFundList = (params = {}) => http.get('/fund/cate/fund_list/20220610', params);
