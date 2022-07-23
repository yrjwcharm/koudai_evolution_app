/*
 * @Date: 2022-07-22 18:34:55
 * @Description:计划确认页
 */
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import {getData} from './service';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Icon from 'react-native-vector-icons/Ionicons';
const Index = ({route}) => {
    const poid = route?.params?.poid || 'X04F193369';
    const [data, setData] = useState({});
    const jump = useJump();
    const getInfo = async () => {
        let res = await getData({poid});
        setData(res.result);
    };
    useEffect(() => {
        getInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView style={{paddingHorizontal: px(16)}}>
                <View style={{alignItems: 'center', ...styles.header}}>
                    <Icon name={'checkmark-circle'} size={px(60)} color="#4BA471" style={{marginBottom: px(17)}} />
                    <Text style={{fontSize: px(16), color: '#4BA471'}}>
                        {data?.notice || '您的计划买卖模式设置成功！'}
                    </Text>
                </View>
                <View style={[Style.flexBetween, {marginBottom: px(22)}]}>
                    <Text style={styles.key}>{'计划名称'}</Text>
                    <Text style={styles.value}>{data?.name}</Text>
                </View>
                <View style={[Style.flexBetween, {marginBottom: px(12)}]}>
                    <Text style={styles.key}>买入模式</Text>
                    <Text style={styles.value}>{data?.buy_model?.buy_model_title}</Text>
                </View>
                <View style={styles.list_con}>
                    <View style={[Style.flexBetween, {marginBottom: px(12)}]}>
                        <Text style={styles.key}>买入工具</Text>
                        <Text style={styles.key}>定投金额(元)</Text>
                        <Text style={styles.key}>跟投时间</Text>
                    </View>
                    {data?.buy_model?.list?.map((item, index) => (
                        <View style={[Style.flexBetween, {marginBottom: px(12)}]} key={index}>
                            <Text style={styles.value}>{item?.name}</Text>
                            <Text style={{fontFamily: Font.numFontFamily, fontSize: px(13)}}>{item?.amount}</Text>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={{fontFamily: Font.numFontFamily, fontSize: px(13)}}>
                                    {item?.next_trade_date}
                                </Text>
                                <Text style={styles.key}>{'(非交易日顺延)'}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={[Style.flexBetween, {marginBottom: px(12)}]}>
                    <Text style={styles.key}>卖出模式</Text>
                    <Text style={styles.value}>{data?.sale_model?.sale_model_title}</Text>
                </View>
                <View style={styles.list_con}>
                    <View style={[Style.flexBetween, {marginBottom: px(12)}]}>
                        <Text style={styles.key}>卖出工具</Text>
                        <Text style={styles.key}>目标收益率</Text>
                        <Text style={styles.key}>达标止盈方式</Text>
                    </View>
                    {data?.buy_model?.list?.map((item, index) => (
                        <View style={[Style.flexBetween, {marginBottom: px(12)}]} key={index}>
                            <Text style={styles.value}>{item?.name}</Text>
                            <Text style={{fontFamily: Font.numFontFamily, fontSize: px(13)}}>{item?.amount}</Text>
                            <Text style={{fontFamily: Font.numFontFamily, fontSize: px(13)}}>
                                {item?.next_trade_date}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <FixedButton title={data?.btn?.text} onPress={() => jump(data?.btn?.url)} />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    header: {
        paddingVertical: px(30),
        borderBottomColor: Colors.lineColor,
        borderBottomWidth: 0.5,
        marginBottom: px(20),
    },
    key: {
        fontSize: px(12),
        color: Colors.lightGrayColor,
    },
    value: {
        fontSize: px(13),
    },
    list_con: {
        backgroundColor: Colors.bgColor,
        borderRadius: px(4),
        paddingHorizontal: px(12),
        paddingTop: px(11),
        paddingBottom: px(4),
        marginBottom: px(20),
    },
});
