/*
 * @Date: 2022-06-10 19:04:49
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-22 17:26:53
 * @Description: 组合转投页面
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';
import {formaNum, isIphoneX, px as text, px} from '../../utils/appUtil';
import http from '../../services';
import {debounce} from 'lodash';
import {Modal} from '../../components/Modal';
import PortfolioCard from "../../components/Portfolios/PortfolioCard";

const weightMedium = Platform.select({android: '700', ios: '500'});

export default ({navigation, route}) => {
    const [data, setData] = useState({});
    const [modalContent, setModalContent] = useState("");
    const {content, pop = {}, portfolios = []} = data;
    const {cancel, confirm, title, content_part1, content_part2, content_part3} = pop;

    /** @name 选中的组合数据 */
    const selectedData = useMemo(() => {
        const {portfolios: _portfolios = []} = data;
        const allSelected = _portfolios.every((item) => item.checked);
        const selected = _portfolios.filter((item) => item.checked);
        const selectedAmount = selected.reduce((prev, curr) => prev + curr.amount, 0);
        return {
            allSelected,
            selected,
            selectedAmount,
            selectedNum: selected.length,
        };
    }, [data]);

    /**
     * @name 选中/取消选中组合
     * @param index 组合的索引
     */
    const onSelect = (index) => {
        const _data = {...data};
        _data.portfolios.forEach((item) => item.checked = false)
        _data.portfolios[index].checked = true;
        setData(_data);
        setModalContent(`${content_part1}${data?.amount}${content_part2}${_data.portfolios[index]?.name}${content_part3}`)
    };

    /**
     * @name 全选/取消全选
     * @param checked 是否全选
     */
    const selectAll = (checked) => {
        const _data = {...data};
        _data.portfolios?.forEach((item) => (item.checked = checked));
        setData(_data);
    };

    const onSubmit = useCallback(
        debounce(
            () => {
                const needSign = selectedData.selected?.filter?.((item) => item.need_sign) || [];
                const to_poids = selectedData.selected?.map((item) => item.to_poid);
                if (needSign.length > 0) {
                    const from_poids = selectedData.selected?.map((item) => item.from_poid);
                    const poids = needSign.map((item) => item.to_poid);
                    navigation.navigate('Sign', {from_poids, poids, to_poids});
                } else {
                    const from_poids = selectedData.selected?.map?.((item) => item.from_poid) || [];
                    const poids = selectedData.selected?.map?.((item) => item.to_poid) || [];
                    navigation.navigate('RiskDisclosure', {
                        auto_poids: [],
                        from_poids,
                        manual_poids: [],
                        need_sign: false,
                        poids,
                        to_poids,
                    });
                }
            },
            1000,
            {leading: true, trailing: false}
        ),
        [selectedData]
    );

    useEffect(() => {
        http.get('/advisor/need_sign/trans3/20220613', {poid: route.params?.poid}).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '组合转投'});
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {content ? <HTML html={content} style={styles.tips}/> : null}
                <View style={[Style.flexBetween, {marginTop: 16}]}>
                    <Text style={[styles.desc, {fontWeight: weightMedium}]}>
                        请选择要转入的组合
                    </Text>
                    {data?.amount ? (
                            <View style={Style.flexRow}>
                                <Text style={[styles.desc, {fontSize: text(12)}]}>
                                    预计转入金额 :
                                </Text>
                                <Text style={[styles.desc, {fontWeight: weightMedium, color: "red"}]}>
                                    {formaNum(data?.amount)}
                                </Text>
                                <Text style={[styles.desc, {fontSize: text(12)}]}>
                                    元
                                </Text>
                            </View>
                    ) : null}
                </View>
                {portfolios?.map?.((item, index) => {
                    const {amount, checked = false, from, poid, to_poid, to, to_url} = item;
                    return (
                        <View style={[Style.flexBetween, {marginTop: 10}]}>
                            <PortfolioCard data={item} key={index} style={{marginBottom: px(12)}} onPress={() => {
                                onSelect(index);
                            }} />
                            <CheckBox
                                checked={checked}
                                onChange={() => {
                                    onSelect(index);
                                }}
                                style={{position: 'absolute', right: px(16)}}
                            />
                        </View>
                    );
                })}
            </ScrollView>
            <View style={styles.btnBox}>
                <Button
                    disabled={selectedData.selectedNum === 0}
                    onPress={() => {
                        Modal.show({
                            cancelText: cancel.text,
                            confirm: true,
                            confirmText: confirm.text,
                            confirmCallBack: onSubmit,
                            content: modalContent,
                            title,
                        });
                    }}
                    title="确认转投"
                />
            </View>
        </View>
    ) : (
        <Loading/>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
    },
    tips: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    title: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: weightMedium,
    },
    desc: {
        fontSize: text(15),
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    itemBox: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    arrow: {
        width: px(52),
        height: px(8),
    },
    btnBox: {
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 : Space.padding,
        backgroundColor: '#fff',
    },
    light_text: {
        color: Colors.lightBlackColor
    }
});
