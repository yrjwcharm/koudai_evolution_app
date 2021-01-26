/*
 * @Date: 2021-01-22 13:40:33
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-26 16:14:58
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
    };
    //动画进行时不能点击下一题
    canNextClick = false;
    //上一题
    canPreviousClick = false;
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
                        startAnimation && startAnimation();
                    }
                );
            }
        );
    };
    handleViewRef = (ref) => (this.quesBtnView = ref);
    handleContentView = (ref) => (this.contentView = ref);
    showAnimation = () => {
        const {translateY, opacity} = this.state;
        this.startTime = new Date().getTime();
        this.setState({
            current: ++this.state.current,
        });
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
                this.quesBtnView &&
                    this.quesBtnView.setNativeProps({
                        opacity: 0,
                    });
                this.contentView &&
                    this.contentView.fadeInUp(500).then(() => {
                        this.quesBtnView &&
                            this.quesBtnView.setNativeProps({
                                opacity: 1,
                            });
                        this.quesBtnView.fadeInRight(500);
                    });
            });
            this.canNextClick = false;
        }, 500);
    };

    jumpNext = (option) => {
        if (this.canNextClick) {
            return;
        }
        this.canNextClick = true;
        const {current, questions, translateY, offsetY, opacity, value} = this.state;
        if (questions[current].tag == 'balance') {
            if (!this.checkInput(value)) {
                return;
            }
        }
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
                this.showAnimation();
            }
        });
    };
    previous = () => {
        if (this.canPreviousClick) {
            return;
        }
        this.canPreviousClick = true;
        const {translateY, offsetY, opacity, questions} = this.state;
        this.setState({current: --this.state.current}, () => {
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
                this.canPreviousClick = false;
            });
        }, 500);
    };
    //提交答案
    reportResult = (option) => {
        this.endTime = new Date().getTime();
        const {summary_id, questions, current, questionnaire_cate, value} = this.state;
        //记录答案
        let ques = questions;
        var newQues = Object.assign(ques[current], {answer: option.id, value});
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
        const {translateY, opacity, questions, current, value, warn, inputBtnCanClick} = this.state;
        const current_ques = questions[current];
        // console.log(current_ques.style && current_ques.style.includes('invest_'));
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
                        <TouchableOpacity style={[styles.title_btn, {width: px(60)}]} onPress={this.previous}>
                            <Text>上一题</Text>
                        </TouchableOpacity>
                    }
                />
                {current_ques ? (
                    <ScrollView
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
                                    {current_ques.title ? (
                                        <Text style={[styles.name, {marginBottom: px(32)}]}>{current_ques.title}</Text>
                                    ) : null}
                                    {current_ques.name ? (
                                        <Text
                                            style={[
                                                styles.name,
                                                {
                                                    fontSize:
                                                        current_ques.style && current_ques.style.includes('invest_')
                                                            ? px(21)
                                                            : px(16),
                                                },
                                            ]}>
                                            {current_ques.name}
                                        </Text>
                                    ) : null}
                                    {current_ques.remark ? (
                                        <HTML
                                            style={[
                                                styles.text,
                                                current_ques.style &&
                                                    current_ques.style.includes('invest_') &&
                                                    styles.invest_text,
                                            ]}
                                            html={current_ques.remark}
                                        />
                                    ) : null}
                                    {current_ques.tip ? (
                                        <TouchableOpacity style={[Style.flexRow, {marginTop: px(24)}]}>
                                            <Icon name="exclamationcircleo" size={px(14)} color={Colors.btnColor} />
                                            <Text style={styles.tip_text}>{current_ques.tip}</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                    {current_ques.type == 3 && current_ques.style == 'age_cursor' ? (
                                        <View style={{backgroundColor: 'red'}}>
                                            <Text>输入</Text>
                                            <Text>输入年龄</Text>
                                        </View>
                                    ) : null}

                                    {current_ques.type == 3 ? (
                                        <>
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
                                        </>
                                    ) : null}
                                </Animatable.View>
                                {/* 按钮 */}
                                <Animatable.View
                                    ref={this.handleViewRef}
                                    animation="fadeInRight"
                                    style={[styles.question_con, {opacity: 1}]}>
                                    {current_ques.options &&
                                        current_ques.options.map((option, index) => {
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
                                                        current_ques.answer &&
                                                            current_ques.answer == option.id &&
                                                            styles.btn_active,
                                                        !inputBtnCanClick && styles.disabled,
                                                    ]}>
                                                    <Text
                                                        style={[
                                                            styles.btn_text,
                                                            current_ques.answer &&
                                                                current_ques.answer == option.id &&
                                                                styles.btn_active,
                                                        ]}>
                                                        {option.content}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                </Animatable.View>
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
        marginBottom: px(12),
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
    btn_text: {
        fontSize: px(13),
        color: Colors.btnColor,
    },
    input_container: {
        borderBottomWidth: 0.5,
        borderColor: '#0051CC',
    },
    input: {
        height: px(60),
        fontSize: px(40),
        flex: 1,
        marginLeft: px(8),
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
    },
});

export default question;
