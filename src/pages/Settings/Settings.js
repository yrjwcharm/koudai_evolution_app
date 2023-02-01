/*
 * @Date: 2021-02-03 11:26:45
 * @Description: 个人设置
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking, AppState} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {isIphoneX, px} from '~/utils/appUtil.js';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {Modal, ShareModal} from '~/components/Modal';
import Storage from '~/utils/storage';
import Toast from '~/components/Toast';
import {InputModal} from '~/components/Modal';
import {useDispatch, useSelector} from 'react-redux';
import {resetVision} from '~/redux/actions/visionData';
import {getUserInfo, updateUserInfo} from '~/redux/actions/userInfo';
import {updateAccount} from '~/redux/actions/accountInfo';
import {deleteModal} from '~/redux/actions/modalInfo';
import {cleanProduct} from '~/redux/actions/pk/pkProducts';
import {pinningProduct} from '~/redux/actions/pk/pkPinning';
import http from '~/services';
import {resetAudio} from '../Community/components/audioService/SetUpService.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
    const onPress = (item) => {
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
                    http.post('/auth/user/logout/20210101').then(async (res) => {
                        if (res.code === '000000') {
                            await Storage.delete('loginStatus');
                            await Storage.delete('AD');
                            dispatch(resetVision());
                            dispatch(getUserInfo());
                            global.pkEntry = '2';
                            dispatch(cleanProduct());
                            dispatch(pinningProduct(null));
                            dispatch(
                                updateUserInfo({
                                    phone: '',
                                    selectBank: '',
                                    bank_no: '',
                                    second: 60,
                                    name: '',
                                    id_no: '',
                                    show_audit_center: '',
                                    show_manage_center: '',
                                })
                            );
                            dispatch(
                                updateAccount({
                                    name: '',
                                    id_no: '',
                                })
                            );
                            resetAudio();
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
            if (item.type === 'about') {
                setShowCircle((prev) => {
                    if (prev) {
                        Storage.save('version' + userInfo.toJS().latest_version + 'setting_page', true);
                        return false;
                    }
                });
            }
            jump(item.url);
        }
    };
    const confirmClick = () => {
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
        http.post('/polaris/bind_invite_code/20210101', {
            invited_code: inviteCodeRef.current,
        }).then((res) => {
            if (res.code === '000000') {
                global.LogTool('bind', 'success');
                dispatch(getUserInfo());
                Modal.show({
                    confirm: true,
                    confirmCallBack: () => (res.result.url ? jump(res.result.url) : navigation.navigate('Find')),
                    content: res.result.nick_name,
                    title: '绑定成功',
                });
                http.get('/mapi/config/20210101').then((resp) => {
                    if (resp.code === '000000') {
                        setData(resp.result);
                    }
                });
            } else {
                Toast.show(res.message);
            }
        });
    };

    useEffect(() => {
        Storage.get('version' + userInfo.toJS().latest_version + 'setting_page').then((res) => {
            if (!res && global.ver < userInfo.toJS().latest_version) {
                setShowCircle(true);
            }
        });
        const handlerData = () => {
            if (AppState.currentState === 'active') {
                http.get('/mapi/config/20210101').then((res) => {
                    if (res.code === '000000') {
                        setData(res.result);
                    }
                });
            }
        };
        handlerData();
        http.get('/share/common/info/20210101', {scene: 'share_lcmf'}).then((res) => {
            if (res.code === '000000') {
                setShareContent(res.result);
            }
        });
        AppState.addEventListener('change', handlerData);
        return () => {
            AppState.removeEventListener('change', handlerData);
        };
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
                            clearButtonMode={'never'}
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
                        {`${inviteCode}`.length > 0 && (
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setInviteCode('')}>
                                <AntDesign name={'closecircle'} color={'#CDCDCD'} size={px(16)} />
                            </TouchableOpacity>
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
                                const {desc, show_circle, text, type, url} = item;
                                return (
                                    <View key={text} style={[i === 0 ? {} : styles.borderTop]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={type === 'text'}
                                            style={[Style.flexBetween, {height: px(56)}]}
                                            onPress={() => onPress(item)}>
                                            <Text style={styles.title}>{text}</Text>
                                            <View style={Style.flexRow}>
                                                {desc ? (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            {
                                                                marginRight: url ? px(8) : 0,
                                                                color: Colors.lightGrayColor,
                                                            },
                                                        ]}>
                                                        {desc}
                                                    </Text>
                                                ) : null}

                                                {(type === 'about' && showCircle) || show_circle ? (
                                                    <View style={styles.circle} />
                                                ) : null}
                                                {item.type === 'text' ? null : (
                                                    <Icon
                                                        name={'angle-right'}
                                                        size={20}
                                                        color={Colors.lightGrayColor}
                                                    />
                                                )}
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
        lineHeight: px(20),
        color: Colors.lightBlackColor,
    },
    inputContainer: {
        marginVertical: px(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: px(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    input: {
        flex: 1,
        fontSize: px(35),
        lineHeight: px(42),
        color: Colors.defaultColor,
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: 0,
        top: px(3.5),
        fontSize: px(26),
        lineHeight: px(37),
        color: Colors.placeholderColor,
    },
    circle: {
        height: px(6),
        width: px(6),
        borderRadius: px(6),
        backgroundColor: Colors.red,
        marginRight: px(8),
    },
});

export default Settings;
