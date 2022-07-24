/*
 * @Date: 2022-07-22 17:40:52
 * @Description: 升级详情页接口
 */
import http from '~/services';

export const getUpgradeToPortfolioData = (params) => http.get('/upgrade/portfolio/detail/20220701', params);

export const getUpgradeToPlanData = (params) => http.get('/upgrade/plan/detail/20220701', params);
