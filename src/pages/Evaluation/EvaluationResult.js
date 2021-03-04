/*
 * @Date: 2021-01-27 21:07:14
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-04 17:09:47
 * @Description:规划结果页
 */

import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Vibration, Image} from 'react-native';
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
        lableAnimation: true,
        data: '', //展示数据
    };
    componentDidMount() {
        http.get('/questionnaire/chart/20210101').then((chart) => {
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
        http.get('/questionnaire/show/20210101', {upid: this.props.route?.params?.upid}).then((res) => {
            this.setState({data: res.result});
        });
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.animationTimer && clearTimeout(this.animationTimer);
    }
    jumpNext = (url, params) => {
        Vibration.vibrate(10);
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
                                    this.jumpNext('Evaluation');
                                }}>
                                <Text>重新评测</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                />

                {/* tag动画 */}
                {this.state.lableAnimation ? (
                    chart && (
                        <Animatable.View style={styles.animation_con}>
                            <View>
                                <Image style={styles.gif} source={require('../../assets/animation/animation.gif')} />
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
                            <View style={{height: 300, paddingHorizontal: px(10), marginVertical: px(16)}}>
                                {chart && <Chart initScript={chartOptions.baseChart(chart)} />}
                            </View>
                            {plan?.length > 0 && (
                                <View style={styles.card}>
                                    <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                        <Text style={styles.key}>目标年化收益率</Text>
                                        <Text style={styles.plan_goal_amount}>10.12%</Text>
                                    </View>
                                </View>
                            )}
                        </Animatable.View>

                        <QuestionBtn
                            style={{marginTop: px(16)}}
                            onPress={() => {
                                this.jumpNext(button?.url?.path, button?.url?.params);
                            }}
                        />
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
        marginHorizontal: px(20),
        padding: px(16),
        shadowColor: '#28479E',
        backgroundColor: '#fff',
        borderRadius: px(8),
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
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
