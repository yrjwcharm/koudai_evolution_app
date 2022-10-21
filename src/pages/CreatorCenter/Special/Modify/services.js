/*
 * @Date: 2022-10-19 17:45:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-21 18:38:43
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/services.js
 * @Description:
 */
import http from '~/services';

/** 专题 - 评论管理 */
export const getManageComment = (params = {}) => http.get('/ss_manage/comment/index/20221010', params);
/** 专题 - 评论管理 - 列表 */
export const getCommentList = (params = {}) => http.get('/ss_manage/comment/list/20221010', params);

// 添加评论
export const addComment = (params = {}) => http.post('/common/comment/add/20220921', params, true);

/** 编辑专题列表 */
export const getModifyList = (params = {}) => http.get('/subject/manage/modify/menus/20220901', params, false);

/** 提交修改专题 */
export const submitModify = (params = {}) => http.post('/subject/manage/audit/submit/20220901', params, true);

/** 推广卡片信息获取 */
export const getRecommendInfo = (params = {}) => http.get('/ss_manage/rec/setting/20221010', params, true);
export const getRecommendProductInfo = (params = {}) => http.get('/ss_manage/rec/edit/20221010', params, false);

/** 推广卡片信息保存 */
export const saveRecommendInfo = (params = {}) => http.post('/ss_manage/rec/save/20221010', params, true);

/** 推广卡片-产品选择 */
export const getProductList = (params = {}) => http.get('/ss_manage/rec/products/20221010', params, false);
