/*
 * @Date: 2022-07-22 17:40:52
 * @Description: 升级详情页接口
 */
import http from '~/services';

export const getUpgradeToPortfolioData = (params) => http.get('/upgrade/portfolio/detail/20220701', params);

export const getUpgradeToPortfolioCard = (params) => http.get('/upgrade/portfolio/detail_card/20220701', params);

export const getUpgradeToPlanCard = (params) => http.get('/upgrade/plan/detail_card/20220701', params);

export const getUpgradeToPlanData = (params) => http.get('/upgrade/plan/detail/20220701', params);

export const upgradeConfirm = (params) => http.get('/upgrade/portfolio/confirm/20220701', params);

export const upgradeDo = (data) => http.post('/upgrade/upgrade/do/20220701', data);
