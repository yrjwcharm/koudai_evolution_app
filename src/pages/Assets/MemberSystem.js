/*
 * @Date: 2021-02-26 14:44:03
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-29 16:01:41
 * @Description: 魔方会员体系
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';

const levelColor = ['#9CBEFF', '#DEDFE0', '#F1D4A2', '#D9E2F4', '#3F3F42'];

const MemberSystem = ({navigation, route}) => {
    const [data, setData] = useState({
        title: '魔方会员体系',
        rule_list: [
            {
                title: '1.什么是信任值？',
                items: [
                    {
                        content: '1)用户通过理财魔方进行投资能够获得信任值（类比经验值）。',
                    },
                    {
                        content: '2)积累信任值能够提升会员等级。用户会员等级越高，享受的专属服务越多。',
                    },
                    {
                        content: '3)用户可以通过购买、持仓、调仓等行为获得信任值。',
                    },
                    {
                        content:
                            '4)当用户的基金总持仓金额连续180天小于100元，信任值会缓慢减少。会员等级会随着信任值减少而降低。',
                    },
                ],
                style: 'text',
            },
            {
                title: '2.会员等级对照表',
                style: 'table',
                table: {
                    th: {
                        key: '会员等级',
                        val: '信任值门槛',
                    },
                    td_list: [
                        {
                            key: '普通会员',
                            val: '0',
                        },
                        {
                            key: '白银会员',
                            val: '95,000',
                        },
                        {
                            key: '黄金会员',
                            val: '362,500',
                        },
                        {
                            key: '铂金会员',
                            val: '800,000',
                        },
                        {
                            key: '黑金会员',
                            val: '1,875,000',
                        },
                    ],
                    remark: '',
                },
                items: [],
            },
        ],
        rational_frame_list: [
            {
                active_level: 1,
                img: 'https://static.licaimofang.com/wp-content/uploads/2020/11/putong_fd_bg.png',
                active_color: '#314881',
                items: [
                    {
                        id: 1,
                        title: '生日特权',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth2.png',
                        url: '/memberService?active=0',
                    },
                    {
                        id: 2,
                        title: '<span style="color:#B8C1D3">鲜花祝福</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower0.png',
                        url: '/memberService?active=1',
                    },
                    {
                        id: 4,
                        title: '<span style="color:#B8C1D3">保险咨询</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins0.png',
                        url: '/memberService?active=2',
                    },
                    {
                        id: 5,
                        title: '<span style="color:#B8C1D3">专属投顾</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult0.png',
                        url: '/memberService?active=3',
                    },
                    {
                        id: 6,
                        title: '<span style="color:#B8C1D3">口腔健康</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                        url: '/memberService?active=4',
                    },
                    {
                        id: 8,
                        title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                        url: '/memberService?active=5',
                    },
                ],
                rational_list: [
                    {
                        title: '<span style="color:#314881">普通会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 1,
                        tip: '<span style="color:#314881;font-size:12px;">当前等级</span>',
                        score: 0,
                    },
                    {
                        title: '<span style="color:#555555">白银会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#555555;font-size:12px;">还需16,497信任值</span>',
                        score: 95000,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth4.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower4.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '<span style="color:#B8C1D3">保险咨询</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins0.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '<span style="color:#B8C1D3">专属投顾</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult0.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '<span style="color:#B8C1D3">口腔健康</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                ],
                process_list: [82.63, 0],
            },
            {
                active_level: 2,
                img: 'https://static.licaimofang.com/wp-content/uploads/2020/11/baiyin_fd_bg.png',
                active_color: '#444444',
                items: [
                    {
                        id: 1,
                        title: '生日特权',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth4.png',
                        url: '/memberService?active=0',
                    },
                    {
                        id: 2,
                        title: '鲜花祝福',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower4.png',
                        url: '/memberService?active=1',
                    },
                    {
                        id: 4,
                        title: '<span style="color:#B8C1D3">保险咨询</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins0.png',
                        url: '/memberService?active=2',
                    },
                    {
                        id: 5,
                        title: '<span style="color:#B8C1D3">专属投顾</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult0.png',
                        url: '/memberService?active=3',
                    },
                    {
                        id: 6,
                        title: '<span style="color:#B8C1D3">口腔健康</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                        url: '/memberService?active=4',
                    },
                    {
                        id: 8,
                        title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                        url: '/memberService?active=5',
                    },
                ],
                rational_list: [
                    {
                        title: '<span style="color:#555555">普通会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 1,
                        tip: '<span style="color:#555555;font-size:12px;">当前等级</span>',
                        score: 0,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth2.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '<span style="color:#B8C1D3">鲜花祝福</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower0.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '<span style="color:#B8C1D3">保险咨询</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins0.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '<span style="color:#B8C1D3">专属投顾</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult0.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '<span style="color:#B8C1D3">口腔健康</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                    {
                        title: '<span style="color:#444444">白银会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#444444;font-size:12px;">还需16,497信任值</span>',
                        score: 95000,
                    },
                    {
                        title: '<span style="color:#555555">黄金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#555555;font-size:12px;">还需283,997信任值</span>',
                        score: 362500,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth1.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower1.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '保险咨询',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins1.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '专属投顾',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult1.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '<span style="color:#B8C1D3">口腔健康</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                ],
                process_list: [1, 82.63, 0, 0],
            },
            {
                active_level: 3,
                img: 'https://static.licaimofang.com/wp-content/uploads/2020/11/huangjin_fd_bg.png',
                active_color: '#725232',
                items: [
                    {
                        id: 1,
                        title: '生日特权',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth1.png',
                        url: '/memberService?active=0',
                    },
                    {
                        id: 2,
                        title: '鲜花祝福',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower1.png',
                        url: '/memberService?active=1',
                    },
                    {
                        id: 4,
                        title: '保险咨询',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins1.png',
                        url: '/memberService?active=2',
                    },
                    {
                        id: 5,
                        title: '专属投顾',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult1.png',
                        url: '/memberService?active=3',
                    },
                    {
                        id: 6,
                        title: '<span style="color:#B8C1D3">口腔健康</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                        url: '/memberService?active=4',
                    },
                    {
                        id: 8,
                        title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                        url: '/memberService?active=5',
                    },
                ],
                rational_list: [
                    {
                        title: '<span style="color:#555555">白银会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#555555;font-size:12px;">还需16,497信任值</span>',
                        score: 95000,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth4.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower4.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '<span style="color:#B8C1D3">保险咨询</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins0.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '<span style="color:#B8C1D3">专属投顾</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult0.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '<span style="color:#B8C1D3">口腔健康</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                    {
                        title: '<span style="color:#725232">黄金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#725232;font-size:12px;">还需283,997信任值</span>',
                        score: 362500,
                    },
                    {
                        title: '<span style="color:#555555">铂金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#555555;font-size:12px;">还需721,497信任值</span>',
                        score: 800000,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth2.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower2.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '保险咨询',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins2.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '专属投顾',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult2.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '口腔健康',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush2.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                ],
                process_list: [82.63, 0, 0, 0],
            },
            {
                active_level: 4,
                img: 'https://static.licaimofang.com/wp-content/uploads/2020/11/bojin_fd_bg.png',
                active_color: '#404C73',
                items: [
                    {
                        id: 1,
                        title: '生日特权',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth2.png',
                        url: '/memberService?active=0',
                    },
                    {
                        id: 2,
                        title: '鲜花祝福',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower2.png',
                        url: '/memberService?active=1',
                    },
                    {
                        id: 4,
                        title: '保险咨询',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins2.png',
                        url: '/memberService?active=2',
                    },
                    {
                        id: 5,
                        title: '专属投顾',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult2.png',
                        url: '/memberService?active=3',
                    },
                    {
                        id: 6,
                        title: '口腔健康',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush2.png',
                        url: '/memberService?active=4',
                    },
                    {
                        id: 8,
                        title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                        status: 0,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                        url: '/memberService?active=5',
                    },
                ],
                rational_list: [
                    {
                        title: '<span style="color:#555555">黄金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#555555;font-size:12px;">还需283,997信任值</span>',
                        score: 362500,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth1.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower1.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '保险咨询',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins1.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '专属投顾',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult1.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '<span style="color:#B8C1D3">口腔健康</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush0.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                    {
                        title: '<span style="color:#404C73">铂金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#404C73;font-size:12px;">还需721,497信任值</span>',
                        score: 800000,
                    },
                    {
                        title: '<span style="color:#555555">黑金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#555555;font-size:12px;">还需1,796,497信任值</span>',
                        score: 1875000,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth1.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower1.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '保险咨询',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins1.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '专属投顾',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult1.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '口腔健康',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush1.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '亲子珠宝',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel1.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                ],
                process_list: [0, 0, 0, 0],
            },
            {
                active_level: 5,
                img: 'https://static.licaimofang.com/wp-content/uploads/2020/11/heijin_fd_bg.png',
                active_color: '#FFEBCD',
                items: [
                    {
                        id: 1,
                        title: '生日特权',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth1.png',
                        url: '/memberService?active=0',
                    },
                    {
                        id: 2,
                        title: '鲜花祝福',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower1.png',
                        url: '/memberService?active=1',
                    },
                    {
                        id: 4,
                        title: '保险咨询',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins1.png',
                        url: '/memberService?active=2',
                    },
                    {
                        id: 5,
                        title: '专属投顾',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult1.png',
                        url: '/memberService?active=3',
                    },
                    {
                        id: 6,
                        title: '口腔健康',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush1.png',
                        url: '/memberService?active=4',
                    },
                    {
                        id: 8,
                        title: '亲子珠宝',
                        status: 1,
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel1.png',
                        url: '/memberService?active=5',
                    },
                ],
                rational_list: [
                    {
                        title: '<span style="color:#CFCFCF">铂金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#CFCFCF;font-size:12px;">还需721,497信任值</span>',
                        score: 800000,
                        privilege_items: [
                            {
                                id: 1,
                                title: '生日特权',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/birth2.png',
                                url: '/memberService?active=0',
                            },
                            {
                                id: 2,
                                title: '鲜花祝福',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/flower2.png',
                                url: '/memberService?active=1',
                            },
                            {
                                id: 4,
                                title: '保险咨询',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/ins2.png',
                                url: '/memberService?active=2',
                            },
                            {
                                id: 5,
                                title: '专属投顾',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/consult2.png',
                                url: '/memberService?active=3',
                            },
                            {
                                id: 6,
                                title: '口腔健康',
                                status: 1,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/brush2.png',
                                url: '/memberService?active=4',
                            },
                            {
                                id: 8,
                                title: '<span style="color:#B8C1D3">亲子珠宝</span>',
                                status: 0,
                                icon: 'https://static.licaimofang.com/wp-content/uploads/2020/11/jewel0.png',
                                url: '/memberService?active=5',
                            },
                        ],
                    },
                    {
                        title: '<span style="color:#FFEBCD">黑金会员</span>',
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/10/putong_icon@2x.png',
                        status: 0,
                        tip: '<span style="color:#FFEBCD;font-size:12px;">还需1,796,497信任值</span>',
                        score: 1875000,
                    },
                ],
                process_list: [0, 0],
            },
        ],
        rational_info: {
            score: 78503,
            title: '我的信任值 78,503',
            level: 1,
            background_img: '',
        },
    });
    const [current, setCurrent] = useState(route.params?.level || 0);
    const swiperRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerBackImage: () => {
                return <Feather name="chevron-left" size={30} color={current === 4 ? '#fff' : Colors.defaultColor} />;
            },
            headerStyle: {
                backgroundColor: levelColor[current],
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
            headerTitleStyle: {
                color: current === 4 ? '#fff' : Colors.navTitleColor,
                fontSize: text(18),
            },
        });
        StatusBar.setBarStyle(current === 4 ? 'light-content' : 'dark-content');
        return () => {
            StatusBar.setBarStyle('dark-content');
        };
    }, [current, navigation, route]);

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <View style={{marginBottom: text(-48)}}>
                    <Swiper
                        autoplay={false}
                        height={text(480)}
                        index={current}
                        loop={false}
                        onIndexChanged={(index) => setCurrent(index)}
                        ref={swiperRef}
                        showsPagination={false}>
                        {data.rational_frame_list.map((item, index) => {
                            return (
                                <ImageBackground
                                    key={`rational_frame${index}`}
                                    source={{uri: item.img}}
                                    style={styles.bg}>
                                    {/* 会员等级 */}
                                    <View
                                        style={[
                                            Style.flexRow,
                                            {
                                                justifyContent: index === 0 ? 'flex-end' : 'flex-start',
                                                marginBottom: text(4),
                                            },
                                        ]}>
                                        {index === 0 && <View style={{flex: 1}} />}
                                        {item.rational_list.map((rational, idx) => {
                                            const i = index === 0 ? 0 : 1;
                                            return (
                                                <View
                                                    key={rational.title}
                                                    style={{
                                                        flex: 1,
                                                        marginLeft: index !== 0 && idx === 0 ? text(-3) : 0,
                                                        marginRight:
                                                            index !== 4 && idx === item.rational_list.length - 1
                                                                ? text(-3)
                                                                : 0,
                                                    }}>
                                                    <HTML
                                                        html={rational.title}
                                                        style={{
                                                            ...styles.rationalTitle,
                                                            ...(idx === i ? styles.acTitle : {}),
                                                        }}
                                                    />
                                                </View>
                                            );
                                        })}
                                        {index === 4 && <View style={{flex: 1}} />}
                                    </View>
                                    {/* 信任值进度条 */}
                                    <View
                                        style={[
                                            Style.flexRow,
                                            {
                                                justifyContent: index === 0 ? 'flex-end' : 'flex-start',
                                                marginBottom: text(4),
                                            },
                                        ]}>
                                        {index !== 0 && (
                                            <View
                                                style={[
                                                    styles.barStyle,
                                                    {width: item.rational_list[0].status === 1 ? text(54) : text(49)},
                                                ]}>
                                                <View
                                                    style={[
                                                        styles.acBar,
                                                        {
                                                            width: `${
                                                                item.process_list[0] === 1 ? 100 : item.process_list[0]
                                                            }%`,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        )}
                                        {item.rational_list.map((rational, idx) => {
                                            const i = index === 0 ? 1 : 2;
                                            const lockedNum =
                                                rational.status === 0
                                                    ? item.rational_list[idx + 1]?.status === 0
                                                        ? 2
                                                        : 1
                                                    : 0;
                                            return (
                                                <View key={`level${index}${idx}`} style={Style.flexRow}>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            swiperRef.current.scrollTo(
                                                                item.active_level - i + idx,
                                                                true
                                                            )
                                                        }>
                                                        {rational.status === 1 ? (
                                                            <View style={styles.dot} />
                                                        ) : (
                                                            <Image
                                                                source={require('../../assets/personal/locked.png')}
                                                                style={styles.locked}
                                                            />
                                                        )}
                                                    </TouchableOpacity>
                                                    {idx !== item.rational_list.length - 1 && (
                                                        <View
                                                            style={[
                                                                styles.barStyle,
                                                                {width: text(119 - lockedNum * 5)},
                                                            ]}>
                                                            <View
                                                                style={[
                                                                    styles.acBar,
                                                                    {
                                                                        width: `${
                                                                            item.process_list[
                                                                                index === 0 || index === 4
                                                                                    ? idx
                                                                                    : idx + 1
                                                                            ]
                                                                        }%`,
                                                                    },
                                                                ]}
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                        {index !== 3 && index !== 4 && (
                                            <View
                                                style={[
                                                    styles.barStyle,
                                                    {
                                                        width:
                                                            item.rational_list[item.rational_list.length - 1].status ===
                                                            1
                                                                ? text(53)
                                                                : text(49),
                                                    },
                                                ]}>
                                                <View
                                                    style={[
                                                        styles.acBar,
                                                        {width: `${item.process_list[item.process_list.length - 1]}%`},
                                                    ]}
                                                />
                                            </View>
                                        )}
                                    </View>
                                    {/* 会员等级提示 */}
                                    <View
                                        style={[
                                            Style.flexRow,
                                            {
                                                justifyContent: index === 0 ? 'flex-end' : 'flex-start',
                                                marginTop: text(6),
                                                marginBottom: text(18),
                                            },
                                        ]}>
                                        {index === 0 && <View style={{flex: 1}} />}
                                        {item.rational_list.map((rational, idx) => {
                                            const i = index === 0 ? 0 : 1;
                                            return (
                                                <View
                                                    key={rational.title}
                                                    style={{
                                                        flex: 1,
                                                        marginLeft: index !== 0 && idx === 0 ? text(-3) : 0,
                                                        marginRight:
                                                            index !== 4 && idx === item.rational_list.length - 1
                                                                ? text(-3)
                                                                : 0,
                                                    }}>
                                                    <HTML
                                                        html={rational.tip}
                                                        style={{
                                                            ...styles.rationalTip,
                                                            ...(idx === i ? styles.acTip : {}),
                                                        }}
                                                    />
                                                </View>
                                            );
                                        })}
                                        {index === 4 && <View style={{flex: 1}} />}
                                    </View>
                                    {/* 会员专属服务 */}
                                    <View style={[Style.flexCenter, {marginHorizontal: text(12)}]}>
                                        <FontAwesome name={'caret-up'} size={26} color={'#fff'} />
                                        <View style={styles.rationalBox}>
                                            <View style={[Style.flexRow, styles.rationalInfo]}>
                                                <Text style={[styles.bigTitle, {marginRight: text(4)}]}>
                                                    {data.rational_info.title.split(' ')[0]}
                                                </Text>
                                                <Text style={[styles.bigTitle, {fontFamily: Font.numFontFamily}]}>
                                                    {data.rational_info.title.split(' ')[1]}
                                                </Text>
                                            </View>
                                            <View style={[Style.flexRow, styles.serviceBox]}>
                                                {item.items.map((v, _i) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={v.id}
                                                            style={[
                                                                Style.flexCenter,
                                                                {width: '25%', marginTop: text(22)},
                                                            ]}>
                                                            <Image source={{uri: v.icon}} style={styles.itemImg} />
                                                            <HTML html={v.title} style={styles.smallTitle} />
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            );
                        })}
                    </Swiper>
                </View>
                {/* 会员规则 */}
                <View style={{paddingHorizontal: text(18)}}>
                    {data.rule_list.map((item, index) => {
                        return (
                            <View style={{marginBottom: text(5)}} key={item.title}>
                                <Text style={[styles.title]}>{item.title}</Text>
                                {item.style === 'text' && (
                                    <View style={{marginTop: text(5)}}>
                                        {item.items.map((c, i) => {
                                            return (
                                                <Text
                                                    key={c.content}
                                                    style={{
                                                        ...styles.acTip,
                                                        lineHeight: text(22),
                                                        color: Colors.descColor,
                                                    }}>
                                                    {c.content}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                )}
                                {item.style === 'table' && (
                                    <View style={styles.tableWrap}>
                                        <View style={[Style.flexRow, styles.tableTr, {backgroundColor: '#EDEDED'}]}>
                                            <View style={[Style.flexCenter, {width: text(142), height: '100%'}]}>
                                                <Text
                                                    style={[
                                                        styles.acTip,
                                                        {color: Colors.defaultColor, fontWeight: '500'},
                                                    ]}>
                                                    {item.table.th.key}
                                                </Text>
                                            </View>
                                            <View style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                                <Text
                                                    style={[
                                                        styles.acTip,
                                                        {color: Colors.defaultColor, fontWeight: '500'},
                                                    ]}>
                                                    {item.table.th.val}
                                                </Text>
                                            </View>
                                        </View>
                                        {item.table.td_list.map((td, l) => {
                                            return (
                                                <View
                                                    key={td.key}
                                                    style={[
                                                        Style.flexRow,
                                                        styles.tableTr,
                                                        {backgroundColor: l % 2 === 0 ? '#fff' : '#F7F7F7'},
                                                    ]}>
                                                    <View
                                                        style={[
                                                            Style.flexCenter,
                                                            styles.borderRight,
                                                            {width: text(142), height: '100%'},
                                                        ]}>
                                                        <Text style={[styles.acTip, {color: Colors.defaultColor}]}>
                                                            {td.key}
                                                        </Text>
                                                    </View>
                                                    <View style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                                        <Text style={[styles.acTip, {color: Colors.defaultColor}]}>
                                                            {td.val}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bg: {
        width: '100%',
        height: text(480),
        paddingTop: text(80),
    },
    rationalTitle: {
        fontSize: text(13),
        lineHeight: text(18),
        textAlign: 'center',
    },
    acTitle: {
        fontSize: text(19),
        lineHeight: text(26),
        fontWeight: '500',
    },
    barStyle: {
        borderRadius: text(2.5),
        height: text(2),
        backgroundColor: '#444',
        overflow: 'hidden',
    },
    acBar: {
        height: text(2),
        backgroundColor: '#fff',
    },
    dot: {
        width: text(10),
        height: text(10),
        borderRadius: text(6),
        backgroundColor: '#fff',
        marginRight: text(-5),
    },
    locked: {
        width: text(20),
        height: text(20),
    },
    rationalTip: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        textAlign: 'center',
    },
    acTip: {
        fontSize: Font.textH3,
        lineHeight: text(17),
    },
    rationalBox: {
        marginTop: text(-8),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        width: '100%',
    },
    rationalInfo: {
        marginHorizontal: text(20),
        paddingVertical: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    serviceBox: {
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        paddingBottom: text(33),
    },
    itemImg: {
        width: text(28),
        height: text(28),
        marginBottom: text(4),
    },
    smallTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    tableWrap: {
        marginTop: text(11),
        borderWidth: Space.borderWidth,
        borderTopWidth: 0,
        borderColor: Colors.borderColor,
    },
    tableTr: {
        height: text(33),
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
});

export default MemberSystem;
