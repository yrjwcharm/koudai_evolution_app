/*
 * @Date: 2022-06-29 19:29:33
 * @Description:
 */
import {Colors} from '~/common/commonStyle';
import {arrDelete} from '../../../../utils/appUtil';
import Storage from '../../../../utils/storage';

// 保存搜索标签
export const insertSearch = async (text) => {
    let searchHistory = await Storage.get('searchHistory');
    let tempArr;
    if (searchHistory?.indexOf(text) != -1) {
        // 本地历史 已有 搜索内容
        let index = searchHistory?.indexOf(text);
        tempArr = arrDelete(searchHistory, index) || [];
        tempArr.unshift(text);
        Storage.save('searchHistory', tempArr);
    } else {
        // 本地历史 无 搜索内容
        tempArr = searchHistory || [];
        tempArr.unshift(text);
        Storage.save('searchHistory', tempArr);
    }
    return tempArr;
};
//更新搜索历史记录
export const updateSearch = async (text) => {
    let searchHistory = await Storage.get('searchHistory');
    let tempArr;
    let index = searchHistory?.indexOf(text);
    tempArr = arrDelete(searchHistory, index);
    Storage.save('searchHistory', tempArr);
    return tempArr;
};
//获取搜索历史
export const getSearchHistory = async () => {
    let history = await Storage.get('searchHistory');
    return history || [];
};
//获取颜色值
export const getColor = (value) => {
    return value == 0 ? Colors.defaultColor : value > 0 ? Colors.red : Colors.green;
};
