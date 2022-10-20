/*
 * @Date: 2022-10-09 14:06:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-19 22:36:47
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyBaseInfo.js
 * @Description: 修改专题 基础信息
 */

import React from 'react';

import SpecialCreateBaseInfo from '../Create/SpecialCreateBaseInfo';

export default function SpecialModifyBaseInfo(props) {
    return SpecialCreateBaseInfo({...props, isEdit: true});
}
