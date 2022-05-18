/*
 * @Date: 2022-05-16 13:55:10
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-18 12:46:02
 * @Description: 特定对象选择
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import Loading from '../Portfolio/components/PageLoading';
// import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

const PopupContent = ({data}) => {
    const {button: popupButton = {}, default_select, options = [], tips: popupTips = ''} = data;
    const {text} = popupButton;
    const [selected, setSelected] = useState();

    useEffect(() => {
        setSelected(default_select);
    }, [default_select]);

    return (
        <View style={styles.popContainer}>
            {options.map((option, index) => {
                const {content, id, title} = option;
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={option + index}
                        onPress={() => setSelected(id)}
                        style={[styles.optionBox, {marginTop: index === 0 ? 0 : px(12)}]}>
                        <View style={Style.flexRow}>
                            <View style={[styles.radioIconBox, {borderWidth: selected !== id ? Space.borderWidth : 0}]}>
                                {selected === id ? (
                                    <Image source={require('../../assets/img/fof/check.png')} style={styles.checked} />
                                ) : null}
                            </View>
                            <Text style={styles.optionTitle}>{title}</Text>
                        </View>
                        <Text style={styles.optionContent}>{content}</Text>
                    </TouchableOpacity>
                );
            })}
            <Text style={styles.popupTips}>{popupTips}</Text>
            <Button
                color="#EDDBC5"
                disabledColor="#EDDBC5"
                onPress={() => {}}
                style={styles.popupButton}
                title={text}
            />
        </View>
    );
};

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, list = [], tips} = data;

    useEffect(() => {
        navigation.setOptions({title: '特定对象选择'});
        setData({
            button: {
                text: '完成',
                url: '',
            },
            list: [
                {
                    action: 'popup',
                    label: '自然人',
                    popup: {
                        button: {
                            text: '确定',
                        },
                        default_select: 1,
                        options: [
                            {
                                content:
                                    '1、金融资产不低于300万元或者最近三年个人年收入不低于50万元的个人\n2、普通投资者在信息告知、风险警示、适当性匹配等方面享有特别保护',
                                id: 1,
                                title: '普通投资者',
                            },
                            {
                                content:
                                    '同时符合下列条件的自然人：\n1、金融资产不低于500万元人民币，或者最近3年个人年均收入不低于50万元人民币\n2、具有2年以上证券、基金、期货、黄金、外汇等投资经历，或者具有2年以上金融产品设计、投资、风险管理及相关工作经历的自然人投资者，或者属于《证券期货投资者适当性管理办法》第八条第（一）款所规定的专业投资者的高级管理人员、获得职业资格认证的从事金融相关业务的注册会计师和律师',
                                id: 2,
                                title: '专业投资者',
                            },
                        ],
                        tips: '*请根据您的实际情况确认所属的类型，后续需要提供相应的证明资料。',
                    },
                    status: 0,
                    text: '未完成',
                },
                {
                    action: 'jump',
                    label: '电子签名约定书',
                    status: 0,
                    text: '未完成',
                    url: '',
                },
                {
                    action: 'jump',
                    label: '合格投资者承诺',
                    status: 0,
                    text: '未完成',
                    url: '',
                },
                {
                    action: 'jump',
                    label: '风险测评',
                    status: 1,
                    text: '已完成',
                    url: '',
                },
            ],
            tips: '*根据合规要求，查看私募产品前，请完成以下步骤。',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                <Text style={styles.tips}>{tips}</Text>
                <View style={styles.partBox}>
                    {list.map((item, index) => {
                        const {action, label, popup, status, text, url} = item;
                        return (
                            <View
                                key={item + index}
                                style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        if (action === 'jump') {
                                            jump(url);
                                        } else if (action === 'popup') {
                                            Modal.show(
                                                {
                                                    children: <PopupContent data={popup} />,
                                                    title: '请选择是普通投资者还是专业投资者',
                                                },
                                                'slide'
                                            );
                                        }
                                    }}
                                    style={[Style.flexBetween, {height: '100%'}]}>
                                    <Text style={styles.itemText}>{label}</Text>
                                    <View style={Style.flexRow}>
                                        <Text
                                            style={[
                                                styles.itemText,
                                                {color: status === 0 ? Colors.red : Colors.lightGrayColor},
                                            ]}>
                                            {text}
                                        </Text>
                                        <EvilIcons color={Colors.lightGrayColor} name="chevron-right" size={24} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <Button
                color="#EDDBC5"
                disabledColor="#EDDBC5"
                onPress={() => jump(button.url)}
                style={styles.button}
                title={button.text}
            />
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    tips: {
        marginTop: Space.marginVertical,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    partBox: {
        marginTop: px(12),
        marginBottom: isIphoneX() ? 34 + px(45) + px(16) : px(45) + px(16) * 2,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    itemText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    button: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
        backgroundColor: '#D7AF74',
    },
    popContainer: {
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
    },
    optionBox: {
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    radioIconBox: {
        marginRight: px(8),
        borderRadius: px(15),
        borderColor: '#979797',
        width: px(15),
        height: px(15),
    },
    checked: {
        width: '100%',
        height: '100%',
    },
    optionTitle: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    optionContent: {
        marginTop: px(8),
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    popupTips: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
    popupButton: {
        marginTop: px(20),
        backgroundColor: '#D7AF74',
    },
});
