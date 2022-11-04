/*
 * @Date: 2022-10-18 22:32:23
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-04 14:58:49
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/services.js
 * @Description:
 */
import http from '~/services';

/** 专题默认背景图列表 */
export const getTemplateBgImg = (params = {}) => http.get('/subject/manage/bgImg/list/20220901', params);
/** 专题基本信息获取 */
export const getStashBaseInfo = (params = {}) => http.get('/subject/manage/base_info/20220901', params);
/** 专题基本信息保存 */
export const saveStashBaseInfo = (params = {}) =>
    http.post('/subject/manage/base_info/modify/20220901', params, '请稍等...');

/** 图片上传 */
export const uploadImage = (params = {}) => http.uploadFiles('/common/image/upload', params, '请稍等...');

/** 专题 内容 - 文章库 */
export const getContentList = (params = {}) => http.get('/subject/manage/articles/all/20220901', params, false);

/** 专题 内容 - 已保存 */
export const getStashContentList = (params = {}) => http.get('/subject/manage/articles/20220901', params, false);
/** 专题 内容 - 保存 */
export const saveStashContentList = (params = {}) =>
    http.post('/subject/manage/articles/modify/20220901', params, '请稍等...');

/** 专题 提交 结果 */
export const getSpeicalResult = (params = {}) =>
    http.get('/subject/manage/audit/submit_result/20220901', params, false);
