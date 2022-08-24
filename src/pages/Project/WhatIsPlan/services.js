/*
 * @Date: 2022-08-24 11:37:56
 * @Description: 什么是计划接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/project/explain/detail/20220824', params);
