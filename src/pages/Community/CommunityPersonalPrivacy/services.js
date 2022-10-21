/*
 * @Date: 2022-10-21 15:56:53
 * @Description: 社区个人隐私管理接口
 */
import http from '~/services';

export const getData = (params) => http.get('/community/personal/info/20220928', params);

export const saveData = (params) => http.post('/community/personal/setting/20220928', params);
