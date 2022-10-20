/*
 * @Date: 2022-10-18 22:32:23
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 12:36:09
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/services.js
 * @Description:
 */
import http from '~/services';

/** 专题默认背景图列表 */
export const getTemplateBgImg = (params = {}) => http.get('/subject/manage/bgImg/list/20220901', params);
/** 专题基本信息获取 */
export const getStashBaseInfo = (params = {}) => http.get('/subject/manage/base_info/20220901', params);
/** 专题基本信息保存 */
export const saveStashBaseInfo = (params = {}) => http.post('/subject/manage/base_info/modify/20220901', params, true);

/** 图片上传 */
export const uploadImage = (params = {}) => http.uploadFiles('/common/image/upload', params, true);
