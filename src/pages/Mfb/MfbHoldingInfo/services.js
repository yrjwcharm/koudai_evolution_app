/*
 * @Date: 2022-07-21 14:31:06
 * @Description: 魔方宝持有信息接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/wallet/v7/funds/20220708', params);
