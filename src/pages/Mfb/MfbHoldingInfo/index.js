/*
 * @Date: 2022-07-21 14:30:52
 * @Description: 魔方宝持有信息
 */
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import NumText from '~/components/NumText';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {getPageData} from './services';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {items} = data;
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            getPageData()
                .then((res) => {
                    if (res.code === '000000') {
                        const {title} = res.result;
                        navigation.setOptions({title: title || '魔方宝持有信息'});
                        setData(res.result);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.container}>
            {loading ? (
                <Loading />
            ) : items?.length > 0 ? (
                items.map((item, index, arr) => {
                    const {amount, code, name, profit, profit_acc, return_daily, return_week, url} = item;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={name + index}
                            onPress={() => jump(url)}
                            style={[
                                styles.card,
                                index === arr.length - 1 ? {marginBottom: isIphoneX() ? 34 : Space.marginVertical} : {},
                            ]}>
                            <View style={Style.flexBetween}>
                                <View style={Style.flexRow}>
                                    <Text numberOfLines={1} style={styles.name}>
                                        {name}
                                    </Text>
                                    <Text style={styles.code}>{code}</Text>
                                </View>
                                <Feather color={Colors.lightGrayColor} name="chevron-right" size={16} />
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <View style={styles.itemSty}>
                                    <Text style={styles.key}>{'持有金额(元)'}</Text>
                                    <Text style={styles.val}>{amount}</Text>
                                </View>
                                <View style={[styles.itemSty, {alignItems: 'center'}]}>
                                    <Text style={styles.key}>{'日收益'}</Text>
                                    <NumText style={styles.val} text={profit} />
                                </View>
                                <View style={[styles.itemSty, {alignItems: 'flex-end'}]}>
                                    <Text style={styles.key}>{'累计收益'}</Text>
                                    <NumText style={styles.val} text={profit_acc} />
                                </View>
                                <View style={styles.itemSty}>
                                    <Text style={styles.key}>{'七日年化'}</Text>
                                    <Text style={styles.val}>{return_week}</Text>
                                </View>
                                <View style={[styles.itemSty, {alignItems: 'center'}]}>
                                    <Text style={styles.key}>{'万份收益'}</Text>
                                    <Text style={styles.val}>{return_daily}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <Empty />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.padding,
    },
    card: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
        maxWidth: px(200),
    },
    code: {
        marginLeft: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
        fontWeight: Font.weightMedium,
    },
    itemSty: {
        marginTop: px(20),
        width: '33.33%',
    },
    key: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    val: {
        marginTop: px(8),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
});
