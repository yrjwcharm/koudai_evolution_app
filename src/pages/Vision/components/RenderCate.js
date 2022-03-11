/*
 * @Date: 2021-05-31 15:51:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-11 17:04:34
 * @Description:根据type生成对应的内容模块
 */
import React from 'react';
import VioceCard from '../../../components/Article/VioceCard';
import VisionArticle from '../../../components/Article/VisionArticle';
import QuestionCard from '../../../components/Article/QuestionCard';
import LiveCard from '../../../components/Article/LiveCard';
import InvestPointCard from '../../../components/Article/InvestPointCard';
/**
 * @description: type
 * @param {*} 1 普通文章
 * @param {*} 2 音频文章
 * @param {*} 3 视频文章
 * @param {*} 4 问答文章
 * @param {*} 5 活动文章
 * @param {*} 6 专辑文章
 * @param {*} 20 直播类型
 * @param {*} 21 投顾观点
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
        case 20:
            com = <LiveCard data={data} key={data.id} style={style} scene={scene} />;
            break;
        case 21:
            com = <InvestPointCard data={data} key={data.id} style={style} scene={scene} />;
            break;
        default:
            com = <VisionArticle data={data} key={data.id} style={style} scene={scene} />;
    }
    return com;
};

export default RenderCate;
