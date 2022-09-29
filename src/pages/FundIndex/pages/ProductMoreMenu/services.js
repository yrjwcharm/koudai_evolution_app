/*
 * @Date: 2022-09-29 14:44:00
 * @Description: 更多分类接口
 */
import http from '~/services';

export const getPageData = (params) => http.get('/products/menus/more/20220901', params);
