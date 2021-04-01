/*
 * @Date: 2021-01-27 21:07:14
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-01 20:08:29
 * @Description:规划结果页
 */

import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import http from '../../services';
import LinearGradient from 'react-native-linear-gradient';
import {Chart, chartOptions} from '../../components/Chart';
import QuestionBtn from './components/QuestionBtn';
import Robot from './components/Robot';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import {BoxShadow} from 'react-native-shadow';
const shadow = {
    color: '#E3E6EE',
    border: 8,
    radius: 8,
    opacity: 0.2,
    x: 2,
    y: 2,
    width: deviceWidth - px(40),
    height: px(156),
    style: {
        marginHorizontal: px(20),
    },
};
const animation = [
    {
        type: 'top',
        left: deviceWidth / 2 - 12,
        top: px(100),
    },
    {
        type: 'left',
        left: px(40),
        top: px(150),
    },
    {
        type: 'left',
        left: px(50),
        top: px(280),
    },
    {
        type: 'bottom',
        left: deviceWidth / 2 - 12,
        top: px(360),
    },
    {
        type: 'right',
        right: px(40),
        top: px(150),
    },
    {
        type: 'right',
        right: px(40),
        top: px(280),
    },
];

export default class planResult extends Component {
    state = {
        chart: '', //图表数据
        lableAnimation: false,
        data: '', //展示数据
    };
    upid = this.props.route?.params?.upid;
    summary_id = this.props.route?.params?.summary_id;
    componentDidMount() {
        http.get('/questionnaire/chart/20210101', {
            upid: this.upid || 88,
            summary_id: this.summary_id || 3982,
        }).then((chart) => {
            this.setState({chart: chart.result});
            this.animationTimer = setTimeout(() => {
                this.setState({lableAnimation: false});
            }, 3500);
            this.timer = setTimeout(() => {
                for (let i in chart.result.labels) {
                    if (animation[i].type == 'top') {
                        this[i]?.fadeInDown(500).then(() => {
                            setTimeout(() => {
                                this[i]?.fadeOutDown(500);
                            }, 1000);
                        });
                    } else if (animation[i].type == 'left') {
                        this[i]?.fadeInLeft(500).then(() => {
                            setTimeout(() => {
                                this[i]?.fadeOutRight(500);
                            }, 1000);
                        });
                    } else if (animation[i].type == 'right') {
                        this[i]?.fadeInRight(500).then(() => {
                            setTimeout(() => {
                                this[i]?.fadeOutLeft(500);
                            }, 1000);
                        });
                    } else {
                        this[i]?.fadeInUp(500).then(() => {
                            setTimeout(() => {
                                this[i]?.fadeOutUp(500);
                            }, 1000);
                        });
                    }
                }
            }, 500);
        });
        http.get('/questionnaire/show/20210101', {
            upid: this.upid || 88,
            summary_id: this.summary_id || 3982,
        }).then((res) => {
            this.setState({data: res.result});
        });
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.animationTimer && clearTimeout(this.animationTimer);
    }
    jumpNext = (url, params) => {
        this.props.navigation.replace(url, params);
    };
    render() {
        const {labels, chart} = this.state.chart;
        const {plan, button} = this.state.data;
        return (
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <Header
                    ref={(ref) => {
                        this.header = ref;
                    }}
                    renderLeft={
                        <TouchableOpacity style={styles.title_btn} onPress={this.props.navigation.goBack}>
                            <Icon name="close" size={px(22)} />
                        </TouchableOpacity>
                    }
                    renderRight={
                        !this.state.lableAnimation ? (
                            <TouchableOpacity
                                style={[styles.title_btn, {width: px(60)}]}
                                onPress={() => {
                                    this.props.navigation.replace(chart?.top_button?.path, chart?.top_button?.params);
                                }}>
                                <Text>重新定制</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                />

                {/* tag动画 */}
                {this.state.lableAnimation ? (
                    chart && (
                        <Animatable.View style={styles.animation_con}>
                            <View>
                                <FastImage
                                    style={styles.gif}
                                    source={require('../../assets/animation/animation.gif')}
                                />
                                {labels
                                    ? labels.map((item, index) => (
                                          <Animatable.View
                                              key={index}
                                              ref={(ref) => {
                                                  this[index] = ref;
                                              }}
                                              style={[
                                                  Style.flexRow,
                                                  {
                                                      position: 'absolute',
                                                      top: animation[index].top,
                                                      left: animation[index].left || null,
                                                      right: animation[index].right || null,
                                                      opacity: 0,
                                                  },
                                              ]}>
                                              <LinearGradient
                                                  start={{x: 0, y: 0.25}}
                                                  end={{x: 0.8, y: 0.8}}
                                                  colors={['#0051CC', '#0089E8']}
                                                  style={styles.lable}>
                                                  <Text style={styles.lable_text}>{item}</Text>
                                              </LinearGradient>
                                          </Animatable.View>
                                      ))
                                    : null}
                            </View>
                        </Animatable.View>
                    )
                ) : (
                    //图表动画
                    <View style={styles.container}>
                        <Robot style={{marginLeft: px(8)}} />
                        <Animatable.View animation="fadeInUp">
                            <View style={[Style.flexBetween, {alignItems: 'flex-end', paddingHorizontal: px(20)}]}>
                                <View>
                                    <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                                        <Text style={[styles.sm_radio, {fontSize: px(36), marginRight: px(9)}]}>
                                            43.58%
                                        </Text>
                                        <View style={[Style.flexRow, {marginBottom: px(5)}]}>
                                            <Icon name="arrowup" color={Colors.red} />
                                            <Text style={[styles.sm_radio, {color: Colors.red}]}>14.35%</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.desc_text}>近5年累计收益率</Text>
                                </View>
                                <View>
                                    <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                                        <Text style={[styles.sm_radio, {fontSize: px(24), marginRight: px(9)}]}>
                                            43.58%
                                        </Text>
                                        <View style={[Style.flexRow]}>
                                            <Icon name="arrowup" color={Colors.red} />
                                            <Text style={[styles.sm_radio, {color: Colors.red}]}>14.35%</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.desc_text}>近5年累计收益率</Text>
                                </View>
                            </View>
                            <View style={{height: px(220), paddingHorizontal: px(20), marginVertical: px(16)}}>
                                {chart && <Chart initScript={chartOptions.baseChart(chart, deviceWidth, px(220))} />}
                            </View>
                            {plan && plan?.type == 1 ? (
                                <BoxShadow setting={{...shadow, height: px(116)}}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={[styles.card, {height: px(116)}]}
                                        onPress={() => {
                                            this.jumpNext(plan?.url?.path, plan?.url?.params);
                                        }}>
                                        <Text style={[styles.name, {marginBottom: px(10)}]}>{plan.title}</Text>
                                        <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                            <Text style={styles.key}>目标年化收益率</Text>
                                            <Text style={styles.plan_goal_amount}>
                                                {plan.plan_yield_info.val}
                                                {plan.plan_yield_info.unit}
                                            </Text>
                                        </View>
                                        <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                                            <View style={Style.flexRow}>
                                                <Text style={styles.key}>投资金额</Text>
                                                <Text style={styles.regular_text}>{plan.plan_amount_info.val}</Text>
                                                <Text style={{marginRight: px(8)}}>{plan.plan_amount_info.unit}</Text>
                                            </View>
                                            <View style={Style.flexRow}>
                                                <Text style={styles.key}>建议投资时长</Text>
                                                <Text style={styles.regular_text}>{plan.plan_duration_info.val}</Text>
                                                <Text style={{marginRight: px(8)}}>{plan.plan_duration_info.unit}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </BoxShadow>
                            ) : plan ? (
                                <BoxShadow setting={shadow}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.card}
                                        onPress={() => {
                                            this.jumpNext(plan?.url?.path, plan?.url?.params);
                                        }}>
                                        <Text style={[styles.name, {marginBottom: px(10)}]}>{plan.title}</Text>
                                        <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                            <Text style={styles.key}>目标金额</Text>
                                            <Text style={styles.plan_goal_amount}>{plan.plan_goal_info.val}</Text>
                                            <Text style={{fontSize: px(12), marginTop: px(2), color: Colors.red}}>
                                                {plan.plan_goal_info.unit}
                                            </Text>
                                        </View>
                                        {plan.plan_type_list ? (
                                            <View style={[Style.flexRow, {marginBottom: px(12)}]}>
                                                <Text style={styles.key}>投资方式</Text>
                                                <View style={[Style.flexRow, {flex: 1}]}>
                                                    {plan.plan_type_list.map((type, _index) => {
                                                        return (
                                                            <View
                                                                style={[Style.flexRow, {marginRight: px(10)}]}
                                                                key={_index}>
                                                                <Text style={[styles.key, {marginRight: px(4)}]}>
                                                                    {type.text}
                                                                </Text>
                                                                <Text style={styles.regular_text}>{type.val}</Text>
                                                                <Text>{type.unit}</Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        ) : null}
                                        {plan.plan_duration_info ? (
                                            <View style={Style.flexRow}>
                                                <Text style={styles.key}>计划时长</Text>
                                                <Text style={styles.regular_text}>{plan.plan_duration_info.val}</Text>
                                                <Text style={{marginRight: px(8)}}>{plan.plan_duration_info.unit}</Text>
                                                <Text style={styles.key}>{plan.plan_duration_info.tip}</Text>
                                            </View>
                                        ) : null}
                                    </TouchableOpacity>
                                </BoxShadow>
                            ) : null}
                        </Animatable.View>

                        {button && (
                            <QuestionBtn
                                style={{marginTop: px(16)}}
                                onPress={_.debounce(
                                    () => {
                                        this.jumpNext(button?.url?.path, button?.url?.params);
                                    },
                                    500,
                                    {leading: true}
                                )}
                            />
                        )}
                    </View>
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: isIphoneX() ? 84 : 50,
    },
    name: {
        fontSize: px(16),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        marginBottom: px(24),
    },

    card: {
        padding: px(16),
        backgroundColor: '#fff',
        borderRadius: px(8),
        width: deviceWidth - px(40),
        marginBottom: px(16),
    },
    plan_goal_amount: {
        fontSize: px(18),
        fontFamily: Font.numFontFamily,
        color: Colors.red,
        marginRight: 2,
    },
    key: {
        fontSize: px(12),
        color: Colors.darkGrayColor,
        marginRight: px(12),
    },

    lable_text: {
        color: '#fff',
        fontSize: px(12),
    },
    animation_con: {
        backgroundColor: '#fff',
        width: deviceWidth,
        flex: 1,
        justifyContent: 'center',
    },
    gif: {
        width: deviceWidth,
        height: px(500),
    },
    lable: {
        borderRadius: px(25),
        paddingVertical: px(3),
        paddingHorizontal: px(7),
    },
    desc_text: {
        fontSize: px(14),
        color: Colors.darkGrayColor,
        marginTop: px(4),
    },
    sm_radio: {
        fontSize: px(14),
        fontFamily: Font.numFontFamily,
    },
});
