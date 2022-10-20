/*
 * @Date: 2022-10-14 19:08:54
 * @Description: 发布视频接口
 */
import http from '~/services';

export const getSearchList = (params) => http.get('/community/search/info/20220928', params);

export const publishVideo = (params) => http.post('community/article/submitpublish/check/202209', params);
