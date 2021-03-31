/*
 * @Date: 2021-01-27 10:40:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-30 17:51:32
 * @Description:规划历史
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import http from '../../services';
import QuestionBtn from './components/QuestionBtn';
import Robot from './components/Robot';
import {BoxShadow} from 'react-native-shadow';
const shadow = {
    color: '#E3E6EE',
    border: 8,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 2,

    width: deviceWidth - px(40),
    height: px(156),
    style: {
        marginBottom: px(16),
    },
};
export class planningHistory extends Component {
    state = {
        data: '',
    };
    componentDidMount() {
        http.get('/questionnaire/history_plan/20210101').then((data) => {
            this.setState({data: data.result});
        });
    }
    jumpNext = (url, param) => {
        this.props.navigation.replace(url, param);
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
                        <TouchableOpacity style={styles.title_btn} onPress={this.props.navigation.goBack}>
                            <Icon name="close" size={px(22)} />
                        </TouchableOpacity>
                    }
                />
                {/* 重新规划 */}
                <View style={styles.container}>
                    <Robot />
                    {title ? <Text style={styles.name}>{title}</Text> : null}
                    <Animatable.View animation="fadeInUp">
                        {plan_list && plan_list.length > 0
                            ? plan_list.map((item, index) => {
                                  return item.type == 1 ? (
                                      <BoxShadow key={index} setting={{...shadow, height: px(116)}}>
                                          <TouchableOpacity
                                              activeOpacity={0.8}
                                              style={[styles.card, {height: px(116)}]}
                                              onPress={() => {
                                                  this.jumpNext(item?.url?.path, item?.url?.params);
                                              }}>
                                              <Text style={[styles.name, {marginBottom: px(10)}]}>{item.title}</Text>
                                              <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                                  <Text style={styles.key}>目标年化收益率</Text>
                                                  <Text style={styles.plan_goal_amount}>
                                                      {item.plan_yield_info.val}
                                                      {item.plan_yield_info.unit}
                                                  </Text>
                                              </View>
                                              <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                                                  <View style={Style.flexRow}>
                                                      <Text style={styles.key}>投资金额</Text>
                                                      <Text style={styles.regular_text}>
                                                          {item.plan_amount_info.val}
                                                      </Text>
                                                      <Text style={{marginRight: px(8)}}>
                                                          {item.plan_amount_info.unit}
                                                      </Text>
                                                  </View>
                                                  <View style={Style.flexRow}>
                                                      <Text style={styles.key}>建议投资时长</Text>
                                                      <Text style={styles.regular_text}>
                                                          {item.plan_duration_info.val}
                                                      </Text>
                                                      <Text style={{marginRight: px(8)}}>
                                                          {item.plan_duration_info.unit}
                                                      </Text>
                                                  </View>
                                              </View>
                                          </TouchableOpacity>
                                      </BoxShadow>
                                  ) : (
                                      <BoxShadow key={index} setting={shadow}>
                                          <TouchableOpacity
                                              activeOpacity={0.8}
                                              style={styles.card}
                                              onPress={() => {
                                                  this.jumpNext(item?.url?.path, item?.url?.params);
                                              }}>
                                              <Text style={[styles.name, {marginBottom: px(10)}]}>{item.title}</Text>
                                              <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                                  <Text style={styles.key}>目标金额</Text>
                                                  <Text style={styles.plan_goal_amount}>{item.plan_goal_info.val}</Text>
                                                  <Text style={{fontSize: px(12), marginTop: px(2), color: Colors.red}}>
                                                      {item.plan_goal_info.unit}
                                                  </Text>
                                              </View>
                                              {item.plan_type_list ? (
                                                  <View style={[Style.flexRow, {marginBottom: px(12)}]}>
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
                                                                      <Text style={styles.regular_text}>
                                                                          {type.val}
                                                                      </Text>
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
                                                      <Text style={styles.regular_text}>
                                                          {item.plan_duration_info.val}
                                                      </Text>
                                                      <Text style={{marginRight: px(8)}}>
                                                          {item.plan_duration_info.unit}
                                                      </Text>
                                                      <Text style={styles.key}>{item.plan_duration_info.tip}</Text>
                                                  </View>
                                              ) : null}
                                          </TouchableOpacity>
                                      </BoxShadow>
                                  );
                              })
                            : null}
                    </Animatable.View>
                    {button && (
                        <QuestionBtn
                            onPress={() => {
                                this.jumpNext(button?.url?.path, button?.url?.params);
                            }}
                            style={{marginTop: px(16), marginRight: 0}}
                            button={button}
                        />
                    )}
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
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        marginBottom: px(24),
    },

    card: {
        padding: px(16),
        backgroundColor: '#fff',
        borderRadius: px(8),
        height: px(156),
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
});

export default planningHistory;
