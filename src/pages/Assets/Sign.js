/*
 * @Date: 2022-04-21 16:13:56
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-04-27 18:40:58
 * @Description:投顾服务签约
 */
import {Platform, StyleSheet, Text, View, ScrollView, Switch} from 'react-native';
import React, {useEffect, useReducer, useState} from 'react';
import CheckBox from '../../components/CheckBox';
import _ from 'lodash';
import http from '../../services';
import {Colors, Style} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import {useJump} from '../../components/hooks';
import {Button} from '../../components/Button';
import RenderHtml from '../../components/RenderHtml';
import {Modal} from '../../components/Modal';
import FastImage from 'react-native-fast-image';
const Sign = ({navigation}) => {
    const [signSelectData, setSignSelectData] = useState([]);
    const [signData, setSignData] = useState(null);
    const jump = useJump();
    const [, forceUpdate] = useReducer((x) => x + 1, 1);
    const showSignNotice = (data) => {
        Modal.show({
            children: () => {
                return (
                    <View>
                        <ScrollView
                            bounces={false}
                            style={{
                                marginTop: px(12),
                                paddingHorizontal: px(20),
                                maxHeight: px(375),
                            }}>
                            <Text style={{fontSize: px(14), color: '#545968', lineHeight: px(21)}}>{data.content}</Text>
                            <FastImage
                                source={{uri: data.img}}
                                style={{width: px(241), height: px(128), marginVertical: px(16)}}
                                resizeMode="contain"
                            />
                        </ScrollView>
                    </View>
                );
            },
            confirmCallBack: () => {
                http.post('/adviser/confirm/split_hbzs/20220516', {}).then((res) => {
                    console.log(res);
                });
            },
            confirmText: data.button?.text,
            countdown: data.countdown,
            countdownText: '确认',
            isTouchMaskToClose: false,
            onCloseCallBack: () => navigation.goBack(),
            title: data.title,
        });
    };
    useEffect(() => {
        http.get('adviser/get_need_sign_list/20210923').then((res) => {
            setSignData(res.result);
            if (res.result?.hbzs_pop?.content) {
                showSignNotice(res.result?.hbzs_pop);
            }
            navigation.setOptions({title: res.result.title});
        });
    }, [navigation]);
    //checkBox 选中
    const checkBoxClick = (check, poid) => {
        //选中
        if (check) {
            if (poid) {
                setSignSelectData((prev) => {
                    return [...prev, poid];
                });
            } else {
                setSignSelectData((prev) => {
                    let poids = signData?.plan_list?.map((item) => {
                        return item.poid;
                    });
                    return [...new Set([...prev, ...poids])];
                });
            }
        } else {
            //非选中
            if (poid) {
                setSignSelectData((prev) => {
                    let data = [...prev];
                    _.remove(data, function (_poid) {
                        return _poid === poid;
                    });
                    return data;
                });
            } else {
                setSignSelectData([]);
            }
        }
    };
    return (
        signData && (
            <>
                <ScrollView style={{backgroundColor: Colors.bgColor, padding: px(16)}}>
                    {signData?.desc ? (
                        <RenderHtml html={signData?.desc} style={{fontSize: px(13), lineHeight: px(20)}} />
                    ) : null}
                    <View style={[Style.flexBetween, {marginVertical: px(12)}]}>
                        <View style={Style.flexRow}>
                            <CheckBox
                                checked={signSelectData?.length == signData?.plan_list?.length}
                                style={{marginRight: px(6)}}
                                onChange={(value) => {
                                    checkBoxClick(value);
                                }}
                            />
                            <Text style={{fontSize: px(16), fontWeight: '700'}}>全选</Text>
                        </View>
                        <Text style={{fontSize: px(12), fontWeight: Platform.select({android: '700', ios: '500'})}}>
                            {`您已选择${signSelectData?.length}个组合 `}
                            {signSelectData?.length}/{signData?.plan_list?.length}
                        </Text>
                    </View>
                    {signData?.plan_list?.map((item, index) => {
                        return (
                            <View key={index} style={styles.card}>
                                <View style={Style.flexBetween}>
                                    <Text style={{fontSize: px(16), fontWeight: '700', marginBottom: px(6)}}>
                                        {item?.name}
                                        {item?.sub_name ? (
                                            <Text style={{fontWeight: '400', fontSize: px(12)}}>{item.sub_name}</Text>
                                        ) : null}
                                    </Text>
                                    {item?.auto_adjust ? (
                                        <Text
                                            style={{
                                                fontSize: px(12),
                                                lineHeight: px(17),
                                                fontWeight: '400',
                                                color: '#121d3a',
                                            }}>
                                            {item?.auto_adjust.text}
                                        </Text>
                                    ) : null}
                                </View>

                                <View style={Style.flexBetween}>
                                    {item?.adviser_cost_desc ? (
                                        <Text style={[styles.light_text, {marginBottom: px(6)}]}>
                                            {item.adviser_cost_desc}
                                        </Text>
                                    ) : null}
                                    {item?.auto_adjust ? (
                                        <Switch
                                            ios_backgroundColor={'#CCD0DB'}
                                            onValueChange={(val) => {
                                                signData.plan_list[index].auto_adjust.status = +val;
                                                forceUpdate();
                                            }}
                                            thumbColor={'#fff'}
                                            trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                            value={!!item?.auto_adjust.status}
                                            style={{transform: [{scale: 0.6}]}}
                                        />
                                    ) : null}
                                </View>
                                <View style={[Style.flexRow, {alignItems: 'flex-start'}]}>
                                    <CheckBox
                                        checked={signSelectData?.includes(item?.poid)}
                                        style={{marginRight: px(6)}}
                                        onChange={(value) => {
                                            checkBoxClick(value, item.poid);
                                        }}
                                    />
                                    <Text style={[styles.light_text, {flex: 1}]}>
                                        {item?.desc}
                                        {item?.link_name}
                                        <Text>
                                            {item?.[item.auto_adjust.status ? 'link_list' : 'link_list2']?.map(
                                                (link, _index, arr) => (
                                                    <Text
                                                        style={{color: Colors.btnColor}}
                                                        key={_index}
                                                        onPress={() => {
                                                            if (link?.url) {
                                                                jump(link?.url);
                                                            }
                                                        }}>
                                                        {link?.text}
                                                        {arr?.length > 1 && _index == arr?.length - 2 ? (
                                                            <Text style={styles.light_text}>和</Text>
                                                        ) : _index == arr?.length - 1 ? (
                                                            ''
                                                        ) : (
                                                            '、'
                                                        )}
                                                    </Text>
                                                )
                                            )}
                                            {item?.desc_end ? (
                                                <Text style={styles.light_text}>{item?.desc_end}</Text>
                                            ) : null}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                    <View style={{height: 40}} />
                </ScrollView>

                <Button
                    style={{marginHorizontal: px(20), marginBottom: px(20)}}
                    title={signData.title}
                    disabled={signSelectData.length == 0}
                    onPress={() => {
                        global.LogTool('Selectcombine_button');
                        http.post('/advisor/action/report/20220422', {action: 'select', poids: signSelectData});
                        navigation.navigate('RiskDisclosure', {
                            poids: signSelectData,
                            auto_poids: signData.plan_list
                                .filter((item) => item?.auto_adjust?.status)
                                .map((item) => item.poid),
                            manual_poids: signData.plan_list
                                .filter((item) => !item?.auto_adjust?.status)
                                .map((item) => item.poid),
                        });
                    }}
                />
            </>
        )
    );
};

export default Sign;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        padding: px(16),
        marginBottom: px(12),
    },
    light_text: {fontSize: px(13), lineHeight: px(17), color: Colors.lightBlackColor},
});
