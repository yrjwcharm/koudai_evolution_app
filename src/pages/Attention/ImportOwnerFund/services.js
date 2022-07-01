/*
 * @Date: 2022-06-28 16:26:07
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-30 18:45:33
 * @Description:
 */
import http from '~/services';

export const postImport = (data) => {
    return http.post('/follow/import/202206', data);
};
