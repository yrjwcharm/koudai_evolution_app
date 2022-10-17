/*
 * @Date: 2022-10-08 15:20:51
 * @Description: 社区首页接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/community/index/202209', params);

export const getFollowedData = (params) => http.get('/community/follow/202209', params);

export const getRecommendFollowUsers = (params) => http.get('/follow/recommend/users/202209', params);

export const getRecommendData = (params) => http.get('/community/index/recommend/20220928', params);

export const getCanPublishContent = (params) => http.get('/community/article/gettypes/202209', params);
