import {arrDelete} from '../../../../utils/appUtil';
import Storage from '../../../../utils/storage';

// 保存搜索标签
export const insertSearch = (searchHistory, text) => {
    if (searchHistory.indexOf(text) != -1) {
        // 本地历史 已有 搜索内容
        let index = searchHistory.indexOf(text);
        let tempArr = arrDelete(searchHistory, index);
        tempArr.unshift(text);
        Storage.save('searchHistory', tempArr);
    } else {
        // 本地历史 无 搜索内容
        let tempArr = searchHistory;
        tempArr.unshift(text);
        Storage.save('searchHistory', tempArr);
    }
};
//获取搜索历史
export const getSearchHistory = async () => {
    let history = await Storage.get('searchHistory');
    return history;
};
