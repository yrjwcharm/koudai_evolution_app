/*
 * @Date: 2022-10-17 16:29:40
 * @Description:
 */
import http from '~/services';

export const getVideoList = (params) => {
    return http.get('/community/video/list/20220928', params);
};
export const getCommentList = (params) => {
    return http.get('/community/article/comment/list/20210101', params);
};
export const postProgress = (params) => http.post('/community/article/progress/20210101', params);
