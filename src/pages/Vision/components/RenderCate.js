/*
 * @Date: 2021-05-31 15:51:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-11 14:27:05
 * @Description:根据type生成对应的内容模块
 */
import React from 'react';
import VioceCard from '../../../components/Article/VioceCard';
import VisionArticle from '../../../components/Article/VisionArticle';
import QuestionCard from '../../../components/Article/QuestionCard';
/**
 * @description: type
 * @param {*} 1 普通文章
 * @param {*} 2 音频文章
 * @param {*} 3 视频文章
 * @param {*} 4 问答文章
 * @param {*} 5 活动文章
 * @param {*} 6 专辑文章
 * @return {*}
 */
const RenderCate = (data, style, scene) => {
    let com = '';
    switch (data.type) {
        case 2:
        case 6:
            com = <VioceCard data={data} key={data.id} style={style} scene={scene} />;
            break;
        case 1:
        case 5:
            com = <VisionArticle key={data.id} data={data} style={style} scene={scene} />;
            break;
        case 4:
            com = <QuestionCard data={data} key={data.id} style={style} scene={scene} />;
            break;
        default:
            com = <VisionArticle data={data} key={data.id} style={style} scene={scene} />;
    }
    return com;
};

export default RenderCate;
