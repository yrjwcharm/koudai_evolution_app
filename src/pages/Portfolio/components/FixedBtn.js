/*
 * @Author: dx
 * @Date: 2021-01-18 15:52:27
 * @LastEditTime: 2022-08-05 11:43:48
 * @LastEditors: Please set LastEditors
 * @Description: 详情页底部固定按钮
 * @FilePath: /koudai_evolution_app/src/pages/Detail/components/FixedBtn.js
 */
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Alert, DeviceEventEmitter, Linking, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import {px as text, isIphoneX} from '~/utils/appUtil';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useNavigation} from '@react-navigation/native';
import {BottomModal} from '~/components/Modal';
import Toast from '~/components/Toast';
import {useJump} from '~/components/hooks';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';

const FixedBtn = (props) => {
    const {btns, style} = props;
    const navigation = useNavigation();
    const bottomModal = useRef(null);
    const clickRef = useRef(true);
    const jump = useJump();
    // 咨询弹窗内容渲染
    const renderContactContent = (subs) => {
        const onPress = (item) => {
            if (item.type === 'im') {
                global.LogTool('im');
                bottomModal.current.hide();
                navigation.navigate('IM');
            } else if (item.type === 'tel') {
                bottomModal.current.hide();
                const url = `tel:${item.sno}`;
                global.LogTool('call');
                Linking.canOpenURL(url)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show(`您的设备不支持该功能，请手动拨打 ${item.sno}`);
                        }
                        return Linking.openURL(url);
                    })
                    .catch((err) => Alert(err));
            }
        };
        return (
            <View style={[styles.contactContainer]}>
                {subs.map((sub, index) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.methodItem,
                                Style.flexRow,
                                index === subs.length - 1 ? {marginBottom: 0} : {},
                            ]}>
                            <View style={[Style.flexRow]}>
                                <View style={[styles.iconBox, Style.flexCenter]}>
                                    <Image source={{uri: sub?.icon}} style={[styles.icon]} />
                                </View>
                                <View>
                                    <Text style={[styles.methodTitle]}>{sub?.title}</Text>
                                    <Text style={[styles.methodDesc]}>{sub?.desc}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.methodBtn, Style.flexCenter]}
                                activeOpacity={0.8}
                                onPress={() => onPress(sub)}>
                                {sub?.btn?.title && <Text style={[styles.methodBtnText]}>{sub?.btn?.title}</Text>}
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    };
    const onPressLeftBtns = (btn) => {
        if (!clickRef.current) {
            return false;
        }
        const {event_id, is_follow, item_type, plan_id} = btn;
        const logParams = {ctrl: plan_id, event: event_id};
        event_id === 'follow_click' && (logParams.oid = is_follow ? 'cancel' : 'add');
        global.LogTool(logParams);
        if (event_id === 'consult_click') {
            bottomModal.current.show();
        } else if (event_id === 'follow_click') {
            clickRef.current = false;
            (is_follow ? followCancel : followAdd)({item_id: plan_id, item_type}).then((res) => {
                if (res.code === '000000') {
                    res.message && Toast.show(res.message);
                    setTimeout(() => {
                        clickRef.current = true;
                    }, 100);
                    DeviceEventEmitter.emit('attentionRefresh');
                }
            });
        }
    };

    return btns?.length > 0 ? (
        <View style={[styles.container, Style.flexRow, style]}>
            {btns.length > 1 ? (
                <>
                    {btns.slice(0, btns.length - 1).map((btn, i) => {
                        const {icon, subs, title} = btn;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={title + i}
                                style={[styles.contactBtn, Style.flexCenter]}
                                onPress={() => onPressLeftBtns(btn)}>
                                <Image source={{uri: icon}} style={styles.contactIcon} />
                                <Text style={styles.contactText}>{title}</Text>
                                {subs?.length > 0 && (
                                    <BottomModal
                                        title={'选择咨询方式'}
                                        ref={bottomModal}
                                        children={renderContactContent(subs)}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                    <Button
                        title={btns[btns.length - 1]?.title}
                        desc={btns[btns.length - 1]?.desc}
                        superscript={btns[btns.length - 1]?.superscript}
                        style={styles.btn}
                        textStyle={styles.btnText}
                        descStyle={styles.descText}
                        onPress={async () => {
                            const {event_id, plan_id, title} = btns[btns.length - 1] || {};
                            global.LogTool(event_id || 'detailBuy', null, plan_id || title);
                            props.onPress && (await props.onPress());
                            jump(btns[btns.length - 1].url);
                        }}
                    />
                </>
            ) : (
                <Button
                    title={btns[0]?.title}
                    desc={btns[0]?.desc}
                    style={styles.btn}
                    textStyle={styles.btnText}
                    descStyle={styles.descText}
                    onPress={() => {
                        const {event_id, plan_id, title} = btns[0] || {};
                        global.LogTool(event_id || 'detailBuy', null, plan_id || title);
                        jump(btns[0].url);
                    }}
                />
            )}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: text(8),
        paddingHorizontal: text(20),
        paddingBottom: isIphoneX() ? 34 : text(8),
    },
    contactBtn: {
        marginRight: text(20),
    },
    contactIcon: {
        width: text(28),
        height: text(28),
    },
    contactText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.defaultColor,
    },
    btn: {
        flex: 1,
        // height: text(50),
    },
    btnText: {
        fontSize: text(15),
        lineHeight: text(21),
        color: '#fff',
    },
    descText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#fff',
        opacity: 0.74,
        marginTop: text(2),
    },
    contactContainer: {
        paddingTop: text(28),
        paddingHorizontal: text(20),
    },
    methodItem: {
        marginBottom: text(34),
        justifyContent: 'space-between',
    },
    iconBox: {
        // width: text(50),
        // height: text(50),
        // borderRadius: text(25),
        // backgroundColor: '#DFEAFC',
        marginRight: text(12),
    },
    icon: {
        width: text(40),
        height: text(40),
    },
    methodTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: '600',
        marginBottom: text(6),
    },
    methodDesc: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.lightGrayColor,
    },
    methodBtn: {
        borderRadius: text(6),
        borderWidth: Space.borderWidth,
        borderColor: Colors.descColor,
        borderStyle: 'solid',
        paddingVertical: text(8),
        paddingHorizontal: text(12),
    },
    methodBtnText: {
        fontSize: Font.textH3,
        lineHeight: text(16),
        color: Colors.descColor,
    },
});

FixedBtn.propTypes = {
    btns: PropTypes.arrayOf(PropTypes.object).isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};
FixedBtn.defaultProps = {
    style: {},
};
FixedBtn.btnHeight = isIphoneX() ? text(90) : text(66);
export default FixedBtn;
