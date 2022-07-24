/*
 * @Date: 2022-07-24 21:03:33
 * @Description: 计划介绍页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/project/introduce/202207', params);
