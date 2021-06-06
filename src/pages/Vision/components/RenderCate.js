/*
 * @Date: 2021-05-31 15:51:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-06 15:29:22
 * @Description:根据cate_id生产对应的内容模块
 */
import React from 'react';
import VioceCard from '../../../components/Article/VioceCard';
import VisionArticle from '../../../components/Article/VisionArticle';
import QuestionCard from '../../../components/Article/QuestionCard';
const RenderCate = (data, style, scene) => {
    let com = '';
    switch (data.cate_id) {
        case 'voice':
            com = <VioceCard data={data} key={data.id} style={style} scene={scene} />;
            break;
        case 'market':
        case 'strategy':
            com = <VisionArticle key={data.id} data={data} style={style} scene={scene} />;
            break;

        case 'qa':
            com = <QuestionCard data={[data]} key={data.id} style={style} scene={scene} />;
            break;
        default:
            com = <VisionArticle data={data} key={data.id} style={style} scene={scene} />;
    }
    return com;
};

export default RenderCate;
