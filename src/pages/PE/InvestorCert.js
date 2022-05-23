/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2022-05-16 13:55:10
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-23 15:34:31
 * @Description: 合格投资者认证
 */
import React, {useCallback, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors, Font, Space} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import {useFocusEffect} from '@react-navigation/native';
import {FormItem} from './IdentityAssertion';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, desc: tips, items: list = [], tip: bottomTips} = data;
    const partBox = useRef();

    const init = () => {
        http.get('/private_fund/investor_certification_info/20220510').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '合格投资者认证'});
                setData(res.result);
            }
        });
    };

    const onSubmit = () => {
        http.post('/private_fund/investor_audit/20220510', {order_id: route.params.order_id || 1, type: 1}).then(
            (res) => {
                if (res.code === '000000') {
                    jump(res.result.url);
                }
            }
        );
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {tips ? <Text style={styles.tips}>{tips}</Text> : null}
                <View ref={partBox} style={styles.partBox}>
                    {list.map((item, index) => {
                        return (
                            <View
                                key={item + index}
                                style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                                <FormItem data={item} />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View
                onLayout={({
                    nativeEvent: {
                        layout: {height},
                    },
                }) =>
                    partBox.current.setNativeProps({
                        style: {marginBottom: isIphoneX() ? 34 + height + px(16) : height + px(32)},
                    })
                }
                style={styles.bottomBox}>
                <Text style={styles.bottomTips}>{bottomTips}</Text>
                <Button
                    color="#EDDBC5"
                    disabled={button.avail === 0}
                    disabledColor="#EDDBC5"
                    onPress={onSubmit}
                    style={styles.button}
                    title={button.text}
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
    bottomBox: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
    },
    button: {
        marginTop: px(20),
        backgroundColor: '#D7AF74',
    },
    bottomTips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
});
