/*
 * @Date: 2022-09-21 10:33:17
 * @Description: 公共评论页接口
 */
import http from '~/services';

export const getCommentList = (params) => http.get('/common/comment/list/20220921', params);

export const publishNewComment = (params) => http.post('/common/comment/add/20220921', params);
