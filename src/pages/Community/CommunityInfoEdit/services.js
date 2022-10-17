/*
 * @Date: 2022-10-17 15:09:18
 * @Description: 编辑社区资料接口
 */
import http from '~/services';

export const getCommunityInfo = (params) => http.get('/community/info/20220928', params);
