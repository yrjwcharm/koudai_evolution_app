import {View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Modal, Image} from 'react-native';
import React, {Component} from 'react';
import {deviceWidth as width, deviceHeight as height, px as text, px} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import HTML from '../RenderHtml';
import * as Animatable from 'react-native-animatable';
/**
 * 通用弹出框，包括居中弹出框和底部弹出框
 * @param comfirm 可选 只要有该属性，底部就会两个按钮
 * @param {Boolean} isVisible 控制是否可见
 * @param {?Boolean} isTouchMaskToClose 可选，控制是否点击阴影关闭弹窗，默认开启
 * @param {?String} title 可选，标题
 * @param {?String} type 弹窗类型 text文本/image图片
 * @param {?String} imageUrl 图片url
 * @param {?String} confirmText 可选，居中框的确认按钮描述，默认为`确 认`
 * @param {?JSX} customTitleView 可选，自定义title样式（包括居中和底部弹框），若该属性有值，会覆盖默认样式，当需要自定义按钮点击功能时可以用这个，
 * @param {?JSX} customBottomView 可选，自定义底部样式（包括居中和底部弹框），若该属性有值，会覆盖默认样式，当需要自定义按钮点击功能时可以用这个，
 * @param {Function} confirmCallBack //确认的回掉函数
 * @param {Function} cancelCallBack //取消的回掉函数
 */
const modalWidth = 260;
export default class MyModal extends Component {
    constructor(props) {
        super(props);
        this.title = props.title;
        this.content = props.content ? props.content : false;
        this.type = props.type ? props.type : 'text';
        this.confirmText = props.confirmText || (props.hasOwnProperty('confirm') ? '确认' : '知道了');
        this.cancelText = props.cancelText || '取消';
        this.customTitleView = props.customTitleView ? props.customTitleView : false;
        this.customBottomView = props.customBottomView ? props.customBottomView : false;
        this.isTouchMaskToClose = JSON.stringify(props.isTouchMaskToClose) ? this.props.isTouchMaskToClose : true;
        this.imageUrl = props.imageUrl;
        this.state = {
            isVisible: this.props.isVisible || false,
        };
    }

    setModalVisiable(state) {
        this.setState({
            isVisible: state,
        });
        if (state == false) {
            this.props.destroy();
        }
    }
    componentDidMount() {
        if (this.props.isVisible == false) {
            this.props.destroy();
        }
    }
    cancel() {
        this.setModalVisiable(false);
        setTimeout(() => {
            this.props.cancelCallBack && this.props.cancelCallBack();
        }, 100);
    }
    confirm() {
        this.setModalVisiable(false);
        setTimeout(() => {
            this.props.confirmCallBack && this.props.confirmCallBack();
        }, 500);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            isVisible: nextProps.isVisible,
        });
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={() => {
                    this.setModalVisiable(false);
                }}>
                <View style={[Style.flexCenter, styles.modalContainer]}>
                    {/* 弹窗遮罩 */}
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.isTouchMaskToClose ? this.setModalVisiable(false) : null;
                        }}>
                        <View style={styles.mask} />
                    </TouchableWithoutFeedback>
                    {/* 判断弹窗类型 */}
                    {this.type == 'text' ? (
                        <View style={[Style.flexCenter, styles.container]}>
                            {/* 是否自定义头部 */}
                            {this.customTitleView ? (
                                this.customTitleView
                            ) : this.title ? (
                                <Text style={styles.title}>{this.title}</Text>
                            ) : null}
                            {/* 内容 */}
                            <View style={[styles.contentCon, {paddingTop: this.title ? px(12) : px(20)}]}>
                                <HTML style={styles.contentText} html={this.props.content} />
                            </View>
                            {/* 分割线 */}
                            <View style={styles.line} />
                            {/* 底部按钮 */}
                            {this.customBottomView ? (
                                this.customBottomView
                            ) : this.props.confirm ? (
                                <View style={styles.centerBottomBtns}>
                                    <TouchableOpacity
                                        style={[styles.centerBtn, Style.flexCenter]}
                                        activeOpacity={1}
                                        onPress={this.cancel.bind(this)}>
                                        <Text style={[styles.centerBtnText, {color: Colors.lightGrayColor}]}>
                                            {this.cancelText}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.borderRight} />
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[Style.flexCenter, styles.centerBtn]}
                                        onPress={this.confirm.bind(this)}>
                                        <Text style={[styles.centerBtnText, {color: Colors.btnColor}]}>
                                            {this.confirmText}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[Style.flexCenter, styles.confirmBtn]}
                                    onPress={this.confirm.bind(this)}>
                                    <Text
                                        style={{
                                            color: Colors.btnColor,
                                            fontSize: text(16),
                                            fontWeight: 'bold',
                                        }}>
                                        {this.confirmText}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <Animatable.View animation="bounceIn">
                            {/* 图片弹窗 */}
                            <Image
                                source={{
                                    uri: this.imageUrl,
                                }}
                                style={[styles.modalImage]}
                            />
                        </Animatable.View>
                    )}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    centerBottomBtns: {
        flexDirection: 'row',
    },
    modalContainer: {
        flex: 1,
        width: width,
        height: height,
    },
    modalImage: {
        width: text(300),
        height: text(400),
        resizeMode: 'contain',
    },
    mask: {
        width: width,
        height: height,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    line: {
        height: 0.5,
        width: text(modalWidth),
        backgroundColor: '#DCDEE3',
    },
    container: {
        width: text(modalWidth),
        backgroundColor: '#FFF',
        borderRadius: 8,
        // paddingHorizontal: 15,
    },
    title: {
        textAlign: 'center',
        fontFamily: 'PingFangSC-Semibold',
        fontSize: text(16),
        fontWeight: '500',
        color: Colors.defaultColor,
        paddingTop: text(18),
    },
    confirmBtn: {
        width: '100%',
        height: text(48),
    },
    centerBtn: {
        flex: 1,
        width: '100%',
        height: text(40),
    },
    centerBtnText: {
        fontSize: text(14),
    },
    contentCon: {
        paddingBottom: px(20),
        paddingHorizontal: text(20),
    },
    contentText: {fontSize: text(14), color: Colors.lightBlackColor, lineHeight: text(20)},
    borderRight: {backgroundColor: '#DCDEE3', width: 0.5, height: text(40)},
});
