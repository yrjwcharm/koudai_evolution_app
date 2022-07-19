/*
 * @Date: 2022-07-16 13:05:52
 * @Description: 计划详情页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/project/detail/buttons/202207', params);
