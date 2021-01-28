/*
 * @Date: 2021-01-27 21:07:14
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-28 14:15:00
 * @Description:规划结果页
 */

import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Vibration} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, isIphoneX, deviceHeight as height} from '../../utils/appUtil';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import http from '../../services';
// import LottieView from 'lottie-react-native';
export default class planResult extends Component {
    state = {
        data: '',
    };
    componentDidMount() {
        http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/questionnaire/history_plan/20210101').then(
            (data) => {
                this.setState({data: data.result});
            }
        );
    }
    jumpNext = (url) => {
        Vibration.vibrate(10);
        // this.props.navigation.replace('Question');
    };
    render() {
        const {title, plan_list, button} = this.state.data;
        return (
            <>
                <Header
                    ref={(ref) => {
                        this.header = ref;
                    }}
                    renderLeft={
                        <TouchableOpacity style={styles.title_btn}>
                            <Icon name="close" size={px(22)} />
                        </TouchableOpacity>
                    }
                />
                {/* 重新规划 */}
                <View style={styles.container}>
                    <Animatable.Image
                        animation="rotate"
                        style={[styles.robot]}
                        source={require('../../assets/img/robot.png')}
                    />
                    <Animatable.View animation="fadeInUp">
                        {/* <LottieView source={require('../../assets/data/data.json')} autoPlay loop /> */}
                        {plan_list?.length > 0
                            ? plan_list.map((item, index) => {
                                  return (
                                      <View key={index} style={styles.card}>
                                          <Text style={[styles.name, {marginBottom: px(20)}]}>{item.title}</Text>
                                          <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                              <Text style={styles.key}>目标金额</Text>
                                              <Text style={styles.plan_goal_amount}>{item.plan_goal_info.val}</Text>
                                              <Text style={{fontSize: px(12), marginTop: px(2), color: Colors.red}}>
                                                  {item.plan_goal_info.unit}
                                              </Text>
                                          </View>
                                          {item.plan_type_list ? (
                                              <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                                  <Text style={styles.key}>投资方式</Text>
                                                  <View style={[Style.flexRow, {flex: 1}]}>
                                                      {item.plan_type_list.map((type, _index) => {
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
                                          {item.plan_duration_info ? (
                                              <View style={Style.flexRow}>
                                                  <Text style={styles.key}>计划时长</Text>
                                                  <Text style={styles.regular_text}>{item.plan_duration_info.val}</Text>
                                                  <Text style={{marginRight: px(8)}}>
                                                      {item.plan_duration_info.unit}
                                                  </Text>
                                                  <Text style={styles.key}>{item.plan_duration_info.tip}</Text>
                                              </View>
                                          ) : null}
                                      </View>
                                  );
                              })
                            : null}
                    </Animatable.View>
                    <Animatable.View animation="fadeInRight" style={[styles.question_con]}>
                        {button ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    this.jumpNext(button.url);
                                }}
                                style={[styles.ques_btn, Style.flexCenter]}>
                                <Text style={[styles.btn_text]}>{button.text}</Text>
                            </TouchableOpacity>
                        ) : null}
                    </Animatable.View>
                </View>
            </>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        paddingHorizontal: px(20),
        paddingBottom: isIphoneX() ? 84 : 50,
    },
    name: {
        fontSize: px(16),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        marginBottom: px(24),
    },
    robot: {
        width: px(86),
        height: px(86),
        marginLeft: px(-10),
        marginBottom: px(14),
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#fff',
    },
    card: {
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
    regular_text: {
        fontSize: px(16),
        fontFamily: Font.numFontFamily,
        marginRight: 1,
    },
    question_con: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: px(32),
    },
    ques_btn: {
        borderRadius: px(19),
        borderWidth: 1,
        borderColor: Colors.btnColor,
        height: px(34),
        paddingHorizontal: px(24),
        minWidth: px(126),
        marginBottom: px(12),
    },
    btn_text: {
        fontSize: px(13),
        color: Colors.btnColor,
    },
});
