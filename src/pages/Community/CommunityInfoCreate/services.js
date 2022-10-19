/*
 * @Date: 2022-10-17 10:12:44
 * @Description: 创建社区接口
 */
import http from '~/services';

export const createCommunity = (params) => http.post('/community/create/info/20220928', params);

export const editCommunity = (params) => http.post('/community/edit/info/20220928', params);
