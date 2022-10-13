/*
 * @Date: 2022-07-01 11:59:15
 * @Description: 专题创建
 */
import http from '~/services';

// export const getTemplateImg = (params = {}) => http.get('/products/fund/index/20220901', params);
export const getTemplateImg = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            let res = {};
            res.result = [
                {
                    id: 1,
                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-1.png',
                },
                {
                    id: 2,
                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-2.png',
                },
                {
                    id: 3,
                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-3.png',
                },
            ];

            resolve(res);
        }, 1000);
    });

/** 获取专题草稿 */
export const getStashSpeical = (params = {}) => http.get('/products/fund/index/20220901', params);
/** 保存专题草稿 */
export const saveStashSpeical = (params = {}) => http.get('/products/fund/index/20220901', params);
