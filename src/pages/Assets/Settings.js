/*
 * @Date: 2021-02-03 11:26:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-19 09:55:43
 * @Description: 个人设置
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Http from '../../services/index.js';
import {useJump} from '../../components/hooks';
import {Modal, ShareModal} from '../../components/Modal';
import Storage from '../../utils/storage';
import Toast from '../../components/Toast';
import {InputModal} from '../../components/Modal';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
const Settings = ({navigation}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const [data, setData] = useState([]);
    const shareModal = useRef(null);
    const inputModal = useRef(null);
    const [modalProps, setModalProps] = useState({});
    const [inviteCode, setInviteCode] = useState('');
    const inviteCodeRef = useRef('');

    const onPress = useCallback(
        (item) => {
            if (item.type === 'bind_invitor') {
                setInviteCode('');
                setModalProps({
                    confirmClick,
                    placeholder: '请填写邀请码',
                    title: '填写邀请码',
                });
            } else if (item.type === 'share_mofang') {
                shareModal.current.show();
            } else if (item.type === 'logout') {
                Modal.show({
                    title: '退出登录',
                    content: '退出后，日收益和投资产品列表将不再展示，是否确认退出？',
                    confirm: true,
                    confirmCallBack: () => {
                        // Alert.alert('退出登录');
                        Storage.delete('loginStatus');
                        dispatch(getUserInfo());
                        navigation.replace('Register');
                    },
                });
            } else {
                jump(item.url);
            }
        },
        [navigation, jump, dispatch, confirmClick]
    );
    const confirmClick = useCallback(() => {
        if (!inviteCodeRef.current) {
            Toast.show('邀请码不能为空');
            return false;
        }
        inputModal.current.hide();
        Http.post('/polaris/bind_invite_code/20210101', {
            invited_code: inviteCodeRef.current,
        }).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                Http.get('/mapi/config/20210101').then((resp) => {
                    if (resp.code === '000000') {
                        setData(resp.result);
                    }
                });
            }
        });
    }, []);

    useEffect(() => {
        Http.get('/mapi/config/20210101').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
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
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <InputModal {...modalProps} ref={inputModal}>
                <View style={{backgroundColor: '#fff'}}>
                    <View style={[Style.flexRow, styles.inputContainer]}>
                        <TextInput
                            autoCapitalize={'none'}
                            autoCompleteType={'off'}
                            autoCorrect={false}
                            autoFocus={true}
                            clearButtonMode={'while-editing'}
                            contextMenuHidden
                            enablesReturnKeyAutomatically
                            keyboardType={'default'}
                            maxLength={6}
                            onChangeText={(value) => setInviteCode(value)}
                            onSubmitEditing={confirmClick}
                            placeholder={modalProps?.placeholder}
                            style={styles.input}
                            value={inviteCode}
                        />
                    </View>
                </View>
            </InputModal>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index) => {
                    return (
                        <View key={index} style={styles.partBox}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.text} style={[i === 0 ? {} : styles.borderTop]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[Style.flexBetween, {paddingVertical: text(18)}]}
                                            onPress={() => onPress(item)}>
                                            <Text style={styles.title}>{item.text}</Text>
                                            <View style={Style.flexRow}>
                                                {item.desc ? (
                                                    <Text
                                                        style={[
                                                            styles.title,
                                                            {
                                                                marginRight: item.type !== 'about' ? text(8) : 0,
                                                                color: Colors.lightGrayColor,
                                                            },
                                                        ]}>
                                                        {item.desc}
                                                    </Text>
                                                ) : null}
                                                {item.type !== 'about' && (
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
            <ShareModal ref={shareModal} title={'分享理财魔方'} shareContent={{}} />
        </SafeAreaView>
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
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.defaultColor,
    },
});

export default Settings;
