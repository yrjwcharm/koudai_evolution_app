/*
 * @Date: 2022-10-20 16:57:46
 * @Description: 写文章接口
 */
import http from '~/services';

export const getArticleDraft = (params) => http.get('/community/article/getdraft/202209', params);

export const saveArticleDraft = (params) => http.post('/community/article/savedraft/202209', params);

export const publishArticle = (params) => http.post('/community/article/submitpublish/check/202209', params);

export const editArticle = (params) => http.post('/article/submitdoedit/202210', params);
