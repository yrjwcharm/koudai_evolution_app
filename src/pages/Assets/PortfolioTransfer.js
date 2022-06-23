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
import {formaNum, isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import {debounce} from 'lodash';
import {Modal} from '../../components/Modal';

const weightMedium = Platform.select({android: '700', ios: '500'});

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {content, pop = {}, portfolios = []} = data;
    const {cancel, confirm, content: modalContent, title} = pop;

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
     * @param checked 是否选中
     */
    const onSelect = (index, checked) => {
        const _data = {...data};
        _data.portfolios[index].checked = checked;
        setData(_data);
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
        http.get('/advisor/need_sign/trans3/20220613').then((res) => {
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
                {content ? <HTML html={content} style={styles.tips} /> : null}
                <View style={[Style.flexBetween, {marginTop: Space.marginVertical}]}>
                    <View style={Style.flexRow}>
                        <CheckBox
                            checked={selectedData.allSelected}
                            onChange={(value) => {
                                selectAll(value);
                            }}
                            style={{marginRight: px(8)}}
                        />
                        <Text style={styles.title}>全选</Text>
                    </View>
                    <Text style={[styles.desc, {fontWeight: weightMedium}]}>
                        {`您已选择${selectedData.selectedNum}个组合，预估转投金额(元)：`}
                        <Text style={{color: Colors.red}}>
                            {selectedData.selectedAmount > 0 ? formaNum(selectedData.selectedAmount) : 0}
                        </Text>
                    </Text>
                </View>
                {portfolios?.map?.((item, index) => {
                    const {amount, checked = false, from, poid, to, to_url} = item;
                    return (
                        <View key={poid} style={styles.itemBox}>
                            <View style={Style.flexRow}>
                                <Text style={[styles.title, {flex: 1}]}>{from}</Text>
                                <Image source={require('../../assets/personal/transArrow.png')} style={styles.arrow} />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => jump(to_url)}
                                    style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                    <Text
                                        style={[
                                            styles.title,
                                            {color: Colors.brandColor, flex: 1, textAlign: 'center'},
                                        ]}>
                                        {to}
                                    </Text>
                                    <AntDesign color={Colors.brandColor} name="right" size={12} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.desc, {marginTop: px(4)}]}>
                                <Text style={{color: Colors.descColor}}>{'持仓金额(元)：'}</Text>
                                <Text style={{fontSize: Font.textH2, fontFamily: Font.numFontFamily}}>
                                    {formaNum(amount)}
                                </Text>
                            </Text>
                            <View style={[Style.flexRow, {marginTop: Space.marginVertical}]}>
                                <CheckBox
                                    checked={checked}
                                    onChange={(value) => {
                                        onSelect(index, value);
                                    }}
                                    style={{marginRight: px(8)}}
                                />
                                <HTML
                                    html={`同意将<span style="color: #E74949;">${from}</span>转投至<span style="color: #E74949;">${to}</span>`}
                                    style={{...styles.desc, color: Colors.descColor}}
                                />
                            </View>
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
                    title="确认"
                />
            </View>
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
        fontSize: Font.textH3,
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
});
