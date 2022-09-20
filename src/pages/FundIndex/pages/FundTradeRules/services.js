/*
 * @Date: 2022-08-09 10:32:18
 * @Description: 基金交易规则接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/fund/trans_rule/info/20220623', params);
