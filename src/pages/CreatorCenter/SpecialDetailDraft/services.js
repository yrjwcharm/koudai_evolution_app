/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:31:08
 */
import http from '~/services';

export const editComment = (data) => {
    return http.post('/subject/manage/comment/init/20220901', data);
};
