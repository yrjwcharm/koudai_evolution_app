/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2022-04-25 10:40:32
<<<<<<< HEAD
=======
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-30 14:12:11
>>>>>>> master
 * @Description: 全局弹窗监听路由变化
 */
import React, {forwardRef, useCallback, useImperativeHandle, useEffect, useRef, useState} from 'react';
import {
    Image,
    ImageBackground,
    LayoutAnimation,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as WeChat from 'react-native-wechat-lib';
import {cloneDeep, debounce} from 'lodash';
import {Button} from '../Button';
import {Modal} from '../Modal';
import Toast from '../Toast';
import UnderlineText from '../UnderlineText';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {deleteModal, updateModal} from '../../redux/actions/modalInfo';
import {getCartData} from '~/redux/actions/pk/pkProducts';
import http from '../../services';
import {deviceHeight, deviceWidth, isIphoneX, px} from '../../utils/appUtil';
import saveImg from '../../utils/saveImg';
import Storage from '../../utils/storage';
import {getUserInfo} from '../../redux/actions/userInfo';

const fontWeightMedium = Platform.select({android: '700', ios: '500'});

export const generateOptions = (modal) => {
    return {
        children: (
            <>
                <View style={Style.flexCenter}>
                    <FastImage
                        source={{
                            uri: modal.qr_code,
                        }}
                        style={styles.qrcode}
                    />
                </View>
                <Text style={styles.codeTips}>{'打开微信扫一扫二维码直接添加'}</Text>
                <Button
                    onPress={() => saveImg(modal.business_card, () => Modal.close())}
                    style={styles.saveBtn}
                    title="保存投顾二维码"
                />
            </>
        ),
        header: (
            <ImageBackground
                source={{
                    uri: modal.bg_img,
                }}
                style={styles.modalBg}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => Modal.close()}
                    style={[Style.flexCenter, styles.close]}>
                    <AntDesign color={'#fff'} name="close" size={24} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{modal.title}</Text>
                <View style={[Style.flexRowCenter, {marginTop: px(8), position: 'relative'}]}>
                    <Text style={styles.modalSubtitle}>您的</Text>
                    <UnderlineText
                        style={[
                            styles.modalSubtitle,
                            {
                                fontWeight: fontWeightMedium,
                            },
                        ]}
                        text={`专属投顾${modal.nick_name}，`}
                        underlineWidthDelta={px(-5.5)}
                    />
                    <Text style={styles.modalSubtitle}>邀请您升级为</Text>
                    <UnderlineText
                        style={[
                            styles.modalSubtitle,
                            {
                                fontWeight: fontWeightMedium,
                            },
                        ]}
                        text={'专属一对一投顾服务'}
                    />
                </View>
                <View style={{marginTop: px(34), paddingTop: px(24), paddingLeft: px(36)}}>
                    {modal?.content_list?.map?.((item, index) => {
                        return (
                            <View
                                key={item + index}
                                style={{flexDirection: 'row', marginTop: index !== 0 ? px(12) : 0}}>
                                <FastImage
                                    source={{
                                        uri: item.icon,
                                    }}
                                    style={styles.serviceIcon}
                                />
                                <View>
                                    <Text style={styles.serviceTitle}>{item.content}</Text>
                                    <Text style={styles.serviceDesc}>{item.content_desc}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ImageBackground>
        ),
        isTouchMaskToClose: modal.touch_close,
    };
};

export const Layer = (props) => {
    const {options = {}, text = '用户交流', type = 'slide'} = props;
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Modal.show(options, type)}
            style={[Style.flexRow, styles.layer]}>
            <FastImage source={require('../../assets/personal/layerIcon.png')} style={styles.layerIcon} />
            <Text style={[styles.questionTitle, {color: '#fff'}]}>{text}</Text>
        </TouchableOpacity>
    );
};

export const UserCommunication = forwardRef((props, ref) => {
    const {button = '', communicate_id = '', question = {}, title = ''} = props;
    const {question_id, question_options: options = []} = question;
    const [answered, setAnswered] = useState(false);
    const [rateArr, setRate] = useState([]);
    const [selected, setSelected] = useState();
    const clickRef = useRef(true);

    useImperativeHandle(ref, () => ({
        getStatus: () => answered,
    }));

    const onSelect = (index) => {
        if (!clickRef.current) {
            return false;
        }
        clickRef.current = false;
        setSelected(index);
        const total = options.reduce((prev, curr) => prev + curr.count, 0) + 1;
        let totalPercent = 0;
        const _rateArr = options.map((item, idx) => {
            const percent = Math.round(((idx === index ? item.count + 1 : item.count) / total) * 100);
            totalPercent += idx === index ? 0 : percent;
            return percent + '%';
        });
        _rateArr.splice(index, 1, 100 - totalPercent + '%');
        setRate(_rateArr);
        http.post('/common/communicate/upload/20220426', {
            communicate_id,
            question_id,
            option_id: options[index].option_id,
            is_start: 1,
            is_end: 1,
        }).then((res) => {
            if (res.code === '000000') {
                setAnswered(true);
                LayoutAnimation.linear();
            } else {
                Toast.show(res.message);
            }
            setTimeout(() => {
                clickRef.current = true;
            }, 1000);
        });
    };

    return (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.userComContainer}>
            <Text style={styles.questionTitle}>{title}</Text>
            {options?.map((option, index, arr) => {
                const {option_content: content} = option;
                return (
                    <TouchableOpacity
                        activeOpacity={answered ? 1 : 0.8}
                        key={option + index}
                        onPress={() => !answered && onSelect(index)}
                        style={[
                            styles.questionOption,
                            {
                                marginTop: index === 0 ? px(16) : px(12),
                                borderColor: answered && selected !== index ? '#E2E4EA' : Colors.brandColor,
                            },
                            index === arr.length - 1 ? {marginBottom: 34 + Space.marginVertical} : {},
                        ]}>
                        <View
                            style={[
                                styles.percentPart,
                                {
                                    backgroundColor:
                                        selected === index ? 'rgba(0, 81, 204, 0.1)' : 'rgba(233, 234, 239, 0.5)',
                                    width: answered ? rateArr[index] : 0,
                                },
                            ]}
                        />
                        <View style={[Style.flexBetween, {padding: px(12)}]}>
                            <Text
                                style={[
                                    styles.optionText,
                                    answered && selected === index ? {color: Colors.brandColor} : {},
                                    // answered ? {maxWidth: px(240)} : {},
                                    {flexShrink: 1},
                                ]}>
                                {content}
                                {selected === index ? '（已选）' : ''}
                            </Text>
                            {answered && (
                                <Text style={[styles.optionText, {marginLeft: Space.marginAlign}]}>
                                    {rateArr[index] || ''}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
            {button ? <Button onPress={button.onPress} style={styles.userComButton} title={button.text} /> : null}
        </ScrollView>
    );
});

function useStateChange({homeShowModal, store}) {
    const flagRef = useRef(true);
    const userInfoRef = useRef({});
    const navigationRef = useRef();
    const userCommunicationRef = useRef();

    useEffect(() => {
        let listener;
        const timer = setInterval(() => {
            const navigation = navigationRef.current;
            // console.log(navigation);
            if (navigation) {
                clearInterval(timer);
                listener = store.subscribe(() => {
                    const next = store.getState().userInfo.toJS();
                    const prev = userInfoRef.current;
                    if (!next.hotRefreshData) {
                        if (
                            (!prev.is_login && next.is_login) ||
                            (!prev.has_account && next.has_account) ||
                            (!prev.buy_status && next.buy_status) ||
                            (!prev.buy_status_for_vision && next.buy_status_for_vision) ||
                            (!prev.hide_preference && next.hide_preference)
                        ) {
                            getModalData();
                            global.pkEntry = '2';
                            store.dispatch(getCartData());
                        }
                    }
                    if (prev.is_login) {
                        showGesture(next).then((res) => {
                            if (!res) {
                                homeShowModal.current = true;
                                onStateChange(navigation?.getCurrentRoute?.()?.name, true);
                            } else {
                                homeShowModal.current = false;
                            }
                        });
                    }
                    userInfoRef.current = cloneDeep(next);
                });
                store.dispatch(getUserInfo());
            }
        }, 500);
        return () => {
            listener && listener();
            timer && clearInterval(timer);
        };
    }, []);

    const jump = (url, type = 'navigate') => {
        const navigation = navigationRef.current || {};
        if (url && flagRef.current) {
            flagRef.current = false;
            if (url.type === 2) {
                Linking.canOpenURL(url.path)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show(
                                url.path?.indexOf?.('tel:') > -1
                                    ? `您的设备不支持该功能，请手动拨打 ${url.path?.split?.('tel:')[1]}`
                                    : '您的设备不支持打开网址'
                            );
                        }
                        return Linking.openURL(url.path);
                    })
                    .catch((err) => Toast.show(err));
            } else if (url.type === 3) {
                navigation[type]?.('OpenPdf', {url: url.path});
            } else if (url.type == 5) {
                WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.launchMiniProgram({
                            userName: url?.params?.app_id,
                            miniProgramType: 0,
                            path: url.path,
                        });
                    } else {
                        Toast.show('请安装微信');
                    }
                });
            } else if (url.type === 6) {
                // 弹出弹窗
                const {popup} = url;
                if (popup.type === 'add_wechat_guide') {
                    const options = generateOptions(popup);
                    Modal.show(options, 'slide');
                } else {
                    Modal.show({
                        backButtonClose: false,
                        cancelCallBack: () => {
                            if (popup?.cancel?.action === 'back') {
                                navigation.goBack();
                            } else if (popup?.cancel?.action === 'jump') {
                                jump(popup?.cancel?.url);
                            }
                        },
                        cancelText: popup?.cancel?.text,
                        confirm: popup?.cancel ? true : false,
                        confirmCallBack: () => {
                            if (popup?.confirm?.action === 'back') {
                                navigation.goBack();
                            } else if (popup?.confirm?.action === 'jump') {
                                jump(popup?.confirm?.url);
                            }
                        },
                        confirmText: popup?.confirm?.text,
                        content: popup?.content,
                        isTouchMaskToClose: false,
                        title: popup?.title,
                    });
                }
                if (popup.log_id) {
                    http.post('/common/layer/click/20210801', {log_id: popup.log_id});
                    global.LogTool('campaignPopup', navigation?.getCurrentRoute?.()?.name, popup.log_id);
                }
            } else {
                navigation[type]?.(url.path, url.params || {});
            }
            setTimeout(() => {
                flagRef.current = true;
            }, 500);
        }
    };

    const showGesture = async (userinfo) => {
        const res = await Storage.get('gesturePwd');
        if (res && res[`${userinfo.uid}`]) {
            const result = await Storage.get('openGesturePwd');
            if (result && result[`${userinfo.uid}`]) {
                if (userinfo.is_login && !userinfo.verifyGesture) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    const getModalData = () => {
        const navigation = navigationRef.current;
        http.get('/common/layer/20220427').then(async (res) => {
            if (res.code === '000000') {
                const arr = res.result || [];
                await Promise.all(
                    arr.map((modal) => {
                        return new Promise((resolve) => {
                            if (modal.image) {
                                Image.getSize(modal.image, (w, h) => {
                                    const height = Math.floor(h / (w / (modal.device_width ? deviceWidth : px(280))));
                                    modal.imgHeight = height || px(375);
                                    resolve(true);
                                });
                            } else {
                                resolve(true);
                            }
                        });
                    })
                );
                store.dispatch(updateModal({modals: arr}));
                const modal = arr[0];
                if (modal) {
                    if (modal.page && modal.page.length > 0) {
                        if (modal.page.includes(navigation?.getCurrentRoute?.()?.name)) {
                            showModal(modal);
                        }
                    } else if (navigation?.getCurrentRoute?.()?.name === 'Vision') {
                        showModal(modal);
                    }
                }
            }
        });
    };

    const showModal = useCallback(
        debounce(
            (modal) => {
                const navigation = navigationRef.current;
                if (modal.log_id) {
                    http.post('/common/layer/click/20210801', {log_id: modal.log_id});
                    global.LogTool('campaignPopup', navigation?.getCurrentRoute?.()?.name, modal.log_id);
                }
                let options = {
                    backButtonClose: modal.back_close,
                    confirmCallBack: () => {
                        if (modal.confirm?.act === 'back') {
                            navigation?.goBack?.();
                        } else if (modal.confirm?.act === 'jump') {
                            jump(modal.confirm?.url || '');
                        } else {
                            jump(modal.confirm?.url || modal.url || '');
                        }
                        modal.log_id &&
                            global.LogTool('campaignPopupStart', navigation?.getCurrentRoute?.()?.name, modal.log_id);
                    },
                    id: modal.log_id,
                    isTouchMaskToClose: modal.touch_close,
                    remainingTime: modal.remaining_time || 0,
                };
                let type = 'fade';
                if (modal.type === 'image' || modal.type === 'diy_image') {
                    options = {
                        ...options,
                        type: 'image',
                        imageUrl: modal.image,
                        imgWidth: modal.device_width ? deviceWidth : 0,
                        imgHeight: modal.imgHeight,
                    };
                    if (modal.type === 'diy_image') {
                        options.content = {
                            title: modal.title,
                            text: modal.content,
                            tip: modal.tip,
                        };
                    }
                } else if (modal.type === 'alert_image' || modal.type === 'confirm') {
                    options = {
                        ...options,
                        confirm: modal.cancel ? true : false,
                        confirmText: modal.confirm?.text || '',
                        cancelCallBack: () => {
                            if (modal.cancel?.act === 'back') {
                                navigation?.goBack?.();
                            } else if (modal.cancel?.act === 'jump') {
                                jump(modal.cancel?.url || '');
                            } else {
                                jump(modal.cancel?.url || '');
                            }
                        },
                        cancelText: modal.cancel?.text || '',
                        content: modal.content || '',
                    };
                    if (modal.type === 'alert_image') {
                        options.customTitleView = (
                            <FastImage
                                source={{uri: modal.image}}
                                style={{
                                    width: px(280),
                                    height: modal.imgHeight,
                                    borderTopRightRadius: 8,
                                    borderTopLeftRadius: 8,
                                }}
                            />
                        );
                    }
                    if (modal.type === 'confirm') {
                        options.title = modal.title || '';
                    }
                } else if (modal.type === 'user_guide') {
                    options = {
                        ...options,
                        confirmCallBack: () => {
                            global.LogTool('copyBindAccountStart');
                            Linking.canOpenURL('weixin://').then((supported) => {
                                if (supported) {
                                    Linking.openURL('weixin://');
                                } else {
                                    Toast.show('请先安装微信');
                                }
                            });
                        },
                        data: modal,
                        type: 'user_guide',
                    };
                } else if (modal.type === 'add_wechat_guide') {
                    options = generateOptions(modal);
                    type = 'slide';
                } else if (modal.type === 'encourage') {
                    global.LogTool('GradeWindows');
                    options = {
                        ...options,
                        confirm: true,
                        confirmText: modal.confirm?.text || '',
                        isTouchMaskToClose: false,
                        backButtonClose: false,
                        cancelCallBack: () => {
                            global.LogTool('GradeWindows_No');
                            http.post('/mapi/set/encourage/20220412', {action_scene: 2}).then((res) => {
                                console.log(res);
                            });
                        },
                        confirmCallBack: () => {
                            global.LogTool('GradeWindows_Yes');
                            Linking.canOpenURL(modal.confirm.url.path)
                                .then((res) => {
                                    if (res) {
                                        Linking.openURL(modal.confirm.url.path);
                                    } else if (modal.confirm.url.path !== modal.confirm.url.params.default_url) {
                                        Linking.canOpenURL(modal.confirm.url.params.default_url).then((r) => {
                                            if (r) {
                                                Linking.openURL(modal.confirm.url.params.default_url);
                                            }
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            http.post('/mapi/set/encourage/20220412', {action_scene: 1}).then((res) => {
                                console.log(res);
                            });
                        },
                        cancelText: modal.cancel?.text || '',
                        content: modal.content || '',
                    };
                } else if (modal.type === 'communicate_single' || modal.type === 'communicate_multiple') {
                    type = 'slide';
                    delete options.confirmCallBack;
                    options = {
                        ...options,
                        children: (
                            <UserCommunication
                                button={
                                    modal.confirm
                                        ? {
                                              onPress: () => {
                                                  Modal.close();
                                                  Modal.hideLayer();
                                                  global.layerOptions = {...options, page: modal.page};
                                                  navigation.navigate('UserCommunication', {
                                                      communicate_id: modal.communicate_id,
                                                  });
                                              },
                                              text: modal.confirm.text,
                                          }
                                        : ''
                                }
                                communicate_id={modal.communicate_id}
                                question={modal.communicate_question}
                                ref={userCommunicationRef}
                                title={modal.content}
                            />
                        ),
                        onClose: () => {
                            if (!userCommunicationRef.current?.getStatus()) {
                                Modal.show({
                                    title: '温馨提示',
                                    content: '是否确认退出本次调研？',
                                    confirm: true,
                                    cancelCallBack: () => {
                                        Modal.show(options, type);
                                    },
                                    confirmCallBack: () => {
                                        global.layerOptions = {...options, page: modal.page};
                                        Modal.showLayer(<Layer options={options} type={type} />);
                                    },
                                    isTouchMaskToClose: false,
                                    backButtonClose: false,
                                });
                            } else {
                                global.layerOptions = null;
                                Modal.hideLayer();
                            }
                        },
                        style: {minHeight: px(150), paddingBottom: 0},
                        title: modal.title,
                    };
                }
                if (modal.type) {
                    if (modal.is_hide) {
                        global.layerOptions = {...options, page: modal.page};
                        Modal.showLayer(<Layer options={options} type={type} />);
                    } else {
                        Modal.show(options, type);
                    }
                    store.dispatch(deleteModal({log_id: modal.log_id, type: modal.type}));
                }
            },
            1000,
            {leading: true, trailing: false}
        ),
        []
    );

    const onStateChange = useCallback((currentRouteName, show, _navigationRef) => {
        if (_navigationRef) {
            navigationRef.current = _navigationRef.current;
        }
        const modalInfo = store.getState().modalInfo.toJS();
        const {modals = []} = modalInfo || {};
        const modal = modals[0];
        if (global.layerOptions) {
            const {page} = global.layerOptions;
            if (page?.includes?.(currentRouteName)) {
                Modal.showLayer(<Layer options={global.layerOptions} />);
            } else {
                Modal.hideLayer();
            }
        }
        if (modal) {
            if (modal.page && modal.page.length > 0) {
                if (modal.page.includes(currentRouteName)) {
                    if (currentRouteName === 'Home') {
                        if (show) {
                            showModal(modal);
                        }
                    } else {
                        showModal(modal);
                    }
                }
            } else if (currentRouteName === 'Vision') {
                showModal(modal);
            }
        }
    }, []);

    return onStateChange;
}

const styles = StyleSheet.create({
    modalBg: {
        width: deviceWidth,
        height: px(388),
        position: 'relative',
    },
    close: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px(60),
        height: px(60),
    },
    modalTitle: {
        marginTop: px(44),
        fontSize: px(22),
        lineHeight: px(30),
        color: '#fff',
        fontWeight: fontWeightMedium,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
        fontWeight: Platform.select({android: '100', ios: '300'}),
        textAlign: 'center',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        height: px(9),
        backgroundColor: '#003FAC',
    },
    serviceIcon: {
        marginTop: px(2),
        marginRight: px(10),
        width: px(16),
        height: px(16),
    },
    serviceTitle: {
        fontSize: Font.textH1,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: fontWeightMedium,
    },
    serviceDesc: {
        marginTop: px(2),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    qrcode: {
        marginTop: px(14),
        width: px(94),
        height: px(94),
    },
    codeTips: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
        textAlign: 'center',
    },
    saveBtn: {
        marginTop: px(20),
        marginHorizontal: px(68),
        marginBottom: px(28),
        borderRadius: px(22.5),
    },
    userComContainer: {
        maxHeight: (deviceHeight * 2) / 3 - px(54),
        padding: px(20),
        paddingBottom: px(12),
    },
    questionTitle: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: fontWeightMedium,
    },
    questionOption: {
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        position: 'relative',
        overflow: 'hidden',
    },
    percentPart: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
    },
    optionText: {
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    layer: {
        padding: px(8),
        borderTopLeftRadius: px(100),
        borderBottomLeftRadius: px(100),
        backgroundColor: 'rgba(30, 31, 32, 0.85)',
        position: 'absolute',
        right: 0,
        bottom: px(180),
    },
    layerIcon: {
        marginRight: px(2),
        width: px(18),
        height: px(18),
    },
    userComButton: {
        margin: px(20),
        marginBottom: isIphoneX() ? 34 : Space.marginVertical,
    },
});

export default useStateChange;
