/*
 * @Author: xjh
 * @Date: 2021-02-05 14:56:52
 * @Description:定投计划
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-22 12:10:48
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import Slider from './components/Slider';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import {Button, FixedButton} from '../../components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
const deviceWidth = Dimensions.get('window').width;
export default function FixedPlan() {
    const [left, setLeft] = useState('40%');
    const [widthD, setWidthD] = useState('40%');
    const [moveRight, setMoveRight] = useState(false);
    useEffect(() => {
        // if(deviceWidth-30){
        // }
    });
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
    return (
        <>
            <View style={styles.bank_wrap_sty}>
                <View style={[Style.flexRow, styles.border_sty]}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2016/04/nongye.png'}}
                        style={{width: text(30), height: text(30)}}
                    />
                    <View style={styles.bank_item_sty}>
                        <Text style={styles.title_sty}>从招商银行储蓄卡(尾号8888)</Text>
                        <Text style={{color: '#555B6C', fontSize: text(12), marginTop: text(4)}}>每月25日定投扣款</Text>
                    </View>
                </View>
                <Text style={styles.time_sty}>下次扣款时间：2021-02-25将扣款3,000.0</Text>
            </View>
            <View style={styles.records_sty}>
                <View style={Style.flexBetween}>
                    <Text style={{color: '#1F2432', fontSize: text(16)}}>定投记录(5/180期)</Text>
                    <Text style={{color: '#1F2432', fontSize: text(12)}}>开始时间 2020-09</Text>
                </View>
                <View style={styles.process_wrap_sty}>
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
                </View>
                <ScrollView style={{marginTop: text(28)}}>
                    <View style={[Style.flexBetween, styles.border_sty]}>
                        <Text style={styles.desc_sty}>扣款日期</Text>
                        <Text style={styles.desc_sty}>扣款日期</Text>
                        <Text style={styles.desc_sty}>扣款日期</Text>
                    </View>
                    <View style={[Style.flexBetween, {marginTop: text(8)}]}>
                        <Text style={styles.desc_sty}>扣款日期</Text>
                        <Text style={styles.desc_sty}>扣款日期</Text>
                        <Text style={styles.desc_sty}>扣款日期</Text>
                    </View>
                </ScrollView>
            </View>

            <FixedButton title="修改计划" />
        </>
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
