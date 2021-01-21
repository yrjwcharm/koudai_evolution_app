/*
 * @Author: dx
 * @Date: 2021-01-18 19:31:01
 * @LastEditTime: 2021-01-21 20:29:51
 * @LastEditors: yhc
 * @Description: 交易须知
 * @FilePath: /koudai_evolution_app/src/pages/Detail/TradeRules.js
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
// import TabBar from '../../components/ScrollTab';
import http from '../../services';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';
import BottomDesc from '../../components/BottomDesc';

class TradeRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curIndex: 0,
            data: {},
        };
    }
    componentDidMount() {
        const {account_id, type, poid, allocation_id} = this.props.route.params || {};
        // http.get('/portfolio/mustknow/20210101', { account_id, type, poid, allocation_id }).then(res => {
        //   if (res.code == '000000') {
        //     this.setState({
        //       data: res.result
        //     });
        //     this.props.navigation.setOptions({ title: res.result.title });
        //   }
        // });
        this.setState({
            data: {
                title: '交易规则',
                head: [
                    {
                        title: '交易费率',
                    },
                    {
                        title: '确认时间',
                    },
                    {
                        title: '交易金额',
                    },
                    {
                        title: '银行卡限额',
                    },
                ],
                part1: {
                    portfolio_fee: {
                        title: '交易费率',
                        desc: ['组合交易费用遵循单只基金的费率规则，详情见单只基金的交易须知'],
                        items: [
                            {
                                title: '鹏华医药科技',
                                code: '001230',
                                sub_title: '鹏华医药科技001230',
                            },
                            {
                                title: '华安科技动力',
                                code: '040025',
                                sub_title: '华安科技动力040025',
                            },
                            {
                                title: '鹏华养老产业',
                                code: '000854',
                                sub_title: '鹏华养老产业000854',
                            },
                            {
                                title: '南方现代教育',
                                code: '003956',
                                sub_title: '南方现代教育003956',
                            },
                        ],
                    },
                    portfolio_fee_desc: {
                        title: '调仓费率',
                        desc: [
                            '调仓费率分赎回费和购买费，赎回费与您当前基金赎回份额和持有时间相关，购买费与您购买基金金额相关，具体参照购买费率和赎回费率',
                        ],
                        notice: '*实际收取费用以基金公司计算为准',
                    },
                },
                part2: {
                    buy: {
                        title: '购买/定投 份额确认时间',
                        desc: [
                            'T日：交易日15:00前购买/赎回则当日为T日，15:00后购买/赎回则下一个交易日为T日，购买/赎回净值均按T日基金单位净值确认。周末和法定节假日不属于交易日。',
                        ],
                        line_image: 'https://static.licaimofang.com/wp-content/uploads/2020/07/line.png',
                        items: [
                            {
                                key: 'T日购买',
                                val: '购买组合',
                            },
                            {
                                key: 'T+1日',
                                val: '确认份额',
                            },
                            {
                                key: 'T+1日',
                                val: '查看收益',
                            },
                        ],
                        table: {
                            head: {
                                name: '基金名称',
                                confirm: '份额确认时间',
                                profile_time: '查看收益时间',
                            },
                            body: [
                                {
                                    name: '鹏华医药科技',
                                    confirm: 'T+1',
                                    profile_time: 'T+1',
                                },
                                {
                                    name: '华安科技动力',
                                    confirm: 'T+1',
                                    profile_time: 'T+1',
                                },
                                {
                                    name: '鹏华养老产业',
                                    confirm: 'T+1',
                                    profile_time: 'T+1',
                                },
                                {
                                    name: '南方现代教育',
                                    confirm: 'T+1',
                                    profile_time: 'T+1',
                                },
                            ],
                        },
                    },
                    redeem: {
                        title: '赎回 份额确认时间',
                        line_image: 'https://static.licaimofang.com/wp-content/uploads/2020/07/line.png',
                        items: [
                            {
                                key: 'T日购买',
                                val: '购买组合',
                            },
                            {
                                key: 'T+1日',
                                val: '确认份额',
                            },
                            {
                                key: 'T+3日',
                                val: '资金全部到账',
                            },
                        ],
                        table: {
                            head: {
                                name: '基金名称',
                                confirm: '份额确认时间',
                                profile_time: '资金到账时间',
                            },
                            body: [
                                {
                                    name: '鹏华医药科技',
                                    confirm: 'T+1',
                                    profile_time: 'T+3',
                                },
                                {
                                    name: '华安科技动力',
                                    confirm: 'T+1',
                                    profile_time: 'T+3',
                                },
                                {
                                    name: '鹏华养老产业',
                                    confirm: 'T+1',
                                    profile_time: 'T+3',
                                },
                                {
                                    name: '南方现代教育',
                                    confirm: 'T+1',
                                    profile_time: 'T+3',
                                },
                            ],
                        },
                    },
                    adjust: {
                        title: '调仓确认时间',
                        desc: [
                            '调仓确认时间是由赎回时间+购买时间组成，需要先等到赎回的基金全部确认后，再发起购买基金。一般情况下是T+2，如有QDII基金进行调仓，则是T+7日完成调仓。',
                        ],
                    },
                },
                part3: {
                    buy: {
                        title: '购买/定投 起购金额',
                        desc: [
                            '基金组合购买/定投均按照金额计算，由于组合中基金有最低起购门槛的限制，所以本组合购买/定投的<span style="color: #0052CD">最低起购金额为500.00元</span>',
                        ],
                        table: {
                            head: {
                                name: '基金名称',
                                start_amount: '最低起购金额',
                            },
                            body: [
                                {
                                    name: '鹏华医药科技',
                                    start_amount: '1元',
                                },
                                {
                                    name: '华安科技动力',
                                    start_amount: '1元',
                                },
                                {
                                    name: '鹏华养老产业',
                                    start_amount: '10元',
                                },
                                {
                                    name: '南方现代教育',
                                    start_amount: '1元',
                                },
                            ],
                        },
                    },
                    redeem: {
                        title: '赎回比例/份额',
                        desc: [
                            '本组合不支持单只基金赎回，在赎回时将按照比例计算组合中各只基金的赎回份额。',
                            '• 由于组合中基金有最小赎回份额及最低保留份额的限制，若组合赎回比例过小，达不到基金的最小赎回份额时，系统将提示您赎回比例过低；若赎回比例过大，赎回后基金持仓份额小于最低保留份额的限制，系统将提示您赎回比例过高，建议您100%赎回该组合。您可根据系统提示来进行操作。',
                        ],
                        table: {
                            head: {
                                name: '基金名称',
                                min_redeem: '最小赎回份额',
                                min_hold: '最低保留份额',
                            },
                            body: [
                                {
                                    name: '鹏华医药科技',
                                    min_redeem: '0份',
                                    min_hold: '0份',
                                },
                                {
                                    name: '华安科技动力',
                                    min_redeem: '0份',
                                    min_hold: '1份',
                                },
                                {
                                    name: '鹏华养老产业',
                                    min_redeem: '0份',
                                    min_hold: '0份',
                                },
                                {
                                    name: '南方现代教育',
                                    min_redeem: '1份',
                                    min_hold: '0份',
                                },
                            ],
                        },
                    },
                },
                part4: [
                    {
                        bank_id: 'ABC',
                        bank_name: '农业银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/nongye.png',
                        single_limit: '单笔1万',
                        daily_limit: '单日1万',
                        month_limit: '单月30万',
                    },
                    {
                        bank_id: 'BCM',
                        bank_name: '交通银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/05/jiaotong.jpg',
                        single_limit: '单笔10万',
                        daily_limit: '单日10万',
                        month_limit: '单月300万',
                    },
                    {
                        bank_id: 'BOC',
                        bank_name: '中国银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/zhongguo.png',
                        single_limit: '单笔20万',
                        daily_limit: '单日20万',
                        month_limit: '单月500万',
                    },
                    {
                        bank_id: 'BOS',
                        bank_name: '上海银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/shanghai.png',
                        single_limit: '单笔5千',
                        daily_limit: '单日5万',
                        month_limit: '单月150万',
                    },
                    {
                        bank_id: 'CCB',
                        bank_name: '建设银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/jianshe.png',
                        single_limit: '单笔40万',
                        daily_limit: '单日40万',
                        month_limit: '单月200万',
                    },
                    {
                        bank_id: 'CIB',
                        bank_name: '兴业银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/xingye.png',
                        single_limit: '单笔5万',
                        daily_limit: '单日5万',
                        month_limit: '单月150万',
                    },
                    {
                        bank_id: 'CMB',
                        bank_name: '招商银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/zhaoshang.png',
                        single_limit: '单笔3万',
                        daily_limit: '单日3万',
                        month_limit: '单月90万',
                    },
                    {
                        bank_id: 'HXB',
                        bank_name: '华夏银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/05/huaxia.jpg',
                        single_limit: '单笔5千',
                        daily_limit: '单日5千',
                        month_limit: '单月15万',
                    },
                    {
                        bank_id: 'ICB',
                        bank_name: '工商银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/gongshang.png',
                        single_limit: '单笔5万',
                        daily_limit: '单日5万',
                        month_limit: '单月30万',
                    },
                    {
                        bank_id: 'MBC',
                        bank_name: '民生银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/minsheng.png',
                        single_limit: '单笔5万',
                        daily_limit: '单日5万',
                        month_limit: '单月150万',
                    },
                    {
                        bank_id: 'PAB',
                        bank_name: '平安银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/04/pingan.png',
                        single_limit: '单笔5千',
                        daily_limit: '单日5千',
                        month_limit: '单月15万',
                    },
                    {
                        bank_id: 'PDB',
                        bank_name: '浦发银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/05/pufa.jpg',
                        single_limit: '单笔5万',
                        daily_limit: '单日5万',
                        month_limit: '单月150万',
                    },
                    {
                        bank_id: 'PSB',
                        bank_name: '邮储银行',
                        bank_icon: 'https://static.licaimofang.com/wp-content/uploads/2016/10/youchu.png',
                        single_limit: '单笔5万',
                        daily_limit: '单日5万',
                        month_limit: '单月150万',
                    },
                ],
                bottom: {
                    image: 'https://static.licaimofang.com/wp-content/uploads/2020/12/endorce_CMBC.png',
                    desc: [
                        {
                            title: '基金销售服务由玄元保险提供',
                        },
                        {
                            title: '基金销售资格证号:000000803',
                            btn: {
                                text: '详情',
                                url: '/article_detail/79',
                            },
                        },
                        {
                            title: '市场有风险，投资需谨慎',
                        },
                    ],
                },
            },
        });
    }
    ChangeTab = (i) => {
        this.setState({
            curIndex: i,
        });
    };
    render_limit() {
        const {data} = this.state;
        return (
            <View>
                {data.part5.length > 0 &&
                    data.part5.map((item, index) => {
                        return (
                            <View style={styles.banklistWrap}>
                                <Image source={{uri: item.bank_icon}} style={{width: text(20), height: text(20)}} />
                                <View style={styles.banklistItem}>
                                    <Text style={{textAlign: 'left', color: Colors.descColor}}>{item.name}</Text>
                                    <Text style={{textAlign: 'right', flex: 1}}>{item.desc}</Text>
                                </View>
                            </View>
                        );
                    })}
            </View>
        );
    }
    renderContent() {
        const {data} = this.state;
        return (
            <View style={{paddingTop: 2}}>
                {Object.keys(data).length > 0 && this.state.curIndex == 0 ? (
                    <View>
                        <Text style={[styles.title]}>赎回费率</Text>
                        <View style={[styles.feeHeadTitle, Style.flexBetween]}>
                            <Text style={[styles.feeHeadTitleText]}>持有期限</Text>
                            <Text style={[styles.feeHeadTitleText]}>费率</Text>
                        </View>
                        <View style={[styles.feeTableItem, Style.flexBetween, {backgroundColor: '#fff'}]}>
                            <Text style={[styles.feeTableLeftText]}>{'0≤持有天数<7天'}</Text>
                            <Text style={[styles.feeTableRightText]}>{'0.15%'}</Text>
                        </View>
                        <View style={[styles.feeTableItem, Style.flexBetween, {backgroundColor: Colors.bgColor}]}>
                            <Text style={[styles.feeTableLeftText]}>{'7≤持有天数<30天'}</Text>
                            <Text style={[styles.feeTableRightText]}>{'0.75%'}</Text>
                        </View>
                        <View
                            style={[
                                styles.feeTableItem,
                                Style.flexBetween,
                                {backgroundColor: '#fff', borderBottomWidth: Space.borderWidth},
                            ]}>
                            <Text style={[styles.feeTableLeftText]}>{'30≤持有天数<365天'}</Text>
                            <Text style={[styles.feeTableRightText]}>{'0.50%'}</Text>
                        </View>
                        <View style={[styles.feeDescBox]}>
                            <View style={{marginBottom: text(12)}}>
                                <Html
                                    style={styles.feeDesc}
                                    html={
                                        '基金卖出时一般按照先进先出规则, 部分基金卖出按照后进后出规则. 基金卖出手续费与持有期限相关. 实际费用收取请以基金公司确认为准.'
                                    }
                                />
                            </View>
                            <View style={{marginBottom: text(20)}}>
                                <Html
                                    style={styles.feeDesc}
                                    html={
                                        '赎回计算公式：\n赎回总额=赎回数量xT日基金单位净值\n赎回费用=赎回总额x赎回费率\n赎回到账金额=赎回总额-赎回费用'
                                    }
                                />
                            </View>
                            <Html
                                style={{...styles.feeDesc, lineHeight: text(20)}}
                                html={'基金费率等信息以基金公司最新披露的基金信息为准'}
                            />
                        </View>
                        <Text style={[styles.title]}>调仓费率</Text>
                        <View style={[styles.feeDescBox, {paddingTop: 0}]}>
                            <Text style={[styles.feeDesc, {color: Colors.descColor}]}>
                                内容内容捏内容内容，基金卖出时一般按照先进先出规则, 部分基金卖出按照后进后出规则.
                                基金卖出手续费与持有期限相关. 实际费用收取请以基金公司确认为准.
                            </Text>
                        </View>
                    </View>
                ) : null}
                {Object.keys(data).length > 0 && this.state.curIndex == 1 ? (
                    <View>
                        <View style={styles.productInfoWrap}>
                            <Text style={styles.productInfoTitle}>{data.part2.buy.title}</Text>
                            <Image source={require('../../assets/img/line.png')} style={[styles.line]} />
                            <View style={styles.buyComfirmTime}>
                                <View style={{flex: 1, alignItems: 'flex-start'}}>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.buy.items[0].key}</Text>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.buy.items[0].val}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'center', paddingLeft: text(10)}}>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.buy.items[1].key}</Text>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.buy.items[1].val}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.buy.items[2].key}</Text>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.buy.items[2].val}</Text>
                                </View>
                            </View>
                            <Text style={styles.buyNotice}>
                                <Text style={styles.blueCircle}>• </Text>
                                <Text style={[styles.buyNoticeText]}>{data.part2.buy.desc}</Text>
                            </Text>
                            <View style={styles.buyTableWrap}>
                                <View style={styles.buyTableHead}>
                                    <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part2.buy.table.head.name}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part2.buy.table.head.confirm}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part2.buy.table.head.profile_time}
                                        </Text>
                                    </View>
                                </View>
                                {data.part2.buy.table.body.length > 0 &&
                                    data.part2.buy.table.body.map((item, index) => {
                                        return (
                                            <View
                                                style={[
                                                    styles.buyTableBody,
                                                    {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                                ]}
                                                key={index + 'v'}>
                                                <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                                    <Text style={[styles.buyTableItem]}>{item.name}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell]}>
                                                    <Text style={styles.buyTableItem}>{item.confirm}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                                    <Text style={[styles.buyTableItem]}>{item.profile_time}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                        <View style={styles.productInfoWrap}>
                            <Text style={styles.productInfoTitle}>{data.part2.redeem.title}</Text>
                            <Image source={require('../../assets/img/line.png')} style={[styles.line]} />
                            <View style={styles.buyComfirmTime}>
                                <View style={{flex: 1, alignItems: 'flex-start'}}>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.redeem.items[0].key}</Text>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.redeem.items[0].val}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'center', paddingLeft: text(4)}}>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.redeem.items[1].key}</Text>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.redeem.items[1].val}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.redeem.items[2].key}</Text>
                                    <Text style={[styles.buyComfirmTimeText]}>{data.part2.redeem.items[2].val}</Text>
                                </View>
                            </View>
                            <Text style={styles.buyNotice}>
                                <Text style={styles.blueCircle}>• </Text>
                                <Text style={[styles.buyNoticeText]}>{data.part2.buy.desc}</Text>
                            </Text>
                            <View style={[styles.buyTableWrap]}>
                                <View style={styles.buyTableHead}>
                                    <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part2.redeem.table.head.name}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part2.redeem.table.head.confirm}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part2.redeem.table.head.profile_time}
                                        </Text>
                                    </View>
                                </View>
                                {data.part2.redeem.table.body.length > 0 &&
                                    data.part2.redeem.table.body.map((item, index) => {
                                        return (
                                            <View
                                                key={index + 'g'}
                                                style={[
                                                    styles.buyTableBody,
                                                    {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                                ]}>
                                                <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                                    <Text style={[styles.buyTableItem]}>{item.name}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell]}>
                                                    <Text style={styles.buyTableItem}>{item.confirm}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                                    <Text style={styles.buyTableItem}>{item.profile_time}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                        {/* <View style={[styles.productInfoWrap, styles.paddingBottom]}>
              <Text style={styles.productInfoTitle}>{data.part2.adjust.title}</Text>
              <View style={styles.buyNotice}>
                <View style={styles.blueCircle}></View>
                <Text style={{ marginLeft: text(10), color: '#808082', paddingBottom: text(16) }}>{data.part2.adjust.desc}</Text>
              </View>
            </View> */}
                    </View>
                ) : null}
                {Object.keys(data).length > 0 && this.state.curIndex == 2 ? (
                    <View>
                        <View style={styles.productInfoWrap}>
                            <Text style={styles.productInfoTitle}>{data.part3.buy.title}</Text>
                            {data.part3.buy.desc.length > 0 &&
                                data.part3.buy.desc.map((_k, index) => {
                                    return (
                                        <View style={styles.buyNotice} key={index + '111i'}>
                                            <View style={styles.blueCircle} />
                                            <Html
                                                style={{marginLeft: text(10), color: Colors.darkGrayColor}}
                                                html={_k}
                                            />
                                        </View>
                                    );
                                })}
                            <View style={styles.buyTableWrap}>
                                <View style={styles.buyTableHead}>
                                    <View style={[styles.buyTableCell]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part3.buy.table.head.name}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part3.buy.table.head.start_amount}
                                        </Text>
                                    </View>
                                </View>
                                {data.part3.buy.table.body.length > 0 &&
                                    data.part3.buy.table.body.map((item, index) => {
                                        return (
                                            <View
                                                style={[
                                                    styles.buyTableBody,
                                                    {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                                ]}
                                                key={index + 'baaa'}>
                                                <View style={[styles.buyTableCell]}>
                                                    <Text style={styles.buyTableItem}>{item.name}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                                    <Text style={styles.buyTableItem}>{item.start_amount}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                        <View style={styles.productInfoWrap}>
                            <Text style={styles.productInfoTitle}>{data.part3.redeem.title}</Text>
                            {data.part3.redeem.desc.length > 0 &&
                                data.part3.redeem.desc.map((_i, index) => {
                                    return (
                                        <View style={styles.buyNotice} key={index}>
                                            <View style={styles.blueCircle} />
                                            <Text style={{marginLeft: text(10), color: Colors.darkGrayColor}}>
                                                {_i}
                                            </Text>
                                        </View>
                                    );
                                })}
                            <View style={styles.buyTableWrap}>
                                <View style={styles.buyTableHead}>
                                    <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part3.redeem.table.head.name}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part3.redeem.table.head.min_redeem}
                                        </Text>
                                    </View>
                                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                        <Text style={[styles.buyTableItem, styles.fontColor]}>
                                            {data.part3.redeem.table.head.min_hold}
                                        </Text>
                                    </View>
                                </View>
                                {data.part3.redeem.table.body.length > 0 &&
                                    data.part3.redeem.table.body.map((item, index) => {
                                        return (
                                            <View
                                                key={index + 'c'}
                                                style={[
                                                    styles.buyTableBody,
                                                    {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                                ]}>
                                                <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                                    <Text style={[styles.buyTableItem]}>{item.name}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell]}>
                                                    <Text style={styles.buyTableItem}>{item.min_redeem}</Text>
                                                </View>
                                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                                    <Text style={styles.buyTableItem}>{item.min_hold}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                    </View>
                ) : null}
                {Object.keys(data).length > 0 && this.state.curIndex == 3 ? (
                    <View style={{backgroundColor: '#fff', paddingBottom: text(20)}}>
                        {data.part4.length > 0 &&
                            data.part4.map((item, index) => {
                                return (
                                    <View style={styles.banklistWrap} key={index + 'l'}>
                                        <Image
                                            source={{uri: item.bank_icon}}
                                            style={{width: text(28), height: text(28)}}
                                        />
                                        <View style={styles.banklistItem}>
                                            <Text style={{textAlign: 'left', color: Colors.descColor}}>
                                                {item.bank_name}
                                            </Text>
                                            <Text style={{textAlign: 'right', flex: 1, color: Colors.descColor}}>
                                                {item.single_limit}/{item.daily_limit}/{item.month_limit}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                    </View>
                ) : null}
                {Object.keys(data).length > 0 && data.bottom && <BottomDesc data={data.bottom} />}
            </View>
        );
    }
    render() {
        const {data} = this.state;
        return (
            <>
                {Object.keys(data).length > 0 && (
                    <ScrollableTabView
                        style={[styles.container]}
                        renderTabBar={() => <Tab />}
                        initialPage={0}
                        onChangeTab={(obj) => this.ChangeTab(obj.i)}>
                        {data.head.length > 0 &&
                            data.head.map((item, index) => {
                                return (
                                    <ScrollView tabLabel={item.title} key={index + 'head'}>
                                        {this.renderContent()}
                                    </ScrollView>
                                );
                            })}
                    </ScrollableTabView>
                )}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    underLine: {
        backgroundColor: Colors.brandColor,
        height: text(2),
        width: text(16),
        left: text(38),
        marginBottom: text(6),
        borderRadius: text(2),
    },
    TradeRuleHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    TradeRuleText: {
        fontSize: Font.textH2,
        paddingHorizontal: text(10),
        flex: 1,
        color: Colors.brandColor,
        fontWeight: 'bold',
        paddingVertical: text(10),
    },
    line: {
        width: text(347),
        height: text(8),
        marginTop: text(4),
        marginBottom: text(12),
    },
    productInfoWrap: {
        backgroundColor: '#fff',
        paddingHorizontal: text(14),
        marginBottom: text(10),
    },
    productAdjustWrap: {
        paddingBottom: text(20),
        marginTop: text(10),
    },
    productInfoTitle: {
        paddingVertical: text(12),
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    productInfoDesc: {
        color: Colors.darkGrayColor,
        fontSize: text(13),
        lineHeight: text(20),
        paddingVertical: text(14),
    },
    productlist: {
        borderTopWidth: text(1),
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        paddingVertical: text(14),
    },
    productInfoNotice: {
        backgroundColor: Colors.bgColor,
        color: Colors.darkGrayColor,
        paddingVertical: text(12),
        paddingHorizontal: text(10),
        marginTop: text(10),
    },
    blueCircle: {
        fontSize: text(17),
        lineHeight: text(22),
        color: Colors.brandColor,
    },
    buyComfirmTime: {
        paddingBottom: text(16),
        borderColor: Colors.borderColor,
        borderBottomWidth: Space.borderWidth,
        flexDirection: 'row',
    },
    buyComfirmTimeText: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.brandColor,
    },
    buyNotice: {
        paddingVertical: Space.marginVertical,
        textAlign: 'justify',
    },
    buyNoticeText: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
    },
    buyTableCell: {
        flex: 1,
        height: '100%',
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyTableItem: {
        flex: 1,
        textAlign: 'center',
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    buyTableWrap: {
        borderColor: Colors.borderColor,
        borderWidth: Space.borderWidth,
        borderRadius: text(6),
        overflow: 'hidden',
        marginVertical: text(20),
        marginTop: 0,
    },
    buyTableHead: {
        flexDirection: 'row',
        backgroundColor: Colors.bgColor,
        height: text(43),
    },
    buyTableBody: {
        flexDirection: 'row',
        height: text(40),
    },
    paddingBottom: {
        marginBottom: text(40),
    },
    fontColor: {
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    banklistItem: {
        flexDirection: 'row',
        paddingHorizontal: text(14),
        flex: 1,
    },
    banklistWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingVertical: text(4),
        height: text(50),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        borderStyle: 'solid',
        backgroundColor: '#fff',
        paddingLeft: text(20),
    },
    title: {
        paddingHorizontal: Space.marginAlign,
        paddingVertical: text(12),
        backgroundColor: '#fff',
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    feeHeadTitle: {
        height: text(36),
        backgroundColor: Colors.bgColor,
        flexDirection: 'row',
        paddingHorizontal: Space.marginAlign,
    },
    feeHeadTitleText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
    },
    feeTableItem: {
        height: text(45),
        paddingHorizontal: Space.marginAlign,
        flexDirection: 'row',
        borderColor: Colors.borderColor,
        borderStyle: 'solid',
    },
    feeTableLeftText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    feeTableRightText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#FF7D41',
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
    },
    feeDescBox: {
        paddingHorizontal: Space.marginAlign,
        paddingTop: text(12),
        paddingBottom: text(18),
        backgroundColor: '#fff',
    },
    feeDesc: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: Colors.darkGrayColor,
        textAlign: 'justify',
    },
});

export default TradeRules;
