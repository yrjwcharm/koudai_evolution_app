/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-18 17:32:51
 */
export const genKey = (product_info) => {
    return product_info.product_id + ['', '基金', '组合'][product_info.product_type];
};
