/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-14 19:35:48
 */
const {default: http} = require('~/services');

export const getList = (data) => {
    return http.get('/subject/manage/products/my/20220901', data);
};
