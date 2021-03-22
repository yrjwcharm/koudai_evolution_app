/*
 * @Author: xjh
 * @Date: 2021-02-05 14:56:52
 * @Description:定投计划
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-22 21:23:47
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import Slider from '../Portfolio/components/Slider';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import {Button, FixedButton} from '../../components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/NavBar';
import FixedBtn from '../Portfolio/components/FixedBtn';
import {useJump} from '../../components/hooks';
const deviceWidth = Dimensions.get('window').width;
export default function FixedPlan(props) {
    const [data, setData] = useState({});
    const [left, setLeft] = useState('40%');
    const [widthD, setWidthD] = useState('40%');
    const [moveRight, setMoveRight] = useState(false);
    const jump = useJump();
    const onLayout = useCallback(
        (e) => {
            const layWidth = e.nativeEvent.layout.width;
            const widthAll = deviceWidth - 30;
            const curWidth = layWidth + widthAll * (left.split('%')[0] / 100);
            if (widthAll <= curWidth) {
                const reSetLeft = 100 - left.split('%')[0] - 21 + '%';
                console.log(reSetLeft);
                setLeft(reSetLeft);
                setMoveRight(true);
            }
        },
        [left]
    );
    useEffect(() => {
        Http.get('/trade/invest_plan/detail/20210101', {invest_id: props.route?.params?.invest_id}).then((res) => {
            setData(res.result);
        });
    }, []);
    return (
        <View style={{backgroundColor: Colors.bgColor}}>
            {Object.keys(data).length > 0 && (
                <View style={{marginBottom: FixedBtn.btnHeight}}>
                    <Header title={data.title} leftIcon="chevron-left" />
                    <View style={styles.bank_wrap_sty}>
                        <View style={[Style.flexRow, styles.border_sty]}>
                            <Image
                                source={{uri: data?.fix_info?.bank_icon}}
                                style={{width: text(30), height: text(30)}}
                            />
                            <View style={styles.bank_item_sty}>
                                <Text style={styles.title_sty}>{data?.fix_info?.bank_text}</Text>
                                <Text style={{color: '#555B6C', fontSize: text(12), marginTop: text(4)}}>
                                    {data?.fix_info?.date_text}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.time_sty}>{data?.fix_info?.next_date}</Text>
                    </View>
                    <View style={styles.records_sty}>
                        <View style={Style.flexBetween}>
                            <Text style={{color: '#1F2432', fontSize: text(16)}}>{data?.fix_records?.title}</Text>
                            <Text style={{color: '#1F2432', fontSize: text(12)}}>{data?.fix_records?.start_date}</Text>
                        </View>
                        {/* 定投进度 */}
                        {/* <View style={styles.process_wrap_sty}>
                    <View style={[styles.bubbles_sty, {left: left}]} onLayout={(e) => onLayout(e)}>
                        <Text style={styles.bubble_text_sty}>完成12.5%，已定投5期</Text>
                        {!moveRight && (
                            <AntDesign
                                name={'caretright'}
                                size={12}
                                color={'#79839D'}
                                style={[styles.ab_sty, {left: -4}]}
                            />
                        )}
                        {moveRight && (
                            <AntDesign
                                name={'caretleft'}
                                size={12}
                                color={'#79839D'}
                                style={[styles.ab_sty, {right: -3.5}]}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.process_outer}>
                    <View style={[styles.process_inner, {width: widthD}]}></View>
                </View> */}
                        {data?.fix_records?.list?.length > 0 && (
                            <ScrollView style={{marginTop: text(28)}}>
                                <View style={[Style.flexBetween, styles.border_sty]}>
                                    <Text style={styles.desc_sty}>{data?.fix_records?.header?.date}</Text>
                                    <Text style={styles.desc_sty}>{data?.fix_records?.header?.amount}</Text>
                                    <Text style={styles.desc_sty}>{data?.fix_records?.header?.status}</Text>
                                </View>
                                {data?.fix_records?.list.map((_l, _d) => {
                                    return (
                                        <View style={[Style.flexBetween, {marginTop: text(8)}]} key={_d + '_l'}>
                                            <Text style={styles.desc_sty}>{_l.date}</Text>
                                            <Text style={styles.desc_sty}>{_l.amount}</Text>
                                            <Text style={styles.desc_sty}>{_l.status}</Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                </View>
            )}

            {Object.keys(data).length > 0 && (
                <FixedButton
                    title={data.button.text}
                    disabled={data.button.avail == 0}
                    onPress={() => jump(data.button.url)}
                />
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    bank_wrap_sty: {
        backgroundColor: '#fff',
        marginVertical: text(12),
        padding: text(16),
        paddingBottom: text(10),
    },
    bank_item_sty: {
        marginLeft: text(10),
    },
    title_sty: {
        color: '#333',
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    time_sty: {
        color: '#555B6C',
        fontSize: Font.textH3,
        paddingTop: text(7),
    },
    records_sty: {
        paddingVertical: text(13),
        paddingHorizontal: text(16),
        backgroundColor: '#fff',
    },
    process_outer: {
        backgroundColor: '#F5F6F8',
        width: deviceWidth - 30,
        height: text(4),
        borderRadius: text(30),
        marginTop: text(40),
    },
    process_inner: {
        backgroundColor: '#FF812C',
        // width: '70%',
        height: text(4),
        borderRadius: text(30),
    },
    process_wrap_sty: {
        position: 'relative',
    },
    bubbles_sty: {
        position: 'absolute',
        backgroundColor: '#79839D',
        borderTopLeftRadius: text(2),
        borderTopRightRadius: text(2),
        // left: '70%',
        top: 10,
    },
    bubble_text_sty: {
        color: '#fff',
        paddingVertical: text(3),
        paddingHorizontal: text(5),
        fontSize: Font.textH3,
    },
    ab_sty: {
        top: text(14),
        position: 'absolute',
    },
    desc_sty: {
        color: '#9095A5',
        fontSize: text(12),
    },
    border_sty: {
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingBottom: text(10),
    },
});
