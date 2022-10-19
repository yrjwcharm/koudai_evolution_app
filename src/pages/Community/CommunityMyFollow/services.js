/*
 * @Date: 2022-10-18 10:50:05
 * @Description: 我的关注/我的粉丝接口
 */
import http from '~/services';

export const getData = (params) => http.get('/follow/listuser/202209', params);
