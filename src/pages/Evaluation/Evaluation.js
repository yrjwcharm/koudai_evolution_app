/*
 * @Date: 2021-01-22 13:40:33
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-05-07 16:35:52
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
import {px, isIphoneX, deviceHeight as height, deviceWidth, onlyNumber} from '../../utils/appUtil';
import {Colors, Style, Font} from '../../common/commonStyle';
import * as Animatable from 'react-native-animatable';
import HTML from '../../components/RenderHtml';
import http from '../../services';
import Ruler from '../../components/AnimateRuler';
import QuestionBtn from './components/QuestionBtn';
import Robot from './components/Robot';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
const bottom = isIphoneX() ? 64 : px(30);
//机器人动画
const layoutAnimation = () => {
    LayoutAnimation.configureNext({
        duration: 300,
        create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
        },
    });
};

class Question extends Component {
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
        warnText: '',
        inputBtnCanClick: true,
        //是否答完题目
        finishTest: false,
        //点击tag 回退的步数
        previousCount: 0,
        loading_text: '',
        nextUrl: '', //最后一步跳转
    };
    //动画进行时不能点击下一题
    canNextClick = false;
    //接口耗时
    startTime = '';
    endTime = '';
    fr = this.props.route?.params?.fr; //risk来自个人资料
    plan_id = this.props.route?.params?.plan_id;
    init = () => {
        http.get('/questionnaire/start/20210101', {plan_id: this.plan_id, fr: this.fr}).then((data) => {
            if (data.code === '000000') {
                this.setState({summary_id: data.result.summary_id}, () => {
                    this.getNextQuestion();
                });
            } else {
                Toast.show(data.message);
            }
        });
    };
    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type == 'GO_BACK') {
                e.preventDefault();
                // Prompt the user before leaving the screen
                Modal.show({
                    title: this.fr == 'risk' ? '结束测评' : '结束定制',
                    content: this.fr == 'risk' ? '确定要结束本次风险测评吗？' : '确定要结束本次定制吗？',
                    confirm: true,
                    confirmCallBack: () => {
                        this.props.navigation.dispatch(e.data.action);
                    },
                });
            }
        });
    }
    componentWillUnmount() {
        this.clearValueTimer && clearTimeout(this.clearValueTimer);
    }
    showTip = ({content, title}) => {
        Modal.show({
            title,
            content,
        });
    };
    getNextQuestion = (questionnaire_cate, action, history, startAnimation) => {
        const {summary_id, questions, current} = this.state;
        var params = {
            summary_id,
            questionnaire_cate,
            history,
            action,
            fr: this.fr,
        };
        http.get('/questionnaire/questions/20210101', params).then((data) => {
            if (data.code === '000000') {
                //已经答过的题
                let ques = questions.slice(0, current + 1);
                this.setState(
                    {
                        questions: ques.concat(data.result.questions),
                        questionnaire_cate: data.result.questionnaire_cate,
                    },
                    () => {
                        if (this.fr == 'risk' && this.state.questions[0]?.style == 'age_cursor') {
                            this.setState({
                                value: this.state.questions[0].default_value,
                                inputBtnCanClick: true,
                            });
                        }
                        startAnimation && startAnimation(action);
                    }
                );
            } else {
                Toast.show(data.message);
            }
        });
    };
    handleViewRef = (ref) => (this.quesBtnView = ref);
    handleContentView = (ref) => (this.contentView = ref);
    showNextAnimation = (action) => {
        layoutAnimation();
        const {translateY, opacity, value, questions, previousCount} = this.state;
        this.startTime = new Date().getTime();
        let _current = this.state.current + (previousCount == 0 ? 1 : previousCount);
        if (action == 'submit' && this.fr != 'risk') {
            this.setState({finishTest: true});
            setTimeout(() => {
                if (this.nextUrl) {
                    this.props.jump(this.nextUrl, 'replace');
                    return;
                }
                this.props.navigation.replace('EvaluationResult', {
                    upid: this.upid,
                    summary_id: this.state.summary_id,
                    chart_h5_url: this.chart_h5_url,
                });
            }, 2000);
        } else if (action == 'submit' && this.fr == 'risk') {
            this.setState({finishTest: true});
            setTimeout(() => {
                this.props.navigation.pop(1);
            }, 2000);
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
                    this.quesBtnView?.fadeInRight(500);
                });
                if (questions[this.state.current]?.style == 'age_cursor') {
                    this.setState({value: questions[this.state.current].default_value, inputBtnCanClick: true});
                } else {
                    if (!value && questions[this.state.current]?.type == 3) {
                        this.setState({inputBtnCanClick: false});
                    }
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
        setTimeout(() => {
            if (this.canNextClick || !this.state.inputBtnCanClick) {
                return;
            }
            this.canNextClick = true;
            if (Platform.OS == 'android') {
                Vibration.vibrate(10);
            }
            const {translateY, offsetY, opacity} = this.state;
            this.reportResult(option);
            if (option.action == 'url') {
                this.props.jump(option.url, 'replace');
                return;
            }
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
                if (option.action.includes('next_questionnaire')) {
                    this.getNextQuestion(
                        option.next_questionnaire_cate,
                        option.action,
                        option.history,
                        this.showNextAnimation
                    );
                } else {
                    this.showNextAnimation(option.action);
                }
            });
        }, 250);
    };

    previous = (count = 1) => {
        Keyboard.dismiss();
        setTimeout(() => {
            if (this.canNextClick) {
                return;
            }
            if (Platform.OS == 'android') {
                Vibration.vibrate(10);
            }
            if (this.state.previousCount) {
                this.setState({previousCount: 0});
            }
            this.canNextClick = true;
            const {translateY, offsetY, opacity, questions, inputBtnCanClick} = this.state;
            let _current = this.state.current - count;
            //点击上一题按钮变为可点击
            if (!inputBtnCanClick) {
                this.setState({inputBtnCanClick: true});
            }
            this.setState({current: _current}, () => {
                this.setState({value: questions[this.state.current]?.value || ''});
            });

            layoutAnimation();
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
        }, 250);
    };
    //答案汇总方法
    handelTag = (option, tag, keyName) => {
        const {questions, current, value, previousCount} = this.state;
        let list = [];
        let handleList = [];
        let previousTest = current - 1 <= 0 ? 0 : current - 1;
        //处理点击tag修改数据
        if (questions[current]?.tag == tag && previousTest >= 0 && questions[current]?.tag_end_status == 0) {
            if (previousCount > 0) {
                // 当点击tag返回previousCount页时，点击修改后需要将之后的对应的值全部修改
                for (let i in questions) {
                    if (questions[i].hasOwnProperty(keyName) && questions[i][keyName].length > 0) {
                        handleList = [].concat(questions[i][keyName]);
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
                    list[findIndex] = {key: questions[current].name, val: value === '' ? option.content : value};
                } else {
                    list.push({key: questions[current].name, val: value === '' ? option.content : value});
                }
            } else {
                list.push({key: questions[current].name, val: value === '' ? option.content : value});
            }
        }
        handleList = [];
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
        let _childList = this.handelTag(option, 'child', 'childList');
        newQues = _.assign(ques[current], {
            answer: option.id,
            value,
            profileList: _profileList,
            balanceList: _balanceList,
            complianceList: _complianceList,
            childList: _childList,
        });
        ques[current] = newQues;
        this.setState(
            {
                questions: ques,
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
                    fr: this.fr,
                };
                http.post('/questionnaire/report/20210101', params).then((res) => {
                    if (option.action == 'submit') {
                        this.setState({
                            loading_text: res?.result?.loading_text,
                            upid: res.result.upid,
                            nextUrl: res.result.next_url,
                        });
                        this.upid = res.result.upid;
                        this.nextUrl = res.result.next_url;
                        this.chart_h5_url = res.result.chart_h5_url;
                    }
                });
                this.clearValueTimer = setTimeout(() => {
                    this.setState({value: ''});
                }, 200);
            }
        );
    };

    goBack = () => {
        this.props.navigation.goBack();
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
    checkInput = (value, id) => {
        if (value) {
            if (value < 0 || value > 10000000) {
                this.setState({warnText: '请输入正确金额', warn: true, inputBtnCanClick: false});
                return false;
            } else {
                if (id == 33 && value < 2000) {
                    //投资金额
                    this.setState({
                        warn: true,
                        warnText: `起购金额${this.state.questions[this.state.current].min_value}元`,
                        inputBtnCanClick: false,
                    });
                } else {
                    this.setState({warnText: '请输入正确金额', warn: false, inputBtnCanClick: true});
                }
            }
        } else {
            this.setState({inputBtnCanClick: false});
            return false;
        }
        return true;
    };
    inputValue = (value, type, id) => {
        this.setState({value: type == 'age' ? value : onlyNumber(value)});
        if (type && type == 'age') {
            this.setState({inputBtnCanClick: true});
        } else {
            if (id == 21) {
                this.expendAmount = onlyNumber(value); //记录月支出金额
            }
            this.checkInput(onlyNumber(value), id);
        }
    };
    render() {
        const {
            translateY,
            opacity,
            questions,
            current,
            value,
            warn,
            inputBtnCanClick,
            finishTest,
            loading_text,
            warnText,
        } = this.state;
        const current_ques = questions[current];
        let previousTest = current - 1;
        let tagList = [];
        // tag判断
        if (previousTest >= 0 && current_ques?.tag) {
            if (current_ques.tag == 'profile') {
                tagList = questions[previousTest].profileList;
            }
            if (current_ques.tag == 'balance') {
                tagList = questions[previousTest].balanceList;
            }
            if (current_ques.tag == 'compliance') {
                tagList = questions[previousTest].complianceList;
            }
            if (current_ques.tag == 'child') {
                tagList = questions[previousTest].childList;
            }
        }
        return (
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <Header
                    ref={(ref) => {
                        this.header = ref;
                    }}
                    renderLeft={
                        <TouchableOpacity style={styles.title_btn} onPress={this.goBack}>
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
                                <Text>上一步</Text>
                            </TouchableOpacity>
                        )
                    }
                />
                <Focus init={this.init} />
                {current_ques ? (
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        // scrollEnabled={false}
                        style={{
                            backgroundColor: '#fff',
                        }}>
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={100}
                            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                            style={[styles.container, {height: height - this.header.navBarHeight - bottom}]}>
                            <Robot />
                            <Animated.View
                                style={{
                                    transform: [{translateY}],
                                    opacity,
                                }}
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
                                                    <View style={[Style.flexRow, {marginVertical: px(20)}]}>
                                                        <FastImage
                                                            style={styles.line}
                                                            source={require('../../assets/img/account/line.png')}
                                                        />
                                                        <View
                                                            style={{
                                                                height: px(182),
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
                                                                                : px(20),
                                                                        marginTop: index == 0 ? px(20) : 0,
                                                                        alignItems: 'flex-start',
                                                                    },
                                                                ]}>
                                                                <Image style={styles.icon} source={{uri: item.icon}} />
                                                                <View style={{flex: 1, paddingTop: px(2)}}>
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
                                                    <HTML
                                                        style={styles.invest_text}
                                                        html={
                                                            current_ques?.relation_id != 0
                                                                ? current_ques.remark.replace(
                                                                      '#amount#',
                                                                      this.expendAmount
                                                                  )
                                                                : current_ques.remark
                                                        }
                                                    />
                                                </View>
                                            ) : null}

                                            {current_ques.tip ? (
                                                <TouchableOpacity
                                                    style={[Style.flexRow, {marginTop: px(16)}]}
                                                    onPress={() => {
                                                        this.showTip(current_ques.pop);
                                                    }}>
                                                    <Icon
                                                        name="exclamationcircleo"
                                                        size={px(14)}
                                                        color={Colors.btnColor}
                                                    />
                                                    <Text style={styles.tip_text}>{current_ques.tip}</Text>
                                                </TouchableOpacity>
                                            ) : null}

                                            {current_ques.style == 'age_cursor' ? (
                                                <Ruler
                                                    width={deviceWidth - px(32)}
                                                    height={170}
                                                    onChangeValue={(age) => {
                                                        this.inputValue(age, 'age');
                                                    }}
                                                    step={2}
                                                    defaultValue={value === '' ? current_ques.default_value : value}
                                                    minimum={
                                                        current_ques.id == 31
                                                            ? questions[previousTest].value + 1
                                                            : current_ques.min_value
                                                    }
                                                    maximum={current_ques.max_value}
                                                    unit="岁"
                                                />
                                            ) : null}

                                            {current_ques.style == 'input_money' ? (
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
                                                            onChangeText={(value) => {
                                                                this.inputValue(value, '', current_ques.id);
                                                            }}
                                                        />
                                                    </View>
                                                    {!warn && value >= 10000 ? (
                                                        <Text style={{fontSize: px(16), color: Colors.lightGrayColor}}>
                                                            {value / 10000}万
                                                        </Text>
                                                    ) : null}
                                                    {warn ? <Text style={styles.warn_text}>{warnText}</Text> : null}
                                                </>
                                            ) : null}
                                        </>
                                    ) : (
                                        <Text style={[styles.name, {fontSize: px(20), lineHeight: px(28)}]}>
                                            {loading_text}
                                        </Text>
                                    )}
                                </Animatable.View>
                                {/* 按钮 */}
                                {!finishTest ? (
                                    <Animatable.View
                                        ref={this.handleViewRef}
                                        animation="fadeInRight"
                                        style={[styles.question_con]}>
                                        {current_ques?.options.map((option, index) => {
                                            return (
                                                <QuestionBtn
                                                    key={index}
                                                    button={{text: option.content}}
                                                    onPress={() => {
                                                        this.jumpNext(option);
                                                    }}
                                                    style={[
                                                        current_ques.answer
                                                            ? current_ques.answer == option.id
                                                                ? styles.btn_active
                                                                : styles.btn_unactive
                                                            : null,
                                                        !inputBtnCanClick && styles.disabled,
                                                    ]}
                                                    textStyle={[
                                                        current_ques.answer
                                                            ? current_ques.answer == option.id
                                                                ? styles.btn_active
                                                                : styles.btn_unactive_text
                                                            : null,
                                                        !inputBtnCanClick && styles.disabled,
                                                    ]}
                                                />
                                            );
                                        })}
                                    </Animatable.View>
                                ) : null}
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                ) : (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            flex: 1,
                        }}
                    />
                )}
            </View>
        );
    }
}
export default (props) => {
    const jump = useJump();
    return <Question {...props} jump={jump} />;
};
function Focus({init}) {
    useFocusEffect(
        React.useCallback(() => {
            init();
        }, [init])
    );

    return null;
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

    name: {
        fontSize: px(16),
        color: Colors.defaultColor,
        lineHeight: px(22),
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

    input_container: {
        borderBottomWidth: 0.5,
        borderColor: '#0051CC',
        marginTop: px(24),
        marginBottom: px(8),
    },
    input: {
        height: px(60),
        fontSize: px(40),
        flex: 1,
        marginLeft: px(8),
        padding: 0,
        fontFamily: Font.numMedium,
    },
    input_icon: {
        fontSize: px(28),
        fontFamily: Font.numFontFamily,
    },
    warn_text: {
        fontSize: px(16),
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
        height: px(180),
        width: px(48),
        // resizeMode: 'stretch',
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
        backgroundColor: '#CCDCF5',
        borderColor: '#CCDCF5',
        color: '#fff',
    },
});
