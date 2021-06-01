/*
 * @Date: 2021-05-31 15:51:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-31 18:47:37
 * @Description:根据cate_id生产对应的内容模块
 */
import React from 'react';
import VioceCard from '../../../components/Article/VioceCard';
import VisionArticle from '../../../components/Article/VisionArticle';
import QuestionCard from '../../../components/Article/QuestionCard';
const RenderCate = (data, style) => {
    let com = '';
    switch (data.cate_id) {
        case 'voice':
            com = <VioceCard data={data} style={style} />;
            break;
        case 'market':
        case 'strategy':
            com = <VisionArticle data={data} style={style} />;
            break;

        case 'qa':
            com = <QuestionCard data={[data]} style={style} />;
            break;
        default:
            com = <VisionArticle data={data} style={style} />;
    }
    return com;
};

export default RenderCate;
