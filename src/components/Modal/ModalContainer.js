import {View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Modal} from 'react-native';
import React, {Component} from 'react';
import Image from 'react-native-fast-image';
import Octicons from 'react-native-vector-icons/Octicons';
import {deviceWidth as width, deviceHeight as height, px as text, px} from '../../utils/appUtil';
import {Colors, Font, Style} from '../../common/commonStyle';
import HTML from '../RenderHtml';
import * as Animatable from 'react-native-animatable';
import {Button} from '../Button';
import FastImage from 'react-native-fast-image';
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
const modalWidth = 280;
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
        this.clickClose = this.props.clickClose; //点击是否关闭弹窗
        this.state = {
            isVisible: this.props.isVisible || false,
            imgHeight: props.imgHeight || 0,
            imgWidth: props.imgWidth || text(280),
            showImgClose: false,
            secondPop: false,
            subPop: '',
        };
    }

    setModalVisiable(state) {
        if (this?.props?.data?.type == 'user_guide' && !state && this.props?.data?.close_tip) {
            //阻止弹窗关闭
            this.showSubPop();
        } else {
            this.setState({
                isVisible: state,
            });
            if (state == false) {
                this.props.destroy();
            }
        }
    }
    showSubPop = () => {
        this.setState({
            subPop: {
                content: this.props?.data?.close_tip,
                cancelCallBack: () => {
                    this.setState({
                        subPop: '',
                    });
                },
                confirmCallBack: () => {
                    //关闭子弹窗
                    this.setState({
                        subPop: '',
                    });
                    //关闭父弹窗
                    this.setState({
                        isVisible: false,
                    });
                    this.props.destroy();
                },
            },
        });
    };
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
    confirm = () => {
        if (this.clickClose !== false) {
            this.setState({
                isVisible: false,
            });
            this.props.destroy();
        }
        setTimeout(() => {
            this.props.confirmCallBack && this.props.confirmCallBack();
        }, 500);
    };
    //设置图片宽高--android、ios有兼容
    //android
    // setSize = (imgItem) => {
    //     let showH;
    //     if (Platform.OS != 'ios') {
    //         Image.getSize(imgItem, (w, h) => {
    //             //多张则循环判断处理
    //             showH = Math.floor(h / (w / this.state.imgWidth));
    //             this.setState({imgHeight: showH});
    //         });
    //     }
    // };
    // //ios
    // setSizeIos = (imgItem) => {
    //     let showH;
    //     if (Platform.OS == 'ios') {
    //         Image.getSize(imgItem, (w, h) => {
    //             //同安卓
    //             showH = Math.floor(h / (w / this.state.imgWidth));
    //             this.setState({imgHeight: showH});
    //         });
    //     }
    // };
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            isVisible: nextProps.isVisible,
        });
    }
    renderImageModal = () => {
        return (
            <Animatable.View animation="bounceIn" style={[{overflow: 'hidden'}, this.props.imageModalStyle]}>
                {/* 图片弹窗 */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setModalVisiable(false)}
                    style={[Style.flexCenter, {position: 'relative', paddingTop: text(31), width: width}]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={(e) => {
                            e.stopPropagation();
                            this.confirm();
                        }}>
                        <Image
                            source={{
                                uri: this.imageUrl,
                            }}
                            style={[
                                styles.modalImage,
                                {width: this.state.imgWidth, height: this.state.imgHeight},
                                this.props.imageStyle,
                            ]}
                            // onLayout={() => !this.state.imgHeight && this.setSizeIos(this.imageUrl)}
                            onLoadEnd={() => this.setState({showImgClose: true})}
                            // onLoadStart={() => !this.state.imgHeight && this.setSize(this.imageUrl)}
                        />
                        {this.props.content ? (
                            <View style={styles.diyContent}>
                                <Text style={styles.imgTitle}>{this.props.content.title}</Text>
                                <Text style={styles.imgText}>{this.props.content.text}</Text>
                                <View style={[Style.flexCenter]}>
                                    <Octicons
                                        name={'triangle-up'}
                                        size={20}
                                        style={{marginVertical: text(-5)}}
                                        color={'#FFE9C7'}
                                    />
                                    <View style={[Style.flexCenter, styles.imgTipBox]}>
                                        <Text style={styles.imgTip}>{this.props.content.tip}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                    {this.state.showImgClose && (
                        <TouchableOpacity
                            style={{position: 'absolute', top: 0, right: text(71)}}
                            activeOpacity={0.8}
                            onPress={() => {
                                global.LogTool('skipCampaignPopupStart', global.currentRoutePageId, this.props.id);
                                this.setModalVisiable(false);
                            }}>
                            <Image source={require('../../assets/img/closeCircle.png')} style={styles.closeCircle} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Animatable.View>
        );
    };
    renderDefaultModal = () => {
        return (
            <View style={[Style.flexCenter, styles.container]}>
                {/* 是否自定义头部 */}
                {this.customTitleView ? (
                    this.customTitleView
                ) : this.title ? (
                    <Text style={styles.title}>{this.title}</Text>
                ) : null}
                {/* 内容 */}
                {this.props.content ? (
                    <View style={[styles.contentCon, {paddingTop: this.title ? px(12) : px(20)}]}>
                        <HTML style={styles.contentText} html={this.props.content} />
                    </View>
                ) : null}
                {this.props.children ? this.props.children() : null}
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
                            <Text style={[styles.centerBtnText, {color: Colors.btnColor}]}>{this.confirmText}</Text>
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
                            }}>
                            {this.confirmText}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    renderGuideModal = () => {
        let {data} = this.props;
        const {secondPop} = this.state;
        data = secondPop ? data.sub_pop : data;
        return (
            <Animatable.View animation="bounceIn">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setModalVisiable(false)}
                    style={[Style.flexCenter, {position: 'relative', paddingTop: text(31)}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.container, {overflow: 'hidden'}]}
                        onPress={(e) => {
                            e.stopPropagation();
                        }}>
                        <FastImage
                            source={require('../../assets/img/modalBg.png')}
                            style={{width: px(modalWidth), height: px(166), position: 'absolute', left: 0, top: 0}}
                        />
                        <View
                            style={{
                                paddingHorizontal: px(20),
                                paddingVertical: px(40),
                            }}>
                            <Text style={styles.guideTitle}>{data.title}</Text>

                            <HTML html={data.content} style={styles.guideContent} />
                            {data.log_id == 'user_guide_pop_a' ? null : (
                                <View style={[styles.wx_info, Style.flexRowCenter]}>
                                    {secondPop ? (
                                        <Text style={[styles.wx_val, {color: Colors.defaultColor}]}>{data?.code}</Text>
                                    ) : (
                                        <>
                                            <Text style={styles.wx_key}>{data?.wx_info?.name}</Text>
                                            <Text style={styles.wx_val}>{data?.wx_info?.val}</Text>
                                        </>
                                    )}
                                </View>
                            )}
                            <Button
                                title={data?.button?.text || '开启通知'}
                                style={{borderRadius: px(22), marginTop: px(22)}}
                                onPress={() => {
                                    if (data.log_id == 'user_guide_pop_a') {
                                        this.confirm();
                                    } else {
                                        if (!this.state.secondPop) {
                                            global.LogTool('copyGoToWechatStart');
                                            this.setState({secondPop: true});
                                        } else {
                                            //sub_POp
                                            this.confirm();
                                        }
                                    }
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{position: 'absolute', top: 0, right: text(24)}}
                        activeOpacity={0.8}
                        onPress={() => {
                            global.LogTool('skipCampaignPopupStart', global.currentRoutePageId, this.props.id);
                            this.setModalVisiable(false);
                        }}>
                        <Image source={require('../../assets/img/closeCircle.png')} style={styles.closeCircle} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Animatable.View>
        );
    };
    render() {
        const {isVisible, subPop} = this.state;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    this.isTouchMaskToClose ? this.setModalVisiable(false) : null;
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
                    {this.type == 'text'
                        ? this.renderDefaultModal()
                        : this.type == 'user_guide'
                        ? this.renderGuideModal()
                        : this.renderImageModal()}
                    {/* //弹窗里的弹窗 */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={subPop ? true : false}
                        onRequestClose={() => {
                            this.setState({subPop: ''});
                        }}>
                        <View style={[Style.flexCenter, styles.modalContainer]}>
                            <View style={[styles.mask, {backgroundColor: 'rgba(0,0,0,0.6)'}]} />
                            <View style={[styles.container, {backgroundColor: '#fff', width: px(300)}]}>
                                <View style={[styles.contentCon, {paddingTop: px(12)}]}>
                                    <HTML style={styles.contentText} html={subPop.content} />
                                </View>
                                <View style={styles.line} />
                                <View style={styles.centerBottomBtns}>
                                    <TouchableOpacity
                                        style={[styles.centerBtn, Style.flexCenter]}
                                        activeOpacity={1}
                                        onPress={subPop.cancelCallBack}>
                                        <Text style={[styles.centerBtnText, {color: Colors.lightGrayColor}]}>取消</Text>
                                    </TouchableOpacity>
                                    <View style={styles.borderRight} />
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[Style.flexCenter, styles.centerBtn]}
                                        onPress={subPop.confirmCallBack}>
                                        <Text style={[styles.centerBtnText, {color: Colors.btnColor}]}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
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
        borderRadius: px(8),
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
        height: text(40),
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
    closeCircle: {
        width: text(20),
        height: text(31),
    },
    diyContent: {
        position: 'absolute',
        width: width,
        paddingTop: text(29),
        alignItems: 'center',
    },
    imgTitle: {
        fontSize: text(20),
        lineHeight: text(28),
        color: Colors.defaultColor,
        fontWeight: '600',
        marginBottom: text(14),
    },
    imgText: {
        fontSize: Font.textH2,
        lineHeight: text(22),
        color: Colors.lightBlackColor,
        textAlign: 'center',
        maxWidth: text(215),
        marginBottom: text(14),
    },
    imgTipBox: {
        width: text(222),
        height: text(32),
        borderRadius: text(16),
        backgroundColor: '#FFE9C7',
    },
    imgTip: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#A17328',
    },
    guideTitle: {
        fontSize: px(18),
        lineHeight: px(25),
        color: '#121D3A',
        fontWeight: '700',
        marginBottom: px(12),
    },
    guideContent: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#545968',
    },
    wx_info: {
        marginTop: px(20),
        height: px(40),
        borderStyle: 'dashed',
        borderRadius: px(4),
        borderColor: '#7EAFFF',
        borderWidth: 0.5,
    },
    wx_key: {
        fontSize: px(14),
        color: '#121D3A',
        lineHeight: px(20),
        marginRight: px(10),
    },
    wx_val: {
        fontSize: px(18),
        color: Colors.btnColor,
        lineHeight: px(20),
        fontFamily: Font.numFontFamily,
    },
});
