/*
 * @Author: xjh
 * @Date: 2021-02-05 14:56:52
 * @Description:定投计划
 * @LastEditors: dx
 * @LastEditTime: 2021-11-25 17:19:07
 */
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
import FixedBtn from '../Portfolio/components/FixedBtn';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import EmptyTip from '../../components/EmptyTip';
import BottomDesc from '../../components/BottomDesc';
const deviceWidth = Dimensions.get('window').width;
export default function FixedPlan(props) {
    const [data, setData] = useState({});
    const jump = useJump();
    const [showEmpty, setShowEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );

    const init = useCallback(() => {
        Http.get('/trade/invest_plan/detail/20210101', {invest_id: props.route?.params?.invest_id})
            .then((res) => {
                setShowEmpty(true);
                setData(res.result);
                setLoading(false);
                props.navigation.setOptions({
                    title: res.result.title,
                });
            })
            .catch(() => {
                setLoading(false);
            });
    }, [props.route, props.navigation]);
    return loading ? (
        <View style={[Style.flexCenter, {flex: 1}]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    ) : (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <ScrollView bounces={false} style={{flex: 1}}>
                {Object.keys(data).length > 0 && (
                    <View style={{marginBottom: FixedBtn.btnHeight}}>
                        <View style={styles.bank_wrap_sty}>
                            <View style={[Style.flexRow, styles.border_sty]}>
                                <Image
                                    source={{uri: data?.fix_info?.bank_icon}}
                                    style={{width: text(30), height: text(30)}}
                                />
                                <View style={styles.bank_item_sty}>
                                    <Text style={styles.title_sty}>{data?.fix_info?.bank_text}</Text>
                                    <Text style={{color: Colors.descColor, fontSize: Font.textH3, marginTop: text(4)}}>
                                        {data?.fix_info?.date_text}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.time_sty}>{data?.fix_info?.next_date}</Text>
                        </View>

                        <View style={styles.records_sty}>
                            <View style={Style.flexBetween}>
                                <Text
                                    style={{color: Colors.defaultFontColor, fontSize: Font.textH1, fontWeight: 'bold'}}>
                                    {data?.fix_records?.title}
                                </Text>
                                <View style={Style.flexRow}>
                                    <Text>开始时间</Text>
                                    <Text
                                        style={{
                                            color: Colors.defaultFontColor,
                                            fontSize: Font.textH3,
                                            fontFamily: Font.numFontFamily,
                                            marginLeft: text(5),
                                        }}>
                                        {data?.fix_records?.start_date}
                                    </Text>
                                </View>
                            </View>

                            {data?.fix_records?.list?.length > 0 ? (
                                <ScrollView style={{marginTop: text(28)}}>
                                    <View style={[Style.flexRow, styles.border_sty]}>
                                        <Text style={styles.desc_sty}>{data?.fix_records?.header?.date}</Text>
                                        <Text style={styles.desc_sty}>{data?.fix_records?.header?.amount}</Text>
                                        <Text style={styles.desc_sty}>{data?.fix_records?.header?.status}</Text>
                                    </View>
                                    {data?.fix_records?.list.map((_l, _d) => {
                                        return (
                                            <View style={[Style.flexRow, {marginTop: text(8)}]} key={_d + '_l'}>
                                                <Text style={[styles.desc_sty, {fontFamily: Font.numFontFamily}]}>
                                                    {_l.date}
                                                </Text>
                                                <Text style={[styles.desc_sty, {fontFamily: Font.numFontFamily}]}>
                                                    {_l.amount}
                                                </Text>
                                                <Text style={styles.desc_sty}>{_l.status}</Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            ) : (
                                showEmpty && <EmptyTip text={'暂无记录'} style={{paddingTop: text(20)}} type={'part'} />
                            )}
                        </View>
                    </View>
                )}
                <BottomDesc />
            </ScrollView>
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
        padding: Space.padding,
        paddingBottom: text(10),
    },
    bank_item_sty: {
        marginLeft: text(10),
    },
    title_sty: {
        color: Colors.defaultFontColor,
        fontSize: Font.textH1,
        fontFamily: Font.numFontFamily,
    },
    time_sty: {
        color: Colors.descColor,
        fontSize: Font.textH3,
        paddingTop: text(12),
    },
    records_sty: {
        paddingVertical: text(13),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    process_outer: {
        backgroundColor: Colors.bgColor,
        width: deviceWidth - 30,
        height: text(4),
        borderRadius: text(30),
        marginTop: text(40),
    },
    process_inner: {
        backgroundColor: '#FF812C',
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
        color: Colors.lightBlackColor,
        fontSize: Font.textH3,
        textAlign: 'center',
        width: '33.3%',
    },
    border_sty: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        paddingBottom: text(10),
    },
});
