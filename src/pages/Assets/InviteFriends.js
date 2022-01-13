/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-03-02 14:25:55
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-01-13 10:24:01
 * @Description: 邀请好友注册(得魔分)
 */
import React, {useCallback, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import {isIphoneX, px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {Modal, ShareModal} from '../../components/Modal';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';
import {useJump} from '../../components/hooks';
import Toast from '../../components/Toast';

const InviteFriends = ({navigation, route}) => {
    const jump = useJump();
    const [activeSections1, setActiveSections1] = useState([]); // 邀请记录展开状态
    const [activeSections2, setActiveSections2] = useState([]); // 提现记录展开状态
    const [data, setData] = useState({});
    const shareModal = useRef(null);
    const clickRef = useRef(true);

    const init = () => {
        http.get('/promotion/invite/summary/20210101', {...route.params}).then((res) => {
            if (res.code === '000000') {
                const {top_button} = res.result;
                if (top_button) {
                    navigation.setOptions({
                        headerRight: () => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[Style.flexCenter, styles.topRightBtn]}
                                onPress={() => {
                                    global.LogTool('click', 'exchange');
                                    jump(top_button.url);
                                }}>
                                <Text style={styles.title}>{top_button.text}</Text>
                            </TouchableOpacity>
                        ),
                    });
                }
                navigation.setOptions({title: res.result.title || '邀请好友'});
                if (res.result.invite_table?.spread) {
                    setActiveSections1([0]);
                }
                if (res.result.withdraw_table?.spread) {
                    setActiveSections2([0]);
                }
                setData(res.result);
            }
        });
    };

    /**
     * 渲染手风琴头部
     * @param {boolean} isActive 是否展开
     * @param {string} type 类型：邀请好友记录/提现记录
     * @returns React.ReactElement
     */
    const renderHeader = (isActive, type) => {
        const {invite_table, withdraw_table} = data;
        const {title} = type === 'invite' ? invite_table : withdraw_table;
        return (
            <View style={[styles.header, Style.flexBetween]}>
                <Text style={[styles.title, {fontWeight: '500'}]}>{title}</Text>
                <Icon name={`${isActive ? 'angle-up' : 'angle-down'}`} size={20} color={Colors.lightGrayColor} />
            </View>
        );
    };
    /**
     * 渲染手风琴空状态
     * @param {boolean} isActive 是否展开
     * @param {string} type 类型：邀请好友记录/提现记录
     * @returns React.ReactElement
     */
    const renderFooter = (isActive, type) => {
        const {invitees, withdraws} = data;
        const content = type === 'invite' ? invitees : withdraws;
        const emptyText = type === 'invite' ? '暂无邀请记录' : '暂无提现记录';
        return (
            (content?.length === 0 || !content) &&
            isActive && <Text style={[styles.moreText, {paddingBottom: Space.padding}]}>{emptyText}</Text>
        );
    };
    /**
     * 渲染手风琴内容
     * @param {string} type 类型：邀请好友记录/提现记录
     * @returns React.ReactElement
     */
    const renderContent = (type) => {
        const {invite_table, invitees, withdraw_table, withdraws} = data;
        const {header, has_more} = type === 'invite' ? invite_table : withdraw_table;
        const tabelContent = type === 'invite' ? invitees : withdraws;
        const contentType = type === 'invite' ? invite_table.type : withdraw_table.type;
        return (
            <View style={{paddingHorizontal: Space.padding, paddingBottom: data.has_more ? 0 : Space.padding}}>
                <View style={[Style.flexRow, styles.tableHead]}>
                    {header.map((item, index, arr) => {
                        return (
                            <Text
                                key={item + index}
                                style={[
                                    styles.desc,
                                    styles.headText,
                                    index === 0 ? {textAlign: 'left'} : {},
                                    index === arr.length - 1 ? {textAlign: 'right'} : {},
                                ]}>
                                {item}
                            </Text>
                        );
                    })}
                </View>
                {tabelContent?.map?.((item, index) => {
                    return (
                        <View key={item + index} style={[Style.flexRow, {height: text(30)}]}>
                            {item?.map?.((html, idx, arr) => {
                                return html ? (
                                    <View
                                        key={html + idx}
                                        style={[
                                            idx === 0 || idx === arr.length - 1 ? {flex: 1} : {flex: 1.5},
                                            idx === 0 ? {alignItems: 'flex-start'} : {alignItems: 'center'},
                                            idx === arr.length - 1 ? {alignItems: 'flex-end'} : {},
                                        ]}>
                                        <HTML html={html} style={{...styles.desc, color: Colors.defaultColor}} />
                                    </View>
                                ) : null;
                            })}
                        </View>
                    );
                })}
                {has_more && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.moreRecord, Style.flexCenter]}
                        onPress={() => {
                            global.LogTool('click', 'more', contentType);
                            navigation.navigate('InviteRecord', {
                                type: contentType,
                            });
                        }}>
                        <Text style={styles.moreText}>{'查看更多'}</Text>
                        <Icon
                            name={'angle-right'}
                            size={16}
                            color={Colors.defaultColor}
                            style={{marginLeft: text(4)}}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const onWithdraw = () => {
        if (!clickRef.current) {
            return false;
        }
        clickRef.current = false;
        http.post('/report/annual/withdraw/20220106').then((res) => {
            if (res.code === '000000') {
                Modal.show({
                    // backButtonClose: false,
                    content: res.result.content,
                    // isTouchMaskToClose: false,
                    title: res.result.title,
                });
                init();
            } else {
                Toast.show(res.message);
            }
            clickRef.current = true;
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    return Object.keys(data || {}).length > 0 ? (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.container}>
            {data.banner ? <Image source={{uri: data.banner}} style={styles.banner} /> : null}
            {/* 获取魔分/红包信息 */}
            <View style={styles.inviteBox}>
                {data.step_image ? <Image source={{uri: data.step_image}} style={styles.stepImg} /> : null}
                {data.steps ? (
                    <View style={[Style.flexRow, styles.stepBox]}>
                        {data.steps.map((step, index) => {
                            return (
                                <Text key={`step${index}`} style={[styles.desc, {width: text(73)}]}>
                                    {step}
                                </Text>
                            );
                        })}
                    </View>
                ) : null}
                <View style={[Style.flexRow, {marginTop: Space.marginVertical}]}>
                    <View style={[Style.flexCenter, {flex: 1}, styles.borderRight]}>
                        <View style={[Style.flexRow, {alignItems: 'flex-end', marginBottom: text(11)}]}>
                            <Text style={[styles.numStyle, {marginRight: text(5)}]}>{data.bonus || '0'}</Text>
                            <Text style={[styles.desc, {color: Colors.lightGrayColor, marginBottom: text(3)}]}>
                                {data.bonus_unit}
                            </Text>
                        </View>
                        <Text style={styles.title}>{data.bonus_desc}</Text>
                    </View>
                    <View style={[Style.flexCenter, {flex: 1}]}>
                        <View style={[Style.flexRow, {alignItems: 'flex-end', marginBottom: text(11)}]}>
                            <Text style={[styles.numStyle, {marginRight: text(5)}]}>{data.count || '0'}</Text>
                            <Text style={[styles.desc, {color: Colors.lightGrayColor, marginBottom: text(3)}]}>
                                {data.count_unit}
                            </Text>
                        </View>
                        <Text style={styles.title}>{data.count_desc}</Text>
                    </View>
                </View>
                {data.button ? (
                    <TouchableOpacity
                        onPress={() => {
                            if (data.button.type === 'invite') {
                                global.LogTool('click', 'showShare');
                                shareModal.current.show();
                            } else if (data.button.type === 'withdraw') {
                                global.LogTool('redPacketWithdrawStart');
                                if (data.button.avail) {
                                    onWithdraw();
                                }
                            }
                        }}
                        activeOpacity={0.8}
                        style={[
                            Style.flexCenter,
                            styles.btn,
                            {backgroundColor: data.button.avail === 0 ? '#FFF1C9' : '#FFD24D'},
                        ]}>
                        <Text style={[styles.btnText, data.button.avail === 0 ? {color: Colors.lightGrayColor} : {}]}>
                            {data.button.text}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={{marginHorizontal: Space.marginAlign, paddingBottom: isIphoneX() ? 34 : 0}}>
                {/* 邀请好友记录 */}
                <Accordion
                    sections={[1]}
                    expandMultiple
                    touchableProps={{activeOpacity: 1}}
                    activeSections={activeSections1}
                    renderHeader={(section, index, isActive) => renderHeader(isActive, 'invite')}
                    renderContent={() => renderContent('invite')}
                    renderFooter={(section, index, isActive) => renderFooter(isActive, 'invite')}
                    onChange={(active) => setActiveSections1(active)}
                    sectionContainerStyle={styles.tableWrap}
                    touchableComponent={TouchableOpacity}
                />
                {/* 提现记录 */}
                {data.withdraw_table ? (
                    <Accordion
                        sections={[1]}
                        expandMultiple
                        touchableProps={{activeOpacity: 1}}
                        activeSections={activeSections2}
                        renderHeader={(section, index, isActive) => renderHeader(isActive, 'withdraw')}
                        renderContent={() => renderContent('withdraw')}
                        renderFooter={(section, index, isActive) => renderFooter(isActive, 'withdraw')}
                        onChange={(active) => setActiveSections2(active)}
                        sectionContainerStyle={styles.tableWrap}
                        touchableComponent={TouchableOpacity}
                    />
                ) : null}
                {data.rule ? (
                    <>
                        <Text style={[styles.title, styles.ruleTitle]}>{data.rule_title || '邀请规则'}</Text>
                        <HTML html={data.rule} style={styles.rules} />
                    </>
                ) : null}
            </View>
            {data.share_info ? (
                <ShareModal
                    ctrl={'invite_friends'}
                    ref={shareModal}
                    title={'邀请好友'}
                    shareContent={data.share_info}
                />
            ) : null}
        </ScrollView>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(64),
        marginRight: text(14),
    },
    banner: {
        width: '100%',
        height: text(209),
    },
    inviteBox: {
        marginTop: text(-44),
        marginHorizontal: Space.marginAlign,
        paddingTop: text(20),
        paddingBottom: text(28),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    stepImg: {
        width: text(268),
        height: text(56),
    },
    stepBox: {
        marginTop: text(4),
        marginBottom: text(12),
        paddingHorizontal: text(12),
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        width: '100%',
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightBlackColor,
        textAlign: 'center',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    numStyle: {
        fontSize: text(28),
        lineHeight: text(32),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
    },
    btn: {
        marginTop: text(28),
        borderRadius: text(8),
        width: text(308),
        height: text(45),
        backgroundColor: '#FFD24D',
        overflow: 'hidden',
    },
    btnText: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    tableWrap: {
        marginTop: Space.marginVertical,
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
    },
    header: {
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: text(50),
    },
    tableHead: {
        marginBottom: text(8),
        paddingBottom: text(8),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    headText: {
        color: Colors.lightGrayColor,
        flex: 1,
    },
    rowText: {
        color: Colors.defaultColor,
        flex: 1,
    },
    ruleTitle: {
        marginTop: Space.marginVertical,
        marginBottom: text(8),
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    rules: {
        fontSize: Font.textH3,
        lineHeight: text(21),
        color: Colors.lightGrayColor,
    },
    moreRecord: {
        marginTop: text(8),
        paddingVertical: text(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
    },
    moreText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
});

export default InviteFriends;
