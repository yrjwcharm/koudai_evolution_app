/*
 * @Date: 2021-01-22 13:40:33
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-28 14:06:49
 * @Description:问答投教
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Animated,
    LayoutAnimation,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Image,
    Keyboard,
    Vibration,
} from 'react-native';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {px, isIphoneX, deviceHeight as height} from '../../utils/appUtil';
import {Colors, Style, Font} from '../../common/commonStyle';
import * as Animatable from 'react-native-animatable';
import HTML from '../../components/RenderHtml';
import http from '../../services';
const bottom = isIphoneX() ? 84 : 50;
export class question extends Component {
    state = {
        questions: [],
        questionnaire_cate: '',
        current: 0,
        offsetY: '',
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
        summary_id: '',
        // 输入框的值
        value: '',
        //输入框提示
        warn: false,
        inputBtnCanClick: true,
        //是否答完题目
        finishTest: false,
        //点击tag 回退的步数
        previousCount: 0,
    };
    //动画进行时不能点击下一题
    canNextClick = false;
    //接口耗时
    startTime = '';
    endTime = '';
    componentDidMount() {
        http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/questionnaire/start/20210101').then((data) => {
            this.setState({summary_id: data.result.summary_id}, () => {
                this.getNextQuestion();
            });
        });
    }
    getNextQuestion = (questionnaire_cate, action, history, startAnimation) => {
        const {summary_id, questions, current} = this.state;
        var params = {
            summary_id,
            questionnaire_cate,
            history,
            action,
        };
        http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/questionnaire/questions/20210101', params).then(
            (data) => {
                //已经答过的题
                let ques = questions.slice(0, current + 1);
                this.setState(
                    {
                        questions: ques.concat(data.result.questions),
                        questionnaire_cate: data.result.questionnaire_cate,
                    },
                    () => {
                        startAnimation && startAnimation(action);
                    }
                );
            }
        );
    };
    handleViewRef = (ref) => (this.quesBtnView = ref);
    handleContentView = (ref) => (this.contentView = ref);
    showAnimation = (action) => {
        const {translateY, opacity, value, questions, previousCount} = this.state;
        this.startTime = new Date().getTime();
        let _current = this.state.current + (previousCount == 0 ? 1 : previousCount);
        if (action == 'submit') {
            this.setState({finishTest: true});
        } else {
            this.setState({
                current: _current,
                previousCount: 0,
            });
        }
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                //动画变化过程中将底部按钮变为透明

                this.quesBtnView?.setNativeProps({
                    opacity: 0,
                });

                this.contentView?.fadeInUp(500).then(() => {
                    this.quesBtnView?.setNativeProps({
                        opacity: 1,
                    });
                    this.quesBtnView.fadeInRight(500);
                });
                if (!value && questions[this.state.current].type == 3) {
                    this.setState({inputBtnCanClick: false});
                }
                // 输入框动画结束后聚焦
                setTimeout(() => {
                    this.input?.focus();
                }, 1200);
            });
            this.canNextClick = false;
        }, 500);
    };

    jumpNext = (option) => {
        Keyboard.dismiss();
        if (this.canNextClick || !this.state.inputBtnCanClick) {
            return;
        }
        this.canNextClick = true;
        Vibration.vibrate(10);
        if (option.action == 'url') {
            this.props.navigation.replace('PlanHistory');
            return;
        }
        const {translateY, offsetY, opacity} = this.state;
        this.reportResult(option);
        Animated.sequence([
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: offsetY,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]),
        ]).start(() => {
            LayoutAnimation.configureNext(
                LayoutAnimation.create(500, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity)
            );
            if (option.action.includes('next_questionnaire')) {
                this.getNextQuestion(option.next_questionnaire_cate, option.action, option.history, this.showAnimation);
            } else {
                this.showAnimation(option.action);
            }
        });
    };

    previous = (count = 1) => {
        Keyboard.dismiss();
        if (this.canNextClick) {
            return;
        }
        this.canNextClick = true;
        Vibration.vibrate(10);
        const {translateY, offsetY, opacity, questions, inputBtnCanClick} = this.state;
        let _current = this.state.current - count;
        //点击上一题按钮变为可点击
        if (!inputBtnCanClick) {
            this.setState({inputBtnCanClick: true});
        }
        this.setState({current: _current}, () => {
            this.setState({value: questions[this.state.current].value || ''});
        });
        LayoutAnimation.configureNext(
            LayoutAnimation.create(500, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity)
        );
        Animated.timing(opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
        }).start();
        setTimeout(() => {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(translateY, {
                        toValue: offsetY,
                        duration: 0,
                        useNativeDriver: false,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: false,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: false,
                    }),
                ]),
            ]).start(() => {
                this.canNextClick = false;
            });
        }, 500);
    };
    //答案汇总方法
    handelTag = (option, tag, keyName) => {
        const {questions, current, value, previousCount} = this.state;
        let list = [];
        let previousTest = current - 1;
        let handleList = [];
        //处理点击tag修改数据
        if (questions[current]?.tag == tag && previousTest >= 0) {
            if (previousCount > 0) {
                for (let i in questions) {
                    if (questions[i].hasOwnProperty(keyName) && questions[i][keyName].length > 0) {
                        handleList = handleList.concat(questions[i][keyName]);
                        handleList.map((item) => {
                            if (item.key == questions[current].name) {
                                return (item.val = value || option.content);
                            } else {
                                return [];
                            }
                        });
                    }
                }
            }
            if (questions[previousTest].hasOwnProperty(keyName) && questions[previousTest][keyName].length > 0) {
                list = list.concat(handleList.length > 0 ? handleList : questions[previousTest][keyName]);
                // 判断是否是修改状态
                let findIndex = list.findIndex((item) => {
                    return item.key == questions[current].name;
                });
                if (findIndex > -1) {
                    list[findIndex] = {key: questions[current].name, val: value || option.content};
                } else {
                    list.push({key: questions[current].name, val: value || option.content});
                }
            } else {
                list.push({key: questions[current].name, val: value || option.content});
            }
        }
        return list;
    };
    //提交答案
    reportResult = (option) => {
        this.endTime = new Date().getTime();
        const {summary_id, questions, current, questionnaire_cate, value} = this.state;
        //记录答案
        let ques = questions;
        let newQues = {};
        let _profileList = this.handelTag(option, 'profile', 'profileList');
        let _balanceList = this.handelTag(option, 'balance', 'balanceList');
        let _complianceList = this.handelTag(option, 'compliance', 'complianceList');
        newQues = Object.assign(ques[current], {
            answer: option.id,
            value,
            profileList: _profileList,
            balanceList: _balanceList,
            complianceList: _complianceList,
        });
        ques[current] = newQues;
        this.setState(
            {
                questions: ques,
                value: '',
            },
            () => {
                //问题id
                const currentRes = this.state.questions[current];
                var params = {
                    summary_id,
                    action: option.action,
                    question_id: currentRes.id,
                    option_id: option.id,
                    option_val: currentRes.value,
                    questionnaire_cate,
                    latency: this.endTime - this.startTime,
                };
                http.post('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/questionnaire/report/20210101', params);
            }
        );
    };
    tagClick = (count) => {
        this.setState({
            previousCount: count,
        });
        this.previous(count);
    };
    onLayout = (event) => {
        this.setState({offsetY: -event.nativeEvent.layout.y});
    };
    checkInput = (value) => {
        if (value) {
            if (value < 0 || value >= 1000000) {
                this.setState({warn: true, inputBtnCanClick: false});
                return false;
            } else {
                this.setState({warn: false, inputBtnCanClick: true});
            }
        } else {
            this.setState({inputBtnCanClick: false});
            return false;
        }
        return true;
    };
    inputValue = (value) => {
        this.setState({value});
        this.checkInput(value);
    };
    render() {
        const {translateY, opacity, questions, current, value, warn, inputBtnCanClick, finishTest} = this.state;
        const current_ques = questions[current];
        let previousTest = current - 1;
        let tagList = [];
        // tag判断
        if (previousTest >= 0 && current_ques.tag) {
            if (current_ques.tag == 'profile') {
                tagList = questions[previousTest].profileList;
            }
            if (current_ques.tag == 'balance') {
                tagList = questions[previousTest].balanceList;
            }
            if (current_ques.tag == 'compliance') {
                tagList = questions[previousTest].complianceList;
            }
        }
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
                    renderRight={
                        !finishTest &&
                        current != 0 && (
                            <TouchableOpacity
                                style={[styles.title_btn, {width: px(60)}]}
                                onPress={() => {
                                    this.previous(1);
                                }}>
                                <Text>上一题</Text>
                            </TouchableOpacity>
                        )
                    }
                />
                {current_ques ? (
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={false}
                        style={{
                            backgroundColor: '#fff',
                        }}>
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={100}
                            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                            style={[styles.container, {height: height - this.header.navBarHeight - bottom}]}>
                            <Animatable.Image
                                animation="rotate"
                                style={[styles.robot]}
                                source={require('../../assets/img/robot.png')}
                            />
                            <Animated.View
                                style={{transform: [{translateY}], opacity, marginTop: px(24)}}
                                onLayout={this.onLayout}>
                                <Animatable.View ref={this.handleContentView} animation="fadeInUp">
                                    {!finishTest ? (
                                        <>
                                            {current_ques.risk_title ? (
                                                <Text style={styles.risk_title}>{current_ques.risk_title}</Text>
                                            ) : null}
                                            {current_ques.title ? (
                                                <Text style={[styles.name, {marginBottom: px(32)}]}>
                                                    {current_ques.title}
                                                </Text>
                                            ) : null}
                                            {tagList.length > 0
                                                ? tagList.map((item, index) => {
                                                      return (
                                                          <View
                                                              key={index}
                                                              style={[Style.flexRow, {marginBottom: px(8)}]}>
                                                              <Text style={[styles.name, {marginRight: px(16)}]}>
                                                                  {item.key}
                                                              </Text>
                                                              <View style={[{flex: 1}, Style.flexRow]}>
                                                                  <TouchableOpacity
                                                                      onPress={() => {
                                                                          this.tagClick(tagList?.length - index);
                                                                      }}
                                                                      style={styles.input_label}>
                                                                      <Text style={styles.input_label_text}>
                                                                          {item.val}
                                                                      </Text>
                                                                  </TouchableOpacity>
                                                              </View>
                                                          </View>
                                                      );
                                                  })
                                                : null}
                                            {current_ques.name ? (
                                                <Text
                                                    style={[
                                                        styles.name,
                                                        {
                                                            fontSize: current_ques?.style.includes('invest_')
                                                                ? px(21)
                                                                : px(16),
                                                        },
                                                    ]}>
                                                    {current_ques.name}
                                                </Text>
                                            ) : null}
                                            {/* 有目的的钱 */}
                                            {current_ques?.style == 'invest_goal' ? (
                                                current_ques?.desc.length > 0 ? (
                                                    <View style={[Style.flexRow, {marginVertical: px(24)}]}>
                                                        <Image
                                                            style={styles.line}
                                                            source={require('../../assets/img/account/line.png')}
                                                        />
                                                        <View
                                                            style={{
                                                                height: px(220),
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                            }}>
                                                            {current_ques?.desc.map((_line, index) => {
                                                                return (
                                                                    <View key={index}>
                                                                        <Text
                                                                            style={[
                                                                                styles.name,
                                                                                {marginBottom: px(6)},
                                                                            ]}>
                                                                            {_line.title}
                                                                        </Text>
                                                                        <View style={Style.flexRow}>
                                                                            {_line.labels
                                                                                ? _line.labels.map((label, id) => {
                                                                                      return (
                                                                                          <View
                                                                                              key={id}
                                                                                              style={styles.lable}>
                                                                                              <Text
                                                                                                  style={{
                                                                                                      color:
                                                                                                          Colors.darkGrayColor,
                                                                                                      fontSize: px(11),
                                                                                                  }}>
                                                                                                  {label}
                                                                                              </Text>
                                                                                          </View>
                                                                                      );
                                                                                  })
                                                                                : null}
                                                                        </View>
                                                                    </View>
                                                                );
                                                            })}
                                                        </View>
                                                    </View>
                                                ) : null
                                            ) : current_ques?.desc.length > 0 ? (
                                                // 无目的的钱
                                                <>
                                                    {current_ques.desc.map((item, index) => {
                                                        return (
                                                            <View
                                                                key={index}
                                                                style={[
                                                                    Style.flexRow,
                                                                    {
                                                                        marginBottom:
                                                                            index == current_ques.desc.length - 1
                                                                                ? 0
                                                                                : px(24),
                                                                        marginTop: px(24),
                                                                        alignItems: 'flex-start',
                                                                    },
                                                                ]}>
                                                                <Image style={styles.icon} source={{uri: item.icon}} />
                                                                <View style={{flex: 1, paddingTop: px(6)}}>
                                                                    <View style={{marginBottom: px(8)}}>
                                                                        <HTML style={styles.name} html={item.title} />
                                                                    </View>
                                                                    <HTML
                                                                        style={styles.invest_text}
                                                                        html={item.content}
                                                                    />
                                                                </View>
                                                            </View>
                                                        );
                                                    })}
                                                </>
                                            ) : null}

                                            {current_ques.content ? (
                                                <HTML style={styles.text} html={current_ques.content} />
                                            ) : null}
                                            {current_ques.remark ? (
                                                <View style={{marginTop: px(12)}}>
                                                    <HTML style={styles.invest_text} html={current_ques.remark} />
                                                </View>
                                            ) : null}

                                            {current_ques.tip ? (
                                                <TouchableOpacity style={[Style.flexRow, {marginTop: px(16)}]}>
                                                    <Icon
                                                        name="exclamationcircleo"
                                                        size={px(14)}
                                                        color={Colors.btnColor}
                                                    />
                                                    <Text style={styles.tip_text}>{current_ques.tip}</Text>
                                                </TouchableOpacity>
                                            ) : null}
                                            {/* {current_ques.type == 3 && current_ques.style == 'age_cursor' ? (
                                        <View style={{backgroundColor: 'red'}}>
                                            <Text>输入</Text>
                                            <Text>输入年龄</Text>
                                        </View>
                                    ) : null} */}
                                            {/* <>
                                        <View style={[styles.input_container, Style.flexRow]}>
                                            <Text style={styles.input_icon}>¥</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                keyboardType={'number-pad'}
                                                onChangeText={this.inputValue}
                                            />
                                        </View>
                                        {warn ? <Text style={styles.warn_text}>请输入正确金额</Text> : null}
                                    </> */}
                                            {current_ques.type == 3 ? (
                                                <>
                                                    <View style={[styles.input_container, Style.flexRow]}>
                                                        <Text style={styles.input_icon}>¥</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={value}
                                                            ref={(ref) => {
                                                                this.input = ref;
                                                            }}
                                                            keyboardType={'number-pad'}
                                                            onChangeText={this.inputValue}
                                                        />
                                                    </View>
                                                    {warn ? <Text style={styles.warn_text}>请输入正确金额</Text> : null}
                                                </>
                                            ) : null}
                                        </>
                                    ) : (
                                        <Text style={[styles.name, {fontSize: px(20), lineHeight: px(28)}]}>
                                            根据您的相关信息，正在为您定制养老计划…
                                        </Text>
                                    )}
                                </Animatable.View>
                                {/* 按钮 */}
                                {!finishTest ? (
                                    <Animatable.View
                                        ref={this.handleViewRef}
                                        animation="fadeInRight"
                                        style={[styles.question_con, {opacity: 1}]}>
                                        {current_ques?.options.map((option, index) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    key={index}
                                                    onPress={() => {
                                                        this.jumpNext(option);
                                                    }}
                                                    style={[
                                                        styles.ques_btn,
                                                        Style.flexCenter,
                                                        current_ques.answer
                                                            ? current_ques.answer == option.id
                                                                ? styles.btn_active
                                                                : styles.btn_unactive
                                                            : null,
                                                        !inputBtnCanClick && styles.disabled,
                                                    ]}>
                                                    <Text
                                                        style={[
                                                            styles.btn_text,
                                                            current_ques.answer
                                                                ? current_ques.answer == option.id
                                                                    ? styles.btn_active
                                                                    : styles.btn_unactive_text
                                                                : null,
                                                            !inputBtnCanClick && styles.disabled,
                                                        ]}>
                                                        {option.content}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </Animatable.View>
                                ) : null}
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                ) : null}
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
    },
    title_btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    robot: {
        width: px(86),
        height: px(86),
        marginLeft: px(-10),
        marginBottom: px(-10),
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: px(16),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    risk_title: {
        fontSize: px(14),
        marginBottom: px(32),
        color: Colors.darkGrayColor,
    },
    text: {
        lineHeight: px(22),
        fontSize: px(16),
        color: Colors.defaultColor,
    },
    tip_text: {
        fontSize: px(12),
        color: Colors.btnColor,
        marginLeft: px(4),
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
    btn_active: {
        backgroundColor: Colors.btnColor,
        color: '#fff',
    },
    btn_unactive: {
        backgroundColor: '#fff',
        borderColor: Colors.borderColor,
    },
    btn_unactive_text: {
        color: Colors.darkGrayColor,
    },
    btn_text: {
        fontSize: px(13),
        color: Colors.btnColor,
    },
    input_container: {
        borderBottomWidth: 0.5,
        borderColor: '#0051CC',
        marginTop: px(24),
    },
    input: {
        height: px(60),
        fontSize: px(40),
        flex: 1,
        marginLeft: px(8),
        padding: 0,
        fontFamily: Font.numFontFamily,
    },
    input_icon: {
        fontSize: px(28),
        fontFamily: Font.numFontFamily,
    },
    warn_text: {
        fontSize: px(16),
        marginTop: px(8),
        color: Colors.red,
    },
    invest_text: {
        fontSize: px(14),
        color: Colors.darkGrayColor,
        lineHeight: px(20),
    },
    lable: {
        paddingVertical: px(4),
        paddingHorizontal: px(12),
        backgroundColor: '#F5F6F8',
        marginRight: px(6),
        borderRadius: 4,
    },
    line: {
        height: px(230),
        width: px(46),
        resizeMode: 'stretch',
        marginRight: px(10),
    },
    icon: {
        width: px(40),
        height: px(32),
        resizeMode: 'contain',
        marginRight: px(18),
    },
    input_label: {
        backgroundColor: '#F5F6F8',
        borderRadius: 20,
        paddingVertical: px(6),
        paddingHorizontal: px(16),
    },
    input_label_text: {
        color: Colors.defaultColor,
        fontSize: px(13),
        lineHeight: px(18),
    },
    disabled: {
        backgroundColor: '#ddd',
        borderColor: '#ddd',
        color: '#fff',
    },
});

export default question;
