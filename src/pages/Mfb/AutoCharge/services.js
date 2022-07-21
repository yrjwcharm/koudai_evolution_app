/*
 * @Date: 2022-07-21 15:19:07
 * @Description: 自动充值接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/wallet/v7/auto_charge/20220708', params);
