/*
 * @Date: 2021-02-02 16:20:54
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-02 16:31:32
 * @Description: 我的魔分
 */
import React, {Component} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Button} from '../../components/Button';
import Modal from '../../components/Modal/Modal';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';

export default class MyScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            refreshing: false,
        };
    }

    UNSAFE_componentWillMount() {
        const {navigation} = this.props;
        navigation.setOptions({
            title: navigation.getParam('title', '我的星分'),
            headerRight: () => (
                <TouchableOpacity
                    style={styles.detailCon}
                    onPress={() => {
                        navigation.navigate('ScoreDetail');
                    }}>
                    <Text style={styles.detail}>{navigation.getParam('topButton', '星分明细')}</Text>
                </TouchableOpacity>
            ),
        });
        this._navListener = navigation.addListener('focus', () => {
            this.init();
        });
    }
    componentWillUnmount() {
        this._navListener.remove();
    }

    init = (refresh) => {
        refresh === 'refresh' && this.setState({refreshing: true});
        http.get('/common/kapi/promotion/point/20210121', null, false).then((res) => {
            if (res.code === '000000') {
                this.props.navigation.setParams({title: res.result.title});
                this.props.navigation.setParams({
                    topButton: (res.result.top_button && res.result.top_button.text) || '星分明细',
                });
                this.setState({
                    data: res.result,
                    refreshing: false,
                });
            }
        });
    };

    onWithdraw = () => {
        http.post('/common/kapi/promotion/point_withdraw/20210121', {}, false).then((res) => {
            if (res.code === '000000') {
                Modal.show({
                    title: res.result.title,
                    content: res.result.content,
                    contentStyle: {color: '#595B5F', textAlign: 'justify', fontSize: text(14), lineHeight: text(22)},
                });
            }
        });
    };

    render() {
        const {data, refreshing} = this.state;
        const {more, points_info} = data;
        return Object.keys(data).length > 0 ? (
            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => this.init('refresh')} />}>
                <Image source={require('../../assets/img/score-bg.png')} style={{width: '100%', height: text(167)}} />
                <View style={styles.scoreNumContainer}>
                    <View style={styles.scoreNum}>
                        <Text style={styles.scoreNumText}>{points_info.point}</Text>
                        <TouchableOpacity
                            onPress={() =>
                                Modal.show({
                                    title: '星分兑换申购费规则',
                                    content:
                                        '1.兑换比例：100星分=1元人民币\n2.兑换流程：\n\t①在基金购买过程中所产生的申购费，其对应可兑换的金额会自动显示在兑换栏中\n\t②点击“兑换”，即可直接兑换成功\n3.返还方式：兑换金额直接返还到星领投绑定银行卡中，若两张及以上，则返还到主卡中，预计48小时内到账',
                                    contentStyle: {
                                        color: '#595B5F',
                                        textAlign: 'justify',
                                        fontSize: text(14),
                                        lineHeight: text(22),
                                    },
                                })
                            }>
                            <SimpleLineIcons name={'question'} size={16} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.tipText}>{points_info.desc}</Text>
                </View>
                <View style={styles.exchangeContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.availableScore}>
                            ￥<Text style={styles.num}>{points_info.amount}</Text>
                        </Text>
                        <Text style={[styles.smTips, {marginLeft: text(6), transform: [{translateY: text(4)}]}]}>
                            {'可提现'}
                        </Text>
                    </View>
                    <Button onPress={this.onWithdraw} title={'兑换'} style={styles.btn} />
                </View>
                <Text style={[styles.moreTitle, {marginLeft: text(14)}]}>{more.title}</Text>
                {more.list?.map((item, index) => {
                    return (
                        <View key={index} style={[styles.exchangeContainer, {marginVertical: text(12)}]}>
                            <View>
                                <Text style={[styles.largeTitle, {marginBottom: text(10)}]}>{item.title}</Text>
                                <Text style={[styles.getScore, {lineHeight: text(21)}]}>
                                    <Text>{'星分'}</Text>
                                    <Text style={{fontSize: text(15), fontFamily: Font.numFontFamily}}>{'+3,000'}</Text>
                                </Text>
                            </View>
                            <Button title={item.button.title} style={styles.btn} />
                        </View>
                    );
                })}
            </ScrollView>
        ) : null;
    }
}

const styles = StyleSheet.create({
    detailCon: {
        height: text(40),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: text(14),
    },
    detail: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scoreNumContainer: {
        marginTop: text(-152),
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreNum: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: text(8),
    },
    scoreNumText: {
        fontSize: text(30),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        marginRight: text(8),
    },
    tipText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#fff',
    },
    exchangeContainer: {
        marginVertical: text(20),
        marginHorizontal: text(14),
        paddingLeft: Space.padding,
        paddingRight: text(20),
        borderRadius: text(6),
        height: text(90),
        backgroundColor: 'rgba(255, 255, 255, 1)',
        shadowColor: 'rgba(59, 98, 157, 0.07)',
        shadowOffset: {width: 0, height: text(6)},
        shadowOpacity: 1,
        shadowRadius: text(15),
        elevation: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availableScore: {
        fontSize: text(20),
        color: '#101A30',
        fontWeight: 'bold',
    },
    num: {
        fontSize: text(30),
        fontFamily: Font.numFontFamily,
    },
    smTips: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
    btn: {
        width: text(76),
        height: text(38),
        borderRadius: text(10),
        fontSize: Font.textH2,
        fontWeight: '500',
    },
    moreTitle: {
        fontSize: text(18),
        lineHeight: text(25),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    largeTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    getScore: {
        fontSize: Font.textH2,
        color: '#EA514E',
        fontWeight: '600',
    },
});
