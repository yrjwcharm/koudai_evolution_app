/*
 * @Date: 2022-07-22 18:34:55
 * @Description:计划确认页
 */
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import {autoCharge, getData} from './service';
import {FixedButton} from '~/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import RenderHtml from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {useJump} from '~/components/hooks';
const Index = ({route, navigation}) => {
    const [data, setData] = useState({});
    const [status, setStatus] = useState(false);
    const jump = useJump();
    const getInfo = async () => {
        let res = await getData(route?.params);
        global.LogTool('effect_jump', '', res.result?.log_id);
        setStatus(res.result?.wallet?.wallet_auto_charge == 1);
        setData(res.result);
        res.result.title && navigation.setOptions({title: res.result.title});
    };
    const onValueChange = async (value) => {
        let res = await autoCharge({
            wallet_auto_charge: value ? 1 : 0,
            ...route?.params,
            wallet_auto_data: data?.wallet?.wallet_auto_data?.join(','),
        });
        Toast.show(res.message);
        setStatus(value);
    };
    useEffect(() => {
        getInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
            <ScrollView style={{flex: 1}}>
                <View style={{backgroundColor: '#fff', paddingHorizontal: px(16), marginBottom: px(12)}}>
                    <View style={{alignItems: 'center', ...styles.header}}>
                        <Icon name={'checkmark-circle'} size={px(60)} color="#4BA471" style={{marginBottom: px(17)}} />
                        <Text style={{fontSize: px(16), color: '#4BA471'}}>
                            {data?.notice || '您的计划买卖模式设置成功！'}
                        </Text>
                    </View>
                    <View style={[Style.flexBetween, {marginBottom: px(22)}]}>
                        <Text style={styles.key}>{data?.name_label}</Text>
                        <Text style={styles.value}>{data?.name}</Text>
                    </View>
                    {/* 买入模式 */}
                    {data?.buy_model?.map((_item, _index) => (
                        <React.Fragment key={_index}>
                            <View style={Style.flexBetween}>
                                <Text style={styles.key}>{_item.label}</Text>
                                <Text style={styles.value}>{_item.title}</Text>
                            </View>
                            <View style={styles.list_con}>
                                <View style={Style.flexBetween}>
                                    {_item?.table_header?.map((item, index, arr) => (
                                        <Text
                                            key={index}
                                            style={[
                                                styles.key,
                                                {flex: 1, textAlign: 'center'},
                                                index == 0 && {textAlign: 'left'},
                                                arr.length - 1 == index && {textAlign: 'right'},
                                            ]}>
                                            {item}
                                        </Text>
                                    ))}
                                </View>
                                {_item?.list?.map((item, index) => (
                                    <View style={[Style.flexBetween, {marginTop: px(12)}]} key={index}>
                                        <Text style={{...styles.value, flex: 1}}>{item?.name}</Text>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <RenderHtml html={item?.amount} style={{fontSize: px(13)}} />
                                        </View>
                                        <View style={{alignItems: 'flex-end', flex: 1}}>
                                            <RenderHtml
                                                html={item?.date}
                                                style={{fontSize: Font.textH3, textAlign: 'right'}}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </React.Fragment>
                    ))}

                    {data?.tip ? <Text style={styles.tip}>{data?.tip}</Text> : null}
                    {/* 卖出模式 */}
                    {data?.sale_model?.table_header ? (
                        <>
                            <View style={Style.flexBetween}>
                                <Text style={styles.key}>卖出模式</Text>
                                <Text style={styles.value}>{data?.sale_model?.sale_model_title}</Text>
                            </View>
                            <View style={styles.list_con}>
                                <View style={Style.flexBetween}>
                                    {data?.sale_model?.table_header?.map((item, index, arr) => (
                                        <Text
                                            key={index}
                                            style={[
                                                styles.key,
                                                {flex: 1, textAlign: 'center'},
                                                index == 0 && {textAlign: 'left'},
                                                arr.length - 1 == index && {textAlign: 'right'},
                                            ]}>
                                            {item}
                                        </Text>
                                    ))}
                                </View>
                                {data?.sale_model?.list?.map((item, index) => (
                                    <View style={[Style.flexBetween, {marginTop: px(12)}]} key={index}>
                                        <Text style={{flex: 1, ...styles.value}}>{item?.name}</Text>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            {!!item?.target_yield && (
                                                <Text style={{fontFamily: Font.numFontFamily, fontSize: px(13)}}>
                                                    {(item?.target_yield * 100)?.toFixed(0) + '%'}
                                                </Text>
                                            )}
                                        </View>
                                        <Text
                                            style={{
                                                fontFamily: Font.numFontFamily,
                                                fontSize: px(13),
                                                textAlign: 'right',
                                                flex: 1,
                                            }}>
                                            {item?.select}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : null}
                </View>
                {data?.wallet ? (
                    <>
                        <View style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
                            <View style={[Style.flexBetween, styles.wallet_auto_title]}>
                                <Text style={{fontSize: px(16)}}>{data?.wallet?.wallet_auto_title}</Text>
                                <Switch
                                    value={status}
                                    onValueChange={onValueChange}
                                    ios_backgroundColor={'#CCD0DB'}
                                    thumbColor={'#fff'}
                                    trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                />
                            </View>

                            <Text style={styles.wallet_auto_desc}>
                                {data?.wallet?.wallet_auto_desc}
                                <Text
                                    style={{color: Colors.btnColor}}
                                    onPress={() => jump(data?.wallet?.wallet_link?.url)}>
                                    {data?.wallet?.wallet_link?.text}
                                </Text>
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: px(12),
                                ...styles.wallet_auto_desc,
                                paddingLeft: px(16),
                                marginBottom: px(20),
                            }}>
                            {data?.wallet?.wallet_auto_tips}
                        </Text>
                    </>
                ) : null}
            </ScrollView>
            {data?.btn?.text ? (
                <FixedButton
                    title={data?.btn?.text}
                    containerStyle={{position: 'relative'}}
                    onPress={() => {
                        global.LogTool('TradeFinish_Click', '', data?.log_id);
                        if (data?.btn?.url) {
                            jump(data?.btn?.url);
                            return;
                        }
                        //升级的返回两层
                        if (route?.params?.upgrade_id) {
                            navigation.pop(2);
                        } else {
                            navigation.pop(1);
                        }
                    }}
                />
            ) : null}
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
        marginTop: px(12),
        paddingHorizontal: px(12),
        paddingVertical: px(12),
        marginBottom: px(20),
    },
    tip: {
        fontSize: px(12),
        color: '#FF7D41',
        lineHeight: px(21),
        marginTop: px(-12),
        marginBottom: px(21),
    },
    wallet_auto_desc: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.lightGrayColor,
        paddingVertical: px(12),
    },
    wallet_auto_title: {
        paddingVertical: px(15),
        borderBottomColor: Colors.lineColor,
        borderBottomWidth: 0.5,
    },
});
