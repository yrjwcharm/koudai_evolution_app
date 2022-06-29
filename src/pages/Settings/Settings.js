/*
 * @Date: 2021-02-03 11:26:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-08 17:20:25
 * @Description: 个人设置
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking, AppState} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Http from '../../services/index.js';
import {useJump} from '../../components/hooks';
import {Modal, ShareModal} from '../../components/Modal';
import Storage from '../../utils/storage';
import Toast from '../../components/Toast';
import {InputModal} from '../../components/Modal';
import {useDispatch, useSelector} from 'react-redux';
import {resetVision} from '../../redux/actions/visionData';
import {getUserInfo, updateUserInfo} from '../../redux/actions/userInfo';
import {updateAccount} from '../../redux/actions/accountInfo.js';
import {deleteModal} from '../../redux/actions/modalInfo';
import {cleanProduct} from '../../redux/actions/pk/pkProducts';
import {pinningProduct} from '../../redux/actions/pk/pkPinning';
import http from '../../services/index.js';
const Settings = ({navigation}) => {
    const userInfo = useSelector((store) => store.userInfo);
    const dispatch = useDispatch();
    const jump = useJump();
    const [data, setData] = useState([]);
    const [shareContent, setShareContent] = useState({});
    const shareModal = useRef(null);
    const inputModal = useRef(null);
    const inputRef = useRef(null);
    const [modalProps, setModalProps] = useState({});
    const [inviteCode, setInviteCode] = useState('');
    const inviteCodeRef = useRef('');
    const [showCircle, setShowCircle] = useState(false);
    const onPress = useCallback(
        (item) => {
            // if (item.type === 'about') {
            //     jump({
            //         type: 1,
            //         path: 'WebView',
            //         params: {
            //             link: 'http://192.168.88.111:3000/portfolioBabyDetail/15',
            //             title: '百万宝贝计划',
            //         },
            //     });
            //     return false;
            // }
            global.LogTool('click', item.type);
            if (item.type === 'bind_invitor') {
                setInviteCode('');
                setModalProps({
                    confirmClick,
                    placeholder: '请输入邀请码',
                    title: '填写邀请码',
                });
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 200);
            } else if (item.type === 'share_mofang') {
                shareModal.current.show();
            } else if (item.type === 'logout') {
                Modal.show({
                    title: '退出登录',
                    content: '退出后，日收益和投资产品列表将不再展示，是否确认退出？',
                    confirm: true,
                    confirmCallBack: () => {
                        Http.post('/auth/user/logout/20210101').then(async (res) => {
                            if (res.code === '000000') {
                                await Storage.delete('loginStatus');
                                await Storage.delete('AD');
                                dispatch(resetVision());
                                dispatch(getUserInfo());
                                dispatch(cleanProduct());
                                dispatch(pinningProduct());
                                dispatch(
                                    updateUserInfo({
                                        phone: '',
                                        selectBank: '',
                                        bank_no: '',
                                        second: 60,
                                        name: '',
                                        id_no: '',
                                    })
                                );
                                dispatch(
                                    updateAccount({
                                        name: '',
                                        id_no: '',
                                    })
                                );
                                dispatch(deleteModal());
                                global.layerOptions = null;
                                Modal.hideLayer();
                                navigation.replace('Login');
                            }
                        });
                    },
                });
            } else if (item.type === 'encourage') {
                global.LogTool('Grade');
                Linking.canOpenURL(item.url.path)
                    .then((res) => {
                        if (res) {
                            Linking.openURL(item.url.path);
                        } else if (item.url.path !== item.url.params.default_url) {
                            Linking.canOpenURL(item.url.params.default_url).then((r) => {
                                if (r) {
                                    Linking.openURL(item.url.params.default_url);
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                http.post('/mapi/set/encourage/20220412').then((res) => {
                    console.log(res);
                });
            } else {
                if (item.type == 'about') {
                    setShowCircle((prev) => {
                        if (prev) {
                            Storage.save('version' + userInfo.toJS().latest_version + 'setting_page', true);
                            return false;
                        }
                    });
                }
                jump(item.url);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigation, jump, dispatch, confirmClick]
    );
    const confirmClick = useCallback(() => {
        if (!inviteCodeRef.current) {
            inputRef?.current?.blur();
            inputModal.current.toastShow('邀请码不能为空', 2000, {
                onHidden: () => {
                    setTimeout(() => {
                        inputRef?.current?.focus();
                    }, 100);
                },
            });
            return false;
        }
        inputModal.current.hide();
        Http.post('/polaris/bind_invite_code/20210101', {
            invited_code: inviteCodeRef.current,
        }).then((res) => {
            if (res.code === '000000') {
                global.LogTool('bind', 'success');
                dispatch(getUserInfo());
                Modal.show({
                    confirm: true,
                    confirmCallBack: () => navigation.navigate('Find'),
                    content: `已经成功绑定${res.result.nick_name}，请到发现页面查看`,
                    title: '绑定成功',
                });
                Http.get('/mapi/config/20210101').then((resp) => {
                    if (resp.code === '000000') {
                        setData(resp.result);
                    }
                });
            } else {
                Toast.show(res.message);
            }
        });
    }, [dispatch, navigation]);

    useEffect(() => {
        Storage.get('version' + userInfo.toJS().latest_version + 'setting_page').then((res) => {
            if (!res && global.ver < userInfo.toJS().latest_version) {
                setShowCircle(true);
            }
        });
        const handlerData = () => {
            if (AppState.currentState === 'active') {
                Http.get('/mapi/config/20210101').then((res) => {
                    if (res.code === '000000') {
                        setData(res.result);
                    }
                });
            }
        };
        handlerData();
        Http.get('/share/common/info/20210101', {scene: 'share_lcmf'}).then((res) => {
            if (res.code === '000000') {
                setShareContent(res.result);
            }
        });
        AppState.addEventListener('change', handlerData);
        return () => {
            AppState.removeEventListener('change', handlerData);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (Object.keys(modalProps).length > 0) {
            inputModal.current.show();
        }
    }, [modalProps]);
    useEffect(() => {
        inviteCodeRef.current = inviteCode;
    }, [inviteCode]);
    return (
        <View style={styles.container}>
            <InputModal {...modalProps} ref={inputModal}>
                <View style={{backgroundColor: '#fff'}}>
                    <View style={[Style.flexRow, styles.inputContainer]}>
                        <TextInput
                            autoCapitalize={'none'}
                            autoCompleteType={'off'}
                            autoCorrect={false}
                            clearButtonMode={'while-editing'}
                            contextMenuHidden
                            enablesReturnKeyAutomatically
                            keyboardType={'default'}
                            onChangeText={(value) => setInviteCode(value.replace(/\W/g, ''))}
                            onSubmitEditing={confirmClick}
                            ref={inputRef}
                            style={styles.input}
                            value={inviteCode}
                        />
                        {`${inviteCode}`.length === 0 && (
                            <Text style={styles.placeholder}>{modalProps?.placeholder}</Text>
                        )}
                    </View>
                </View>
            </InputModal>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index, arr) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.partBox,
                                index === arr.length - 1
                                    ? {marginBottom: isIphoneX() ? 34 + Space.marginVertical : Space.marginVertical}
                                    : {},
                            ]}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.text} style={[i === 0 ? {} : styles.borderTop]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[Style.flexBetween, {height: text(56)}]}
                                            onPress={() => onPress(item)}>
                                            <Text style={styles.title}>{item.text}</Text>
                                            <View style={Style.flexRow}>
                                                {item.desc ? (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            {
                                                                marginRight: item.url ? text(8) : 0,
                                                                color: Colors.lightGrayColor,
                                                            },
                                                        ]}>
                                                        {item.desc}
                                                    </Text>
                                                ) : null}

                                                {(item.type == 'about' && showCircle) || item.show_circle ? (
                                                    <View style={styles.circle} />
                                                ) : null}
                                                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
            <ShareModal
                ctrl={'share_lcmf'}
                ref={shareModal}
                title={'分享理财魔方'}
                shareContent={shareContent?.share_info || {}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    partBox: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
    inputContainer: {
        marginVertical: text(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    input: {
        flex: 1,
        fontSize: text(35),
        lineHeight: text(42),
        color: Colors.defaultColor,
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: 0,
        top: text(3.5),
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.placeholderColor,
    },
    circle: {
        height: text(6),
        width: text(6),
        borderRadius: text(6),
        backgroundColor: Colors.red,
        marginRight: text(8),
    },
});

export default Settings;
